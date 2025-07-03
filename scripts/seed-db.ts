
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
    console.log("Upserting audits...");
    for (const audit of audits) {
      await tx.audit.upsert({
        where: { id: audit.id },
        update: {
          ...audit,
          startDate: new Date(audit.startDate),
          endDate: new Date(audit.endDate),
        },
        create: {
          ...audit,
          startDate: new Date(audit.startDate),
          endDate: new Date(audit.endDate),
        },
      });
    }
    console.log(`✅ Audits seeding complete.`);

    console.log("Upserting checklists...");
    for (const checklist of checklists) {
      await tx.checklist.upsert({
        where: { id: checklist.id },
        update: {
          ...checklist,
          lastUpdated: new Date(checklist.lastUpdated)
        },
        create: {
          ...checklist,
          lastUpdated: new Date(checklist.lastUpdated)
        },
      });
    }
    console.log(`✅ Checklists seeding complete.`);

    console.log("Upserting documents...");
    for (const doc of documents) {
        await tx.document.upsert({
            where: { id: doc.id },
            update: {
                ...doc,
                uploadDate: new Date(doc.uploadDate)
            },
            create: {
                ...doc,
                uploadDate: new Date(doc.uploadDate)
            },
        });
    }
    console.log(`✅ Documents seeding complete.`);
    
    console.log("Upserting reports and findings...");
    for (const report of reports) {
      const { findings, ...reportData } = report;
      await tx.report.upsert({
        where: { id: reportData.id },
        update: {
            ...reportData,
            date: new Date(reportData.date),
            complianceScore: report.compliance?.score ?? null,
            complianceDetails: report.compliance?.details ?? null,
        },
        create: {
          ...reportData,
          date: new Date(reportData.date),
          complianceScore: report.compliance?.score ?? null,
          complianceDetails: report.compliance?.details ?? null,
        },
      });

      if (findings && findings.length > 0) {
        // Delete existing findings and create new ones to ensure data matches seed file
        await tx.reportFinding.deleteMany({ where: { reportId: report.id } });
        await tx.reportFinding.createMany({
          data: findings.map(finding => ({
            reportId: report.id,
            title: finding.title,
            recommendation: finding.recommendation,
          })),
        });
      }
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
