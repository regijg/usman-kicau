import PakanForm from '../../../components/PakanForm'
import Link from 'next/link'

export default function TambahPakanPage() {
  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/pakan"
          className="text-sm text-stone-400 hover:text-stone-600 transition-colors mb-3 inline-flex items-center gap-1"
        >
          ← Kembali
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-stone-900">Tambah Produk Pakan</h1>
        <p className="text-stone-500 text-sm mt-0.5">Tambah produk pakan baru ke katalog</p>
      </div>

      <PakanForm />
    </div>
  )
}
