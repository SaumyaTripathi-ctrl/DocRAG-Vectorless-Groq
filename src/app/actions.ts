'use server';

import { 
  parseDocuments, 
  getDocumentHash,
  extractTextFromDocument,
  DocumentChunk,
  parseDocumentSections,
  chunkSections,
  retrieveRelevantChunksVectorless
} from '@/lib/retriever';
import { 
  routeRequest, 
  runSummaryAgent, 
  runCompareAgent, 
  runInsightsAgent, 
  runQAAgent,
  runNotesAgent,
  rephraseQuery,
  ChatExchange
} from '@/lib/agents';

export async function askQuestion(
  query: string, 
  documentContent: string, 
  history: ChatExchange[] = []
) {
  try {
    // 1. Parse documents from consolidated context string
    const rawDocuments = parseDocuments(documentContent);
    
    // 2. Perform server-side document extraction (PDF, DOCX, TXT) and run Audit Logs
    const documentsWithText = await Promise.all(
      rawDocuments.map(async (doc) => {
        const extResult = await extractTextFromDocument(doc.name, doc.content);
        const fileType = doc.name.split('.').pop() || 'Unknown';
        
        console.log('\n================ DOCUMENT EXTRACTION AUDIT ================');
        console.log(`File Name: ${doc.name}`);
        console.log(`File Type: ${fileType}`);
        console.log(`Extracted Text Length: ${extResult.text.length}`);
        if (extResult.pageCount !== undefined) {
          console.log(`Page Count (PDF only): ${extResult.pageCount}`);
        }
        console.log(`First 1000 Characters:\n${extResult.text.substring(0, 1000)}`);
        
        if (extResult.text.length < 100) {
          console.error('\nLOG ERROR:\n"Document extraction may have failed."');
        }
        console.log('===========================================================');
        
        return { name: doc.name, content: extResult.text };
      })
    );

    const totalDocLength = documentsWithText.reduce((acc, d) => acc + d.content.length, 0);
    
    let selectedChunks: DocumentChunk[] = [];
    let retrievalResultMethod = 'vectorless-bm25';
    let retrievalResultScores: { chunkId: string; score: number }[] = [];
    
    // Query Rephrasing: use rolling memory to rephrase context-rich follow-up questions
    const searchQuery = await rephraseQuery(query, history);
    
    const isEnumQuery = isEnumerationQuery(query);
    const isSimple = isSimpleQuery(query);
    
    console.log('\n[RAG FLOW] Running VECTORLESS Retrieval...');
    
    const sections = documentsWithText.flatMap(doc => parseDocumentSections(doc));
    const childChunks = chunkSections(sections, 1500, 300);
    
    let topK = 8;
    if (isEnumQuery) {
      topK = childChunks.length;
    } else if (isSimple) {
      topK = 4;
    }
    
    const vResult = retrieveRelevantChunksVectorless(searchQuery, childChunks, sections, topK);
    selectedChunks = vResult.chunks;
    retrievalResultMethod = vResult.method;
    retrievalResultScores = vResult.scores;
    
    if (isEnumQuery) {
      const scoredItems = selectedChunks.map(chunk => {
        const scoreInfo = retrievalResultScores.find(s => s.chunkId === `${chunk.documentName} (Chunk ${chunk.chunkIndex})`);
        return { chunk, score: scoreInfo ? scoreInfo.score : 0 };
      });
      selectedChunks = selectChunksFromMultipleRegions(scoredItems, 20);
    }

    // 8. Log Retrieval Validation details
    console.log('\n================ RETRIEVAL VALIDATION ================');
    console.log(`User Query: ${query}`);
    console.log(`Rephrased Query: ${searchQuery}`);
    console.log(`Enumeration Query: ${isEnumQuery}`);
    console.log(`Simple Query: ${isSimple}`);
    console.log(`Method: ${retrievalResultMethod || 'vectorless-bm25'}`);
    console.log('Retrieved Chunk IDs:');
    selectedChunks.forEach((c, idx) => {
      console.log(`  - ${c.documentName} (Chunk ${c.chunkIndex})`);
    });
    console.log('Similarity/BM25 Scores:');
    retrievalResultScores.slice(0, 10).forEach(s => {
      console.log(`  - ${s.chunkId}: ${s.score.toFixed(4)}`);
    });
    console.log('Retrieved Chunk Contents:');
    selectedChunks.forEach((c, idx) => {
      console.log(`  --- Chunk ${idx + 1} (${c.documentName} (Chunk ${c.chunkIndex})) ---\n${c.content.substring(0, 500)}...\n`);
    });
    console.log('===============================================================');

    // 9. Classify user intent using the Router Agent (Groq intent classification)
    const routing = await routeRequest(query, history);
    
    // 10. Select target agent
    let agentName = '';
    switch (routing.intent) {
      case 'summary':
        agentName = 'Summary Agent';
        break;
      case 'compare':
        agentName = 'Compare Agent';
        break;
      case 'insights':
        agentName = 'Insights Agent';
        break;
      case 'qa':
      default:
        agentName = 'QA Agent';
        break;
    }

    // 11. Summary Agent Context Budget:
    // If total retrieved chunks <= 4, use all chunks.
    // If total retrieved chunks > 4, use the most relevant 4–6 chunks within a budget of 7500 characters.
    if (routing.intent === 'summary' && !isEnumQuery) {
      const charBudget = 7500;
      const minChunks = 4;
      const maxChunks = 6;

      if (selectedChunks.length > minChunks) {
        const selected: typeof selectedChunks = [];
        let totalChars = 0;

        for (const chunk of selectedChunks) {
          // Always include up to the minimum number of chunks
          if (selected.length < minChunks) {
            selected.push(chunk);
            totalChars += chunk.content.length;
            continue;
          }
          // Stop if we have reached the maximum allowed chunks
          if (selected.length >= maxChunks) {
            break;
          }
          // Check if adding the next chunk fits within our context budget
          if (totalChars + chunk.content.length <= charBudget) {
            selected.push(chunk);
            totalChars += chunk.content.length;
          } else {
            break; // Stop if budget exceeded
          }
        }
        selectedChunks = selected;
        console.log(`[Summary Agent Context Budget] Selected ${selectedChunks.length} chunks within context budget of ${charBudget} characters.`);
      }
    }

    const mergedText = selectedChunks.map(c => c.content).join('\n\n');

    // 13. Log the final context block immediately before invoking the agents
    console.log('\n================ FINAL CONTEXT SENT TO AGENT ================');
    console.log(mergedText);
    console.log('=============================================================\n');

    // 14. Prepare request context for selected agent (mapped into a virtual chunk)
    const request = {
      query,
      chunks: [{
        documentName: 'Merged Retrieval Context',
        chunkIndex: 1,
        content: mergedText,
        startChar: 0,
        endChar: mergedText.length
      }],
      history
    };

    const startAgent = Date.now();
    let answer = '';

    // 15. Run the selected sub-agent
    switch (routing.intent) {
      case 'summary':
        answer = await runSummaryAgent(request);
        break;
      case 'compare':
        answer = await runCompareAgent(request);
        break;
      case 'insights':
        answer = await runInsightsAgent(request);
        break;
      case 'qa':
      default:
        answer = await runQAAgent(request);
        break;
    }

    const durationSec = ((Date.now() - startAgent) / 1000).toFixed(1);

    // Log target Groq metrics
    console.log('\n================ GROQ RESPONSE METRICS ================');
    console.log(`Retrieved Chunk Count: ${selectedChunks.length}`);
    console.log(`Context Size: ${mergedText.length} characters`);
    console.log(`Estimated Prompt Size: ${mergedText.length + query.length + 1500} characters`);
    console.log(`Groq Response Duration: ${durationSec}s`);
    console.log('==========================================================\n');

    // 16. Map retrieved sources metadata with priority (citations -> overlaps -> full window fallback)
    const referencedChunks = findReferencedChunks(answer, selectedChunks);
    
    const isDebug = process.env.NODE_ENV === 'development';
    const sources = Array.from(
      new Set(referencedChunks.map(c => {
        if (isDebug) {
          const scoreInfo = retrievalResultScores.find(s => s.chunkId === `${c.documentName} (Chunk ${c.chunkIndex})`);
          return scoreInfo 
            ? `${c.documentName} (Chunk ${c.chunkIndex}) [Score: ${scoreInfo.score.toFixed(2)}]`
            : `${c.documentName} (Chunk ${c.chunkIndex})`;
        } else {
          return c.documentName;
        }
      }))
    );

    return {
      answer,
      sources,
      agent: agentName
    };
  } catch (error: any) {
    console.error('Error in askQuestion server action:', error);
    
    // Return specific error message (timeout vs not running vs invalid response)
    return {
      answer: error.message || "An unexpected error occurred.",
      sources: [],
      agent: "System"
    };
  }
}

