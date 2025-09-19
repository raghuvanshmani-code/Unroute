'use server';
/**
 * @fileOverview Provides short, guided mindfulness scripts to help users ride the urge without acting on it.
 *
 * - urgeSurfingMindfulnessPrompt - A function that provides mindfulness scripts.
 * - UrgeSurfingMindfulnessInput - The input type for the urgeSurfingMindfulnessPrompt function.
 * - UrgeSurfingMindfulnessOutput - The return type for the urgeSurfingMindfulnessPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UrgeSurfingMindfulnessInputSchema = z.object({
  urgeType: z.string().describe('The type of urge the user is experiencing (e.g., sex, food, social media).'),
  intensityBefore: z.number().describe('The user-rated intensity of the urge before the mindfulness exercise (1-10).'),
});
export type UrgeSurfingMindfulnessInput = z.infer<typeof UrgeSurfingMindfulnessInputSchema>;

const UrgeSurfingMindfulnessOutputSchema = z.object({
  script: z.string().describe('A short, guided mindfulness script to help the user ride the urge.'),
  intensityAfter: z.number().describe('The user-rated intensity of the urge after the mindfulness exercise (1-10).'),
});
export type UrgeSurfingMindfulnessOutput = z.infer<typeof UrgeSurfingMindfulnessOutputSchema>;

export async function urgeSurfingMindfulnessPrompt(input: UrgeSurfingMindfulnessInput): Promise<UrgeSurfingMindfulnessOutput> {
  return urgeSurfingMindfulnessFlow(input);
}

const prompt = ai.definePrompt({
  name: 'urgeSurfingMindfulnessPrompt',
  input: {schema: UrgeSurfingMindfulnessInputSchema},
  output: {schema: UrgeSurfingMindfulnessOutputSchema},
  prompt: `You are a mindfulness expert guiding a user through urge-surfing.

The user is experiencing an urge of type: {{{urgeType}}} with an initial intensity of {{{intensityBefore}}}.

Provide a short (30 sec - 3 min) guided mindfulness script to help the user ride the urge without acting on it.
The script should encourage the user to:
- Notice the physical sensations of the urge in their body without judgment.
- Acknowledge the urge as a temporary experience that will pass.
- Visualize the urge as a wave, rising and falling, without being swept away by it.
- Focus on their breath and the present moment.

After the script, ask the user to rate the intensity of the urge again (1-10) and record it in the intensityAfter output field.

Mindfulness Script:
`,
});

const urgeSurfingMindfulnessFlow = ai.defineFlow(
  {
    name: 'urgeSurfingMindfulnessFlow',
    inputSchema: UrgeSurfingMindfulnessInputSchema,
    outputSchema: UrgeSurfingMindfulnessOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
