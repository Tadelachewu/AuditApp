import prisma from './db';
import { unstable_noStore as noStore } from 'next/cache';
import type { Audit, Checklist, Document, Report, Activity, User, DetailedReport } from './definitions';
import { format } from 'date-fns';

type AuditWithUser = Audit & { auditor: { name: string }};
type ReportWithUser = Report & { generated_by: { name: string }};


// --------- AUDITS ---------
export async function fetchAudits(): Promise<AuditWithUser[]> {
  noStore();
  try {
    const data = await prisma.audit.findMany({
      include: {
        auditor: {
          select: { name: true }
        }
      },
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
export async function fetchReports(): Promise<ReportWithUser[]> {
  noStore();
  try {
    const data = await prisma.report.findMany({
       include: {
        generatedBy: {
          select: { name: true }
        }
      },
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

// --------- DASHBOARD ---------
export async function fetchCardData() {
    noStore();
    try {
        const [ongoingAuditsCount, checklistsCount, openFindingsCount, generatedReportsCount] = await prisma.$transaction([
            prisma.audit.count({ where: { status: 'In Progress' } }),
            prisma.checklist.count(),
            prisma.reportFinding.count({ where: { report: { status: 'Finalized' } } }),
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

export async function fetchUpcomingDeadlines(): Promise<AuditWithUser[]> {
    noStore();
    try {
        const data = await prisma.audit.findMany({
            where: { status: { not: 'Completed' } },
            include: {
                auditor: {
                    select: { name: true }
                }
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

// --------- SETTINGS / USERS ---------
export async function fetchAllUsers(): Promise<User[]> {
  noStore();
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return users;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}
