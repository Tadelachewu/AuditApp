import 'dotenv/config';
import { Pool } from 'pg';
import { audits, checklists, documents, reports } from '../src/lib/data';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.POSTGRES_URL?.includes('sslmode=disable') 
    ? false 
    : { rejectUnauthorized: false },
});

async function seedDatabase() {
  let client;
  try {
    client = await pool.connect();
    console.log("✅ Database connection established.");

    // Clear existing data
    await client.query('TRUNCATE report_findings, reports, documents, checklists, audits, activities RESTART IDENTITY');
    console.log("🧹 Cleared existing data.");

    // Seed Audits
    console.log("🌱 Seeding audits...");
    for (const audit of audits) {
      await client.query(
        `INSERT INTO audits (id, name, auditor, start_date, end_date, status)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [audit.id, audit.name, audit.auditor, audit.startDate, audit.endDate, audit.status]
      );
    }
    console.log(`✅ Seeded ${audits.length} audits.`);

    // Seed Checklists
    console.log("🌱 Seeding checklists...");
    for (const checklist of checklists) {
      await client.query(
        `INSERT INTO checklists (id, name, category, last_updated)
         VALUES ($1, $2, $3, $4)`,
        [checklist.id, checklist.name, checklist.category, checklist.lastUpdated]
      );
    }
    console.log(`✅ Seeded ${checklists.length} checklists.`);
    
    // Seed Documents
    console.log("🌱 Seeding documents...");
    for (const doc of documents) {
        await client.query(
          `INSERT INTO documents (id, title, type, version, upload_date)
           VALUES ($1, $2, $3, $4, $5)`,
          [doc.id, doc.title, doc.type, doc.version, doc.uploadDate]
        );
    }
    console.log(`✅ Seeded ${documents.length} documents.`);

    // Seed Reports and Findings
    console.log("🌱 Seeding reports and findings...");
    for (const report of reports) {
      const insertedReport = await client.query(
        `INSERT INTO reports (id, audit_id, title, generated_by, date, status, summary, compliance_score, compliance_details)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING id`,
        [report.id, report.auditId, report.title, report.generatedBy, report.date, report.status, report.summary, report.compliance?.score, report.compliance?.details]
      );
      const reportId = insertedReport.rows[0].id;

      if (report.findings && report.findings.length > 0) {
        for (const finding of report.findings) {
          await client.query(
            `INSERT INTO report_findings (report_id, title, recommendation)
             VALUES ($1, $2, $3)`,
            [reportId, finding.title, finding.recommendation]
          );
        }
      }
    }
    console.log(`✅ Seeded ${reports.length} reports with their findings.`);

    // Seed Activities (from all other data)
    console.log("🌱 Seeding activities...");
    const allActivities = [
      ...audits.map(a => ({ type: 'Audit' as const, date: a.startDate, description: `Audit "${a.name}" scheduled.` })),
      ...checklists.map(c => ({ type: 'Checklist' as const, date: c.lastUpdated, description: `Checklist "${c.name}" updated.` })),
      ...reports.map(r => ({ type: 'Report' as const, date: r.date, description: `Report "${r.title}" was ${r.status.toLowerCase()}.` })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    for (const activity of allActivities) {
      await client.query(
        `INSERT INTO activities (type, date, description) VALUES ($1, $2, $3)`,
        [activity.type, activity.date, activity.description]
      );
    }
    console.log(`✅ Seeded ${allActivities.length} activities.`);

    console.log("\n🎉 Database seeding complete!");

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    if (client) {
      await client.release();
    }
    await pool.end();
    console.log("🏁 Database connection closed.");
  }
}

seedDatabase();
