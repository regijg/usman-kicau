'use client'

import { useState, useRef } from 'react'
import { tambahPembayaran, hapusPembayaran } from '../actions'
import type { Pembayaran } from '@/types'

function formatRp(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID')
}
function parseAngka(s: string): number {
  return parseInt(s.replace(/\D/g, '')) || 0
}
function formatAngka(n: number): string {
  return n > 0 ? n.toLocaleString('id-ID') : ''
}
function formatTanggal(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

interface Props {
  transaksiId: string
  total: number
  pembayaran: Pembayaran[]
  status: 'Lunas' | 'Belum Lunas' | 'Titip'
}

export default function PembayaranForm({ transaksiId, total, pembayaran, status }: Props) {
  const [jumlahInput, setJumlahInput] = useState('')
  const [tanggal, setTanggal] = useState(new Date().toLocaleDateString('en-CA'))
  const [catatan, setCatatan] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const dateInputRef = useRef<HTMLInputElement>(null)

  const totalBayar = pembayaran.reduce((sum, p) => sum + p.jumlah, 0)
  const sisa = total - totalBayar
  // Lunas tunai = status Lunas tapi belum ada riwayat cicilan
  const lunasTunai = status === 'Lunas' && pembayaran.length === 0
  const persen = lunasTunai ? 100 : total > 0 ? Math.min(100, Math.round((totalBayar / total) * 100)) : 0
  const sudahLunas = sisa <= 0 || lunasTunai

  async function handleTambah(e: React.FormEvent) {
    e.preventDefault()
    const jumlah = parseAngka(jumlahInput)
    if (!jumlah) { setError('Jumlah pembayaran wajib diisi'); return }
    if (jumlah > sisa) { setError(`Melebihi sisa tagihan ${formatRp(sisa)}`); return }

    setLoading(true)
    setError('')
    try {
      await tambahPembayaran(transaksiId, jumlah, tanggal, catatan || null)
      setJumlahInput('')
      setCatatan('')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  async function handleHapus(id: string) {
    if (!confirm('Hapus catatan pembayaran ini?')) return
    await hapusPembayaran(id, transaksiId)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-5">
      <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">Pembayaran</h2>

      {/* Progress */}
      <div className="mb-5">
        <div className="flex justify-between text-xs font-semibold mb-1.5">
          <span className="text-stone-500">Sudah dibayar</span>
          <span className={sudahLunas ? 'text-green-600' : 'text-amber-600'}>{persen}%</span>
        </div>
        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${sudahLunas ? 'bg-green-500' : 'bg-amber-400'}`}
            style={{ width: `${persen}%` }}
          />
        </div>
        {lunasTunai ? (
          <div className="flex justify-between mt-2">
            <div className="text-center">
              <p className="text-[10px] text-stone-400 font-semibold uppercase">Tagihan</p>
              <p className="text-sm font-black text-stone-700">{formatRp(total)}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-stone-400 font-semibold uppercase">Metode</p>
              <p className="text-sm font-black text-green-600">Tunai</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-stone-400 font-semibold uppercase">Sisa</p>
              <p className="text-sm font-black text-green-600">Lunas ✓</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-between mt-2">
            <div className="text-center">
              <p className="text-[10px] text-stone-400 font-semibold uppercase">Tagihan</p>
              <p className="text-sm font-black text-stone-700">{formatRp(total)}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-stone-400 font-semibold uppercase">Dibayar</p>
              <p className="text-sm font-black text-green-600">{formatRp(totalBayar)}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-stone-400 font-semibold uppercase">Sisa</p>
              <p className={`text-sm font-black ${sisa > 0 ? 'text-red-500' : 'text-green-600'}`}>
                {sisa > 0 ? formatRp(sisa) : 'Lunas ✓'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Riwayat pembayaran */}
      {pembayaran.length > 0 && (
        <div className="mb-5 space-y-2">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">Riwayat</p>
          {pembayaran.map((p, i) => (
            <div key={p.id} className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-black text-stone-800">{formatRp(p.jumlah)}</p>
                  <p className="text-xs text-stone-400">{formatTanggal(p.tanggal)}{p.catatan ? ` · ${p.catatan}` : ''}</p>
                </div>
              </div>
              <button
                onClick={() => handleHapus(p.id)}
                className="text-xs text-stone-300 hover:text-red-400 font-semibold transition-colors flex-shrink-0"
              >
                hapus
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Form tambah pembayaran */}
      {!sudahLunas && (
        <form onSubmit={handleTambah} className="space-y-3 border-t border-gray-100 pt-4">
          <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">+ Catat Pembayaran</p>

          <div className="grid grid-cols-2 gap-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 pointer-events-none">Rp</span>
              <input
                type="text"
                inputMode="numeric"
                value={jumlahInput}
                onChange={(e) => setJumlahInput(e.target.value.replace(/\D/g, ''))}
                onBlur={(e) => { const n = parseAngka(e.target.value); setJumlahInput(n > 0 ? formatAngka(n) : '') }}
                placeholder="Jumlah *"
                className="w-full pl-9 pr-3 py-2.5 border border-stone-200 rounded-xl text-sm placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              />
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => dateInputRef.current?.showPicker()}
                className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-left text-stone-700 hover:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all bg-white"
              >
                📅 {formatTanggal(tanggal)}
              </button>
              <input
                ref={dateInputRef}
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="absolute inset-0 opacity-0 pointer-events-none"
                tabIndex={-1}
              />
            </div>
          </div>

          <input
            type="text"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Catatan (opsional, cth: DP, Pelunasan, Transfer)"
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
          />

          {/* Shortcut bayar lunas */}
          {sisa > 0 && (
            <button
              type="button"
              onClick={() => setJumlahInput(formatAngka(sisa))}
              className="text-xs text-amber-600 hover:text-amber-800 font-semibold"
            >
              Isi sisa tagihan → {formatRp(sisa)}
            </button>
          )}

          {error && (
            <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-xl">⚠ {error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 text-white py-3 rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors disabled:opacity-50"
          >
            {loading ? 'Menyimpan...' : '💰 Catat Pembayaran'}
          </button>
        </form>
      )}

      {sudahLunas && (
        <div className="border-t border-gray-100 pt-4 text-center">
          {lunasTunai ? (
            <p className="text-sm text-green-600 font-bold">✓ Lunas — dibayar tunai</p>
          ) : (
            <p className="text-sm text-green-600 font-bold">✓ Transaksi ini sudah lunas</p>
          )}
        </div>
      )}
    </div>
  )
}
