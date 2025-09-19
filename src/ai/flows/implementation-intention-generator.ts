'use server';

/**
 * @fileOverview A flow that generates personalized implementation intentions (If X, then I will Y plans) based on logged triggers.
 *
 * - generateImplementationIntention - A function that generates personalized implementation intentions.
 * - ImplementationIntentionInput - The input type for the generateImplementationIntention function.
 * - ImplementationIntentionOutput - The return type for the generateImplementationIntention function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImplementationIntentionInputSchema = z.object({
  loggedTriggers: z
    .string()
    .describe(
      'A comma-separated list of triggers that the user has logged.  These should be short phrases.'
    ),
  habitCategory: z
    .string()
    .describe(
      'The category of habit the user is trying to change (e.g., sex, porn, food, shopping, social media, validation-seeking, alcohol, etc.)'
    ),
});
export type ImplementationIntentionInput = z.infer<
  typeof ImplementationIntentionInputSchema
>;

const ImplementationIntentionOutputSchema = z.object({
  implementationIntention: z
    .string()
    .describe(
      'A personalized implementation intention in the format \'If X, then I will Y,\' where X is a specific trigger and Y is a replacement behavior.'
    ),
});
export type ImplementationIntentionOutput = z.infer<
  typeof ImplementationIntentionOutputSchema
>;

export async function generateImplementationIntention(
  input: ImplementationIntentionInput
): Promise<ImplementationIntentionOutput> {
  return implementationIntentionFlow(input);
}

const implementationIntentionPrompt = ai.definePrompt({
  name: 'implementationIntentionPrompt',
  input: {schema: ImplementationIntentionInputSchema},
  output: {schema: ImplementationIntentionOutputSchema},
  prompt: `You are a clinically-informed habit change assistant. Based on the user's logged triggers, generate a personalized implementation intention in the format \'If X, then I will Y,\' where X is a specific trigger and Y is a replacement behavior.

  The user is trying to change a habit related to: {{habitCategory}}.

  Here are the user's logged triggers: {{loggedTriggers}}

  Remember to cite the principle briefly (eg: “This works because even a small replacement habit can rewire your cue→routine→reward loop.”)
  Make the replacement behavior specific, measurable, achievable, relevant, and time-bound (SMART).
  Make the implementation intention as easy as possible to follow.
`,
});

const implementationIntentionFlow = ai.defineFlow(
  {
    name: 'implementationIntentionFlow',
    inputSchema: ImplementationIntentionInputSchema,
    outputSchema: ImplementationIntentionOutputSchema,
  },
  async input => {
    const {output} = await implementationIntentionPrompt(input);
    return output!;
  }
);
