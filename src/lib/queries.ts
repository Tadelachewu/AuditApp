import prisma from './db';
import { unstable_noStore as noStore } from 'next/cache';
import type { Audit, Checklist, Document, Report, ReportFinding, Activity } from './definitions';
import { format } from 'date-fns';

// Helper function to format dates in an object
function formatDateFields<T extends { [key: string]: any }>(
  item: T,
  fields: (keyof T)[]
): T {
  const newItem = { ...item };
  for (const field of fields) {
    if (newItem[field]) {
      newItem[field] = format(new Date(newItem[field]), 'yyyy-MM-dd');
    }
  }
  return newItem;
}

// --------- AUDITS ---------
export async function fetchAudits(): Promise<Audit[]> {
  noStore();
  try {
    const data = await prisma.audit.findMany({
      orderBy: {
        startDate: 'desc',
      },
    });
    return data.map(audit => ({
      ...audit,
      start_date: format(new Date(audit.startDate), 'yyyy-MM-dd'),
      end_date: format(new Date(audit.endDate), 'yyyy-MM-dd'),
    }));
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

// --------- CHECKLISTS ---------
export async function fetchChecklists(): Promise<Checklist[]> {
  noStore();
  try {
    const data = await prisma.checklist.findMany({
      orderBy: {
        lastUpdated: 'desc',
      },
    });
    return data.map(checklist => ({
        ...checklist,
        last_updated: format(new Date(checklist.lastUpdated), 'yyyy-MM-dd'),
    }));
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

// --------- DOCUMENTS ---------
export async function fetchDocuments(): Promise<Document[]> {
  noStore();
  try {
    const data = await prisma.document.findMany({
      orderBy: {
        uploadDate: 'desc',
      },
    });
    return data.map(doc => ({
        ...doc,
        upload_date: format(new Date(doc.uploadDate), 'yyyy-MM-dd'),
    }));
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

// --------- REPORTS ---------
export async function fetchReports(): Promise<Report[]> {
  noStore();
  try {
    const data = await prisma.report.findMany({
      orderBy: {
        date: 'desc',
      },
    });
    return data.map(report => ({
      ...report,
      date: format(new Date(report.date), 'yyyy-MM-dd'),
      compliance_score: report.complianceScore,
      compliance_details: report.complianceDetails,
      generated_by: report.generatedBy,
    }));
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export async function fetchReportById(id: string): Promise<(Report & { findings: ReportFinding[] }) | null> {
  noStore();
  try {
    const report = await prisma.report.findUnique({
      where: { id },
      include: {
        findings: true,
      },
    });

    if (!report) {
      return null;
    }

    return {
      ...report,
      date: format(new Date(report.date), 'yyyy-MM-dd'),
      compliance_score: report.complianceScore,
      compliance_details: report.complianceDetails,
      generated_by: report.generatedBy,
      findings: report.findings.map(finding => ({
        ...finding,
      })),
    };
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}


// --------- DASHBOARD ---------
export async function fetchCardData() {
    noStore();
    try {
        const [ongoingAuditsCount, checklistsCount, openFindingsCount, generatedReportsCount] = await prisma.$transaction([
            prisma.audit.count({ where: { status: 'In Progress' } }),
            prisma.checklist.count(),
            prisma.reportFinding.count({
                where: {
                    report: {
                        status: 'Finalized',
                    }
                }
            }),
            prisma.report.count(),
        ]);

        return {
            ongoingAuditsCount,
            checklistsCount,
            openFindingsCount,
            generatedReportsCount,
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch card data.');
    }
}

export async function fetchUpcomingDeadlines(): Promise<Audit[]> {
    noStore();
    try {
        const data = await prisma.audit.findMany({
            where: {
                status: {
                    not: 'Completed',
                },
            },
            orderBy: {
                endDate: 'asc',
            },
            take: 5,
        });
        return data.map(audit => ({
            ...audit,
            start_date: format(new Date(audit.startDate), 'yyyy-MM-dd'),
            end_date: format(new Date(audit.endDate), 'yyyy-MM-dd'),
        }));
    } catch (error) {
        console.error('Database Error:', error);
        return [];
    }
}

export async function fetchRecentActivities(): Promise<Activity[]> {
    noStore();
    try {
        const data = await prisma.activity.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: 5,
        });
        return data.map(activity => ({
            ...activity,
            date: format(new Date(activity.date), 'yyyy-MM-dd'),
        }));
    } catch (error) {
        console.error('Database Error:', error);
        return [];
    }
}
