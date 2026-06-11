'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating suggested follow-up questions
 * based on a given conversation history. It exports the main flow function and its input/output types.
 *
 * - generateSuggestedFollowUpQuestions - A function that orchestrates the generation of follow-up questions.
 * - SuggestedFollowUpQuestionsInput - The input type for the generateSuggestedFollowUpQuestions function.
 * - SuggestedFollowUpQuestionsOutput - The return type for the generateSuggestedFollowUpQuestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Represents a message in the conversation history.
 */
const ConversationMessageSchema = z.object({
  role: z.enum(['user', 'model']).describe('The role of the sender (user or model).'),
  content: z.string().describe('The content of the message.'),
});

/**
 * Defines the input for the suggested follow-up questions flow.
 * It expects an array of conversation messages.
 */
const SuggestedFollowUpQuestionsInputSchema = z.array(ConversationMessageSchema).describe('The current conversation history, including user questions and AI answers.');
export type SuggestedFollowUpQuestionsInput = z.infer<typeof SuggestedFollowUpQuestionsInputSchema>;

/**
 * Defines the output for the suggested follow-up questions flow.
 * It returns an array of suggested follow-up questions as strings.
 */
const SuggestedFollowUpQuestionsOutputSchema = z.array(z.string())
  .describe('A list of suggested follow-up questions.');
export type SuggestedFollowUpQuestionsOutput = z.infer<typeof SuggestedFollowUpQuestionsOutputSchema>;

/**
 * Generates suggested follow-up questions based on the provided conversation history.
 *
 * @param input The conversation history.
 * @returns A promise that resolves to an array of suggested questions.
 */
export async function generateSuggestedFollowUpQuestions(
  input: SuggestedFollowUpQuestionsInput
): Promise<SuggestedFollowUpQuestionsOutput> {
  return suggestedFollowUpQuestionsFlow(input);
}

/**
 * Defines the prompt for generating suggested follow-up questions.
 */
const suggestedFollowUpPrompt = ai.definePrompt({
  name: 'suggestedFollowUpPrompt',
  input: {schema: SuggestedFollowUpQuestionsInputSchema},
  output: {schema: SuggestedFollowUpQuestionsOutputSchema},
  prompt: `You are an AI assistant tasked with generating 3-5 concise and relevant follow-up questions for a user based on the provided conversation history.
These questions should build upon the last turn of the conversation or explore related aspects of the topic discussed.
Format your output as a JSON array of strings, where each string is a suggested question. Do not include any introductory text or numbering outside the JSON array.

Conversation History:
{{#each this}}
  {{#ifEquals role "user"}}User: {{/ifEquals}}{{#ifEquals role "model"}}AI: {{/ifEquals}}{{content}}
{{/each}}
`,
});

/**
 * Defines the Genkit flow for generating suggested follow-up questions.
 */
const suggestedFollowUpQuestionsFlow = ai.defineFlow(
  {
    name: 'suggestedFollowUpQuestionsFlow',
    inputSchema: SuggestedFollowUpQuestionsInputSchema,
    outputSchema: SuggestedFollowUpQuestionsOutputSchema,
  },
  async (history) => {
    // Call the prompt with the input history to get suggested questions.
    const {output} = await suggestedFollowUpPrompt(history);
    return output!;
  }
);
