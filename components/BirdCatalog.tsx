'use client'
import { useState, useCallback } from 'react'
import Link from 'next/link'
import type { Burung } from '@/types'
import Lightbox from './Lightbox'

const WA_NUMBER = '6281287627817'
const PER_PAGE = 12

const WA_ICON = (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)

const CATEGORIES = ['Semua', 'Kicau', 'Aviari', 'Perkutut', 'Lainnya'] as const

const categoryStyle: Record<string, string> = {
  Kicau:    'bg-amber-100 text-amber-800',
  Aviari:   'bg-sky-100 text-sky-800',
  Perkutut: 'bg-orange-100 text-orange-800',
  Lainnya:  'bg-stone-100 text-stone-600',
}

function waLink(birdName: string) {
  const msg = `Assalamualaikum Kak 🙏\n\nSaya tertarik dengan burung *${birdName}* di USMAN.\nApakah masih ada stok? Berapa harganya?\n\nTerima kasih`
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`
}

async function shareCard(bird: Burung) {
  const url = `${window.location.origin}/burung/${bird.id}`
  const text = `Lihat burung *${bird.nama}* di USMAN 🐦\n${url}`
  if (typeof navigator !== 'undefined' && navigator.share) {
    await navigator.share({ title: bird.nama, text, url }).catch(() => {})
  } else {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }
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
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) pages.push(i)
    if (currentPage < totalPages - 2) pages.push('...')
    pages.push(totalPages)
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 text-sm font-medium text-stone-600 dark:text-stone-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
        ← Prev
      </button>
      {pages.map((page, idx) =>
        page === '...' ? (
          <span key={`el-${idx}`} className="px-1 text-stone-400 text-sm">…</span>
        ) : (
          <button key={page} onClick={() => onPageChange(page as number)}
            className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
              page === currentPage
                ? 'bg-amber-500 text-white shadow-sm'
                : 'border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-amber-50 dark:hover:bg-stone-800 hover:border-amber-300 hover:text-amber-600'
            }`}>
            {page}
          </button>
        )
      )}
      <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 text-sm font-medium text-stone-600 dark:text-stone-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors">
        Next →
      </button>
    </div>
  )
}

interface Props { birds: Burung[] }

