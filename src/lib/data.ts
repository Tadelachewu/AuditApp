
export const audits = [
    { id: 'AUD-001', name: 'Q3 Financial Statement Audit', auditor: 'Alice Johnson', startDate: '2024-07-15', endDate: '2024-08-15', status: 'In Progress' },
    { id: 'AUD-002', name: 'IT Security Compliance Check', auditor: 'Bob Williams', startDate: '2024-08-01', endDate: '2024-08-31', status: 'Scheduled' },
    { id: 'AUD-003', name: 'Branch Operations Review (Downtown)', auditor: 'Charlie Brown', startDate: '2024-06-20', endDate: '2024-07-10', status: 'Completed' },
    { id: 'AUD-004', name: 'AML Policy Adherence Audit', auditor: 'Diana Prince', startDate: '2024-07-25', endDate: '2024-08-25', status: 'Scheduled' },
    { id: 'AUD-005', name: 'Q2 Customer Data Privacy Audit', auditor: 'Alice Johnson', startDate: '2024-05-10', endDate: '2024-06-10', status: 'Completed' },
  ];
  
  export const checklists = [
    { id: 'CHK-FIN-01', name: 'Quarterly Financial Closing', category: 'Finance', lastUpdated: '2024-06-28' },
    { id: 'CHK-IT-03', name: 'Server Security Hardening', category: 'IT Security', lastUpdated: '2024-07-05' },
    { id: 'CHK-OPS-02', name: 'New Employee Onboarding', category: 'Operations', lastUpdated: '2024-05-15' },
    { id: 'CHK-CMP-05', name: 'AML Transaction Monitoring', category: 'Compliance', lastUpdated: '2024-07-11' },
    { id: 'CHK-HR-01', name: 'Annual Performance Review', category: 'Human Resources', lastUpdated: '2024-04-30' },
  ];
  
  export const documents = [
    { id: 'DOC-POL-001', title: 'Information Security Policy', type: 'Policy', version: 'v3.2', uploadDate: '2024-01-15' },
    { id: 'DOC-PRC-004', title: 'Incident Response Procedure', type: 'Procedure', version: 'v2.1', uploadDate: '2024-03-22' },
    { id: 'DOC-EVD-102', title: 'Q2 Firewall Configuration Logs', type: 'Evidence', version: 'N/A', uploadDate: '2024-07-01' },
    { id: 'DOC-RPT-034', title: 'Penetration Test Report - May 2024', type: 'Report', version: 'v1.0', uploadDate: '2024-06-05' },
    { id: 'DOC-POL-002', title: 'Data Privacy Policy', type: 'Policy', version: 'v1.5', uploadDate: '2023-11-20' },
  ];
  
  export const reports = [
    { 
      id: 'RPT-2024-001', 
      audit_id: 'AUD-003', 
      title: 'Q2 Branch Operations Review', 
      generatedBy: 'Charlie Brown', 
      date: '2024-07-12', 
      status: 'Finalized' as const,
      summary: 'The audit of the Downtown branch operations, conducted from June 20, 2024, to July 10, 2024, found operations to be largely compliant with bank policies. Three minor findings were identified and corrective actions have been recommended.',
      compliance: {
        score: 98,
        details: '3 findings out of 150 checklist items.'
      },
      findings: [
        {
          title: 'Finding 1: Cash handling logs were not consistently filled out at end of day.',
          recommendation: 'Implement mandatory daily supervisor sign-off on cash logs.'
        },
        {
          title: 'Finding 2: Physical security checklist for the vault was missed on two occasions.',
          recommendation: 'Add automated reminders for security checklist completion.'
        }
      ] 
    },
    { 
      id: 'RPT-2024-002', 
      audit_id: 'AUD-005', 
      title: 'Q2 Customer Data Privacy Audit', 
      generatedBy: 'Alice Johnson', 
      date: '2024-06-15', 
      status: 'Finalized' as const,
      summary: 'The Q2 Customer Data Privacy Audit revealed full compliance with all regulations. No findings were identified.',
      compliance: {
        score: 100,
        details: '0 findings out of 80 checklist items.'
      },
      findings: []
    },
    { 
      id: 'RPT-2024-003', 
      audit_id: 'AUD-001', 
      title: 'Q3 Financial Statement Audit', 
      generatedBy: 'Alice Johnson', 
      date: '2024-08-16', 
      status: 'Draft' as const,
      summary: 'Draft report in progress. Initial findings indicate potential discrepancies in revenue recognition.',
      compliance: null,
      findings: []
    },
  ];

export type Report = typeof reports[0];
