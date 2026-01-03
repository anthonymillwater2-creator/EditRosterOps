'use server';

import { createClient } from '@/lib/supabase/server';
import type { Template } from '@/lib/types';
import { revalidatePath } from 'next/cache';

export async function getTemplates() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching templates:', error);
    return [];
  }

  return data;
}

export async function createTemplate(template: {
  name: string;
  subject?: string;
  body: string;
}) {
  const supabase = await createClient();
  const { error } = await supabase.from('templates').insert(template);

  if (error) {
    console.error('Error creating template:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function updateTemplate(
  id: string,
  template: { name: string; subject?: string; body: string }
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('templates')
    .update(template)
    .eq('id', id);

  if (error) {
    console.error('Error updating template:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}

export async function deleteTemplate(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('templates').delete().eq('id', id);

  if (error) {
    console.error('Error deleting template:', error);
    return { success: false, error: error.message };
  }

  revalidatePath('/admin');
  return { success: true };
}
