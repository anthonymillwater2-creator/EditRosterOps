'use server';

import { createClient } from '@/lib/supabase/server';
import type { JobStatus, Job } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getJobs() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching jobs:', error);
    return [];
  }

  return data;
}

export async function getJobChecklist(jobId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('job_checklist')
    .select('*')
    .eq('job_id', jobId)
    .single();

  if (error) {
    console.error('Error fetching checklist:', error);
    return null;
  }

  return data;
}

export async function updateJobStatus(jobId: string, status: JobStatus) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('jobs')
    .update({ status })
    .eq('id', jobId);

  if (error) {
    console.error('Error updating job status:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function updateJob(jobId: string, updates: Partial<Job>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('jobs')
    .update(updates)
    .eq('id', jobId);

  if (error) {
    console.error('Error updating job:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function updateChecklist(jobId: string, updates: Record<string, boolean>) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('job_checklist')
    .update(updates)
    .eq('job_id', jobId);

  if (error) {
    console.error('Error updating checklist:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}
