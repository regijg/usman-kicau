import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Suspense } from 'react'
import Pagination from '../../components/Pagination'

const PER_PAGE = 15

function formatRp(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID')
}

function formatTanggal(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

const statusStyle: Record<string, string> = {
  Lunas: 'bg-green-50 text-green-600',
  'Belum Lunas': 'bg-red-50 text-red-500',
  Titip: 'bg-amber-50 text-amber-600',
}

export default async function TransaksiPage({
  searchParams,
}: {
  searchParams: { page?: string; status?: string }
}) {
  const page = Math.max(1, parseInt(searchParams.page ?? '1'))
  const statusFilter = searchParams.status ?? ''
  const from = (page - 1) * PER_PAGE
  const to = from + PER_PAGE - 1

  const supabase = createClient()

  let query = supabase
    .from('transaksi')
    .select('*', { count: 'exact' })
    .order('tanggal', { ascending: false })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (statusFilter) query = query.eq('status', statusFilter)

  const { data: transaksiList, count } = await query

  const totalItems = count ?? 0
  const totalPages = Math.ceil(totalItems / PER_PAGE)

  // Hitung total omzet yang ditampilkan
  const { data: omzetData } = await supabase
    .from('transaksi')
    .select('total, status')
  const omzetLunas = (omzetData ?? [])
    .filter((t) => t.status === 'Lunas')
    .reduce((sum, t) => sum + (t.total ?? 0), 0)
  const omzetPending = (omzetData ?? [])
    .filter((t) => t.status !== 'Lunas')
    .reduce((sum, t) => sum + (t.total ?? 0), 0)

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900">Transaksi</h1>
          <p className="text-stone-500 text-sm mt-0.5">{totalItems} transaksi tercatat</p>
        </div>
        <Link
          href="/admin/transaksi/tambah"
          className="bg-amber-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors self-start sm:self-auto"
        >
          + Transaksi Baru
        </Link>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="text-xs text-stone-400 font-semibold mb-1">Total Lunas</div>
          <div className="text-lg font-black text-green-600">{formatRp(omzetLunas)}</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
          <div className="text-xs text-stone-400 font-semibold mb-1">Belum Lunas / Titip</div>
          <div className="text-lg font-black text-amber-600">{formatRp(omzetPending)}</div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm col-span-2 sm:col-span-1">
          <div className="text-xs text-stone-400 font-semibold mb-1">Total Semua</div>
          <div className="text-lg font-black text-stone-800">{formatRp(omzetLunas + omzetPending)}</div>
        </div>
      </div>

      {/* Filter status */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { label: 'Semua', value: '' },
          { label: 'Lunas', value: 'Lunas' },
          { label: 'Belum Lunas', value: 'Belum Lunas' },
          { label: 'Titip', value: 'Titip' },
        ].map((f) => (
          <Link
            key={f.value}
            href={f.value ? `/admin/transaksi?status=${encodeURIComponent(f.value)}` : '/admin/transaksi'}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              statusFilter === f.value
                ? 'bg-amber-500 text-white'
                : 'bg-white border border-stone-200 text-stone-500 hover:bg-gray-50'
            }`}
          >
            {f.label}
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {!transaksiList || transaksiList.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <div className="text-5xl mb-3">🧾</div>
            <p className="font-semibold text-stone-500">Belum ada transaksi</p>
            <Link
              href="/admin/transaksi/tambah"
              className="text-amber-600 text-sm font-semibold hover:underline mt-2 inline-block"
            >
              Buat transaksi pertama →
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile */}
            <div className="sm:hidden divide-y divide-gray-50">
              {transaksiList.map((trx) => (
                <div key={trx.id} className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-stone-800 text-sm truncate">{trx.nama_pembeli}</p>
                      <p className="text-xs text-stone-400 mt-0.5">{formatTanggal(trx.tanggal)}</p>
                      <p className="text-base font-black text-amber-700 mt-1">{formatRp(trx.total)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusStyle[trx.status]}`}>
                        {trx.status}
                      </span>
                      <Link
                        href={`/admin/transaksi/${trx.id}`}
                        className="text-xs font-semibold text-stone-600 bg-gray-100 px-3 py-1.5 rounded-lg"
                      >
                        Detail
                      </Link>
                    </div>
                  </div>
                  {trx.catatan && (
                    <p className="text-xs text-stone-400 mt-2 italic">{trx.catatan}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left py-3 px-6 text-xs font-bold text-stone-400 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-bold text-stone-400 uppercase tracking-wider">
                      Pembeli
                    </th>
                    <th className="text-left py-3 px-6 text-xs font-bold text-stone-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right py-3 px-6 text-xs font-bold text-stone-400 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="text-center py-3 px-6 text-xs font-bold text-stone-400 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {transaksiList.map((trx) => (
                    <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6 text-sm text-stone-500 whitespace-nowrap">
                        {formatTanggal(trx.tanggal)}
                      </td>
                      <td className="py-4 px-6">
                        <p className="font-semibold text-stone-800 text-sm">{trx.nama_pembeli}</p>
                        {trx.catatan && (
                          <p className="text-xs text-stone-400 mt-0.5 italic">{trx.catatan}</p>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyle[trx.status]}`}>
                          {trx.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-black text-amber-700 whitespace-nowrap">
                        {formatRp(trx.total)}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <Link
                          href={`/admin/transaksi/${trx.id}`}
                          className="text-xs font-semibold text-stone-600 hover:text-amber-600 bg-gray-100 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Suspense fallback={null}>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                totalItems={totalItems}
                perPage={PER_PAGE}
              />
            </Suspense>
          </>
        )}
      </div>
    </div>
  )
}
