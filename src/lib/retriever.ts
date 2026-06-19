import crypto from 'crypto';

export interface Document {
  name: string;
  content: string;
  pageMap?: { pageNum: number; startChar: number; endChar: number }[];
}

export interface DocumentChunk {
  documentName: string;
  chunkIndex: number; // 1-indexed
  content: string;
  startChar: number;  // Start character offset in the original document
  endChar: number;    // End character offset in the original document
  embedding?: number[];
  pageNumber?: number;
  sectionName?: string;
}

export interface ExtractedDocument {
  text: string;
  pageCount?: number;
  pageMap?: { pageNum: number; startChar: number; endChar: number }[];
}

export interface ParentSection {
  id: string;
  documentName: string;
  sectionName: string;
  content: string;
  startChar: number;
  endChar: number;
  pageNumbers?: number[];
}

export interface ChildChunk {
  documentName: string;
  sectionName: string;
  chunkIndex: number;
  content: string;
  parentSectionId: string;
  startChar: number;
  endChar: number;
  pageNumber?: number;
}

export interface VectorlessRetrievalResult {
  chunks: DocumentChunk[];
  scores: { chunkId: string; score: number }[];
  method: 'vectorless-bm25';
}

/**
 * Helper to calculate page numbers for a given character offset range using the pageMap.
 */
export function getPageNumbersForRange(
  startChar: number,
  endChar: number,
  pageMap?: { pageNum: number; startChar: number; endChar: number }[]
): number[] {
  if (!pageMap || pageMap.length === 0) return [1];
  const pages: number[] = [];
  for (const page of pageMap) {
    const overlapStart = Math.max(startChar, page.startChar);
    const overlapEnd = Math.min(endChar, page.endChar);
    if (overlapStart < overlapEnd) {
      pages.push(page.pageNum);
    }
  }
  return pages.length > 0 ? pages : [1];
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
          const text = result.value || '';
          return {
            text,
            pageMap: [{ pageNum: 1, startChar: 0, endChar: text.length }]
          };
        } catch (err) {
          console.error(`[ERROR] mammoth extraction failed for ${docName}:`, err);
          return { text: '' };
        }
      }

      // 2. PDF Extraction using pdf-parse with custom page render tagging
      if (ext === 'pdf' || mimeType.includes('pdf')) {
        try {
          const pdfParse = require('pdf-parse');
          let pageCounter = 0;
          const options = {
            pagerender: (pageData: any) => {
              pageCounter++;
              const currentPage = pageCounter;
              return pageData.getTextContent({
                normalizeWhitespace: true,
                disableCombineTextItems: false
              }).then((textContent: any) => {
                let lastY, text = '';
                for (const item of textContent.items) {
                  if (lastY === item.transform[5] || !lastY) {
                    text += item.str;
                  } else {
                    text += '\n' + item.str;
                  }
                  lastY = item.transform[5];
                }
                return `\n--- PAGE_START_${currentPage} ---\n${text}\n--- PAGE_END_${currentPage} ---\n`;
              });
            }
          };

          const data = await pdfParse(buffer, options);
          const rawText = data.text || '';
          
          const pageMarkerRegex = /--- PAGE_START_(\d+) ---([\s\S]*?)--- PAGE_END_\1 ---/g;
          const matches: { pageNum: number; text: string }[] = [];
          let match;
          
          pageMarkerRegex.lastIndex = 0;
          while ((match = pageMarkerRegex.exec(rawText)) !== null) {
            matches.push({
              pageNum: parseInt(match[1], 10),
              text: match[2]
            });
          }
          
          matches.sort((a, b) => a.pageNum - b.pageNum);
          
          let currentPos = 0;
          const pageMap: { pageNum: number; startChar: number; endChar: number }[] = [];
          let cleanText = '';
          
          for (const p of matches) {
            const pageText = p.text;
            const start = currentPos;
            const end = currentPos + pageText.length;
            pageMap.push({
              pageNum: p.pageNum,
              startChar: start,
              endChar: end
            });
            cleanText += pageText;
            currentPos = end;
          }
          
          // Fallback if no markers parsed
          if (cleanText.length === 0) {
            cleanText = rawText;
            pageMap.push({
              pageNum: 1,
              startChar: 0,
              endChar: rawText.length
            });
          }

          return {
            text: cleanText,
            pageCount: data.numpages || 0,
            pageMap: pageMap
          };
        } catch (err) {
          console.error(`[ERROR] pdf-parse extraction failed for ${docName}:`, err);
          return { text: '' };
        }
      }

      // 3. TXT file: decode as UTF-8
      if (ext === 'txt' || mimeType.includes('text/plain') || mimeType.includes('plain')) {
        const text = buffer.toString('utf-8');
        return {
          text,
          pageMap: [{ pageNum: 1, startChar: 0, endChar: text.length }]
        };
      }

      // Fallback: decode as UTF-8
      const text = buffer.toString('utf-8');
      return {
        text,
        pageMap: [{ pageNum: 1, startChar: 0, endChar: text.length }]
      };
    }
  }

  // If already plain text, return as-is
  return {
    text: content,
    pageMap: [{ pageNum: 1, startChar: 0, endChar: content.length }]
  };
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
  const pageMap = doc.pageMap || [];
  
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
        endChar: cutPoint,
        pageNumbers: getPageNumbersForRange(start, cutPoint, pageMap)
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
        endChar: end,
        pageNumbers: getPageNumbersForRange(start, end, pageMap)
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
          endChar: headingPositions[0].pos,
          pageNumbers: getPageNumbersForRange(0, headingPositions[0].pos, pageMap)
        });
      }
    }
  }
  
  return sections;
}

