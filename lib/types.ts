export type NeedType = 'Repurpose' | 'Social Edit' | 'Smart Cut' | 'Captions' | 'Other';
export type Platform = 'TikTok' | 'IG' | 'Shorts';
export type TurnaroundType = '24-48h' | 'Rush 12h' | 'Custom';
export type BudgetRange = '<200' | '200-500' | '500-1k' | '1k+';

export type RequestStatus = 'NEW' | 'IN_REVIEW' | 'QUOTED' | 'WON' | 'LOST';
export type JobStatus = 'INTAKE_PENDING' | 'IN_PROGRESS' | 'QA' | 'DELIVERED' | 'REVISIONS' | 'CLOSED';

export type ComplexityTier = 'BASIC' | 'PRO' | 'ELITE';
export type SpeedTier = 'STANDARD' | 'RUSH';
export type PayoutStatus = 'PENDING' | 'PAID' | 'CANCELLED';

export interface BuyerRequest {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company?: string;
  need_type: NeedType;
  platforms: Platform[];
  volume_per_week: number;
  turnaround: TurnaroundType;
  budget_range: BudgetRange;
  footage_link?: string;
  examples_link?: string;
  notes?: string;
  status: RequestStatus;
  complexity_suggested?: ComplexityTier;
  speed_tier?: SpeedTier;
}

export interface Job {
  id: string;
  created_at: string;
  request_id?: string;
  status: JobStatus;
  buyer_name: string;
  buyer_email: string;
  service: string;
  package?: string;
  rush: boolean;
  due_at?: string;
  assets_link?: string;
  footage_link?: string;
  delivery_link?: string;
  qa_notes?: string;
  buyer_price?: number;
  editor_payout?: number;
  payout_status?: PayoutStatus;
}

export interface JobChecklist {
  id: string;
  job_id: string;
  payment_confirmed: boolean;
  files_received: boolean;
  scope_locked: boolean;
  edit_in_progress: boolean;
  qa_pass: boolean;
  delivered: boolean;
  revision_requested: boolean;
  closed: boolean;
}

export interface Template {
  id: string;
  created_at: string;
  name: string;
  subject?: string;
  body: string;
}
