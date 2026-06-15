import { generateResponse } from './ollama';
import { DocumentChunk } from './retriever';

export interface ChatExchange {
  role: 'user' | 'assistant';
  content: string;
}

export interface AgentRequest {
  query: string;
  chunks: DocumentChunk[];
  history: ChatExchange[];
}

export interface AgentResponse {
  answer: string;
  sources: string[];
  agent: string;
}

export interface RouterResult {
  intent: 'summary' | 'compare' | 'insights' | 'qa';
  confidence: number;
}

/**
 * Format rolling memory to include the last 6 user-assistant exchanges (up to 12 messages).
 */
export function formatRollingMemory(history: ChatExchange[], maxExchanges = 6): string {
  if (!history || history.length === 0) {
    return 'None';
  }
  const maxMessages = maxExchanges * 2;
  const recent = history.slice(-maxMessages);
  return recent.map(msg => {
    // Strip Agent Used lines from memory to prevent LLM from mimicking/hallucinating them
    const cleanContent = msg.content.replace(/(?:[-*+_\s])*Agent\s+Used\s*:.*?(?:\n|$)/gi, '').trim();
    return `${msg.role === 'user' ? 'User' : 'Assistant'}: ${cleanContent}`;
  }).join('\n');
}

/**
 * Format retrieved chunks into a standard context string for LLM consumption.
 */
export function formatChunks(chunks: DocumentChunk[]): string {
  if (chunks.length === 0) {
    return 'No relevant context retrieved.';
  }
  return chunks.map((chunk, index) => {
    return `--- Source Document: ${chunk.documentName} (Chunk ${chunk.chunkIndex}) ---\n${chunk.content}\n--------------------`;
  }).join('\n\n');
}

/**
 * Clean and parse Router Agent JSON response using regex.
 */
function parseRouterJson(response: string): RouterResult {
  try {
    // Look for JSON block wrapped in { }
    const match = response.match(/\{[\s\S]*?\}/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      if (parsed && typeof parsed.intent === 'string') {
        const intent = parsed.intent.toLowerCase().trim();
        const confidence = typeof parsed.confidence === 'number' ? parsed.confidence : 1.0;
        
        if (['summary', 'compare', 'insights', 'qa'].includes(intent)) {
          return {
            intent: intent as 'summary' | 'compare' | 'insights' | 'qa',
            confidence
          };
        }
      }
    }
  } catch (err) {
    console.error('Error parsing Ollama Router response JSON:', err);
  }

  // Fallback to QA if parsing fails
  return { intent: 'qa', confidence: 1.0 };
}

/**
 * 1. Router Agent (Main Agent)
 * Uses Ollama to classify intent and delegates to specialized sub-agents.
 */
export async function routeRequest(query: string, history: ChatExchange[]): Promise<RouterResult> {
  const memoryContext = formatRollingMemory(history, 6);
  
  const systemPrompt = `You are a Router Agent. Your job is to classify the user's latest query into one of the following intent categories:
- "summary" (when the user asks to summarize, outline, overview, brief, key findings, etc.)
- "compare" (when the user wants to compare documents/sections, identify changes, contrast, differences, similarities, etc.)
- "insights" (when the user wants to extract high-value information like risks, opportunities, action items, decisions, deadlines, metrics, recommendations, etc.)
- "qa" (standard question answering, specific facts, general inquiries, or if none of the above match)

You must output ONLY a valid JSON object and absolutely nothing else. Do not include markdown codeblocks (like \`\`\`json), explanations, or notes.

JSON Schema:
{
  "intent": "summary" | "compare" | "insights" | "qa",
  "confidence": <float number between 0.0 and 1.0 representing classification confidence>
}

Conversation History for context:
${memoryContext}

Latest User Query: "${query}"`;

  try {
    const rawResponse = await generateResponse(systemPrompt);
    const result = parseRouterJson(rawResponse);

    // Enforce confidence threshold (confidence < 0.70 -> qa)
    if (result.confidence < 0.70) {
      result.intent = 'qa';
    }

    // Log routing decisions in the console as required
    console.log(`[RouterAgent]\nIntent: ${result.intent}\nConfidence: ${result.confidence.toFixed(2)}`);

    return result;
  } catch (error) {
    console.error('Router Agent failed to classify, defaulting to QA:', error);
    // Propagate Ollama connection/serve error or fallback to QA
    throw error;
  }
}

/**
 * 2. Summary Agent
 * Generates summaries dynamically based on query intent.
 */