/**
 * Chunks parsed parent sections into child chunks.
 */
export function chunkSections(
  sections: ParentSection[],
  pageMaps?: Record<string, { pageNum: number; startChar: number; endChar: number }[]>,
  chunkSize = 1500,
  overlap = 300
): ChildChunk[] {
  const childChunks: ChildChunk[] = [];
  let overallIndex = 1;
  
  for (const sec of sections) {
    const content = sec.content;
    const pageMap = pageMaps ? pageMaps[sec.documentName] : undefined;
    
    if (content.length <= chunkSize) {
      const pageNumbers = getPageNumbersForRange(sec.startChar, sec.endChar, pageMap);
      childChunks.push({
        documentName: sec.documentName,
        sectionName: sec.sectionName,
        chunkIndex: overallIndex++,
        content: content,
        parentSectionId: sec.id,
        startChar: sec.startChar,
        endChar: sec.endChar,
        pageNumber: pageNumbers[0] || 1
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
      const ccStart = sec.startChar + start;
      const ccEnd = sec.startChar + start + chunkLength;
      const pageNumbers = getPageNumbersForRange(ccStart, ccEnd, pageMap);
      
      childChunks.push({
        documentName: sec.documentName,
        sectionName: sec.sectionName,
        chunkIndex: overallIndex++,
        content: chunkText.trim(),
        parentSectionId: sec.id,
        startChar: ccStart,
        endChar: ccEnd,
        pageNumber: pageNumbers[0] || 1
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
  topK = 12
): VectorlessRetrievalResult {
  const queryTokens = tokenize(query);
  
  if (queryTokens.length === 0 || childChunks.length === 0) {
    const defaultSections = parentSections.slice(0, topK);
    const defaultChunks = defaultSections.map((sec, idx) => {
      const cc = childChunks.find(c => c.parentSectionId === sec.id);
      const pageNumStr = sec.pageNumbers ? sec.pageNumbers.join(', ') : (cc?.pageNumber || 1).toString();
      const enrichedContent = `[SOURCE]\nDocument Name: ${sec.documentName}\nSection Name: ${sec.sectionName}\nPage Number(s): ${pageNumStr}\n\n${sec.content}`;
      
      return {
        documentName: sec.documentName,
        chunkIndex: cc ? cc.chunkIndex : 1,
        content: enrichedContent,
        startChar: sec.startChar,
        endChar: sec.endChar,
        pageNumber: cc ? cc.pageNumber : 1,
        sectionName: sec.sectionName
      };
    });
    return {
      chunks: defaultChunks,
      scores: defaultChunks.map(c => ({ chunkId: `${c.documentName} (Section: ${c.sectionName})`, score: 0 })),
      method: 'vectorless-bm25'
    };
  }

  const df: Record<string, number> = {};
  for (const token of queryTokens) {
    df[token] = 0;
    for (const chunk of childChunks) {
      const inContent = chunk.content.toLowerCase().includes(token);
      const inHeading = chunk.sectionName.toLowerCase().includes(token);
      const inDocName = chunk.documentName.toLowerCase().includes(token);
      const inPage = `page ${chunk.pageNumber}`.includes(token);
      if (inContent || inHeading || inDocName || inPage) {
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
      let tf = countOccurrences(chunkTextLower, token);
      
      const inHeading = chunk.sectionName.toLowerCase().includes(token);
      const inDocName = chunk.documentName.toLowerCase().includes(token);
      const inPage = `page ${chunk.pageNumber}`.includes(token);
      
      if (inHeading) {
        tf += 5.0; // Heading match counts as 5 virtual occurrences
      }
      if (inDocName) {
        tf += 2.0; // Document name match
      }
      if (inPage) {
        tf += 1.0; // Page number match
      }

      if (tf > 0) {
        const tfWeight = (tf * 2.2) / (tf + 1.2);
        let tokenScore = tfWeight * idf[token];
        
        if (inHeading) {
          tokenScore *= 2.0; // Double token score for heading match
        }
        score += tokenScore;
      }
    }

    return { chunk, score };
  });

  const matched = scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  // Group child chunks by parentSectionId to prevent duplicate parent sections
  const parentScores = new Map<string, { maxScore: number; childChunks: ChildChunk[] }>();
  
  const itemsToGroup = matched.length > 0 ? matched : scored.sort((a, b) => b.score - a.score);
  for (const item of itemsToGroup) {
    const cc = item.chunk;
    const parentId = cc.parentSectionId;
    const existing = parentScores.get(parentId);
    if (existing) {
      existing.maxScore = Math.max(existing.maxScore, item.score);
      existing.childChunks.push(cc);
    } else {
      parentScores.set(parentId, { maxScore: item.score, childChunks: [cc] });
    }
  }

  // Sort parent sections by their max child chunk score descending
  const sortedParents = Array.from(parentScores.entries())
    .map(([parentId, data]) => ({ parentId, ...data }))
    .sort((a, b) => b.maxScore - a.maxScore);

  // Select top K unique parent sections
  const selectedParents = sortedParents.slice(0, topK);

  const enrichedChunks: DocumentChunk[] = [];
  const scoresList: { chunkId: string; score: number }[] = [];

  for (const parentData of selectedParents) {
    const parent = parentSections.find(p => p.id === parentData.parentId);
    if (!parent) continue;

    const cc = parentData.childChunks[0];
    const pageNumStr = parent.pageNumbers ? parent.pageNumbers.join(', ') : (cc?.pageNumber || 1).toString();
    
    const enrichedContent = `[SOURCE]\nDocument Name: ${parent.documentName}\nSection Name: ${parent.sectionName}\nPage Number(s): ${pageNumStr}\n\n${parent.content}`;
    
    enrichedChunks.push({
      documentName: parent.documentName,
      chunkIndex: cc ? cc.chunkIndex : 1,
      content: enrichedContent,
      startChar: parent.startChar,
      endChar: parent.endChar,
      pageNumber: cc ? cc.pageNumber : 1,
      sectionName: parent.sectionName
    });

    scoresList.push({
      chunkId: `${parent.documentName} (Section: ${parent.sectionName})`,
      score: parentData.maxScore
    });
  }

  return {
    chunks: enrichedChunks,
    scores: scoresList,
    method: 'vectorless-bm25'
  };
}

/**
 * Samples parent sections uniformly to cover the beginning, middle, and end.
 */
export function sampleSectionsUniformly(
  sections: ParentSection[],
  maxSections = 12
): ParentSection[] {
  const totalSections = sections.length;
  if (totalSections <= maxSections) {
    return sections;
  }
  const sampled: ParentSection[] = [];
  const step = totalSections / maxSections;
  for (let i = 0; i < maxSections; i++) {
    const index = Math.min(Math.floor(i * step), totalSections - 1);
    sampled.push(sections[index]);
  }
  return sampled;
}
