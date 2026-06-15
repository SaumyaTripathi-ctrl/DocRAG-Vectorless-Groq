/**
 * Ollama AI Integration Service
 * 
 * This service provides a reusable interface to interact with a local Ollama server.
 * It is integrated as a replacement for the Gemini API backend.
 * 
 * Default connection details:
 * - Server URL: http://localhost:11434
 * - Default Model: llama3 (can be easily replaced via OLLAMA_MODEL environment variable)
 */

// Easy model replacement config (defaults to 'llama3.2:latest')
export const OLLAMA_HOST = process.env.NEXT_PUBLIC_OLLAMA_HOST || 'http://localhost:11434';
export const OLLAMA_MODEL = process.env.NEXT_PUBLIC_OLLAMA_MODEL || 'llama3.2:latest';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'model';
  content: string;
}

/**
 * Custom error class to represent Ollama-specific connection and execution errors.
 */
export class OllamaError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'OllamaError';
  }
}

/**
 * Helper function to handle fetch errors and return a user-friendly error message.
 */
function handleConnectionError(error: any): never {
  console.error('Ollama connection/execution error:', error);
  
  if (error.name === 'AbortError' || error.message?.includes('aborted')) {
    throw new OllamaError('Ollama is taking longer than expected to respond.', error);
  }
  
  const errorMessage = error.message || '';
  if (
    error.code === 'ECONNREFUSED' || 
    errorMessage.includes('fetch failed') ||
    errorMessage.includes('Failed to fetch') ||
    errorMessage.includes('connection refused')
  ) {
    throw new OllamaError('Ollama server is not running.', error);
  }
  
  if (errorMessage.includes('Invalid response') || errorMessage.includes('status') || errorMessage.includes('format')) {
    throw new OllamaError('Ollama returned an invalid response.', error);
  }
  
  throw new OllamaError(errorMessage || 'An error occurred while communicating with Ollama.', error);
}

/**
 * Generate a response using the Ollama /api/generate endpoint.
 * 
 * @param prompt The prompt to send to the model.
 * @param model Override the default model.
 * @returns The generated response text.
 */
export async function generateResponse(prompt: string, model: string = OLLAMA_MODEL): Promise<string> {
  const url = `${OLLAMA_HOST}/api/generate`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000); // 120s timeout limit

  const start = Date.now();
  const startTimeStr = new Date(start).toISOString();

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: prompt,
        stream: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const end = Date.now();
    const endTimeStr = new Date(end).toISOString();
    const durationSec = ((end - start) / 1000).toFixed(1);
    console.log(`\n[Ollama]`);
    console.log(`Model: ${model}`);
    console.log(`Request Start Time: ${startTimeStr}`);
    console.log(`Request End Time: ${endTimeStr}`);
    console.log(`Duration: ${durationSec}s\n`);

    if (!response.ok) {
      throw new Error(`Ollama server returned status ${response.status}`);
    }

    const data = await response.json();
    if (!data || typeof data.response !== 'string') {
      throw new Error('Invalid response format received from Ollama');
    }

    return data.response;
  } catch (error: any) {
    clearTimeout(timeoutId);
    return handleConnectionError(error);
  }
}

/**
 * Conduct a multi-turn chat using the Ollama /api/chat endpoint.
 * 
 * @param messages Array of conversational messages.
 * @param model Override the default model.
 * @returns The assistant's response content.
 */
export async function chat(messages: ChatMessage[], model: string = OLLAMA_MODEL): Promise<string> {
  const url = `${OLLAMA_HOST}/api/chat`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000); // 120s timeout limit

  const start = Date.now();
  const startTimeStr = new Date(start).toISOString();

  // Map roles to standard Ollama roles (e.g., 'model' -> 'assistant')
  const formattedMessages = messages.map(msg => ({
    role: msg.role === 'model' ? 'assistant' : msg.role,
    content: msg.content,
  }));

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: formattedMessages,
        stream: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const end = Date.now();
    const endTimeStr = new Date(end).toISOString();
    const durationSec = ((end - start) / 1000).toFixed(1);
    console.log(`\n[Ollama]`);
    console.log(`Model: ${model}`);
    console.log(`Request Start Time: ${startTimeStr}`);
    console.log(`Request End Time: ${endTimeStr}`);
    console.log(`Duration: ${durationSec}s\n`);

    if (!response.ok) {
      throw new Error(`Ollama server returned status ${response.status}`);
    }

    const data = await response.json();
    if (!data || !data.message || typeof data.message.content !== 'string') {
      throw new Error('Invalid response format received from Ollama');
    }

    return data.message.content;
  } catch (error: any) {
    clearTimeout(timeoutId);
    return handleConnectionError(error);
  }
}

/**
 * Generate an embedding vector using Ollama's /api/embeddings endpoint.
 * Defaults to the 'nomic-embed-text' model.
 */
export async function getEmbedding(text: string, model = 'nomic-embed-text'): Promise<number[]> {
  const url = `${OLLAMA_HOST}/api/embeddings`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 120000); // 120s timeout limit

  const start = Date.now();
  const startTimeStr = new Date(start).toISOString();

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        prompt: text,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const end = Date.now();
    const endTimeStr = new Date(end).toISOString();
    const durationSec = ((end - start) / 1000).toFixed(1);
    console.log(`\n[Ollama]`);
    console.log(`Model: ${model}`);
    console.log(`Request Start Time: ${startTimeStr}`);
    console.log(`Request End Time: ${endTimeStr}`);
    console.log(`Duration: ${durationSec}s\n`);

    if (!response.ok) {
      throw new Error(`Ollama embedding server returned status ${response.status}`);
    }

    const data = await response.json();
    if (!data || !Array.isArray(data.embedding)) {
      throw new Error('Invalid embedding response format received from Ollama');
    }

    return data.embedding;
  } catch (error: any) {
    clearTimeout(timeoutId);
    return handleConnectionError(error);
  }
}

