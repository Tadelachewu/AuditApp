export type Audit = {
  id: string;
  name: string;
  auditor: string;
  start_date: string;
  end_date: string;
  status: 'In Progress' | 'Scheduled' | 'Completed';
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
  id: number;
  report_id: string;
  title: string;
  recommendation: string;
};

export type Report = {
  id: string;
  audit_id: string;
  title: string;
  generated_by: string;
  date: string;
  status: 'Finalized' | 'Draft';
  summary: string | null;
  compliance_score: number | null;
  compliance_details: string | null;
  findings?: ReportFinding[];
};

export type Activity = {
    id: number;
    type: 'Audit' | 'Checklist' | 'Report';
    date: string;
    description: string;
};
