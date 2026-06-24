'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const WA_ICON = (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)

const NAV_LINKS = [
  { href: '/#burung',  label: 'Burung',  id: 'burung'  },
  { href: '/#pakan',   label: 'Pakan',   id: 'pakan'   },
  { href: '/#kontak',  label: 'Kontak',  id: 'kontak'  },
]

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observers: IntersectionObserver[] = []
    NAV_LINKS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id) },
        { threshold: 0.35 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach(o => o.disconnect())
  }, [])

  function toggleDark() {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white dark:bg-stone-900 shadow-md'
        : 'bg-white/90 dark:bg-stone-900/90 backdrop-blur-sm border-b border-stone-100 dark:border-stone-800'
    }`}>
      <nav className="container-custom py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1 hover:opacity-90 transition-opacity">
          <img src="/img/bg/usman-logo-3.png" alt="USMAN Logo" className="w-14 h-14 rounded-xl object-cover shadow-sm" />
          <div>
            <h1 className="text-xl font-black text-stone-900 dark:text-stone-100 leading-none tracking-tight">USMAN</h1>
            <p className="text-xs text-stone-400 font-medium">Usaha Manuk</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(({ href, label, id }) => (
            <Link
              key={id}
              href={href}
              className={`font-medium transition-colors text-sm relative py-1 ${
                activeSection === id
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400'
              }`}
            >
              {label}
              {activeSection === id && (
                <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
              )}
            </Link>
          ))}
          <Link href="/tentang-kami" className="text-stone-500 dark:text-stone-400 hover:text-amber-600 dark:hover:text-amber-400 font-medium transition-colors text-sm">
            Tentang
          </Link>

          {/* Dark mode toggle */}
          <button
            onClick={toggleDark}
            className="w-9 h-9 rounded-lg border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-500 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {dark ? '☀️' : '🌙'}
          </button>

          <a
            href="https://wa.me/6281287627817"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-wa px-5 py-2"
          >
            {WA_ICON}
            Chat WA
          </a>
        </div>

        {/* Mobile right: dark toggle + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleDark}
            className="w-9 h-9 rounded-lg border border-stone-200 dark:border-stone-700 flex items-center justify-center text-stone-500 dark:text-stone-400"
            aria-label="Toggle dark mode"
          >
            {dark ? '☀️' : '🌙'}
          </button>
          <button
            className="p-2 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 flex flex-col justify-center gap-1.5"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-stone-700 dark:bg-stone-300 transition-all duration-300 origin-center ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}/>
            <span className={`block w-5 h-0.5 bg-stone-700 dark:bg-stone-300 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}/>
            <span className={`block w-5 h-0.5 bg-stone-700 dark:bg-stone-300 transition-all duration-300 origin-center ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}/>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${isMenuOpen ? 'max-h-72' : 'max-h-0'}`}>
        <div className="bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800 px-4 py-4 space-y-1">
          {NAV_LINKS.map(({ href, label, id }) => (
            <Link
              key={id}
              href={href}
              className={`flex items-center gap-2 py-3 px-3 rounded-xl font-medium ${
                activeSection === id
                  ? 'bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                  : 'text-stone-700 dark:text-stone-300 hover:bg-amber-50 dark:hover:bg-stone-800'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {id === 'burung' ? '🐦' : id === 'pakan' ? '🌿' : '📞'} {label}
            </Link>
          ))}
          <Link href="/tentang-kami" className="flex items-center gap-2 py-3 px-3 rounded-xl text-stone-700 dark:text-stone-300 font-medium hover:bg-amber-50 dark:hover:bg-stone-800" onClick={() => setIsMenuOpen(false)}>
            ℹ️ Tentang Kami
          </Link>
          <a href="https://wa.me/6281287627817" target="_blank" rel="noopener noreferrer" className="btn-wa w-full mt-2">
            💬 Chat WhatsApp
          </a>
        </div>
      </div>
    </header>
  )
}
