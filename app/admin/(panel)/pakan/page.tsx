import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { DeletePakanButton } from '../../components/DeleteButtons'
import Pagination from '../../components/Pagination'

const PER_PAGE = 10

export default async function PakanPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = Math.max(1, parseInt(searchParams.page ?? '1'))
  const from = (page - 1) * PER_PAGE
  const to = from + PER_PAGE - 1

  const supabase = createClient()
  const { data: pakanList, count } = await supabase
    .from('pakan')
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
          <h1 className="text-xl sm:text-2xl font-black text-stone-900">Manajemen Pakan</h1>
          <p className="text-stone-500 text-sm mt-0.5">{totalItems} produk pakan terdaftar</p>
        </div>
        <Link
          href="/admin/pakan/tambah"
          className="bg-amber-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors self-start sm:self-auto"
        >
          + Tambah Pakan
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {!pakanList || pakanList.length === 0 ? (
          <div className="text-center py-16 text-stone-400">
            <div className="text-5xl mb-3">🌾</div>
            <p className="font-semibold text-stone-500">Belum ada produk pakan</p>
            <Link href="/admin/pakan/tambah" className="text-amber-600 text-sm font-semibold hover:underline mt-2 inline-block">
              Tambah produk pertama →
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile: Card list */}
            <div className="sm:hidden divide-y divide-gray-50">
              {pakanList.map((pakan) => (
                <div key={pakan.id} className="flex items-center gap-3 p-4">
                  {pakan.gambar_url ? (
                    <img src={pakan.gambar_url} alt={pakan.nama} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center text-xl flex-shrink-0">🌾</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-800 text-sm truncate">{pakan.nama}</p>
                    <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                      {pakan.tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full text-xs font-medium">{tag}</span>
                      ))}
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${pakan.tersedia ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                        {pakan.tersedia ? 'Tersedia' : 'Habis'}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <Link href={`/admin/pakan/${pakan.id}`} className="text-xs font-semibold text-stone-600 bg-gray-100 px-3 py-1.5 rounded-lg text-center">
                      Edit
                    </Link>
                    <DeletePakanButton id={pakan.id} nama={pakan.nama} />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: Table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left py-3 px-6 text-xs font-bold text-stone-400 uppercase tracking-wider">Produk</th>
                    <th className="text-left py-3 px-6 text-xs font-bold text-stone-400 uppercase tracking-wider">Tags</th>
                    <th className="text-left py-3 px-6 text-xs font-bold text-stone-400 uppercase tracking-wider">Status</th>
                    <th className="text-right py-3 px-6 text-xs font-bold text-stone-400 uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {pakanList.map((pakan) => (
                    <tr key={pakan.id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {pakan.gambar_url ? (
                            <img src={pakan.gambar_url} alt={pakan.nama} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-lg flex-shrink-0">🌾</div>
                          )}
                          <div>
                            <div className="font-semibold text-stone-800">{pakan.nama}</div>
                            {pakan.deskripsi && (
                              <div className="text-xs text-stone-400 mt-0.5 line-clamp-1">{pakan.deskripsi}</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {pakan.tags?.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {pakan.tags.slice(0, 3).map((tag: string) => (
                              <span key={tag} className="bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full text-xs font-medium">{tag}</span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-stone-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${pakan.tersedia ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                          {pakan.tersedia ? 'Tersedia' : 'Habis'}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/pakan/${pakan.id}`} className="text-xs font-semibold text-stone-600 hover:text-amber-600 bg-gray-100 hover:bg-amber-50 px-3 py-1.5 rounded-lg transition-colors">
                            Edit
                          </Link>
                          <DeletePakanButton id={pakan.id} nama={pakan.nama} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination currentPage={page} totalPages={totalPages} totalItems={totalItems} perPage={PER_PAGE} />
          </>
        )}
      </div>
    </div>
  )
}
