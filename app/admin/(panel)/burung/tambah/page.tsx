import BurungForm from '../../../components/BurungForm'
import Link from 'next/link'

export default function TambahBurungPage() {
  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/burung"
          className="text-sm text-stone-400 hover:text-stone-600 transition-colors mb-3 inline-flex items-center gap-1"
        >
          ← Kembali
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-stone-900">Tambah Burung</h1>
        <p className="text-stone-500 text-sm mt-0.5">Tambah data burung baru ke katalog</p>
      </div>

      <BurungForm />
    </div>
  )
}
