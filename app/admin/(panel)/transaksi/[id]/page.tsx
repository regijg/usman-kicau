import { createClient } from '@/lib/supabase/server'
import TransaksiForm from '../../../components/TransaksiForm'
import PembayaranForm from '../../../components/PembayaranForm'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { TransaksiWithItems } from '@/types'

function formatRp(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID')
}

function formatTanggal(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

const statusStyle: Record<string, string> = {
  Lunas: 'bg-green-50 text-green-600 border-green-200',
  'Belum Lunas': 'bg-red-50 text-red-500 border-red-200',
  Titip: 'bg-amber-50 text-amber-600 border-amber-200',
}

export default async function DetailTransaksiPage({ params }: { params: { id: string } }) {
  const supabase = createClient()
  const { data } = await supabase
    .from('transaksi')
    .select('*, transaksi_item(*), pembayaran(*)')
    .eq('id', params.id)
    .single()

  if (!data) notFound()

  const transaksi = data as TransaksiWithItems

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/transaksi"
          className="text-sm text-stone-400 hover:text-stone-600 transition-colors mb-3 inline-flex items-center gap-1"
        >
          ← Kembali
        </Link>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-stone-900">
              {transaksi.nama_pembeli}
            </h1>
            <p className="text-stone-500 text-sm mt-0.5">{formatTanggal(transaksi.tanggal)}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold border ${statusStyle[transaksi.status]}`}
          >
            {transaksi.status}
          </span>
        </div>
      </div>

      {/* Ringkasan Item */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
        <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">
          Ringkasan Pembelian
        </h2>
        <div className="space-y-3">
          {transaksi.transaksi_item.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {item.jenis_produk === 'burung' ? '🐦' : item.jenis_produk === 'pakan' ? '🌾' : '📦'}
                </span>
                <div>
                  <p className="text-sm font-semibold text-stone-800">{item.nama_produk}</p>
                  <p className="text-xs text-stone-400">
                    {formatRp(item.harga)} × {item.jumlah}
                  </p>
                </div>
              </div>
              <span className="text-sm font-bold text-stone-700 whitespace-nowrap">
                {formatRp(item.subtotal)}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4 space-y-2">
          {transaksi.diskon > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">Subtotal</span>
              <span className="font-semibold text-stone-600">{formatRp(transaksi.subtotal)}</span>
            </div>
          )}
          {transaksi.diskon > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-500">Diskon</span>
              <span className="font-semibold text-red-500">- {formatRp(transaksi.diskon)}</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-700">Total</span>
            <span className="text-xl font-black text-amber-700">{formatRp(transaksi.total)}</span>
          </div>
        </div>
        {transaksi.catatan && (
          <p className="text-xs text-stone-400 mt-3 italic">Catatan: {transaksi.catatan}</p>
        )}
      </div>

      {/* Pembayaran / Cicilan */}
      <PembayaranForm
        transaksiId={transaksi.id}
        total={transaksi.total}
        pembayaran={transaksi.pembayaran ?? []}
        status={transaksi.status}
      />

      {/* Form Edit */}
      <div className="mb-3">
        <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">
          Edit Transaksi
        </h2>
      </div>
      <TransaksiForm transaksi={transaksi} />
    </div>
  )
}
