'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteBurung(id: string) {
  const supabase = createClient()
  await supabase.from('burung').delete().eq('id', id)
  revalidatePath('/admin/burung')
}

export async function deletePakan(id: string) {
  const supabase = createClient()
  await supabase.from('pakan').delete().eq('id', id)
  revalidatePath('/admin/pakan')
}

export async function deleteTestimoni(id: string) {
  const supabase = createClient()
  await supabase.from('testimoni').delete().eq('id', id)
  revalidatePath('/admin/testimoni')
}
