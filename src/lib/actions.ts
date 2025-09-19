'use server';

import {
  generateImplementationIntention,
  type ImplementationIntentionInput,
} from '@/ai/flows/implementation-intention-generator';
import {
  suggestIntervention,
  type InterventionInput,
} from '@/ai/flows/personalized-intervention-suggestions';
import {
  urgeSurfingMindfulnessPrompt,
  type UrgeSurfingMindfulnessInput,
} from '@/ai/flows/urge-surfing-mindfulness-prompts';

export async function getIntervention(input: InterventionInput) {
  try {
    const result = await suggestIntervention(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting intervention:', error);
    return { success: false, error: 'Failed to get intervention.' };
  }
}

export async function getImplementationIntention(
  input: ImplementationIntentionInput
) {
  try {
    const result = await generateImplementationIntention(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting implementation intention:', error);
    return { success: false, error: 'Failed to get implementation intention.' };
  }
}

export async function getUrgeSurfingScript(
  input: UrgeSurfingMindfulnessInput
) {
  try {
    const result = await urgeSurfingMindfulnessPrompt(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error getting urge surfing script:', error);
    return { success: false, error: 'Failed to get urge surfing script.' };
  }
}
