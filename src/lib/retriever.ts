import crypto from 'crypto';
import { getEmbedding } from './ollama';

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

// In-memory cache for document embeddings to avoid redundant generation calls
// Key: SHA-256 hash of consolidated document content
// Value: Array of document chunks with pre-generated embeddings
const embeddingCache = new Map<string, DocumentChunk[]>();


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
 * Chunks a list of documents into chunks of 1500 characters with 300 characters overlap,
 * capturing exact start and end offsets.
 */
export function chunkDocuments(documents: Document[], chunkSize = 1500, overlap = 300): DocumentChunk[] {
  const allChunks: DocumentChunk[] = [];

  for (const doc of documents) {
    let start = 0;
    let index = 1;
    const content = doc.content;

    if (content.length <= chunkSize) {
      allChunks.push({
        documentName: doc.name,
        chunkIndex: 1,
        content,
        startChar: 0,
        endChar: content.length
      });
      continue;
    }

    while (start < content.length) {
      const end = Math.min(start + chunkSize, content.length);
      let chunkText = content.substring(start, end);

      // Sentence or paragraph boundary adjustment for cleaner chunks
      if (end < content.length) {
        const lastPeriod = chunkText.lastIndexOf('.');
        const lastNewline = chunkText.lastIndexOf('\n');
        const cutPoint = Math.max(lastPeriod, lastNewline);
        if (cutPoint > chunkSize * 0.7) {
          chunkText = chunkText.substring(0, cutPoint + 1);
        }
      }

      const chunkLength = chunkText.length;
      allChunks.push({
        documentName: doc.name,
        chunkIndex: index++,
        content: chunkText.trim(),
        startChar: start,
        endChar: start + chunkLength
      });

      start += chunkLength - overlap;
      if (chunkLength - overlap <= 0) {
        start = end; // Prevent infinite loop
      }
    }
  }

  return allChunks;
}

/**
 * Generates embeddings for all document chunks in parallel.
 * Utilizes the global in-memory cache to load pre-calculated vectors.
 */
export async function ensureChunkEmbeddings(chunks: DocumentChunk[], docHash: string): Promise<DocumentChunk[]> {
  if (embeddingCache.has(docHash)) {
    return embeddingCache.get(docHash)!;
  }

  // Generate embeddings for each chunk using nomic-embed-text
  const updatedChunks = await Promise.all(
    chunks.map(async (chunk) => {
      try {
        const embedding = await getEmbedding(chunk.content);
        return { ...chunk, embedding };
      } catch (err) {
        console.error(`Error generating embedding for chunk ${chunk.chunkIndex} of ${chunk.documentName}:`, err);
        return chunk;
      }
    })
  );

  embeddingCache.set(docHash, updatedChunks);
  return updatedChunks;
}

/**
 * Computes cosine similarity between two numerical vectors.
 */
export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Classic BM25/TF-IDF similarity retriever (used as fallback for hybrid search).
 */
