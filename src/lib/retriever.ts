import crypto from 'crypto';

export interface Document {
  name: string;
  content: string;
}

export interface DocumentChunk {
  documentName: string;
  chunkIndex: number; // 1-indexed
  content: string;
  startChar: number;  // Start character offset in the original document
  endChar: number;    // End character offset in the original document
  embedding?: number[];
}

export interface ExtractedDocument {
  text: string;
  pageCount?: number;
}

export interface ParentSection {
  id: string;
  documentName: string;
  sectionName: string;
  content: string;
  startChar: number;
  endChar: number;
}

export interface ChildChunk {
  documentName: string;
  sectionName: string;
  chunkIndex: number;
  content: string;
  parentSectionId: string;
  startChar: number;
  endChar: number;
}

export interface VectorlessRetrievalResult {
  chunks: DocumentChunk[];
  scores: { chunkId: string; score: number }[];
  method: 'vectorless-bm25';
}

/**
 * Extracts raw plain text from Base64 Data URL or returns the string directly.
 * Handles PDF, DOCX, and TXT files.
 */
export async function extractTextFromDocument(docName: string, content: string): Promise<ExtractedDocument> {
  if (content.startsWith('data:')) {
    const commaIndex = content.indexOf(',');
    if (commaIndex !== -1) {
      const mimeTypeMatch = content.match(/data:(.*?);base64/);
      const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : '';
      const base64Data = content.substring(commaIndex + 1);
      const buffer = Buffer.from(base64Data, 'base64');
      const ext = docName.split('.').pop()?.toLowerCase() || '';

      // 1. DOCX Extraction using mammoth
      if (ext === 'docx' || mimeType.includes('officedocument.wordprocessingml.document')) {
        try {
          const mammoth = require('mammoth');
          const result = await mammoth.extractRawText({ buffer });
          return { text: result.value || '' };
        } catch (err) {
          console.error(`[ERROR] mammoth extraction failed for ${docName}:`, err);
          return { text: '' };
        }
      }

      // 2. PDF Extraction using pdf-parse
      if (ext === 'pdf' || mimeType.includes('pdf')) {
        try {
          const pdfParse = require('pdf-parse');
          const data = await pdfParse(buffer);
          return {
            text: data.text || '',
            pageCount: data.numpages || 0
          };
        } catch (err) {
          console.error(`[ERROR] pdf-parse extraction failed for ${docName}:`, err);
          return { text: '' };
        }
      }

      // 3. TXT file: decode as UTF-8
      if (ext === 'txt' || mimeType.includes('text/plain') || mimeType.includes('plain')) {
        return { text: buffer.toString('utf-8') };
      }

      // Fallback: decode as UTF-8
      return { text: buffer.toString('utf-8') };
    }
  }

  // If already plain text, return as-is
  return { text: content };
}


/**
 * Computes the SHA-256 hash of a string.
 */
export function getDocumentHash(content: string): string {
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Parses the raw documentContent string passed from the client back into individual Documents.
 */
export function parseDocuments(documentContent: string): Document[] {
  const docs: Document[] = [];
  
  // Split by the Document header pattern
  const parts = documentContent.split(/Document:\s+/);
  for (const part of parts) {
    if (!part.trim()) continue;
    const firstNewline = part.indexOf('\n');
    if (firstNewline === -1) continue;
    const name = part.substring(0, firstNewline).trim();
    const content = part.substring(firstNewline + 1).trim();
    docs.push({ name, content });
  }

  // Fallback: if no split matches, treat the entire string as a single document
  if (docs.length === 0 && documentContent.trim()) {
    docs.push({ name: 'Document', content: documentContent });
  }
  
  return docs;
}

/**
 * Helper to tokenize text, excluding standard stop words.
 */
function tokenize(text: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 
    'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'this', 
    'that', 'these', 'those', 'it', 'its', 'they', 'their', 'them'
  ]);
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 1 && !stopWords.has(token));
}

function countOccurrences(text: string, term: string): number {
  let count = 0;
  let pos = text.indexOf(term);
  while (pos !== -1) {
    count++;
    pos = text.indexOf(term, pos + term.length);
  }
  return count;
}

