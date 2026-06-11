'use server';
/**
 * @fileOverview A Genkit flow for synthesizing information across multiple documents.
 *
 * - synthesizeInformation - A function that handles the cross-document information synthesis process.
 * - CrossDocumentInformationSynthesisInput - The input type for the synthesizeInformation function.
 * - CrossDocumentInformationSynthesisOutput - The return type for the synthesizeInformation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CrossDocumentInformationSynthesisInputSchema = z.object({
  question: z.string().describe('The question to be answered by synthesizing information.'),
  documents: z.array(
    z.object({
      documentName: z.string().describe('The name of the document.'),
      documentContent: z.string().describe('The text content of the document.'),
    })
  ).describe('An array of documents to synthesize information from.'),
});
export type CrossDocumentInformationSynthesisInput = z.infer<typeof CrossDocumentInformationSynthesisInputSchema>;

const CrossDocumentInformationSynthesisOutputSchema = z.object({
  synthesizedAnswer: z.string().describe('The comprehensive answer synthesized from the documents.'),
});
export type CrossDocumentInformationSynthesisOutput = z.infer<typeof CrossDocumentInformationSynthesisOutputSchema>;

export async function synthesizeInformation(input: CrossDocumentInformationSynthesisInput): Promise<CrossDocumentInformationSynthesisOutput> {
  return crossDocumentInformationSynthesisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'crossDocumentInformationSynthesisPrompt',
  input: {schema: CrossDocumentInformationSynthesisInputSchema},
  output: {schema: CrossDocumentInformationSynthesisOutputSchema},
  prompt: `You are an expert at synthesizing information across multiple documents to answer questions.
Please answer the following question based ONLY on the provided documents. If the answer cannot be found in the provided documents, please state that explicitly.

Question: {{{question}}}

Documents:
{{#each documents}}
---
Document Name: {{{documentName}}}
Document Content:
{{{documentContent}}}
---
{{/each}}
`,
});

const crossDocumentInformationSynthesisFlow = ai.defineFlow(
  {
    name: 'crossDocumentInformationSynthesisFlow',
    inputSchema: CrossDocumentInformationSynthesisInputSchema,
    outputSchema: CrossDocumentInformationSynthesisOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
