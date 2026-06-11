'use server';

import { intelligentDocumentQuery } from '@/ai/flows/intelligent-document-query';

export async function askQuestion(query: string, documentContent: string) {
  try {
    const result = await intelligentDocumentQuery({ query, documentContent });
    return result;
  } catch (error) {
    console.error('Error in askQuestion:', error);
    return { answer: "I'm sorry, I couldn't process that query." };
  }
}