/**
 * Divides document content into sections based on headings or paragraphs.
 */
export function parseDocumentSections(doc: Document): ParentSection[] {
  const content = doc.content;
  const sections: ParentSection[] = [];
  
  // Find heading positions
  const lines = content.split('\n');
  const headingPositions: { index: number; line: string; pos: number }[] = [];
  
  let currentPos = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    // Markdown heading or CAPS line that looks like a title
    const isMarkdownHeading = /^#{1,6}\s+.+/.test(trimmed);
    const isCapHeading = /^[A-Z\s]{4,60}$/.test(trimmed) && trimmed.length > 5;
    
    if (isMarkdownHeading || isCapHeading) {
      headingPositions.push({ index: i, line: trimmed, pos: currentPos });
    }
    currentPos += line.length + 1; // +1 for the newline character
  }
  
  // If no headings, divide by fixed blocks
  if (headingPositions.length === 0) {
    let start = 0;
    let secIndex = 1;
    const sectionSize = 4000;
    
    while (start < content.length) {
      const end = Math.min(start + sectionSize, content.length);
      let cutPoint = end;
      if (end < content.length) {
        const searchRange = content.substring(end - 1000, end);
        const lastDoubleNL = searchRange.lastIndexOf('\n\n');
        const lastNL = searchRange.lastIndexOf('\n');
        if (lastDoubleNL !== -1) {
          cutPoint = end - 1000 + lastDoubleNL + 2;
        } else if (lastNL !== -1) {
          cutPoint = end - 1000 + lastNL + 1;
        }
      }
      
      const secContent = content.substring(start, cutPoint).trim();
      sections.push({
        id: `${doc.name}-sec-${secIndex}`,
        documentName: doc.name,
        sectionName: `Section ${secIndex}`,
        content: secContent,
        startChar: start,
        endChar: cutPoint
      });
      
      start = cutPoint;
      secIndex++;
    }
  } else {
    // Generate sections
    for (let i = 0; i < headingPositions.length; i++) {
      const current = headingPositions[i];
      const next = headingPositions[i + 1];
      
      const start = current.pos;
      const end = next ? next.pos : content.length;
      
      const secContent = content.substring(start, end).trim();
      const sectionName = current.line.replace(/^#+\s+/, '').trim();
      
      sections.push({
        id: `${doc.name}-sec-${i + 1}`,
        documentName: doc.name,
        sectionName: sectionName || `Section ${i + 1}`,
        content: secContent,
        startChar: start,
        endChar: end
      });
    }
    
    // Capture preamble/introduction if there is text before the first heading
    if (headingPositions[0] && headingPositions[0].pos > 0) {
      const introContent = content.substring(0, headingPositions[0].pos).trim();
      if (introContent) {
        sections.unshift({
          id: `${doc.name}-sec-0`,
          documentName: doc.name,
          sectionName: 'Introduction',
          content: introContent,
          startChar: 0,
          endChar: headingPositions[0].pos
        });
      }
    }
  }
  
  return sections;
}

/**
 * Chunks parsed parent sections into child chunks.
 */
export function chunkSections(sections: ParentSection[], chunkSize = 1500, overlap = 300): ChildChunk[] {
  const childChunks: ChildChunk[] = [];
  let overallIndex = 1;
  
  for (const sec of sections) {
    const content = sec.content;
    if (content.length <= chunkSize) {
      childChunks.push({
        documentName: sec.documentName,
        sectionName: sec.sectionName,
        chunkIndex: overallIndex++,
        content: content,
        parentSectionId: sec.id,
        startChar: sec.startChar,
        endChar: sec.endChar
      });
      continue;
    }
    
    let start = 0;
    while (start < content.length) {
      const end = Math.min(start + chunkSize, content.length);
      let chunkText = content.substring(start, end);
      
      if (end < content.length) {
        const lastPeriod = chunkText.lastIndexOf('.');
        const lastNewline = chunkText.lastIndexOf('\n');
        const cutPoint = Math.max(lastPeriod, lastNewline);
        if (cutPoint > chunkSize * 0.7) {
          chunkText = chunkText.substring(0, cutPoint + 1);
        }
      }
      
      const chunkLength = chunkText.length;
      childChunks.push({
        documentName: sec.documentName,
        sectionName: sec.sectionName,
        chunkIndex: overallIndex++,
        content: chunkText.trim(),
        parentSectionId: sec.id,
        startChar: sec.startChar + start,
        endChar: sec.startChar + start + chunkLength
      });
      
      start += chunkLength - overlap;
      if (chunkLength - overlap <= 0) {
        start = end; // Prevent infinite loop
      }
    }
  }
  
  return childChunks;
}

