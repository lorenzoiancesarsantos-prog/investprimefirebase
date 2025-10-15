
'use server';
/**
 * @fileOverview Flow to generate investment suggestions based on user profile.
 *
 * - getInvestmentSuggestion: A function that takes a user's investment profile and returns an AI-generated suggestion.
 * - InvestmentProfileSchema: The Zod schema for the input profile.
 * - InvestmentSuggestionSchema: The Zod schema for the output suggestion.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

export const InvestmentProfileSchema = z.object({
  investmentObjective: z.string().describe('The main financial goal of the user.'),
  riskProfile: z.enum(['conservador', 'moderado', 'agressivo']).describe('The user\'s tolerance for investment risk.'),
  availableBalance: z.number().describe('The amount of money the user has available to invest right now.'),
  monthlyInvestment: z.number().describe('The amount of money the user plans to invest every month.'),
});

export const InvestmentSuggestionSchema = z.object({
  analysisSummary: z.string().describe('A brief summary of the user\'s profile and what it means.'),
  suggestedStrategy: z.string().describe('A clear, actionable investment strategy tailored to the user. Be specific about percentages and types of assets available on the platform (e.g., music royalties, patents).'),
  rationale: z.string().describe('The reasoning behind the suggested strategy, explaining how it aligns with the user\'s profile and goals.'),
});

export type InvestmentProfile = z.infer<typeof InvestmentProfileSchema>;
export type InvestmentSuggestion = z.infer<typeof InvestmentSuggestionSchema>;

const investmentPrompt = ai.definePrompt({
  name: 'investmentSuggestionPrompt',
  input: { schema: InvestmentProfileSchema },
  output: { schema: InvestmentSuggestionSchema },
  prompt: `You are an expert financial advisor for Invest Prime, a platform specializing in royalty-based alternative investments.
Your task is to analyze a user's investment profile and provide a personalized, actionable investment suggestion.

User Profile:
- Investment Objective: {{{investmentObjective}}}
- Risk Profile: {{{riskProfile}}}
- Available Balance: R$ {{{availableBalance}}}
- Monthly Investment: R$ {{{monthlyInvestment}}}

Based on this profile, provide a clear and concise investment suggestion.

Instructions:
1.  **Analysis Summary**: Briefly summarize the user's profile and its implications.
2.  **Suggested Strategy**: Propose a concrete strategy. Allocate the "Available Balance" and "Monthly Investment" into the platform's assets. Be specific. The only assets available are high-yield music royalties and medium-yield patent royalties.
3.  **Rationale**: Explain WHY this strategy is suitable for the user, linking it directly to their risk profile, objectives, and financial situation.

Provide the response in the structured format defined by the output schema.
`,
});

const investmentFlow = ai.defineFlow(
  {
    name: 'investmentSuggestionFlow',
    inputSchema: InvestmentProfileSchema,
    outputSchema: InvestmentSuggestionSchema,
  },
  async (profile) => {
    const { output } = await investmentPrompt(profile);
    if (!output) {
      throw new Error('Failed to get a valid response from the AI model.');
    }
    return output;
  }
);

export async function getInvestmentSuggestion(profile: InvestmentProfile): Promise<InvestmentSuggestion> {
  return investmentFlow(profile);
}
