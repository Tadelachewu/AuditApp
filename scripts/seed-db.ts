import 'dotenv/config';
import { Pool } from 'pg';
import { audits, checklists, documents, reports } from '../src/lib/data';

if (process.env.NODE_ENV === 'production') {
  console.error('❌ Refusing to run seed script in a production environment.');
  console.error('This script is intended for development and testing purposes only.');
  process.exit(1);
}

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

    await client.query('BEGIN');
    console.log("🔒 Transaction started. Seeding data...");

    console.log("🌱 Seeding audits (skips if data exists)...");
    for (const audit of audits) {
      await client.query(
        `INSERT INTO audits (id, name, auditor, start_date, end_date, status)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (id) DO NOTHING`,
        [audit.id, audit.name, audit.auditor, audit.startDate, audit.endDate, audit.status]
      );
    }
    console.log(`✅ Audits seeding complete.`);

    console.log("🌱 Seeding checklists (skips if data exists)...");
    for (const checklist of checklists) {
      await client.query(
        `INSERT INTO checklists (id, name, category, last_updated)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING`,
        [checklist.id, checklist.name, checklist.category, checklist.lastUpdated]
      );
    }
    console.log(`✅ Checklists seeding complete.`);
    
    console.log("🌱 Seeding documents (skips if data exists)...");
    for (const doc of documents) {
        await client.query(
          `INSERT INTO documents (id, title, type, version, upload_date)
           VALUES ($1, $2, $3, $4, $5)
           ON CONFLICT (id) DO NOTHING`,
          [doc.id, doc.title, doc.type, doc.version, doc.uploadDate]
        );
    }
    console.log(`✅ Documents seeding complete.`);

    console.log("🌱 Seeding reports and findings (skips if data exists)...");
    for (const report of reports) {
      const insertedReport = await client.query(
        `INSERT INTO reports (id, audit_id, title, generated_by, date, status, summary, compliance_score, compliance_details)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         ON CONFLICT (id) DO NOTHING
         RETURNING id`,
        [report.id, report.auditId, report.title, report.generatedBy, report.date, report.status, report.summary, report.compliance?.score, report.compliance?.details]
      );
      
      if (insertedReport.rowCount > 0 && report.findings && report.findings.length > 0) {
        const reportId = insertedReport.rows[0].id;
        for (const finding of report.findings) {
          await client.query(
            `INSERT INTO report_findings (report_id, title, recommendation)
             VALUES ($1, $2, $3)`,
            [reportId, finding.title, finding.recommendation]
          );
        }
      }
    }
    console.log(`✅ Reports and findings seeding complete.`);

    console.log("🌱 Clearing and re-seeding activities table...");
    await client.query('TRUNCATE activities RESTART IDENTITY');
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

    await client.query('COMMIT');
    console.log("\n🎉 Database seeding complete! Transaction committed.");

  } catch (error) {
    if (client) {
      await client.query('ROLLBACK');
      console.error('❌ Transaction rolled back due to an error.');
    }
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