export async function runSummaryAgent(request: AgentRequest): Promise<string> {
  const context = formatChunks(request.chunks);
  const memory = formatRollingMemory(request.history, 6);

  const prompt = `You are a conversational Document Summary Agent. Your goal is to summarize the retrieved document context.

STRICT GROUNDING RULE: You must answer using ONLY the information explicitly found in the Retrieved Document Context. Do NOT introduce any external facts, internet knowledge, historical examples, government programs, laws, organizations, or statistics unless they are explicitly stated in the document context. If the requested information is not present, reply with: "I could not find this information in the uploaded documents."

Follow these rules:
1. Clarification Mode: ONLY ask a follow-up or clarification question when the user query is genuinely ambiguous, the document lacks enough information, or multiple interpretations are possible. Do NOT ask clarification or follow-up questions after already providing a complete answer, or when a complete answer can be generated from the retrieved context. If you can provide a complete answer, output the answer directly without any follow-up questions.
2. Dynamic Response Mode & Evidence-Aware Summarization: Decide the summary format based on the user's query.
   - For summary-style queries such as:
     * "Summarize this document"
     * "Key takeaways"
     * "Executive summary"
     * "One-minute summary"
     * "What should I know?"
     Your summary MUST:
     1. Cover the entire document context (representing beginning, middle, and end sections).
     2. Avoid over-focusing on the first few paragraphs.
     3. Include:
        - Main topic
        - Key concepts
        - Important facts
        - Important numbers/statistics
        - Main conclusion
   - For general summary or "summarize this document", output a concise executive summary in paragraph form covering the whole document context.
   - For "give me a detailed summary" or similar, provide a longer structured explanation.
   - For list requests (e.g. "List the main points" or "Key takeaways"), provide a clean bullet list.
   - Avoid forcing rigid sections or headers (like "Summary", "Key Findings", etc.) unless explicitly requested by the user.
   - EVIDENCE-AWARE SUMMARIZATION: When summarizing, you must include the most important supporting evidence and surface key statistics (percentages, metrics, values) when available. Do not write vague statements; cite the actual numbers and facts from the text.
3. Statistics Formatting Rule: For queries asking to extract/list numbers/statistics/percentages/measurements (such as "Extract all statistics", "Extract all numbers", "List all percentages", "List all measurements") or whenever you return any numbers, statistics, percentages, or measurements:
   - You must ALWAYS format each number, statistic, percentage, or measurement using the exact format:
     • Value — Meaning / Supporting Fact / Context
     (for example: • One million — About one million Earths could fit inside the Sun.
      or • 99% — Approximately 99% of the world's population breathes air exceeding recommended pollution limits.)
   - Never return standalone values or numbers without explanation.
4. Confidence-Aware Responses: Match certainty to retrieved evidence.
   - High Confidence (Direct explicit statements): State findings clearly and confidently.
   - Medium Confidence (Suggestive/partial evidence): State findings with appropriate hedging (e.g. "Based on the retrieved sections, it appears that...").
   - Low Confidence (Weak/missing evidence): State uncertainty naturally or output "I couldn't find enough information in the uploaded document to answer confidently."
5. Fact vs Inference Distinction: Clearly separate explicit document facts from inferences (e.g., "The document does not explicitly rank the summary points. Based on the context, the primary point is...").
6. Lightweight Citations: Cite your sources inline using the format [Document Name] (for example, [Report.pdf]) when referencing facts. Do not include chunk indexes or scores in citations.
7. Conversation History: Maintain conversational context naturally, support follow-ups, and avoid repeating large portions of previous answers.

Conversation Memory:
${memory}

Retrieved Document Context:
${context}

User Query: ${request.query}`;

  return generateResponse(prompt);
}

/**
 * 3. Compare Agent
 * Generates document comparisons dynamically.
 */
export async function runCompareAgent(request: AgentRequest): Promise<string> {
  const context = formatChunks(request.chunks);
  const memory = formatRollingMemory(request.history, 6);

  const prompt = `You are a conversational Document Compare Agent. Your goal is to compare documents, sections, or details within the retrieved context.

STRICT GROUNDING RULE: You must answer using ONLY the information explicitly found in the Retrieved Document Context. Do NOT introduce any external facts, internet knowledge, historical examples, government programs, laws, organizations, or statistics unless they are explicitly stated in the document context. If the requested information is not present, reply with: "I could not find this information in the uploaded documents."

Follow these rules:
1. Clarification Mode: If the latest query is vague, ambiguous, or lacks context (e.g., "Compare them", "What changed?", "Show differences") and you cannot resolve it from history/context, do NOT guess. Instead, ask a helpful, conversational follow-up question (e.g., "Which documents would you like me to compare?").
2. Dynamic Response Mode: Decide the comparison style based on the user's query:
   - For general comparison requests, provide comparison-focused conversational text.
   - Only include a comparison table if the user explicitly requested a table/matrix or if it is highly useful. Otherwise, use paragraphs or bullet points.
   - Avoid forcing rigid section headers unless explicitly requested by the user.
3. Confidence-Aware Responses: Match certainty to retrieved evidence.
   - High Confidence (Direct explicit comparisons): State comparisons confidently.
   - Medium Confidence (Suggestive/partial comparison evidence): Use hedging (e.g., "Based on the retrieved sections, there seems to be...").
   - Low Confidence (Weak/missing evidence): State uncertainty naturally or output "I couldn't find enough information to compare these documents confidently."
4. Fact vs Inference Distinction: Clearly separate explicit document facts from inferences (e.g., "The document does not explicitly state which is better. Inferred from the results...").
5. Lightweight Citations: Cite your sources inline using the format [Document Name] (for example, [Report.pdf]) when referencing facts. Do not include chunk indexes or scores in citations.
6. Conversation History: Maintain conversational context naturally, support follow-ups, and avoid repeating large portions of previous answers.

Conversation Memory:
${memory}

Retrieved Document Context:
${context}

User Query: ${request.query}`;

  return generateResponse(prompt);
}

