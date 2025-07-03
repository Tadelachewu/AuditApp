'use server';

import prisma from '@/lib/db';
import * as cache from 'next/cache';
import { format } from 'date-fns';
import type { DetailedReport } from "@/lib/definitions";

export async function getReportDetails(id: string): Promise<DetailedReport | null> {
  cache.noStore();
  try {
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        findings: true,
        generatedBy: {
          select: { name: true }
        }
      },
    });

    if (!report) {
      return null;
    }

    // The included 'findings' makes this compatible with DetailedReport
    return {
      ...report,
      date: format(new Date(report.date), 'yyyy-MM-dd'),
      compliance_score: report.complianceScore,
      compliance_details: report.complianceDetails,
      generated_by: report.generatedBy,
    };
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}
