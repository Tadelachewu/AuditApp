import { pool } from './db';
import { unstable_noStore as noStore } from 'next/cache';
import type { Audit, Checklist, Document, Report, ReportFinding, Activity } from './definitions';

// --------- AUDITS ---------
export async function fetchAudits(): Promise<Audit[]> {
  noStore();
  try {
    const data = await pool.query<Audit>('SELECT id, name, auditor, TO_CHAR(start_date, \'YYYY-MM-DD\') as start_date, TO_CHAR(end_date, \'YYYY-MM-DD\') as end_date, status FROM audits ORDER BY start_date DESC');
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

// --------- CHECKLISTS ---------
export async function fetchChecklists(): Promise<Checklist[]> {
  noStore();
  try {
    const data = await pool.query<Checklist>('SELECT id, name, category, TO_CHAR(last_updated, \'YYYY-MM-DD\') as last_updated FROM checklists ORDER BY last_updated DESC');
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

// --------- DOCUMENTS ---------
export async function fetchDocuments(): Promise<Document[]> {
  noStore();
  try {
    const data = await pool.query<Document>('SELECT id, title, type, version, TO_CHAR(upload_date, \'YYYY-MM-DD\') as upload_date FROM documents ORDER BY upload_date DESC');
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

// --------- REPORTS ---------
export async function fetchReports(): Promise<Report[]> {
  noStore();
  try {
    const data = await pool.query<Report>(`
      SELECT 
        id, audit_id, title, generated_by, TO_CHAR(date, 'YYYY-MM-DD') as date, 
        status, summary, compliance_score, compliance_details 
      FROM reports 
      ORDER BY date DESC
    `);
    return data.rows;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export async function fetchReportById(id: string): Promise<(Report & { findings: ReportFinding[] }) | null> {
  noStore();
  try {
    const reportData = await pool.query<Report>('SELECT id, audit_id, title, generated_by, TO_CHAR(date, \'YYYY-MM-DD\') as date, status, summary, compliance_score, compliance_details FROM reports WHERE id = $1', [id]);
    if (reportData.rows.length === 0) {
      return null;
    }
    const report = reportData.rows[0];

    const findingsData = await pool.query<ReportFinding>('SELECT * FROM report_findings WHERE report_id = $1', [id]);
    report.findings = findingsData.rows;

    return report as Report & { findings: ReportFinding[] };
  } catch (error) {
    console.error('Database Error:', error);
    return null;
  }
}


// --------- DASHBOARD ---------
export async function fetchCardData() {
    noStore();
    try {
        const ongoingAuditsPromise = pool.query("SELECT COUNT(*) FROM audits WHERE status = 'In Progress'");
        const checklistsPromise = pool.query("SELECT COUNT(*) FROM checklists");
        const openFindingsPromise = pool.query("SELECT COUNT(*) FROM report_findings rf JOIN reports r ON rf.report_id = r.id WHERE r.status = 'Finalized'");
        const generatedReportsPromise = pool.query("SELECT COUNT(*) FROM reports");

        const data = await Promise.all([
            ongoingAuditsPromise,
            checklistsPromise,
            openFindingsPromise,
            generatedReportsPromise,
        ]);

        const ongoingAuditsCount = Number(data[0].rows[0].count ?? '0');
        const checklistsCount = Number(data[1].rows[0].count ?? '0');
        const openFindingsCount = Number(data[2].rows[0].count ?? '0');
        const generatedReportsCount = Number(data[3].rows[0].count ?? '0');

        return {
            ongoingAuditsCount,
            checklistsCount,
            openFindingsCount,
            generatedReportsCount,
        };
    } catch (error) {
        console.error('Database Error:', error);
        return {
            ongoingAuditsCount: 0,
            checklistsCount: 0,
            openFindingsCount: 0,
            generatedReportsCount: 0,
        };
    }
}

export async function fetchUpcomingDeadlines(): Promise<Audit[]> {
    noStore();
    try {
        const data = await pool.query<Audit>(`
            SELECT id, name, auditor, TO_CHAR(end_date, 'YYYY-MM-DD') as end_date, status
            FROM audits
            WHERE status != 'Completed'
            ORDER BY end_date ASC
            LIMIT 5
        `);
        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        return [];
    }
}

export async function fetchRecentActivities(): Promise<Activity[]> {
    noStore();
    try {
        const data = await pool.query<Activity>(`
            SELECT id, type, TO_CHAR(date, 'YYYY-MM-DD') as date, description
            FROM activities
            ORDER BY date DESC
            LIMIT 5
        `);
        return data.rows;
    } catch (error) {
        console.error('Database Error:', error);
        return [];
    }
}
