'use client'

import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'

interface Option {
  id: string
  nama: string
  harga: number
}

interface Props {
  options: Option[]
  value: string
  onChange: (id: string, nama: string, harga: number) => void
  placeholder?: string
}

export default function ProductCombobox({ options, value, onChange, placeholder = 'Pilih produk...' }: Props) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [dropPos, setDropPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 })
  const triggerRef = useRef<HTMLButtonElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  const selected = options.find((o) => o.id === value)
  const filtered = query.trim()
    ? options.filter((o) => o.nama.toLowerCase().includes(query.toLowerCase()))
    : options

  function calcPos() {
    if (!triggerRef.current) return
    const r = triggerRef.current.getBoundingClientRect()
    setDropPos({ top: r.bottom + 6, left: r.left, width: r.width })
  }

  useEffect(() => {
    if (!open) return
    calcPos()
    const t = setTimeout(() => searchRef.current?.focus(), 30)

    window.addEventListener('scroll', calcPos, true)
    window.addEventListener('resize', calcPos)
    return () => {
      clearTimeout(t)
      window.removeEventListener('scroll', calcPos, true)
      window.removeEventListener('resize', calcPos)
    }
  }, [open])

  useEffect(() => {
    function onDown(e: MouseEvent) {
      const t = e.target as Node
      if (
        !triggerRef.current?.contains(t) &&
        !dropdownRef.current?.contains(t)
      ) {
        setOpen(false)
        setQuery('')
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  function handleSelect(opt: Option) {
    onChange(opt.id, opt.nama, opt.harga)
    setOpen(false)
    setQuery('')
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation()
    onChange('', '', 0)
  }

  const dropdown = (
    <div
      ref={dropdownRef}
      style={{ position: 'fixed', top: dropPos.top, left: dropPos.left, width: dropPos.width, zIndex: 9999 }}
      className="bg-white rounded-xl border border-stone-200 shadow-2xl overflow-hidden"
    >
      {/* Search input */}
      <div className="p-2.5 border-b border-gray-100">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            ref={searchRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-sm text-stone-800 placeholder-stone-400 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:bg-white transition-all"
            placeholder="Ketik nama untuk cari..."
          />
        </div>
      </div>

      {/* Option list */}
      <div className="max-h-60 overflow-y-auto overscroll-contain">
        {filtered.length === 0 ? (
          <p className="px-4 py-4 text-sm text-stone-400 text-center">
            Tidak ditemukan &ldquo;{query}&rdquo;
          </p>
        ) : (
          filtered.map((opt) => (
            <button
              key={opt.id}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(opt)}
              className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-amber-50 transition-colors ${
                opt.id === value ? 'bg-amber-50' : ''
              }`}
            >
              <span className={`text-sm font-medium truncate ${opt.id === value ? 'text-amber-700' : 'text-stone-700'}`}>
                {opt.id === value && <span className="mr-1.5 text-amber-500 text-xs">✓</span>}
                {opt.nama}
              </span>
              {opt.harga > 0 && (
                <span className="text-xs text-stone-400 flex-shrink-0">
                  Rp {opt.harga.toLocaleString('id-ID')}
                </span>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  )

  return (
    <div>
      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-2 border rounded-xl px-4 py-3 text-sm text-left bg-white transition-all ${
          open
            ? 'border-amber-400 ring-2 ring-amber-400/30'
            : 'border-stone-200 hover:border-stone-300'
        }`}
      >
        <span className={`truncate ${selected ? 'text-stone-800 font-medium' : 'text-stone-400'}`}>
          {selected ? selected.nama : placeholder}
        </span>
        <div className="flex items-center gap-1 flex-shrink-0">
          {selected && (
            <span
              role="button"
              onClick={handleClear}
              className="w-5 h-5 flex items-center justify-center rounded-full text-stone-400 hover:text-stone-700 hover:bg-gray-100 font-bold leading-none transition-colors"
            >
              ×
            </span>
          )}
          <svg
            className={`w-4 h-4 text-stone-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Portal — render di luar DOM tree, melewati overflow:hidden parent */}
      {open && typeof window !== 'undefined' && createPortal(dropdown, document.body)}
    </div>
  )
}
