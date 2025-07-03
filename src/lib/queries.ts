import prisma from './db';
import { unstable_noStore as noStore } from 'next/cache';
import type { Audit, Checklist, Document, Report, Activity, User, DetailedReport } from './definitions';
import { format } from 'date-fns';

type AuditWithUser = Audit & { auditor: { name: string }};
type ReportWithUser = Report & { generated_by: { name: string }};


// --------- AUDITS ---------
export async function fetchAudits(user: User): Promise<AuditWithUser[]> {
  noStore();
  try {
    const whereClause = user.role === 'AUDITOR' ? { auditorId: user.id } : {};

    const data = await prisma.audit.findMany({
      where: whereClause,
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
export async function fetchReports(user: User): Promise<ReportWithUser[]> {
  noStore();
  try {
    const whereClause = user.role === 'AUDITOR' ? { audit: { auditorId: user.id } } : {};
    
    const data = await prisma.report.findMany({
       where: whereClause,
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
export async function fetchCardData(user: User) {
    noStore();
    try {
        const auditWhere = user.role === 'AUDITOR' ? { status: 'In Progress', auditorId: user.id } : { status: 'In Progress' };
        const findingWhere = user.role === 'AUDITOR' ? { report: { status: 'Finalized', audit: { auditorId: user.id } } } : { report: { status: 'Finalized' } };
        const reportWhere = user.role === 'AUDITOR' ? { audit: { auditorId: user.id } } : {};

        const [ongoingAuditsCount, checklistsCount, openFindingsCount, generatedReportsCount] = await prisma.$transaction([
            prisma.audit.count({ where: auditWhere }),
            prisma.checklist.count(),
            prisma.reportFinding.count({ where: findingWhere }),
            prisma.report.count({ where: reportWhere }),
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

export async function fetchUpcomingDeadlines(user: User): Promise<AuditWithUser[]> {
    noStore();
    try {
        const whereClause: any = { status: { not: 'Completed' } };
        if (user.role === 'AUDITOR') {
            whereClause.auditorId = user.id;
        }

        const data = await prisma.audit.findMany({
            where: whereClause,
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
