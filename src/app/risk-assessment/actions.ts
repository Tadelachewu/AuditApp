"use server";

import { assessRisk, type RiskAssessmentInput, type RiskAssessmentOutput } from "@/ai/flows/risk-assessment";
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session-crypto';

export async function runRiskAssessment(input: RiskAssessmentInput): Promise<RiskAssessmentOutput> {
  const sessionCookie = cookies().get('session')?.value;
  const session = sessionCookie ? await decrypt(sessionCookie) : null;
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
