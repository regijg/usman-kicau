import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import TestimoniForm from '../../../components/TestimoniForm'
import Link from 'next/link'

interface Props { params: { id: string } }

export default async function EditTestimoniPage({ params }: Props) {
  const supabase = createClient()
  const { data: testimoni } = await supabase.from('testimoni').select('*').eq('id', params.id).single()

  if (!testimoni) notFound()

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/testimoni" className="text-sm text-stone-400 hover:text-stone-600 transition-colors mb-3 inline-flex items-center gap-1">
          ← Kembali
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-stone-900">Edit Testimoni</h1>
        <p className="text-stone-500 text-sm mt-0.5">Dari: {testimoni.nama}</p>
      </div>
      <TestimoniForm testimoni={testimoni} />
    </div>
  )
}
