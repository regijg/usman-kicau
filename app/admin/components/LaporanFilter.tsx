'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export type LaporanMode = 'minggu' | 'bulan' | 'tahun' | 'custom'

const TABS: { mode: LaporanMode; label: string }[] = [
  { mode: 'minggu', label: 'Minggu' },
  { mode: 'bulan',  label: 'Bulan'  },
  { mode: 'tahun',  label: 'Tahun'  },
  { mode: 'custom', label: 'Range'  },
]

interface Props {
  mode: LaporanMode
  label: string
  prevHref: string
  nextHref: string
  defaultDari: string
  defaultSampai: string
}

export default function LaporanFilter({ mode, label, prevHref, nextHref, defaultDari, defaultSampai }: Props) {
  const router = useRouter()
  const [dari, setDari]     = useState(defaultDari)
  const [sampai, setSampai] = useState(defaultSampai)

  function handleRange(e: React.FormEvent) {
    e.preventDefault()
    if (!dari || !sampai) return
    if (sampai < dari) { setSampai(dari); return }
    router.push(`/admin/laporan?mode=custom&dari=${dari}&sampai=${sampai}`)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
      {/* Mode tabs */}
      <div className="flex gap-1 bg-gray-50 p-1 rounded-xl mb-4">
        {TABS.map((tab) => (
          <Link
            key={tab.mode}
            href={`/admin/laporan?mode=${tab.mode}`}
            className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${
              mode === tab.mode
                ? 'bg-white text-amber-700 shadow-sm border border-amber-100'
                : 'text-stone-500 hover:text-stone-700'
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {/* Navigation or date range */}
      {mode !== 'custom' ? (
        <div className="flex items-center justify-between gap-3">
          <Link
            href={prevHref}
            className="px-3 py-2 rounded-xl border border-stone-200 text-stone-500 hover:bg-gray-50 text-sm font-semibold transition-colors flex-shrink-0"
          >
            ←
          </Link>
          <span className="text-sm font-bold text-stone-700 text-center flex-1">{label}</span>
          <Link
            href={nextHref}
            className="px-3 py-2 rounded-xl border border-stone-200 text-stone-500 hover:bg-gray-50 text-sm font-semibold transition-colors flex-shrink-0"
          >
            →
          </Link>
        </div>
      ) : (
        <form onSubmit={handleRange} className="flex flex-wrap items-end gap-2">
          <div className="flex flex-col gap-1 flex-1 min-w-[130px]">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Dari</label>
            <input
              type="date"
              value={dari}
              onChange={(e) => setDari(e.target.value)}
              className="border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-[130px]">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Sampai</label>
            <input
              type="date"
              value={sampai}
              min={dari}
              onChange={(e) => setSampai(e.target.value)}
              className="border border-stone-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            />
          </div>
          <button
            type="submit"
            className="bg-amber-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-amber-600 transition-colors flex-shrink-0"
          >
            Tampilkan
          </button>
        </form>
      )}
    </div>
  )
}
