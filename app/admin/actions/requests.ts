'use server';

import { createClient } from '@/lib/supabase/server';
import type { RequestStatus, ComplexityTier, SpeedTier } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getRequests() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('buyer_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching requests:', error);
    return [];
  }

  return data;
}

export async function updateRequestStatus(id: string, status: RequestStatus) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('buyer_requests')
    .update({ status })
    .eq('id', id);

  if (error) {
    console.error('Error updating request status:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function updateRequestTiers(
  id: string,
  complexitySuggested: ComplexityTier,
  speedTier: SpeedTier
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('buyer_requests')
    .update({ complexity_suggested: complexitySuggested, speed_tier: speedTier })
    .eq('id', id);

  if (error) {
    console.error('Error updating request tiers:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function convertRequestToJob(requestId: string) {
  const supabase = await createClient();

  // Get the request
  const { data: request, error: fetchError } = await supabase
    .from('buyer_requests')
    .select('*')
    .eq('id', requestId)
    .single();

  if (fetchError || !request) {
    return { success: false, error: 'Request not found' };
  }

  // Create job
  const jobData = {
    request_id: requestId,
    buyer_name: request.name,
    buyer_email: request.email,
    service: request.need_type,
    rush: request.speed_tier === 'RUSH',
    status: 'INTAKE_PENDING',
  };

  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .insert(jobData)
    .select()
    .single();

  if (jobError || !job) {
    return { success: false, error: jobError?.message || 'Failed to create job' };
  }

  // Create checklist
  const checklistData = {
    job_id: job.id,
    payment_confirmed: false,
    files_received: false,
    scope_locked: false,
    edit_in_progress: false,
    qa_pass: false,
    delivered: false,
    revision_requested: false,
    closed: false,
  };

  const { error: checklistError } = await supabase
    .from('job_checklist')
    .insert(checklistData);

  if (checklistError) {
    return { success: false, error: checklistError.message };
  }

  // Update request status to WON
  await supabase
    .from('buyer_requests')
    .update({ status: 'WON' })
    .eq('id', requestId);

  revalidatePath('/admin');
  return { success: true, jobId: job.id };
}