/**
 * Prioritized source chunk attribution finder.
 * 
 * 1. Checks for explicit inline citations: [DocName] or DocName or [DocName (Chunk Index)]
 * 2. Fallback: Checks for unique term overlap matching on context chunks
 * 3. Fallback: Returns all chunks included in the final context window
 */
function findReferencedChunks(
  answer: string,
  contextChunks: DocumentChunk[]
): DocumentChunk[] {
  const referenced: DocumentChunk[] = [];
  const citedDocs = new Set<string>();

  // Identify which documents are cited in the answer
  for (const chunk of contextChunks) {
    const escapedDocName = chunk.documentName.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&');
    // Pattern to match [DocName] or DocName or [DocName (Chunk X)]
    const docCitationPattern = new RegExp(`\\[${escapedDocName}\\]|\\b${escapedDocName}\\b|${escapedDocName}\\s+\\(Chunk\\s+${chunk.chunkIndex}\\)`, 'i');
    if (docCitationPattern.test(answer)) {
      citedDocs.add(chunk.documentName);
    }
  }

  // If we found explicitly cited documents, filter their chunks using term-overlap
  if (citedDocs.size > 0) {
    for (const chunk of contextChunks) {
      if (citedDocs.has(chunk.documentName)) {
        // Narrow down by term overlap to avoid attributing all chunks of the cited document
        const chunkTokens = tokenizeForOverlaps(chunk.content);
        let hasOverlap = false;
        if (chunkTokens.length > 0) {
          let matchCount = 0;
          for (const token of chunkTokens) {
            if (answer.toLowerCase().includes(token)) {
              matchCount++;
            }
          }
          const score = matchCount / chunkTokens.length;
          if (score > 0.15) { // 15% threshold for relevance
            hasOverlap = true;
          }
        }
        
        if (hasOverlap) {
          referenced.push(chunk);
        }
      }
    }
    
    // Fallback: If citedDocs has docs, but no chunk met the overlap threshold, include all chunks of those cited docs
    if (referenced.length === 0) {
      for (const chunk of contextChunks) {
        if (citedDocs.has(chunk.documentName)) {
          referenced.push(chunk);
        }
      }
    }
    
    if (referenced.length > 0) {
      return referenced;
    }
  }

  // Priority 2: Term-overlap matching (Fallback if no explicit citations exist at all)
  const overlapMatches: { chunk: DocumentChunk; score: number }[] = [];
  for (const chunk of contextChunks) {
    const chunkTokens = tokenizeForOverlaps(chunk.content);
    if (chunkTokens.length > 0) {
      let matchCount = 0;
      for (const token of chunkTokens) {
        if (answer.toLowerCase().includes(token)) {
          matchCount++;
        }
      }
      const score = matchCount / chunkTokens.length;
      if (score > 0.15) {
        overlapMatches.push({ chunk, score });
      }
    }
  }

  if (overlapMatches.length > 0) {
    return overlapMatches
      .sort((a, b) => b.score - a.score)
      .map(item => item.chunk);
  }

  // Final Fallback: Return all chunks included in the context window
  return contextChunks;
}

