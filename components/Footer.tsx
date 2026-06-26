import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#0f0b05] text-stone-500">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center mb-4 hover:opacity-90 transition-opacity w-fit">
              <img src="/img/bg/usman-logo-3.png" alt="USMAN" className="w-16 h-16 rounded-xl object-cover shadow-md" />
              <div>
                <h3 className="text-base font-black text-white tracking-tight">USMAN</h3>
                <p className="text-xs text-stone-600">Usaha Manuk</p>
              </div>
            </Link>
            <p className="text-sm leading-relaxed">
              Penyedia burung kicau dan pakan berkualitas dengan harga terjangkau. Grosir dan ecer langsung dari tangan pertama.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold text-stone-300 mb-4 text-sm uppercase tracking-wide">Navigasi</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/#burung" className="hover:text-amber-400 transition-colors flex items-center gap-2"><span className="text-stone-700">›</span> Koleksi Burung</Link></li>
              <li><Link href="/#pakan" className="hover:text-amber-400 transition-colors flex items-center gap-2"><span className="text-stone-700">›</span> Pakan Burung</Link></li>
              <li><Link href="/#kontak" className="hover:text-amber-400 transition-colors flex items-center gap-2"><span className="text-stone-700">›</span> Hubungi Kami</Link></li>
              <li><Link href="/tentang-kami" className="hover:text-amber-400 transition-colors flex items-center gap-2"><span className="text-stone-700">›</span> Tentang Kami</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-amber-400 transition-colors flex items-center gap-2"><span className="text-stone-700">›</span> Kebijakan Privasi</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-stone-300 mb-4 text-sm uppercase tracking-wide">Kontak</h4>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <span>📲</span>
                <a href="https://wa.me/6281287627817" className="text-amber-500 font-bold hover:text-amber-400 transition-colors">
                  0812-8762-7817
                </a>
              </li>
              <li className="flex items-start gap-2">
                <span>📍</span>
                <span>Ujung Berung Batim,<br/>Jl. Ciwaru RT02/RW01</span>
              </li>
              <li className="flex items-center gap-2">
                <span>⏰</span>
                <span>Buka 24 Jam Sehudangna</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-stone-700">
          <p>© 2025 USMAN - Usaha Manuk. Semoga Jadi Amanah 🐦</p>
          <div className="flex items-center gap-4">
            <Link href="/tentang-kami" className="hover:text-stone-500 transition-colors">Tentang Kami</Link>
            <span>·</span>
            <Link href="/privacy-policy" className="hover:text-stone-500 transition-colors">Kebijakan Privasi</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
