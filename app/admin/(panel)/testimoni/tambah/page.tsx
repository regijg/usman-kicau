import TestimoniForm from '../../../components/TestimoniForm'
import Link from 'next/link'

export default function TambahTestimoniPage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/testimoni" className="text-sm text-stone-400 hover:text-stone-600 transition-colors mb-3 inline-flex items-center gap-1">
          ← Kembali
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-stone-900">Tambah Testimoni</h1>
        <p className="text-stone-500 text-sm mt-0.5">Tambah ulasan pelanggan baru</p>
      </div>
      <TestimoniForm />
    </div>
  )
}