/**
 * Tokenize helper for overlap matching, ignoring common stop words.
 */
function tokenizeForOverlaps(text: string): string[] {
  const stopWords = new Set([
    'the', 'and', 'with', 'from', 'this', 'that', 'these', 'those', 
    'here', 'there', 'what', 'where', 'when', 'which', 'who', 'how', 
    'why', 'are', 'was', 'were', 'been', 'have', 'has', 'had', 'will', 
    'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must',
    'about', 'their', 'there'
  ]);
  return Array.from(new Set(
    text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(token => token.length > 4 && !stopWords.has(token))
  ));
}

/**
 * Checks if a query is seeking comprehensive listings/extractions across the entire document.
 */
function isEnumerationQuery(query: string): boolean {
  const lower = query.toLowerCase();
  const patterns = [
    /\ball\s+(percentages|statistics|numbers|risks|recommendations|metrics|findings|numbers)\b/i,
    /\blist\s+everything\b/i,
    /\bextract\s+all\b/i,
    /\bevery\s+(percentage|numerical\s+value|statistic)\b/i,
    /\bshow\s+all\b/i
  ];
  return patterns.some(pattern => pattern.test(lower));
}

/**
 * Checks if a query is a short, direct factual QA question to optimize context budget and Groq speed.
 */
function isSimpleQuery(query: string): boolean {
  const wordCount = query.trim().split(/\s+/).length;
  const isQuestion = /^(what|where|who|when|how|why|is|are|was|were|did|does|can|could|do)\b/i.test(query.trim());
  return isQuestion && wordCount <= 8;
}

