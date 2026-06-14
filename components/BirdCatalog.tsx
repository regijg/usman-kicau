'use client'
import { useState } from 'react'

const WA_NUMBER = '6281287627817'

const WA_ICON = (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)

const birds = [
  { id: 1,  name: 'Sogon',             category: 'Kicau',   img: '/img/produk/sogon.jpg' },
  { id: 2,  name: 'Ciblek Gunung',     category: 'Kicau',   img: '/img/produk/ciblek-gunung.jpg' },
  { id: 3,  name: 'Ciblek Sawah',      category: 'Kicau',   img: '/img/produk/ciblek-sawah.jpg' },
  { id: 4,  name: 'Cikrak Daun',       category: 'Kicau',   img: '/img/produk/cikrak-daun.jpg' },
  { id: 5,  name: 'Cingcoang',         category: 'Kicau',   img: '/img/produk/cingcoang.jpg' },
  { id: 6,  name: 'Cipoh',             category: 'Kicau',   img: '/img/produk/cipoh.jpg' },
  { id: 7,  name: 'Kerak Basi',        category: 'Kicau',   img: '/img/produk/kerak-basi.jpg' },
  { id: 8,  name: 'Kipasan',           category: 'Kicau',   img: '/img/produk/kipasan.jpg' },
  { id: 9,  name: 'Kopi-Kopi',         category: 'Kicau',   img: '/img/produk/kopi-kopi.jpg' },
  { id: 10, name: 'Kutilang',          category: 'Kicau',   img: '/img/produk/kutilang.jpg' },
  { id: 11, name: 'Merbah',            category: 'Kicau',   img: '/img/produk/merbah.jpg' },
  { id: 12, name: 'Perenjak',          category: 'Kicau',   img: '/img/produk/perenjak.jpg' },
  { id: 13, name: 'Pijantung Gunung',  category: 'Kicau',   img: '/img/produk/pijantung-gunung.jpg' },
  { id: 14, name: 'Pijantung Pisang',  category: 'Kicau',   img: '/img/produk/pijantung-pisang.jpg' },
  { id: 15, name: 'Remetuk Laut',      category: 'Kicau',   img: '/img/produk/remetuk-lut.jpg' },
  { id: 16, name: 'Sepah Raja',        category: 'Kicau',   img: '/img/produk/sepah-raja.jpg' },
  { id: 17, name: 'Sniper',            category: 'Kicau',   img: '/img/produk/sniper.jpg' },
  { id: 18, name: 'Teruncukan',        category: 'Kicau',   img: '/img/produk/teruncukan.jpg' },
  { id: 19, name: 'Lolohan',           category: 'Aviari',  img: '/img/produk/lolohan.jpg' },
  { id: 20, name: 'Paok Panca Warna',  category: 'Aviari',  img: '/img/produk/paok-panca-warna.jpg' },
  { id: 21, name: 'Tengkek Raja',      category: 'Aviari',  img: '/img/produk/tengkek-raja.jpg' },
  { id: 22, name: 'Kamade',            category: 'Lainnya', img: '/img/produk/kamade.jpg' },
]

const CATEGORIES = ['Semua', 'Kicau', 'Aviari', 'Lainnya'] as const

const categoryStyle: Record<string, string> = {
  Kicau:    'bg-amber-100 text-amber-800',
  Aviari:   'bg-sky-100 text-sky-800',
  Lainnya:  'bg-stone-100 text-stone-600',
}

function waLink(birdName: string) {
  const msg = `Assalamualaikum Kak 🙏\n\nSaya tertarik dengan burung *${birdName}* di USMAN.\nApakah masih ada stok? Berapa harganya?\n\nTerima kasih`
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`
}

export default function BirdCatalog() {
  const [activeCategory, setActiveCategory] = useState<string>('Semua')

  const filtered = activeCategory === 'Semua'
    ? birds
    : birds.filter(b => b.category === activeCategory)

  return (
    <section id="burung" className="py-16 md:py-24 bg-amber-50">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block bg-amber-100 text-amber-700 text-sm font-bold px-4 py-1.5 rounded-full mb-4 border border-amber-200">
            🐦 Stok Siap Pantau
          </span>
          <h2 className="section-title mb-4">Katalog Burung Kicau</h2>
          <p className="text-stone-500 max-w-lg mx-auto">
            Klik <strong className="text-amber-600">Pesan Sekarang</strong> untuk langsung chat WA — pesan otomatis terisi sesuai burung yang dipilih.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {CATEGORIES.map(cat => {
            const count = cat === 'Semua' ? birds.length : birds.filter(b => b.category === cat).length
            const isActive = activeCategory === cat
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-amber-400 hover:text-amber-600'
                }`}
              >
                {cat}
                <span className={`ml-1.5 text-xs ${isActive ? 'opacity-80' : 'opacity-50'}`}>
                  ({count})
                </span>
              </button>
            )
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {filtered.map((bird) => (
            <div key={bird.id} className="card overflow-hidden group flex flex-col">
              {/* Image */}
              <div className="relative overflow-hidden h-36 md:h-44 bg-stone-100 flex-shrink-0">
                <img
                  src={bird.img}
                  alt={bird.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                <span className={`absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full ${categoryStyle[bird.category] ?? 'bg-stone-100 text-stone-600'}`}>
                  {bird.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-3 md:p-4 flex flex-col flex-1">
                <h3 className="font-bold text-stone-900 text-sm md:text-base mb-3 leading-tight flex-1">
                  {bird.name}
                </h3>
                <a
                  href={waLink(bird.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-wa w-full text-xs md:text-sm mt-auto"
                >
                  {WA_ICON}
                  Pesan Sekarang
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-12 bg-[#1a1208] rounded-2xl p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-amber-400 text-lg mb-1">✓ Teliti Sebelum Membeli</p>
              <p className="text-stone-400 text-sm">Semoga Jadi Amanah · Harga Bersahabat Burung Sehat · Rawatlah Burungmu Dengan Kasih Sayang</p>
            </div>
            <a
              href={waLink('burung pilihan')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-wa whitespace-nowrap px-6 py-3 text-sm flex-shrink-0"
            >
              {WA_ICON}
              Tanya Stok Sekarang
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
