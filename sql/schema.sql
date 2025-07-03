-- Drop existing tables to start fresh
DROP TABLE IF EXISTS report_findings;
DROP TABLE IF EXISTS reports;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS checklists;
DROP TABLE IF EXISTS audits;
DROP TABLE IF EXISTS activities;

-- Audits Table
CREATE TABLE audits (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    auditor VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Checklists Table
CREATE TABLE checklists (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    last_updated DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Documents Table
CREATE TABLE documents (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    version VARCHAR(50) NOT NULL,
    upload_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reports Table
CREATE TABLE reports (
    id VARCHAR(255) PRIMARY KEY,
    audit_id VARCHAR(255) REFERENCES audits(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    generated_by VARCHAR(255),
    date DATE NOT NULL,
    status VARCHAR(50) NOT NULL,
    summary TEXT,
    compliance_score INT,
    compliance_details VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Report Findings Table
CREATE TABLE report_findings (
    id SERIAL PRIMARY KEY,
    report_id VARCHAR(255) NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    recommendation TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Activities Table (for dashboard)
CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    description TEXT NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_reports_audit_id ON reports(audit_id);
CREATE INDEX idx_report_findings_report_id ON report_findings(report_id);
