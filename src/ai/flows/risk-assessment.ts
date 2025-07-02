// risk-assessment.ts
'use server';

/**
 * @fileOverview An AI agent to identify potential risks based on historical audit data, regulatory changes, and industry trends.
 *
 * - assessRisk - A function that handles the risk assessment process.
 * - RiskAssessmentInput - The input type for the assessRisk function.
 * - RiskAssessmentOutput - The return type for the assessRisk function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RiskAssessmentInputSchema = z.object({
  historicalData: z
    .string()
    .describe('Historical audit data, including findings and resolutions.'),
  regulatoryChanges: z
    .string()
    .describe('Recent regulatory changes relevant to the audit.'),
  industryTrends: z
    .string()
    .describe('Current industry trends that may impact risk.'),
});
export type RiskAssessmentInput = z.infer<typeof RiskAssessmentInputSchema>;

const RiskAssessmentOutputSchema = z.object({
  riskSummary: z
    .string()
    .describe('A summary of the potential risks identified.'),
  riskDetails: z
    .array(z.string())
    .describe('Detailed descriptions of each identified risk.'),
  recommendations: z
    .array(z.string())
    .describe('Recommendations for addressing the identified risks.'),
});
export type RiskAssessmentOutput = z.infer<typeof RiskAssessmentOutputSchema>;

export async function assessRisk(input: RiskAssessmentInput): Promise<RiskAssessmentOutput> {
  return assessRiskFlow(input);
}

const prompt = ai.definePrompt({
  name: 'riskAssessmentPrompt',
  input: {schema: RiskAssessmentInputSchema},
  output: {schema: RiskAssessmentOutputSchema},
  prompt: `You are an expert risk assessor for X Bank.

  Based on the historical audit data, regulatory changes, and industry trends provided, identify potential risks and provide recommendations for addressing them.

  Historical Audit Data: {{{historicalData}}}
  Regulatory Changes: {{{regulatoryChanges}}}
  Industry Trends: {{{industryTrends}}}

  Format your response as a summary of potential risks, detailed descriptions of each risk, and recommendations for addressing the risks.

  Summary:
  Risk Details:
  Recommendations: `,
});

const assessRiskFlow = ai.defineFlow(
  {
    name: 'assessRiskFlow',
    inputSchema: RiskAssessmentInputSchema,
    outputSchema: RiskAssessmentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