export default function BirdCatalog({ birds }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>('Semua')
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const [lightbox, setLightbox] = useState<{ src: string; alt: string } | null>(null)
  const closeLightbox = useCallback(() => setLightbox(null), [])

  const filtered = birds
    .filter(b => activeCategory === 'Semua' || b.kategori === activeCategory)
    .filter(b => !search || b.nama.toLowerCase().includes(search.toLowerCase()))

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE)

  function handleCategoryChange(cat: string) {
    setActiveCategory(cat)
    setCurrentPage(1)
  }

  function handleSearch(val: string) {
    setSearch(val)
    setCurrentPage(1)
  }

  function handlePageChange(page: number) {
    setCurrentPage(page)
    document.getElementById('burung')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={closeLightbox} />}

      <section id="burung" className="py-16 md:py-24 bg-amber-50 dark:bg-stone-900">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-block bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-sm font-bold px-4 py-1.5 rounded-full mb-4 border border-amber-200 dark:border-amber-700">
              🐦 Stok Siap Pantau
            </span>
            <h2 className="section-title mb-4">Katalog Burung Kicau</h2>
            <p className="text-stone-500 dark:text-stone-400 max-w-lg mx-auto">
              Klik <strong className="text-amber-600">Pesan Sekarang</strong> untuk langsung chat WA — pesan otomatis terisi sesuai burung yang dipilih.
            </p>
          </div>

          {/* Search */}
          <div className="relative max-w-sm mx-auto mb-6">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              placeholder="Cari nama burung..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 text-sm focus:outline-none focus:border-amber-400 dark:focus:border-amber-500 focus:ring-2 focus:ring-amber-100 dark:focus:ring-amber-900/30 transition-all"
            />
            {search && (
              <button onClick={() => handleSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 text-lg leading-none">
                ×
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="flex overflow-x-auto gap-2 mb-8 pb-1 scrollbar-hide">
            {CATEGORIES.map(cat => {
              const count = cat === 'Semua' ? birds.length : birds.filter(b => b.kategori === cat).length
              const isActive = activeCategory === cat
              return (
                <button key={cat} onClick={() => handleCategoryChange(cat)}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                      : 'bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700 hover:border-amber-400 hover:text-amber-600'
                  }`}>
                  {cat}
                  <span className={`ml-1.5 text-xs ${isActive ? 'opacity-80' : 'opacity-50'}`}>({count})</span>
                </button>
              )
            })}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-stone-400">
              <div className="text-5xl mb-3">🐦</div>
              <p className="font-semibold">{search ? `Burung "${search}" tidak ditemukan` : 'Belum ada burung di kategori ini'}</p>
              {search && <button onClick={() => handleSearch('')} className="mt-3 text-sm text-amber-600 hover:underline">Hapus pencarian</button>}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                {paginated.map((bird) => (
                  <div key={bird.id} className="card overflow-hidden group flex flex-col">
                    {/* Image */}
                    <div className="relative overflow-hidden h-36 md:h-44 bg-stone-100 dark:bg-stone-700 flex-shrink-0">
                      {bird.gambar_url ? (
                        <img
                          src={bird.gambar_url}
                          alt={bird.nama}
                          className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 cursor-zoom-in ${!bird.tersedia ? 'grayscale-[40%]' : ''}`}
                          loading="lazy"
                          onClick={() => setLightbox({ src: bird.gambar_url!, alt: bird.nama })}
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-stone-200 dark:bg-stone-700 text-stone-400 gap-1">
                          <span className="text-3xl">🐦</span>
                          <span className="text-xs font-medium">Foto Menyusul</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"/>

                      {/* Availability badge */}
                      <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full border ${
                        bird.tersedia ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'
                      }`}>
                        {bird.tersedia ? '✓ Tersedia' : '✗ Sudah Habis'}
                      </span>

                      {/* Category badge */}
                      <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full ${categoryStyle[bird.kategori] ?? 'bg-stone-100 text-stone-600'}`}>
                        {bird.kategori}
                      </span>

                      {/* Share button */}
                      <button
                        onClick={() => shareCard(bird)}
                        className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-black/50 hover:bg-black/70 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                        title="Bagikan"
                      >
                        ↗
                      </button>
                    </div>

                    {/* Content */}
                    <div className="p-3 md:p-4 flex flex-col flex-1">
                      <Link href={`/burung/${bird.id}`} className="font-bold text-stone-900 dark:text-stone-100 text-sm md:text-base mb-3 leading-tight flex-1 hover:text-amber-600 dark:hover:text-amber-400 transition-colors block">
                        {bird.nama}
                      </Link>
                      {bird.tersedia ? (
                        <a href={waLink(bird.nama)} target="_blank" rel="noopener noreferrer" className="btn-wa w-full text-xs md:text-sm mt-auto">
                          {WA_ICON}
                          Pesan Sekarang
                        </a>
                      ) : (
                        <button disabled className="w-full text-xs md:text-sm mt-auto flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-400 dark:text-stone-500 cursor-not-allowed font-semibold">
                          Stok Habis
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-center text-xs text-stone-400 mt-6">
                Menampilkan {(currentPage - 1) * PER_PAGE + 1}–{Math.min(currentPage * PER_PAGE, filtered.length)} dari {filtered.length} burung
              </p>

              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </>
          )}

          {/* Bottom Banner */}
          <div className="mt-12 bg-[#1a1208] rounded-2xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-bold text-amber-400 text-lg mb-1">✓ Teliti Sebelum Membeli</p>
                <p className="text-stone-400 text-sm">Semoga Jadi Amanah · Harga Bersahabat Burung Sehat · Rawatlah Burungmu Dengan Kasih Sayang</p>
              </div>
              <a href={waLink('burung pilihan')} target="_blank" rel="noopener noreferrer" className="btn-wa whitespace-nowrap px-6 py-3 text-sm flex-shrink-0">
                {WA_ICON}
                Tanya Stok Sekarang
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
