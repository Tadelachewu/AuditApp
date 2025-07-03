import 'dotenv/config';
import prisma from '../src/lib/db';
import { audits, checklists, documents, reports } from '../src/lib/data';

if (process.env.NODE_ENV === 'production') {
  console.error('❌ Refusing to run seed script in a production environment.');
  console.error('This script is intended for development and testing purposes only.');
  process.exit(1);
}

async function main() {
  console.log('🌱 Starting database seeding...');

  await prisma.$transaction(async (tx) => {
    console.log("Seeding audits (skips if data exists)...");
    await tx.audit.createMany({
      data: audits.map(a => ({
        ...a,
        startDate: new Date(a.startDate),
        endDate: new Date(a.endDate),
      })),
      skipDuplicates: true,
    });
    console.log(`✅ Audits seeding complete.`);

    console.log("Seeding checklists (skips if data exists)...");
    await tx.checklist.createMany({
        data: checklists.map(c => ({
            ...c,
            lastUpdated: new Date(c.lastUpdated)
        })),
        skipDuplicates: true,
    });
    console.log(`✅ Checklists seeding complete.`);

    console.log("Seeding documents (skips if data exists)...");
    await tx.document.createMany({
        data: documents.map(d => ({
            ...d,
            uploadDate: new Date(d.uploadDate)
        })),
        skipDuplicates: true,
    });
    console.log(`✅ Documents seeding complete.`);
    
    console.log("Seeding reports and findings (skips if data exists)...");
    for (const report of reports) {
      await tx.report.upsert({
        where: { id: report.id },
        update: {},
        create: {
          id: report.id,
          auditId: report.auditId,
          title: report.title,
          generatedBy: report.generatedBy,
          date: new Date(report.date),
          status: report.status,
          summary: report.summary,
          complianceScore: report.compliance?.score ?? null,
          complianceDetails: report.compliance?.details ?? null,
          findings: {
            create: report.findings.map(finding => ({
              title: finding.title,
              recommendation: finding.recommendation,
            })),
          },
        },
      });
    }
    console.log(`✅ Reports and findings seeding complete.`);

    console.log("🌱 Clearing and re-seeding activities table...");
    await tx.activity.deleteMany({});
    const allActivities = [
      ...audits.map(a => ({ type: 'Audit' as const, date: new Date(a.startDate), description: `Audit "${a.name}" scheduled.` })),
      ...checklists.map(c => ({ type: 'Checklist' as const, date: new Date(c.lastUpdated), description: `Checklist "${c.name}" updated.` })),
      ...reports.map(r => ({ type: 'Report' as const, date: new Date(r.date), description: `Report "${r.title}" was ${r.status.toLowerCase()}.` })),
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    await tx.activity.createMany({
        data: allActivities,
    });
    console.log(`✅ Seeded ${allActivities.length} activities.`);
  });
  
  console.log('\n🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🏁 Database connection closed.');
  });
