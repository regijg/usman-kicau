'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { href: '/admin/burung', label: 'Burung', icon: '🐦', exact: false },
  { href: '/admin/pakan', label: 'Pakan', icon: '🌾', exact: false },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  function isActive(item: (typeof navItems)[0]) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href)
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-100 hidden lg:flex flex-col z-40">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🐦</span>
            <div>
              <h1 className="font-black text-stone-900 text-lg leading-tight">USMAN</h1>
              <p className="text-xs text-stone-400">Panel Admin</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                isActive(item)
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-stone-600 hover:bg-gray-50 hover:text-stone-900'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-stone-500 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
          >
            <span>🚪</span>
            {loggingOut ? 'Keluar...' : 'Keluar'}
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-100 z-50 h-14 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🐦</span>
          <span className="font-black text-stone-900 text-sm">USMAN Admin</span>
        </div>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
          aria-label="Menu"
        >
          {menuOpen ? (
            <span className="text-stone-600 font-bold text-lg leading-none">✕</span>
          ) : (
            <div className="space-y-1.5">
              <div className="w-5 h-0.5 bg-stone-600 rounded" />
              <div className="w-5 h-0.5 bg-stone-600 rounded" />
              <div className="w-5 h-0.5 bg-stone-600 rounded" />
            </div>
          )}
        </button>
      </header>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="lg:hidden fixed top-14 left-0 right-0 bg-white border-b border-gray-100 z-40 shadow-lg">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  isActive(item) ? 'bg-amber-50 text-amber-700' : 'text-stone-600 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-stone-500 hover:text-red-600 transition-colors"
            >
              <span>🚪</span>
              Keluar
            </button>
          </nav>
        </div>
      )}
    </>
  )
}
