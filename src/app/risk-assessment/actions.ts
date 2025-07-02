"use server";

import { assessRisk, type RiskAssessmentInput, type RiskAssessmentOutput } from "@/ai/flows/risk-assessment";

export async function runRiskAssessment(input: RiskAssessmentInput): Promise<RiskAssessmentOutput> {
  // Here you could add extra validation, logging, or authentication checks
  // before calling the AI flow.
  try {
    const result = await assessRisk(input);
    return result;
  } catch (error) {
    console.error("Error in runRiskAssessment server action:", error);
    // Re-throw the error to be caught by the client-side caller
    throw new Error("Failed to execute risk assessment AI flow.");
  }
}
