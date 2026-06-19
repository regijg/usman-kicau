import TransaksiForm from '../../../components/TransaksiForm'
import Link from 'next/link'

export default function TambahTransaksiPage() {
  return (
    <div>
      <div className="mb-4">
        <Link
          href="/admin/transaksi"
          className="text-sm text-stone-400 hover:text-stone-600 transition-colors mb-2 inline-flex items-center gap-1"
        >
          ← Kembali
        </Link>
        <h1 className="text-xl sm:text-2xl font-black text-stone-900">Transaksi Baru</h1>
      </div>
      <TransaksiForm />
    </div>
  )
}
