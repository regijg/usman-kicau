import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WaFloat from '@/components/WaFloat'

const WA_NUMBER = '6281287627817'

const WA_ICON = (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current flex-shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)

const categoryStyle: Record<string, string> = {
  Kicau:    'bg-amber-100 text-amber-800',
  Aviari:   'bg-sky-100 text-sky-800',
  Masteran: 'bg-orange-100 text-orange-800',
  Lainnya:  'bg-stone-100 text-stone-600',
}

interface Props { params: { id: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const supabase = createClient()
  const { data: bird } = await supabase.from('burung').select('nama, kategori, tersedia, gambar_url').eq('id', params.id).single()
  if (!bird) return { title: 'Burung Tidak Ditemukan' }
  return {
    title: `${bird.nama} - ${bird.kategori}`,
    description: `Beli burung ${bird.nama} di USMAN. ${bird.tersedia ? 'Stok tersedia!' : 'Hubungi kami untuk info stok.'}`,
    openGraph: {
      title: `${bird.nama} | USMAN Usaha Manuk`,
      description: `Beli burung ${bird.nama} kategori ${bird.kategori} di USMAN.`,
      images: bird.gambar_url ? [bird.gambar_url] : [],
    },
  }
}

export default async function BurungDetailPage({ params }: Props) {
  const supabase = createClient()

  const [{ data: bird }, { data: others }] = await Promise.all([
    supabase.from('burung').select('*').eq('id', params.id).single(),
    supabase.from('burung').select('*').neq('id', params.id).order('nama').limit(20),
  ])

  if (!bird) notFound()

  const waOrderMsg = `Assalamualaikum Kak 🙏\n\nSaya tertarik dengan burung *${bird.nama}* di USMAN.\nApakah masih ada stok? Berapa harganya?\n\nTerima kasih`
  const waRestockMsg = `Assalamualaikum Kak 🙏\n\nMau tanya kapan restok *${bird.nama}*?\n\nTerima kasih`

  const sameCategory = (others ?? []).filter(b => b.kategori === bird.kategori)
  const related = sameCategory.length >= 4
    ? sameCategory.slice(0, 4)
    : [...sameCategory, ...(others ?? []).filter(b => b.kategori !== bird.kategori)].slice(0, 4)

  return (
    <main className="min-h-screen bg-amber-50 dark:bg-stone-950">
      <Header />
      <WaFloat />

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-stone-900 border-b border-stone-100 dark:border-stone-800">
        <div className="container-custom py-3 flex items-center gap-2 text-sm text-stone-500 dark:text-stone-400">
          <Link href="/" className="hover:text-amber-600 transition-colors">Beranda</Link>
          <span>›</span>
          <Link href="/#burung" className="hover:text-amber-600 transition-colors">Burung</Link>
          <span>›</span>
          <span className="text-stone-900 dark:text-stone-100 font-medium truncate">{bird.nama}</span>
        </div>
      </div>

      <div className="container-custom py-10 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 md:gap-14 max-w-4xl mx-auto">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 aspect-square shadow-lg">
            {bird.gambar_url ? (
              <img src={bird.gambar_url} alt={bird.nama} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 gap-3">
                <span className="text-8xl">🐦</span>
                <span className="text-sm font-medium">Foto Menyusul</span>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              <span className={`text-sm font-bold px-3 py-1 rounded-full ${categoryStyle[bird.kategori] ?? 'bg-stone-100 text-stone-600'}`}>
                {bird.kategori}
              </span>
              <span className={`text-sm font-bold px-3 py-1 rounded-full border ${
                bird.tersedia ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
              }`}>
                {bird.tersedia ? '✓ Tersedia' : '✗ Sudah Habis'}
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-stone-900 dark:text-stone-100 mb-4 leading-tight">
              {bird.nama}
            </h1>

            <p className="text-stone-500 dark:text-stone-400 mb-8 leading-relaxed">
              {bird.tersedia
                ? 'Burung ini sedang tersedia. Hubungi kami sekarang untuk informasi harga dan pemesanan.'
                : 'Stok burung ini sedang habis. Hubungi kami untuk info restok atau lihat burung lainnya.'}
            </p>

            <div className="space-y-3">
              {bird.tersedia ? (
                <a
                  href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waOrderMsg)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-wa w-full py-4 text-base font-bold"
                >
                  {WA_ICON}
                  Pesan via WhatsApp
                </a>
              ) : (
                <button disabled className="w-full py-4 rounded-xl bg-stone-200 dark:bg-stone-700 text-stone-400 dark:text-stone-500 font-bold cursor-not-allowed">
                  Stok Habis
                </button>
              )}
              <a
                href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(waRestockMsg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center text-sm text-stone-400 dark:text-stone-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors py-2"
              >
                💬 Tanya harga / info restok
              </a>
            </div>
          </div>
        </div>

        {/* Related Birds */}
        {related.length > 0 && (
          <div className="max-w-4xl mx-auto mt-16">
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100 mb-6">Burung Lainnya</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {related.map((b) => (
                <Link key={b.id} href={`/burung/${b.id}`} className="card overflow-hidden group block">
                  <div className="relative h-28 overflow-hidden bg-stone-100 dark:bg-stone-700">
                    {b.gambar_url ? (
                      <img src={b.gambar_url} alt={b.nama} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-stone-200 dark:bg-stone-700 text-stone-400">
                        <span className="text-3xl">🐦</span>
                      </div>
                    )}
                    <span className={`absolute top-2 left-2 text-xs font-bold px-1.5 py-0.5 rounded-full border ${
                      b.tersedia ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
                    }`}>
                      {b.tersedia ? '✓' : '✗'}
                    </span>
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-stone-900 dark:text-stone-100 text-sm leading-tight">{b.nama}</p>
                    <p className="text-xs text-stone-400 mt-0.5">{b.kategori}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </main>
  )
}
