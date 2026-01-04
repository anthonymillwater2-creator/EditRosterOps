-- ShortFormFactory Hub Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Buyer Requests Table
CREATE TABLE buyer_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  need_type TEXT NOT NULL CHECK (need_type IN ('Repurpose', 'Social Edit', 'Smart Cut', 'Captions', 'Other')),
  platforms TEXT[] NOT NULL,
  volume_per_week INTEGER NOT NULL,
  turnaround TEXT NOT NULL CHECK (turnaround IN ('24-48h', 'Rush 12h', 'Custom')),
  budget_range TEXT NOT NULL CHECK (budget_range IN ('<200', '200-500', '500-1k', '1k+')),
  footage_link TEXT,
  examples_link TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'IN_REVIEW', 'QUOTED', 'WON', 'LOST')),
  complexity_suggested TEXT CHECK (complexity_suggested IN ('BASIC', 'PRO', 'ELITE')),
  speed_tier TEXT CHECK (speed_tier IN ('STANDARD', 'RUSH'))
);

-- Jobs Table
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  request_id UUID REFERENCES buyer_requests(id),
  status TEXT NOT NULL DEFAULT 'INTAKE_PENDING' CHECK (status IN ('INTAKE_PENDING', 'IN_PROGRESS', 'QA', 'DELIVERED', 'REVISIONS', 'CLOSED')),
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  service TEXT NOT NULL,
  package TEXT,
  rush BOOLEAN NOT NULL DEFAULT FALSE,
  due_at TIMESTAMPTZ,
  assets_link TEXT,
  footage_link TEXT,
  delivery_link TEXT,
  qa_notes TEXT,
  buyer_price NUMERIC(10, 2),
  editor_payout NUMERIC(10, 2),
  payout_status TEXT CHECK (payout_status IN ('PENDING', 'PAID', 'CANCELLED'))
);

-- Job Checklist Table
CREATE TABLE job_checklist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  payment_confirmed BOOLEAN NOT NULL DEFAULT FALSE,
  files_received BOOLEAN NOT NULL DEFAULT FALSE,
  scope_locked BOOLEAN NOT NULL DEFAULT FALSE,
  edit_in_progress BOOLEAN NOT NULL DEFAULT FALSE,
  qa_pass BOOLEAN NOT NULL DEFAULT FALSE,
  delivered BOOLEAN NOT NULL DEFAULT FALSE,
  revision_requested BOOLEAN NOT NULL DEFAULT FALSE,
  closed BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE(job_id)
);

-- Templates Table
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name TEXT NOT NULL UNIQUE,
  subject TEXT,
  body TEXT NOT NULL
);

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE buyer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_checklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;

-- Buyer Requests Policies
-- Anonymous users can INSERT only
CREATE POLICY "Anonymous can insert buyer_requests"
  ON buyer_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated users (admin) can do everything
CREATE POLICY "Admin can do everything on buyer_requests"
  ON buyer_requests
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Jobs Policies
-- Only authenticated users (admin) can access
CREATE POLICY "Admin can do everything on jobs"
  ON jobs
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Job Checklist Policies
CREATE POLICY "Admin can do everything on job_checklist"
  ON job_checklist
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Templates Policies
CREATE POLICY "Admin can do everything on templates"
  ON templates
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX idx_buyer_requests_status ON buyer_requests(status);
CREATE INDEX idx_buyer_requests_created_at ON buyer_requests(created_at DESC);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_created_at ON jobs(created_at DESC);
CREATE INDEX idx_job_checklist_job_id ON job_checklist(job_id);
