import 'dotenv/config';
import prisma from '../src/lib/db';
import bcrypt from 'bcryptjs';

if (process.env.NODE_ENV === 'production') {
  console.error('❌ Refusing to run seed script in a production environment.');
  process.exit(1);
}

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clean up existing data
  await prisma.activity.deleteMany({});
  await prisma.reportFinding.deleteMany({});
  await prisma.report.deleteMany({});
  await prisma.audit.deleteMany({});
  await prisma.checklist.deleteMany({});
  await prisma.document.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('🧹 Cleaned up existing data.');

  // Create Users
  const hashedPasswordAdmin = await bcrypt.hash('password123', 10);
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@xbank.com',
      name: 'Admin User',
      password: hashedPasswordAdmin,
      role: 'ADMIN',
    },
  });

  const hashedPasswordAuditor = await bcrypt.hash('password123', 10);
  const auditorUser = await prisma.user.create({
    data: {
      email: 'auditor@xbank.com',
      name: 'Auditor User',
      password: hashedPasswordAuditor,
      role: 'AUDITOR',
    },
  });

  const hashedPasswordManager = await bcrypt.hash('password123', 10);
  const managerUser = await prisma.user.create({
    data: {
      email: 'manager@xbank.com',
      name: 'Manager User',
      password: hashedPasswordManager,
      role: 'MANAGER',
    },
  });
  console.log(`✅ Created users: ${adminUser.name}, ${auditorUser.name}, ${managerUser.name}`);


  // Create Audits
  const audit1 = await prisma.audit.create({
    data: {
      name: 'Q3 Financial Statement Audit',
      auditorId: auditorUser.id,
      startDate: new Date('2024-07-15'),
      endDate: new Date('2024-08-15'),
      status: 'In Progress',
      scope: 'SOX Compliance',
      riskLevel: 'HIGH',
    }
  });

  const audit2 = await prisma.audit.create({
    data: {
      name: 'IT Security Compliance Check',
      auditorId: adminUser.id,
      startDate: new Date('2024-08-01'),
      endDate: new Date('2024-08-31'),
      status: 'Scheduled',
      scope: 'PCI-DSS v4.0',
      riskLevel: 'MEDIUM',
    }
  });
  console.log('✅ Seeded audits.');
  
  // Create Checklists
  await prisma.checklist.createMany({
    data: [
      { name: 'Quarterly Financial Closing', category: 'Finance', lastUpdated: new Date('2024-06-28') },
      { name: 'Server Security Hardening', category: 'IT Security', lastUpdated: new Date('2024-07-05') },
    ]
  });
  console.log('✅ Seeded checklists.');

  // Create Documents
  const doc1 = await prisma.document.create({
    data: { title: 'Information Security Policy', type: 'Policy', version: 'v3.2', uploadDate: new Date('2024-01-15') }
  });
  const doc2 = await prisma.document.create({
    data: { title: 'Incident Response Procedure', type: 'Procedure', version: 'v2.1', uploadDate: new Date('2024-03-22') },
  });
  const doc3 = await prisma.document.create({
    data: { title: 'Q3 Firewall Logs', type: 'Evidence', version: 'v1.0', uploadDate: new Date('2024-07-20') },
  });
  console.log('✅ Seeded documents.');

  // Create Reports
  const report1 = await prisma.report.create({
    data: {
      auditId: audit1.id,
      title: 'Q3 Financial Statement Preliminary Report',
      generatedById: auditorUser.id,
      date: new Date(),
      status: 'Draft',
      summary: 'Initial review of financial statements is underway. Several findings related to access control have been identified.'
    }
  });
  console.log('✅ Seeded reports.');

  // Create Report Findings
  await prisma.reportFinding.createMany({
    data: [
      {
        reportId: report1.id,
        title: 'Excessive Privileges on Core Banking System',
        recommendation: 'Implement a formal quarterly access review process for all production systems.',
        riskRating: 'HIGH',
        status: 'OPEN',
        owner: 'IT Department',
      },
      {
        reportId: report1.id,
        title: 'Lack of Segregation of Duties',
        recommendation: 'Review and update role definitions to ensure proper segregation of duties between development and deployment personnel.',
        riskRating: 'MEDIUM',
        status: 'IN_PROGRESS',
        owner: 'Compliance Team',
      }
    ]
  });
  console.log('✅ Seeded report findings.');


  // Create Activities
  await prisma.activity.createMany({
    data: [
      { type: 'Audit', date: audit1.startDate, description: `Audit "${audit1.name}" was started.` },
      { type: 'Audit', date: audit2.startDate, description: `Audit "${audit2.name}" was scheduled.` },
      { type: 'Report', date: report1.date, description: `Report "${report1.title}" was created.` },
    ]
  });
  console.log('✅ Seeded activities.');
  
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
