'use client'

import { useState, useEffect } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-sm border-b border-stone-100'}`}>
      <nav className="container-custom py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-xl shadow-sm">🐦</div>
          <div>
            <h1 className="text-xl font-black text-stone-900 leading-none tracking-tight">USMAN</h1>
            <p className="text-xs text-stone-400 font-medium">Usaha Manuk</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#burung" className="text-stone-500 hover:text-amber-600 font-medium transition-colors text-sm">Burung</a>
          <a href="#pakan" className="text-stone-500 hover:text-amber-600 font-medium transition-colors text-sm">Pakan</a>
          <a href="#kontak" className="text-stone-500 hover:text-amber-600 font-medium transition-colors text-sm">Kontak</a>
          <a
            href="https://wa.me/6281287627817"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa px-5 py-2"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Chat WA
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-stone-100 flex flex-col justify-center gap-1.5"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-5 h-0.5 bg-stone-700 transition-all duration-300 origin-center ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}/>
          <span className={`block w-5 h-0.5 bg-stone-700 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}/>
          <span className={`block w-5 h-0.5 bg-stone-700 transition-all duration-300 origin-center ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}/>
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-64' : 'max-h-0'}`}>
        <div className="bg-white border-t border-stone-100 px-4 py-4 space-y-1">
          <a href="#burung" className="flex items-center gap-2 py-3 px-3 rounded-xl text-stone-700 font-medium hover:bg-amber-50" onClick={() => setIsMenuOpen(false)}>🐦 Burung</a>
          <a href="#pakan" className="flex items-center gap-2 py-3 px-3 rounded-xl text-stone-700 font-medium hover:bg-amber-50" onClick={() => setIsMenuOpen(false)}>🌿 Pakan</a>
          <a href="#kontak" className="flex items-center gap-2 py-3 px-3 rounded-xl text-stone-700 font-medium hover:bg-amber-50" onClick={() => setIsMenuOpen(false)}>📞 Kontak</a>
          <a
            href="https://wa.me/6281287627817"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa w-full mt-2"
          >
            💬 Chat WhatsApp
          </a>
        </div>
      </div>
    </header>
  )
}
