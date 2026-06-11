'use server';
/**
 * @fileOverview An AI agent that answers natural language questions based on provided document content.
 *
 * - intelligentDocumentQuery - A function that handles querying documents.
 * - IntelligentDocumentQueryInput - The input type for the intelligentDocumentQuery function.
 * - IntelligentDocumentQueryOutput - The return type for the intelligentDocumentQuery function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IntelligentDocumentQueryInputSchema = z.object({
  query: z.string().describe('The natural language question from the user.'),
  documentContent: z.string().describe('The relevant content from the document(s) to answer the query.'),
});
export type IntelligentDocumentQueryInput = z.infer<typeof IntelligentDocumentQueryInputSchema>;

const IntelligentDocumentQueryOutputSchema = z.object({
  answer: z.string().describe('The AI-generated answer to the user\'s question based on the document content.'),
});
export type IntelligentDocumentQueryOutput = z.infer<typeof IntelligentDocumentQueryOutputSchema>;

export async function intelligentDocumentQuery(input: IntelligentDocumentQueryInput): Promise<IntelligentDocumentQueryOutput> {
  return intelligentDocumentQueryFlow(input);
}

const intelligentDocumentQueryPrompt = ai.definePrompt({
  name: 'intelligentDocumentQueryPrompt',
  input: { schema: IntelligentDocumentQueryInputSchema },
  output: { schema: IntelligentDocumentQueryOutputSchema },
  prompt: `You are an AI assistant designed to answer questions based *only* on the provided document content.
If the answer cannot be found in the document, state that you cannot find the answer in the provided context.

User Query: {{{query}}}

Document Content:
\`\`\`
{{{documentContent}}}
\`\`\`

Based on the Document Content, please provide a concise answer to the User Query.`,
});

const intelligentDocumentQueryFlow = ai.defineFlow(
  {
    name: 'intelligentDocumentQueryFlow',
    inputSchema: IntelligentDocumentQueryInputSchema,
    outputSchema: IntelligentDocumentQueryOutputSchema,
  },
  async (input) => {
    const { output } = await intelligentDocumentQueryPrompt(input);
    if (!output) {
      throw new Error('Failed to get an answer from the AI model.');
    }
    return output;
  }
);
