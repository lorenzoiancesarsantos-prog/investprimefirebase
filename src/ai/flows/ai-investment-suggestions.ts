
'use server';

/**
 * @fileOverview Provides AI-powered investment suggestions based on user goals and risk preferences.
 *
 * - getInvestmentSuggestion - A function that provides investment suggestions.
 * - InvestmentSuggestionInput - The input type for the getInvestmentSuggestion function.
 * - InvestmentSuggestionOutput - The return type for the getInvestmentSuggestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InvestmentSuggestionInputSchema = z.object({
  investmentObjective: z
    .string()
    .describe('The user investment objective, e.g., long-term growth, retirement savings.'),
  riskProfile: z
    .string()
    .describe(
      'The user risk profile, e.g., conservative, moderate, aggressive.'
    ),
  availableBalance: z
    .number()
    .describe('The current available balance for investments.'),
  monthlyInvestment: z
    .number()
    .describe('The amount the user plans to invest monthly.'),
});
export type InvestmentSuggestionInput = z.infer<
  typeof InvestmentSuggestionInputSchema
>;

const InvestmentSuggestionOutputSchema = z.object({
    analysisSummary: z.string().describe("A summary of the user's financial situation and goals."),
    suggestedStrategy: z
        .string()
        .describe(
        'A detailed investment strategy including royalty purchase suggestions, diversification, and risk management.'
        ),
    rationale: z
        .string()
        .describe(
        'The AI rationale behind the suggested investment strategy, referencing historical data and simulations.'
        ),
});
export type InvestmentSuggestionOutput = z.infer<
  typeof InvestmentSuggestionOutputSchema
>;

const analyzeUserFinancials = ai.defineTool(
    {
        name: 'analyzeUserFinancials',
        description: 'Analyzes the user\'s financial data to provide key insights for investment strategy.',
        inputSchema: InvestmentSuggestionInputSchema,
        outputSchema: z.object({
            canTakeRisk: z.boolean().describe('Whether the user is in a good position to take risks.'),
            primaryFocus: z.string().describe('The primary focus for the investment strategy (e.g., capital preservation, aggressive growth).'),
            observation: z.string().describe('A key observation about the user\'s financial situation.'),
        }),
    },
    async (input) => {
        let canTakeRisk = false;
        let primaryFocus = 'capital preservation';
        let observation = 'The user has a limited available balance, suggesting a cautious start.';

        if (input.riskProfile === 'aggressive' && input.availableBalance > 10000) {
            canTakeRisk = true;
            primaryFocus = 'aggressive growth';
            observation = 'The user has a high risk tolerance and sufficient balance to explore aggressive strategies.';
        } else if (input.riskProfile === 'moderado' && input.availableBalance > 5000) {
            canTakeRisk = true;
            primaryFocus = 'balanced growth';
            observation = 'The user has a moderate risk profile and a reasonable balance, allowing for a balanced approach.';
        } else if (input.riskProfile === 'conservador') {
            primaryFocus = 'capital preservation';
            observation = 'With a conservative profile, the main goal is to protect the principal investment.';
        }

        return { canTakeRisk, primaryFocus, observation };
    }
);


export async function getInvestmentSuggestion(
  input: InvestmentSuggestionInput
): Promise<InvestmentSuggestionOutput> {
  return investmentSuggestionFlow(input);
}

const investmentSuggestionPrompt = ai.definePrompt({
  name: 'investmentSuggestionPrompt',
  input: {schema: InvestmentSuggestionInputSchema},
  output: {schema: InvestmentSuggestionOutputSchema},
  tools: [analyzeUserFinancials],
  prompt: `You are an expert AI investment advisor. Your first step is to use the 'analyzeUserFinancials' tool to get a summary of the user's financial situation.
  
  Based on the output from the tool and the user's provided goals, create a personalized investment strategy.

  Your response must include:
  1.  **analysisSummary**: A brief summary of the insights you gained from the analysis tool.
  2.  **suggestedStrategy**: A detailed, actionable investment strategy. Recommend specific types of royalties (e.g., music, patents), suggest diversification, and advise on risk management.
  3.  **rationale**: Explain clearly WHY you are making these suggestions, linking them back to the user's profile and the tool's analysis.
`,
});

const investmentSuggestionFlow = ai.defineFlow(
  {
    name: 'investmentSuggestionFlow',
    inputSchema: InvestmentSuggestionInputSchema,
    outputSchema: InvestmentSuggestionOutputSchema,
  },
  async input => {
    const {output} = await investmentSuggestionPrompt(input);
    return output!;
  }
);
