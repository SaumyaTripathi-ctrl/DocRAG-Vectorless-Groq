'use server';
/**
 * @fileOverview A Genkit flow for generating premium 3D product animations using Veo.
 *
 * - generateProductAnimation - A function that orchestrates the video generation.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const AnimationInputSchema = z.object({
  photoDataUri: z.string().describe("A photo of the scene as a base reference (data URI)."),
  prompt: z.string().describe("The animation flow description."),
});

export type AnimationInput = z.infer<typeof AnimationInputSchema>;

export async function generateProductAnimation(input: AnimationInput) {
  return productAnimationFlow(input);
}

const productAnimationFlow = ai.defineFlow(
  {
    name: 'productAnimationFlow',
    inputSchema: AnimationInputSchema,
    outputSchema: z.object({ videoUrl: z.string() }),
  },
  async (input) => {
    let { operation } = await ai.generate({
      model: googleAI.model('veo-2.0-generate-001'),
      prompt: [
        { text: input.prompt },
        { media: { url: input.photoDataUri, contentType: 'image/jpeg' } }
      ],
      config: {
        durationSeconds: 8,
        aspectRatio: '16:9',
      },
    });

    if (!operation) {
      throw new Error('Expected the model to return an operation');
    }

    // Polling logic for video generation
    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }

    if (operation.error) {
      throw new Error('failed to generate video: ' + operation.error.message);
    }

    const video = operation.output?.message?.content.find((p) => !!p.media);
    if (!video || !video.media) {
      throw new Error('Failed to find the generated video');
    }

    // In a real app, you would download and return the video.
    // Here we return the temporary URL (requires API key to view as per Genkit docs).
    return { videoUrl: video.media.url };
  }
);
