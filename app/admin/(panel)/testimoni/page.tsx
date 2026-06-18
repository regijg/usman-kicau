import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { DeleteTestimoniButton } from '../../components/DeleteButtons'
import type { Testimoni } from '@/types'

function StarDisplay({ bintang }: { bintang: number }) {
  return (
    <span className="text-sm">
      {'⭐'.repeat(bintang)}{'☆'.repeat(5 - bintang)}
    </span>
  )
}

export default async function TestimoniAdminPage() {
  const supabase = createClient()
  const { data: list } = await supabase
    .from('testimoni')
    .select('*')
    .order('created_at', { ascending: false })

  const items: Testimoni[] = list ?? []

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-stone-900">Testimoni</h1>
          <p className="text-stone-500 text-sm mt-0.5">{items.length} testimoni terdaftar</p>
        </div>
        <Link
          href="/admin/testimoni/tambah"
          className="bg-amber-500 text-white px-4 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors whitespace-nowrap"
        >
          + Tambah
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-stone-400">
          <div className="text-4xl mb-3">⭐</div>
          <p className="font-semibold">Belum ada testimoni</p>
          <Link href="/admin/testimoni/tambah" className="mt-3 inline-block text-amber-600 text-sm font-bold hover:underline">
            + Tambah testimoni pertama
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(t => (
            <div key={t.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-bold text-stone-900">{t.nama}</span>
                    {t.produk && (
                      <span className="bg-amber-100 text-amber-700 text-xs font-semibold px-2 py-0.5 rounded-full">
                        {t.produk}
                      </span>
                    )}
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      t.aktif ? 'bg-green-100 text-green-700' : 'bg-stone-100 text-stone-500'
                    }`}>
                      {t.aktif ? 'Aktif' : 'Disembunyikan'}
                    </span>
                  </div>
                  <StarDisplay bintang={t.bintang} />
                  <p className="text-stone-600 text-sm mt-1.5 leading-relaxed line-clamp-2">{t.pesan}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Link
                    href={`/admin/testimoni/${t.id}`}
                    className="px-3 py-1.5 text-xs border border-stone-200 rounded-lg font-semibold text-stone-600 hover:bg-gray-50 transition-colors"
                  >
                    Edit
                  </Link>
                  <DeleteTestimoniButton id={t.id} nama={t.nama} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
