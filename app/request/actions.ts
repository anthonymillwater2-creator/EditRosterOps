'use server';

import { createClient } from '@/lib/supabase/server';
import type { BuyerRequest, ComplexityTier, SpeedTier } from '@/lib/types';

export async function submitRequest(formData: FormData) {
  const supabase = await createClient();

  const platforms = formData.getAll('platforms') as string[];
  const volumePerWeek = parseInt(formData.get('volume_per_week') as string);
  const turnaround = formData.get('turnaround') as string;
  const needType = formData.get('need_type') as string;
  const notes = formData.get('notes') as string || '';

  // Calculate suggested tier and speed tier (admin can override later)
  let speedTier: SpeedTier = 'STANDARD';
  if (turnaround === 'Rush 12h') {
    speedTier = 'RUSH';
  }

  let complexitySuggested: ComplexityTier = 'PRO'; // default

  // Simple tier logic
  if ((needType === 'Captions' || needType === 'Smart Cut') && volumePerWeek <= 5) {
    complexitySuggested = 'BASIC';
  } else if (volumePerWeek > 15) {
    complexitySuggested = 'ELITE';
  } else if (needType === 'Repurpose' || (volumePerWeek >= 6 && volumePerWeek <= 15)) {
    complexitySuggested = 'PRO';
  }

  // Check notes for complexity indicators
  const complexityKeywords = ['motion graphics', 'after effects', 'multi-cam', 'sound design', 'multicam'];
  const notesLower = notes.toLowerCase();
  if (complexityKeywords.some(keyword => notesLower.includes(keyword))) {
    complexitySuggested = 'ELITE';
  }

  const requestData = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    company: formData.get('company') as string || null,
    need_type: needType,
    platforms,
    volume_per_week: volumePerWeek,
    turnaround,
    budget_range: formData.get('budget_range') as string,
    footage_link: formData.get('footage_link') as string || null,
    examples_link: formData.get('examples_link') as string || null,
    notes: notes || null,
    status: 'NEW',
    complexity_suggested: complexitySuggested,
    speed_tier: speedTier,
  };

  const { error } = await supabase.from('buyer_requests').insert(requestData);

  if (error) {
    console.error('Error submitting request:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
