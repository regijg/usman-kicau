import { createClient } from '@/lib/supabase/server'
import PakanForm from '../../../components/PakanForm'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditPakanPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data: pakan } = await supabase
    .from('pakan')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!pakan) notFound()

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/pakan"
          className="text-sm text-stone-400 hover:text-stone-600 transition-colors mb-3 inline-flex items-center gap-1"
        >
          ← Kembali
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-stone-900">Edit Produk Pakan</h1>
        <p className="text-stone-500 text-sm mt-0.5">
          Mengubah: <span className="font-semibold text-stone-700">{pakan.nama}</span>
        </p>
      </div>

      <PakanForm pakan={pakan} />
    </div>
  )
}
