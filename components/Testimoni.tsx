import type { Testimoni } from '@/types'

function getInitials(nama: string) {
  return nama.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

const AVATAR_COLORS = [
  'bg-amber-500',
  'bg-sky-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-rose-500',
  'bg-orange-500',
]

function Stars({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 20 20" className={`w-4 h-4 ${i < n ? 'fill-amber-400' : 'fill-stone-200 dark:fill-stone-600'}`}>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
        </svg>
      ))}
    </div>
  )
}

interface Props { items: Testimoni[] }

export default function Testimoni({ items }: Props) {
  if (items.length === 0) return null

  return (
    <section id="testimoni" className="py-16 md:py-24 bg-stone-900 dark:bg-stone-950">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-amber-500/20 text-amber-400 text-sm font-bold px-4 py-1.5 rounded-full mb-4 border border-amber-500/30">
            💬 Kata Mereka
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Testimoni Pelanggan</h2>
          <p className="text-stone-400 max-w-md mx-auto">
            Ribuan pelanggan puas dengan burung dan pakan dari USMAN
          </p>
        </div>

        {/* Mobile: horizontal scroll — Desktop: grid */}
        <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-5 overflow-x-auto pb-3 md:pb-0 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
          {items.map((t, idx) => (
            <div
              key={t.id}
              className="bg-stone-800 dark:bg-stone-900 border border-stone-700 rounded-2xl p-6 flex flex-col gap-4 hover:border-amber-700/50 transition-colors flex-shrink-0 w-[80vw] sm:w-[60vw] md:w-auto snap-start"
            >
              {/* Stars + produk */}
              <div className="flex items-center justify-between">
                <Stars n={t.bintang} />
                {t.produk && (
                  <span className="text-xs font-semibold bg-amber-500/20 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/20">
                    {t.produk}
                  </span>
                )}
              </div>

              {/* Pesan */}
              <p className="text-stone-300 text-sm leading-relaxed flex-1">
                &ldquo;{t.pesan}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-2 border-t border-stone-700">
                <div className={`w-9 h-9 rounded-full ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-black flex-shrink-0`}>
                  {getInitials(t.nama)}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.nama}</p>
                  <p className="text-stone-500 text-xs">Pelanggan USMAN</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-10">
          <p className="text-stone-500 text-sm">
            Sudah beli di USMAN? Ceritakan pengalamanmu via WhatsApp 😊
          </p>
        </div>
      </div>
    </section>
  )
}
