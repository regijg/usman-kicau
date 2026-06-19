import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Suspense } from 'react'
import { DeleteBurungButton } from '../../components/DeleteButtons'
import Pagination from '../../components/Pagination'

const PER_PAGE = 10

export default async function BurungPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = Math.max(1, parseInt(searchParams.page ?? '1'))
  const from = (page - 1) * PER_PAGE
  const to = from + PER_PAGE - 1

  const supabase = createClient()
  const { data: burungList, count } = await supabase
    .from('burung')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  const totalItems = count ?? 0
  const totalPages = Math.ceil(totalItems / PER_PAGE)

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900">Manajemen Burung</h1>
          <p className="text-stone-500 text-sm mt-0.5">{totalItems} burung terdaftar</p>
        </div>
        <Link
          href="/admin/burung/tambah"
          className="bg-amber-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors self-start sm:self-auto"
        >
          + Tambah Burung
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {!burungList || burungList.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <div className="text-5xl mb-3">🐦</div>
            <p className="font-semibold text-stone-500">Belum ada data burung</p>
            <Link href="/admin/burung/tambah" className="text-amber-600 text-sm font-semibold hover:underline mt-2 inline-block">
              Tambah burung pertama →
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile: Card list */}
            <div className="sm:hidden divide-y divide-gray-50">
              {burungList.map((burung) => (
                <div key={burung.id} className="flex items-center gap-3 p-4">
                  {burung.gambar_url ? (
                    <img src={burung.gambar_url} alt={burung.nama} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-xl flex-shrink-0">🐦</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-800 text-sm truncate">{burung.nama}</p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-xs font-semibold">
                        {burung.kategori}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${burung.tersedia ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                        {burung.tersedia ? 'Tersedia' : 'Habis'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <Link href={`/admin/burung/${burung.id}`} className="text-xs font-semibold text-stone-600 bg-gray-100 px-3 py-1.5 rounded-lg text-center">
                      Edit
                    </Link>
                    <DeleteBurungButton id={burung.id} nama={burung.nama} />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left py-3 px-6 text-xs font-bold text-stone-400 uppercase tracking-wider">Burung</th>
                    <th className="text-left py-3 px-6 text-xs font-bold text-stone-400 uppercase tracking-wider">Kategori</th>
                    <th className="text-left py-3 px-6 text-xs font-bold text-stone-400 uppercase tracking-wider">Status</th>
                    <th className="text-right py-3 px-6 text-xs font-bold text-stone-400 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {burungList.map((burung) => (
                    <tr key={burung.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {burung.gambar_url ? (
                            <img src={burung.gambar_url} alt={burung.nama} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center text-lg flex-shrink-0">🐦</div>
                          )}
                          <span className="font-semibold text-stone-800">{burung.nama}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold">{burung.kategori}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${burung.tersedia ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                          {burung.tersedia ? 'Tersedia' : 'Habis'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/burung/${burung.id}`} className="text-xs font-semibold text-stone-600 hover:text-amber-600 bg-gray-100 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors">
                            Edit
                          </Link>
                          <DeleteBurungButton id={burung.id} nama={burung.nama} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Suspense fallback={null}>
              <Pagination currentPage={page} totalPages={totalPages} totalItems={totalItems} perPage={PER_PAGE} />
            </Suspense>
          </>
        )}
      </div>
    </div>
  )
}