export function retrieveRelevantChunks(query: string, chunks: DocumentChunk[], topK = 5): DocumentChunk[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0 || chunks.length === 0) {
    return chunks.slice(0, topK);
  }

  const df: Record<string, number> = {};
  for (const token of queryTokens) {
    df[token] = 0;
    for (const chunk of chunks) {
      if (chunk.content.toLowerCase().includes(token)) {
        df[token]++;
      }
    }
  }

  const idf: Record<string, number> = {};
  const N = chunks.length;
  for (const token of queryTokens) {
    idf[token] = Math.log(1 + (N - df[token] + 0.5) / (df[token] + 0.5));
  }

  const scored = chunks.map(chunk => {
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
    .sort((a, b) => b.score - a.score)
    .map(item => item.chunk);

  if (matched.length === 0) {
    return chunks.slice(0, topK);
  }

  return matched.slice(0, topK);
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
 * Hybrid Semantic & BM25 Fallback Retriever.
 * 
 * 1. Generates semantic query embedding.
 * 2. Performs cosine similarity search against Top 8 chunks.
 * 3. Fallback: If top similarity score is below 0.55, runs BM25 exact keyword search.
 * 4. Merges and deduplicates chunks from both runs, selecting the Top 8 overall.
 */
export async function retrieveRelevantChunksHybrid(
  query: string,
  chunksWithEmbeddings: DocumentChunk[],
  topK = 8,
  threshold = 0.55
): Promise<{ 
  chunks: DocumentChunk[]; 
  scores: { chunkId: string; score: number }[];
  method: 'semantic' | 'hybrid-fallback'; 
}> {
  if (chunksWithEmbeddings.length === 0) {
    return { chunks: [], scores: [], method: 'semantic' };
  }

  // 1. Generate query embedding vector using nomic-embed-text
  const queryEmbedding = await getEmbedding(query);

  // 2. Perform cosine similarity calculation
  const scored = chunksWithEmbeddings.map(chunk => {
    const score = chunk.embedding 
      ? cosineSimilarity(queryEmbedding, chunk.embedding)
      : 0;
    return { chunk, score };
  });

  // Sort similarity scores descending
  const sortedSemantic = scored.sort((a, b) => b.score - a.score);
  const topScore = sortedSemantic[0]?.score || 0;

  // Retrieve top similarity scores for logging
  const scores = sortedSemantic.slice(0, topK).map(item => ({
    chunkId: `${item.chunk.documentName} (Chunk ${item.chunk.chunkIndex})`,
    score: item.score
  }));

  if (topScore >= threshold) {
    // Semantic similarity threshold met
    const topChunks = sortedSemantic.slice(0, topK).map(item => item.chunk);
    return { chunks: topChunks, scores, method: 'semantic' };
  }

  // 3. Fallback to BM25 retrieval
  const bm25Chunks = retrieveRelevantChunks(query, chunksWithEmbeddings, topK);

  // Merge and deduplicate results, giving precedence to BM25 matches
  const mergedMap = new Map<string, DocumentChunk>();
  
  for (const chunk of bm25Chunks) {
    const key = `${chunk.documentName}::${chunk.chunkIndex}`;
    mergedMap.set(key, chunk);
  }

  for (const item of sortedSemantic) {
    if (item.score <= 0) continue;
    const key = `${item.chunk.documentName}::${item.chunk.chunkIndex}`;
    if (!mergedMap.has(key)) {
      mergedMap.set(key, item.chunk);
    }
  }

  const mergedChunks = Array.from(mergedMap.values()).slice(0, topK);
  return { chunks: mergedChunks, scores, method: 'hybrid-fallback' };
}

/**
 * Merges retrieved contiguous or overlapping document chunks.
 * Reconstructs original document text ranges to preserve structural headings and page order.
 */
export function mergeContiguousChunks(retrievedChunks: DocumentChunk[], documents: Document[]): string {
  // Create a lookup for raw document contents
  const docMap = new Map<string, string>();
  for (const doc of documents) {
    docMap.set(doc.name, doc.content);
  }

  // Group retrieved chunks by document
  const groups = new Map<string, DocumentChunk[]>();
  for (const chunk of retrievedChunks) {
    const list = groups.get(chunk.documentName) || [];
    list.push(chunk);
    groups.set(chunk.documentName, list);
  }

  const finalMergedBlocks: string[] = [];

  for (const [docName, chunks] of groups.entries()) {
    const originalContent = docMap.get(docName) || '';
    if (!originalContent) continue;

    // Sort contiguous chunks by their start offset
    const sorted = [...chunks].sort((a, b) => a.startChar - b.startChar);

    const mergedIntervals: { start: number; end: number }[] = [];
    for (const chunk of sorted) {
      if (mergedIntervals.length === 0) {
        mergedIntervals.push({ start: chunk.startChar, end: chunk.endChar });
      } else {
        const last = mergedIntervals[mergedIntervals.length - 1];
        // Merge overlapping or touch-contiguous intervals
        if (chunk.startChar <= last.end) {
          last.end = Math.max(last.end, chunk.endChar);
        } else {
          mergedIntervals.push({ start: chunk.startChar, end: chunk.endChar });
        }
      }
    }

    // Extract merged text blocks from raw content
    for (const interval of mergedIntervals) {
      const slicedText = originalContent.substring(interval.start, interval.end).trim();
      if (slicedText) {
        finalMergedBlocks.push(`--- Document: ${docName} ---\n${slicedText}\n-------------------`);
      }
    }
  }

  return finalMergedBlocks.join('\n\n');
}
