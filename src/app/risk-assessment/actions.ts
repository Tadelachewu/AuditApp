"use server";

import { assessRisk, type RiskAssessmentInput, type RiskAssessmentOutput } from "@/ai/flows/risk-assessment";
import { getSession } from "@/lib/session";

export async function runRiskAssessment(input: RiskAssessmentInput): Promise<RiskAssessmentOutput> {
  const session = await getSession();
  if (session?.role !== 'ADMIN') {
    throw new Error("Unauthorized: You do not have permission to run risk assessments.");
  }
  
  try {
    const result = await assessRisk(input);
    return result;
  } catch (error) {
    console.error("Error in runRiskAssessment server action:", error);
    // Re-throw the error to be caught by the client-side caller
    throw new Error("Failed to execute risk assessment AI flow.");
  }
}
