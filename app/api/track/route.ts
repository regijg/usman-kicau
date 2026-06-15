import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = createClient()
  await supabase.from('visitors').insert({ page: '/' })
  return NextResponse.json({ ok: true })
}