/**
 * Selects chunks distributed across multiple document regions (4 regions per document)
 * to maximize document coverage and completeness for enumeration queries.
 */
function selectChunksFromMultipleRegions(
  scoredChunks: { chunk: DocumentChunk; score: number }[],
  maxTotalChunks = 20
): DocumentChunk[] {
  // Group scored chunks by document name
  const docChunksMap = new Map<string, { chunk: DocumentChunk; score: number }[]>();
  for (const item of scoredChunks) {
    const list = docChunksMap.get(item.chunk.documentName) || [];
    list.push(item);
    docChunksMap.set(item.chunk.documentName, list);
  }

  const selected: DocumentChunk[] = [];
  const numDocs = docChunksMap.size;
  if (numDocs === 0) return [];

  // Limit per document
  const maxChunksPerDoc = Math.max(5, Math.floor(maxTotalChunks / numDocs));

  for (const [docName, items] of docChunksMap.entries()) {
    // Sort items by chunkIndex to define regions correctly
    const sortedByIndex = [...items].sort((a, b) => a.chunk.chunkIndex - b.chunk.chunkIndex);
    const totalChunksInDoc = sortedByIndex.length;

    if (totalChunksInDoc <= maxChunksPerDoc) {
      // If document is small, just take all chunks
      selected.push(...sortedByIndex.map(item => item.chunk));
      continue;
    }

    // Divide into 4 index-based regions
    const regionSize = Math.ceil(totalChunksInDoc / 4);
    const regions: { chunk: DocumentChunk; score: number }[][] = [[], [], [], []];

    for (const item of items) {
      const idx = item.chunk.chunkIndex - 1;
      const regionIndex = Math.min(3, Math.floor(idx / regionSize));
      regions[regionIndex].push(item);
    }

    // From each region, sort by score descending and take top chunks
    const limitPerRegion = Math.ceil(maxChunksPerDoc / 4);
    const docSelected: DocumentChunk[] = [];

    for (const regionItems of regions) {
      const sortedByScore = [...regionItems].sort((a, b) => b.score - a.score);
      const topInRegion = sortedByScore.slice(0, limitPerRegion).map(item => item.chunk);
      docSelected.push(...topInRegion);
    }

    // If we haven't reached maxChunksPerDoc, fill with remaining highest scoring chunks of the doc
    if (docSelected.length < maxChunksPerDoc) {
      const alreadySelected = new Set(docSelected.map(c => c.chunkIndex));
      const remainingScored = [...items]
        .filter(item => !alreadySelected.has(item.chunk.chunkIndex))
        .sort((a, b) => b.score - a.score);
      
      const needed = maxChunksPerDoc - docSelected.length;
      docSelected.push(...remainingScored.slice(0, needed).map(item => item.chunk));
    }

    // Sort document chunks by chunkIndex before adding to preserve natural document flow
    docSelected.sort((a, b) => a.chunkIndex - b.chunkIndex);
    selected.push(...docSelected);
  }

  return selected;
}

