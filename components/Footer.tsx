export default function Footer() {
  return (
    <footer className="bg-[#0f0b05] text-stone-500">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-xl shadow-md">🐦</div>
              <div>
                <h3 className="text-xl font-black text-white tracking-tight">USMAN</h3>
                <p className="text-xs text-stone-600">Usaha Manuk</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed">
              Penyedia burung kicau dan pakan berkualitas dengan harga terjangkau. Grosir dan ecer langsung dari tangan pertama.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold text-stone-300 mb-4 text-sm uppercase tracking-wide">Navigasi</h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#burung" className="hover:text-amber-400 transition-colors flex items-center gap-2"><span className="text-stone-700">›</span> Koleksi Burung</a></li>
              <li><a href="#pakan" className="hover:text-amber-400 transition-colors flex items-center gap-2"><span className="text-stone-700">›</span> Pakan Burung</a></li>
              <li><a href="#kontak" className="hover:text-amber-400 transition-colors flex items-center gap-2"><span className="text-stone-700">›</span> Hubungi Kami</a></li>
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
          <p>Rawatlah Burungmu Dengan Penuh Kasih Sayang ❤️</p>
        </div>
      </div>
    </footer>
  )
}
