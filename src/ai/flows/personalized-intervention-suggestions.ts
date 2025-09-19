'use server';

/**
 * @fileOverview Provides personalized intervention suggestions based on user's motivation and ability.
 *
 * - suggestIntervention - A function that suggests interventions based on motivation and ability levels.
 * - InterventionInput - The input type for the suggestIntervention function.
 * - InterventionOutput - The return type for the suggestIntervention function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterventionInputSchema = z.object({
  urgeType: z.enum([
    'sex',
    'porn',
    'food',
    'shopping',
    'social media',
    'validation-seeking',
    'alcohol',
    'other',
  ]).describe('The type of urge the user is experiencing.'),
  motivationLevel: z
    .number()
    .min(1)
    .max(10)
    .describe('The user motivation level (1-10).'),
  abilityLevel: z
    .number()
    .min(1)
    .max(10)
    .describe('The user ability level (1-10).'),
  context: z.string().optional().describe('Additional context about the urge.'),
});
export type InterventionInput = z.infer<typeof InterventionInputSchema>;

const InterventionOutputSchema = z.object({
  intervention: z
    .string()
    .describe(
      'A personalized intervention suggestion based on the user motivation and ability levels.'
    ),
  explanation: z
    .string()
    .describe('A brief explanation of why the intervention is suggested.'),
});
export type InterventionOutput = z.infer<typeof InterventionOutputSchema>;

export async function suggestIntervention(
  input: InterventionInput
): Promise<InterventionOutput> {
  return interventionFlow(input);
}

const interventionPrompt = ai.definePrompt({
  name: 'interventionPrompt',
  input: {schema: InterventionInputSchema},
  output: {schema: InterventionOutputSchema},
  prompt: `You are an AI habit change assistant. Based on the user's motivation and ability levels, suggest a micro-action intervention and explain why it's helpful, citing relevant principles.

Urge Type: {{{urgeType}}}
Motivation Level: {{{motivationLevel}}} (1-10)
Ability Level: {{{abilityLevel}}} (1-10)
Context: {{{context}}}

Consider these principles:
- High Motivation + Low Ability: suggest very easy micro-action (1 pushup, sip water, 30-sec breath).
- High Motivation + High Ability: suggest stronger action (10 min walk, call a friend, cold shower).
- Low Motivation: give motivational testimonial, visualization, or CBT reframe.

Always cite the principle briefly (eg: "This works because even a small replacement habit can rewire your cue→routine→reward loop.")

Format your response as follows:
Intervention: [The suggested micro-action intervention]
Explanation: [A brief explanation of why the intervention is suggested, citing the relevant principle]`,
});

const interventionFlow = ai.defineFlow(
  {
    name: 'interventionFlow',
    inputSchema: InterventionInputSchema,
    outputSchema: InterventionOutputSchema,
  },
  async input => {
    const {output} = await interventionPrompt(input);
    return output!;
  }
);
