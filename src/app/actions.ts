'use server';

import { intelligentDocumentQuery } from '@/ai/flows/intelligent-document-query';
import { generateSuggestedFollowUpQuestions } from '@/ai/flows/suggested-follow-up-questions';
import { synthesizeInformation } from '@/ai/flows/cross-document-information-synthesis';
import { generateProductAnimation, type AnimationInput } from '@/ai/flows/video-animation';

export async function askQuestion(query: string, documentContent: string) {
  try {
    const result = await intelligentDocumentQuery({ query, documentContent });
    return result;
  } catch (error) {
    console.error('Error in askQuestion:', error);
    return { answer: "I'm sorry, I couldn't process that query." };
  }
}

export async function getFollowUps(history: any[]) {
  try {
    const result = await generateSuggestedFollowUpQuestions(history);
    return result;
  } catch (error) {
    console.error('Error in getFollowUps:', error);
    return [];
  }
}

export async function synthesizeDocs(question: string, documents: { documentName: string; documentContent: string }[]) {
  try {
    const result = await synthesizeInformation({ question, documents });
    return result;
  } catch (error) {
    console.error('Error in synthesizeDocs:', error);
    return { synthesizedAnswer: "I'm sorry, I couldn't synthesize the information across documents." };
  }
}

export async function createAnimation(input: AnimationInput) {
  try {
    const result = await generateProductAnimation(input);
    return result;
  } catch (error) {
    console.error('Error in createAnimation:', error);
    throw error;
  }
}
