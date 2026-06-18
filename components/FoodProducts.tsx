'use client'
import { useState } from 'react'
import type { Pakan } from '@/types'

const WA_NUMBER = '6281287627817'
const PER_PAGE = 12

const WA_ICON = (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)

function getEmoji(nama: string): string {
  const n = nama.toLowerCase()
  if (n.includes('jangkrik')) return '🦗'
  if (n.includes('ulat')) return '🪱'
  if (n.includes('kroto')) return '🐜'
  if (n.includes('voer') || n.includes('pelet')) return '🌾'
  return '🌿'
}

function waLink(productName: string) {
  const msg = `Assalamualaikum Kak 🙏\n\nSaya mau pesan *${productName}* dari USMAN.\nBerapa harga dan minimal ordernya?\n\nTerima kasih`
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`
}

function Pagination({ currentPage, totalPages, onPageChange }: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}) {
  if (totalPages <= 1) return null

  const pages: (number | '...')[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('...')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg border border-stone-200 text-sm font-medium text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 transition-colors"
      >
        ← Prev
      </button>
      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`el-${idx}`} className="px-1 text-stone-400 text-sm">…</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
              page === currentPage
                ? 'bg-amber-500 text-white shadow-sm'
                : 'border border-stone-200 text-stone-600 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-600'
            }`}
          >
            {page}
          </button>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg border border-stone-200 text-sm font-medium text-stone-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 transition-colors"
      >
        Next →
      </button>
    </div>
  )
}

interface Props {
  products: Pakan[]
}

export default function FoodProducts({ products }: Props) {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(products.length / PER_PAGE)
  const paginated = products.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  function handlePageChange(page: number) {
    setCurrentPage(page)
    document.getElementById('pakan')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section id="pakan" className="py-16 md:py-24 bg-white">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="inline-block bg-orange-100 text-orange-700 text-sm font-bold px-4 py-1.5 rounded-full mb-4 border border-orange-200">
            🌿 Pakan Berkualitas
          </span>
          <h2 className="section-title mb-4">Jual Pakan Burung</h2>
          <p className="text-stone-500 max-w-lg mx-auto">
            Pakan segar dan berkualitas untuk kesehatan dan kegacoran burung kesayanganmu
          </p>
        </div>

        {/* Product Cards */}
        {products.length === 0 ? (
          <div className="text-center py-12 text-stone-400">
            <div className="text-5xl mb-3">🌾</div>
            <p className="font-semibold">Pakan sedang tidak tersedia</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-4">
              {paginated.map((p) => (
                <div key={p.id} className="card overflow-hidden group">
                  <div className="h-52 overflow-hidden bg-stone-100 relative">
                    {p.gambar_url ? (
                      <img
                        src={p.gambar_url}
                        alt={p.nama}
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${!p.tersedia ? 'grayscale-[40%]' : ''}`}
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-stone-200 text-stone-400">
                        <span className="text-6xl">{getEmoji(p.nama)}</span>
                      </div>
                    )}
                    {p.gambar_url && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"/>
                    )}

                    {/* Availability Badge */}
                    <span className={`absolute top-2 left-2 text-xs font-bold px-2.5 py-1 rounded-full border ${
                      p.tersedia
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : 'bg-red-100 text-red-700 border-red-200'
                    }`}>
                      {p.tersedia ? '✓ Tersedia' : '✗ Sudah Habis'}
                    </span>

                    <span className="absolute bottom-3 left-3 text-4xl drop-shadow-lg">
                      {getEmoji(p.nama)}
                    </span>
                  </div>

                  <div className="p-5">
                    {p.tags && p.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {p.tags.map((tag) => (
                          <span key={tag} className="bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-200">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <h3 className="text-xl font-bold text-stone-900 mb-2">{p.nama}</h3>
                    {p.deskripsi && (
                      <p className="text-stone-500 text-sm mb-5 leading-relaxed">{p.deskripsi}</p>
                    )}
                    {p.tersedia ? (
                      <a
                        href={waLink(p.nama)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-wa w-full"
                      >
                        {WA_ICON}
                        Pesan Sekarang
                      </a>
                    ) : (
                      <button
                        disabled
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-stone-200 text-stone-400 cursor-not-allowed font-semibold text-sm"
                      >
                        Stok Habis
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination info */}
            <p className="text-center text-xs text-stone-400 mt-2">
              Menampilkan {(currentPage - 1) * PER_PAGE + 1}–{Math.min(currentPage * PER_PAGE, products.length)} dari {products.length} pakan
            </p>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}

        {/* Feature Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {[
            { icon: '💥', label: 'Harga Bersahabat', sub: 'Grosir & Ecer' },
            { icon: '🌿', label: 'Pakan Segar',       sub: 'Kualitas Terjamin' },
            { icon: '🚚', label: 'Bisa Dikirim',      sub: 'Tanya Ongkir' },
            { icon: '⏰', label: 'Buka 24 Jam',       sub: 'Sehudangna' },
          ].map((f) => (
            <div key={f.label} className="flex flex-col items-center gap-1 bg-stone-50 rounded-2xl p-4 border border-stone-100 text-center hover:border-amber-200 hover:bg-amber-50 transition-colors">
              <span className="text-3xl mb-1">{f.icon}</span>
              <p className="text-sm font-bold text-stone-800">{f.label}</p>
              <p className="text-xs text-stone-500">{f.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