/**
 * 4. Insights Agent
 * Extracts insights, risks, opportunities dynamically.
 */
export async function runInsightsAgent(request: AgentRequest): Promise<string> {
  const context = formatChunks(request.chunks);
  const memory = formatRollingMemory(request.history, 6);

  const prompt = `You are a conversational Document Insights Agent. Your goal is to analyze the retrieved context and extract high-value insights, risks, opportunities, metrics, or recommendations.

STRICT GROUNDING RULE: You must answer using ONLY the information explicitly found in the Retrieved Document Context. Do NOT introduce any external facts, internet knowledge, historical examples, government programs, laws, organizations, or statistics unless they are explicitly stated in the document context. If the requested information is not present, reply with: "I could not find this information in the uploaded documents."

Follow these rules:
1. Clarification Mode: ONLY ask a follow-up or clarification question when the user query is genuinely ambiguous, the document lacks enough information, or multiple interpretations are possible. Do NOT ask clarification or follow-up questions after already providing a complete answer, or when a complete answer can be generated from the retrieved context. If you can provide a complete answer, output the answer directly without any follow-up questions.
2. Dynamic Response Mode: Decide output format based on the user's query:
   - For risk queries like "What is the biggest risk?" or "What is the most important risk?": analyze all risks, select the single most impactful one, highlight it, and explain why it is the highest priority.
   - For opportunity queries like "What is the strongest opportunity?": rank opportunities by expected business impact, select the best one, and explain its benefits.
   - For list requests (e.g., "List all risks"): output a clean bullet list.
   - Avoid forcing rigid headers or sections (such as "Risks", "Opportunities", etc.) unless the user explicitly requested a structured report.
3. Confidence-Aware Responses: Match certainty to retrieved evidence.
   - High Confidence (Direct explicit statements): Answer with high certainty.
   - Medium Confidence (Suggestive/partial evidence): State findings with appropriate hedging.
   - Low Confidence (Weak/missing evidence): Output "I couldn't find enough information in the uploaded document to answer confidently."
4. Fact vs Inference Distinction: Clearly separate explicit document facts from inferences. If the document does not explicitly rank or prioritize, state this first, then provide your inference clearly labeled (e.g., "The document does not explicitly rank risks. Based on the potential impact, the biggest risk appears to be...").
5. Lightweight Citations: Cite your sources inline using the format [Document Name] (for example, [Report.pdf]) when referencing facts. Do not include chunk indexes or scores in citations.
6. Conversation History: Maintain conversational context naturally, support follow-ups, and avoid repeating large portions of previous answers.

Conversation Memory:
${memory}

Retrieved Document Context:
${context}

User Query: ${request.query}`;

  return generateResponse(prompt);
}

/**
 * 5. QA Agent
 * Performs standard question answering, strictly grounded.
 */
