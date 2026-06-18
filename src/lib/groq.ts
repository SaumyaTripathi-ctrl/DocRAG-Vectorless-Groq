export const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system' | 'model';
  content: string;
}

export class GroqError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'GroqError';
  }
}

function handleConnectionError(error: any): never {
  console.error('Groq connection/execution error:', error);
  if (error.name === 'AbortError' || error.message?.includes('aborted')) {
    throw new GroqError('Groq is taking longer than expected to respond.', error);
  }
  const errorMessage = error.message || '';
  if (errorMessage.includes('401') || errorMessage.includes('Unauthorized')) {
    throw new GroqError('Groq API Key is invalid or missing in env configurations.', error);
  }
  throw new GroqError(errorMessage || 'An error occurred while communicating with Groq API.', error);
}

export async function generateResponse(prompt: string, model: string = GROQ_MODEL): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY || '';
  if (!apiKey) {
    throw new GroqError('GROQ_API_KEY is not defined in the environment variables.');
  }

  const url = 'https://api.groq.com/openai/v1/chat/completions';
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout limit

  const start = Date.now();
  const startTimeStr = new Date(start).toISOString();
  
  // Clean up model name: if it's the Ollama default, fall back to Groq default
  const targetModel = model.includes('llama3.2') ? GROQ_MODEL : model;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: targetModel,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const end = Date.now();
    const endTimeStr = new Date(end).toISOString();
    const durationSec = ((end - start) / 1000).toFixed(1);
    console.log(`\n[Groq API]`);
    console.log(`Model: ${targetModel}`);
    console.log(`Request Start Time: ${startTimeStr}`);
    console.log(`Request End Time: ${endTimeStr}`);
    console.log(`Duration: ${durationSec}s\n`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.error?.message || `Groq server returned status ${response.status}`;
      throw new Error(message);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (typeof content !== 'string') {
      throw new Error('Invalid response format received from Groq API');
    }

    return content;
  } catch (error: any) {
    clearTimeout(timeoutId);
    return handleConnectionError(error);
  }
}

export async function chat(messages: ChatMessage[], model: string = GROQ_MODEL): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY || '';
  if (!apiKey) {
    throw new GroqError('GROQ_API_KEY is not defined in the environment variables.');
  }

  const url = 'https://api.groq.com/openai/v1/chat/completions';
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout limit

  const start = Date.now();
  const startTimeStr = new Date(start).toISOString();
  
  const targetModel = model.includes('llama3.2') ? GROQ_MODEL : model;

  // Map messages to OpenAI roles ('system', 'user', 'assistant')
  const formattedMessages = messages.map(msg => ({
    role: msg.role === 'model' ? 'assistant' : msg.role === 'assistant' ? 'assistant' : msg.role === 'system' ? 'system' : 'user',
    content: msg.content,
  }));

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: targetModel,
        messages: formattedMessages,
        temperature: 0.2,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const end = Date.now();
    const endTimeStr = new Date(end).toISOString();
    const durationSec = ((end - start) / 1000).toFixed(1);
    console.log(`\n[Groq API - Chat]`);
    console.log(`Model: ${targetModel}`);
    console.log(`Request Start Time: ${startTimeStr}`);
    console.log(`Request End Time: ${endTimeStr}`);
    console.log(`Duration: ${durationSec}s\n`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const message = errorData.error?.message || `Groq server returned status ${response.status}`;
      throw new Error(message);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (typeof content !== 'string') {
      throw new Error('Invalid response format received from Groq API');
    }

    return content;
  } catch (error: any) {
    clearTimeout(timeoutId);
    return handleConnectionError(error);
  }
}
