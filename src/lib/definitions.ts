import type { User as PrismaUser, Role, RiskLevel, FindingRiskRating, FindingStatus } from '@prisma/client';

export type User = Omit<PrismaUser, 'password'>;

export type Audit = {
  id: string;
  name: string;
  auditor: { name: string };
  start_date: string;
  end_date: string;
  status: 'In Progress' | 'Scheduled' | 'Completed';
  scope: string;
  riskLevel: RiskLevel;
};

export type Checklist = {
  id: string;
  name: string;
  category: string;
  last_updated: string;
};

export type Document = {
  id: string;
  title: string;
  type: string;
  version: string;
  upload_date: string;
};

export type ReportFinding = {
  id: string;
  report_id: string;
  title: string;
  recommendation: string;
  riskRating: FindingRiskRating;
  status: FindingStatus;
  owner: string;
};

export type Report = {
  id: string;
  audit_id: string;
  title: string;
  generated_by: { name: string };
  date: string;
  status: 'Finalized' | 'Draft';
  summary: string | null;
  compliance_score: number | null;
  compliance_details: string | null;
  findings?: ReportFinding[];
};

export type DetailedReport = Report & {
  findings: ReportFinding[];
};

export type Activity = {
    id: number;
    type: 'Audit' | 'Checklist' | 'Report';
    date: string;
    description: string;
};