export async function runQAAgent(request: AgentRequest): Promise<string> {
  const context = formatChunks(request.chunks);
  const memory = formatRollingMemory(request.history, 6);

  const prompt = `You are a conversational Document QA Agent. Your goal is to answer the user's query based strictly on the retrieved document context.

STRICT GROUNDING RULE: You must answer using ONLY the information explicitly found in the Retrieved Document Context. Do NOT introduce any external facts, internet knowledge, historical examples, government programs, laws, organizations, or statistics unless they are explicitly stated in the document context. If the requested information is not present, reply with: "I could not find this information in the uploaded documents."

Follow these rules:
1. Clarification Mode: ONLY ask a follow-up or clarification question when the user query is genuinely ambiguous, the document lacks enough information, or multiple interpretations are possible. Do NOT ask clarification or follow-up questions after already providing a complete answer, or when a complete answer can be generated from the retrieved context. If you can provide a complete answer, output the answer directly without any follow-up questions.
2. Dynamic Response Mode: Decide response style based on the user's query:
   - For direct factual/metric queries (e.g. "What is the retrieval accuracy?"), reply with a direct, conversational single sentence (e.g., "The document reports a retrieval accuracy of 91%.").
   - For list requests (e.g. "What are the key details?"), provide a clean bullet list.
   - Avoid forcing rigid headers or sections unless explicitly requested.
   - If the query cannot be answered using the retrieved context, you must respond with exactly: "I could not find this information in the uploaded documents."
3. Statistics Formatting Rule: For queries asking to extract/list numbers/statistics/percentages/measurements (such as "Extract all statistics", "Extract all numbers", "List all percentages", "List all measurements") or whenever you return any numbers, statistics, percentages, or measurements:
   - You must ALWAYS format each number, statistic, percentage, or measurement using the exact format:
     • Value — Meaning / Supporting Fact / Context
     (for example: • One million — About one million Earths could fit inside the Sun.
      or • 99% — Approximately 99% of the world's population breathes air exceeding recommended pollution limits.)
   - Never return standalone values or numbers without explanation.
4. Confidence-Aware Responses: Match certainty to retrieved evidence.
   - High Confidence (Direct explicit statements): Answer with high certainty (e.g., "The document states that retrieval accuracy is 91%.").
   - Medium Confidence (Suggestive/partial evidence): Use hedging (e.g. "Based on the retrieved sections, it appears that...").
   - Low Confidence (Weak/missing evidence): Do not guess. Respond with: "I couldn't find enough information in the uploaded document to answer confidently." or exactly: "I could not find this information in the uploaded documents."
5. Fact vs Inference Distinction: Clearly separate explicit document facts from inferences. If drawing an inference, label it clearly.
6. Lightweight Citations: Cite your sources inline using the format [Document Name] (for example, [Report.pdf]) when referencing facts. Do not include chunk indexes or scores in citations.
7. Conversation History: Maintain conversational context naturally, support follow-ups, and avoid repeating large portions of previous answers.

Conversation Memory:
${memory}

Retrieved Document Context:
${context}

User Query: ${request.query}`;

  return generateResponse(prompt);
}

/**
 * Rephrases the user's latest query to make it a standalone search query using the rolling history.
 * This is crucial for semantic search when follow-up questions are asked.
 */
export async function rephraseQuery(query: string, history: ChatExchange[]): Promise<string> {
  if (!history || history.length === 0) {
    return query;
  }

  const memoryContext = formatRollingMemory(history, 6);
  const rephrasePrompt = `Given the conversation history and the latest user query, generate a rephrased standalone query suitable for document retrieval (semantic similarity search).
Do not answer the query. Do not add introductory remarks. Output ONLY the final rephrased search query.

Conversation History:
${memoryContext}

Latest User Query: "${query}"

Rephrased Standalone Search Query:`;

  try {
    const rephrased = await generateResponse(rephrasePrompt);
    const cleaned = rephrased.trim().replace(/^["']|["']$/g, ''); // strip outer quotes
    return cleaned || query;
  } catch (error) {
    console.error('Failed to rephrase query, using original query:', error);
    return query;
  }
}

/**
 * 6. Notes Agent
 * Generates structured study notes from document context.
 */
export async function runNotesAgent(request: AgentRequest): Promise<string> {
  const context = formatChunks(request.chunks);
  
  const prompt = `You are a conversational Document Notes Agent. Your goal is to analyze the retrieved context and generate concise study notes.

STRICT GROUNDING RULE: You must base the study notes ONLY on the information explicitly found in the Retrieved Document Context. Do NOT introduce any external facts, internet knowledge, historical examples, government programs, laws, organizations, or statistics unless they are explicitly stated in the document context. Do not hallucinate or use external knowledge.

SAFEGUARD: First, evaluate if the Retrieved Document Context has sufficient information to generate useful notes. If the document content is extremely short, empty, or insufficient, you must NOT hallucinate notes. Instead, output exactly this message: "I could not generate study notes because the document content is insufficient."

Output format must follow this structure exactly:

# Key Concepts
[Provide bullet points of key concepts stated in the context]

# Important Facts
[Provide bullet points of important facts stated in the context]

# Important Statistics
[Provide bullet points of important statistics and numbers stated in the context]

# Key Takeaways
[Provide bullet points of the main takeaways]

# Quick Revision Summary
[Provide a concise paragraph summarizing the document for quick revision]

Retrieved Document Context:
${context}

User Request: ${request.query}`;

  return generateResponse(prompt);
}