/**
 * Server action to generate study notes for the active documents list.
 */
export async function generateNotesAction(documentContent: string) {
  try {
    console.log("generateNotesAction entered");
    const rawDocuments = parseDocuments(documentContent);
    const documentsWithText = await Promise.all(
      rawDocuments.map(async (doc) => {
        const extResult = await extractTextFromDocument(doc.name, doc.content);
        return { name: doc.name, content: extResult.text };
      })
    );

    let selectedChunks: DocumentChunk[] = [];
    const searchQuery = "study notes key concepts facts statistics summary";
    let retrievalResultScores: { chunkId: string; score: number }[] = [];
    
    console.log('\n[RAG FLOW] Running VECTORLESS Notes Retrieval...');
    const sections = documentsWithText.flatMap(doc => parseDocumentSections(doc));
    const childChunks = chunkSections(sections, 1500, 300);
    
    const vResult = retrieveRelevantChunksVectorless(searchQuery, childChunks, sections, childChunks.length);
    retrievalResultScores = vResult.scores;
    
    const scoredItems = vResult.chunks.map(chunk => {
      const scoreInfo = retrievalResultScores.find(s => s.chunkId === `${chunk.documentName} (Chunk ${chunk.chunkIndex})`);
      return { chunk, score: scoreInfo ? scoreInfo.score : 0 };
    });
    selectedChunks = selectChunksFromMultipleRegions(scoredItems, 20);

    const mergedText = selectedChunks.map(c => c.content).join('\n\n');
    const request = {
      query: "Generate study notes based on the uploaded document content.",
      chunks: [{
        documentName: 'Merged Retrieval Context',
        chunkIndex: 1,
        content: mergedText,
        startChar: 0,
        endChar: mergedText.length
      }],
      history: []
    };

    const startAgent = Date.now();
    const answer = await runNotesAgent(request);
    const durationSec = ((Date.now() - startAgent) / 1000).toFixed(1);

    console.log('\n================ GROQ RESPONSE METRICS (NOTES AGENT) ================');
    console.log(`Retrieved Chunk Count: ${selectedChunks.length}`);
    console.log(`Context Size: ${mergedText.length} characters`);
    console.log(`Groq Response Duration: ${durationSec}s`);
    console.log('========================================================================\n');

    const referencedChunks = findReferencedChunks(answer, selectedChunks);
    const isDebug = process.env.NODE_ENV === 'development';
    const sources = Array.from(
      new Set(referencedChunks.map(c => {
        if (isDebug) {
          const scoreInfo = retrievalResultScores.find(s => s.chunkId === `${c.documentName} (Chunk ${c.chunkIndex})`);
          return scoreInfo 
            ? `${c.documentName} (Chunk ${c.chunkIndex}) [Score: ${scoreInfo.score.toFixed(2)}]`
            : `${c.documentName} (Chunk ${c.chunkIndex})`;
        } else {
          return c.documentName;
        }
      }))
    );

    return {
      answer,
      sources,
      agent: "Notes Agent"
    };
  } catch (error: any) {
    console.error('Error in generateNotesAction server action:', error);
    return {
      answer: error.message || "An unexpected error occurred.",
      sources: [],
      agent: "System"
    };
  }
}

export async function extractDocumentsAction(
  docs: { name: string; content: string }[]
): Promise<{ name: string; text: string }[]> {
  try {
    return Promise.all(
      docs.map(async (doc) => {
        const extResult = await extractTextFromDocument(doc.name, doc.content);
        return { name: doc.name, text: extResult.text };
      })
    );
  } catch (error: any) {
    console.error('Error in extractDocumentsAction:', error);
    throw new Error(error.message || 'Failed to extract text from documents.');
  }
}