/**
 * Retrieves relevant chunks from child chunks using BM25, fetches their parent sections,
 * and enriches the retrieved context with metadata.
 */
export function retrieveRelevantChunksVectorless(
  query: string,
  childChunks: ChildChunk[],
  parentSections: ParentSection[],
  topK = 8
): VectorlessRetrievalResult {
  const queryTokens = tokenize(query);
  
  if (queryTokens.length === 0 || childChunks.length === 0) {
    const defaultChunks = childChunks.slice(0, topK).map(cc => {
      const parent = parentSections.find(p => p.id === cc.parentSectionId);
      const parentContent = parent ? parent.content : cc.content;
      const enrichedContent = `[SOURCE]\nDocument Name: ${cc.documentName}\nSection Name: ${cc.sectionName}\nChunk Index: ${cc.chunkIndex}\n\n${parentContent}`;
      
      return {
        documentName: cc.documentName,
        chunkIndex: cc.chunkIndex,
        content: enrichedContent,
        startChar: cc.startChar,
        endChar: cc.endChar
      };
    });
    return {
      chunks: defaultChunks,
      scores: defaultChunks.map(c => ({ chunkId: `${c.documentName} (Chunk ${c.chunkIndex})`, score: 0 })),
      method: 'vectorless-bm25'
    };
  }

  const df: Record<string, number> = {};
  for (const token of queryTokens) {
    df[token] = 0;
    for (const chunk of childChunks) {
      if (chunk.content.toLowerCase().includes(token)) {
        df[token]++;
      }
    }
  }

  const idf: Record<string, number> = {};
  const N = childChunks.length;
  for (const token of queryTokens) {
    idf[token] = Math.log(1 + (N - df[token] + 0.5) / (df[token] + 0.5));
  }

  const scored = childChunks.map(chunk => {
    const chunkTextLower = chunk.content.toLowerCase();
    let score = 0;

    for (const token of queryTokens) {
      const tf = countOccurrences(chunkTextLower, token);
      if (tf > 0) {
        const tfWeight = (tf * 2.2) / (tf + 1.2);
        score += tfWeight * idf[token];
      }
    }

    return { chunk, score };
  });

  const matched = scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  const selected = matched.length > 0 ? matched.slice(0, topK) : scored.sort((a, b) => b.score - a.score).slice(0, topK);

  const enrichedChunks: DocumentChunk[] = [];
  const scoresList: { chunkId: string; score: number }[] = [];

  for (const item of selected) {
    const cc = item.chunk;
    const parent = parentSections.find(p => p.id === cc.parentSectionId);
    const parentContent = parent ? parent.content : cc.content;
    
    const enrichedContent = `[SOURCE]\nDocument Name: ${cc.documentName}\nSection Name: ${cc.sectionName}\nChunk Index: ${cc.chunkIndex}\n\n${parentContent}`;
    
    enrichedChunks.push({
      documentName: cc.documentName,
      chunkIndex: cc.chunkIndex,
      content: enrichedContent,
      startChar: cc.startChar,
      endChar: cc.endChar
    });
    
    scoresList.push({
      chunkId: `${cc.documentName} (Chunk ${cc.chunkIndex})`,
      score: item.score
    });
  }

  return {
    chunks: enrichedChunks,
    scores: scoresList,
    method: 'vectorless-bm25'
  };
}
