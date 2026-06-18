'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Testimoni } from '@/types'

interface Props {
  testimoni?: Testimoni
}

export default function TestimoniForm({ testimoni }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [nama, setNama] = useState(testimoni?.nama ?? '')
  const [pesan, setPesan] = useState(testimoni?.pesan ?? '')
  const [bintang, setBintang] = useState(testimoni?.bintang ?? 5)
  const [produk, setProduk] = useState(testimoni?.produk ?? '')
  const [aktif, setAktif] = useState(testimoni?.aktif ?? true)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const supabase = createClient()
      const payload = { nama, pesan, bintang, produk: produk.trim() || null, aktif }

      if (testimoni?.id) {
        const { error: dbError } = await supabase.from('testimoni').update(payload).eq('id', testimoni.id)
        if (dbError) throw dbError
      } else {
        const { error: dbError } = await supabase.from('testimoni').insert(payload)
        if (dbError) throw dbError
      }

      router.push('/admin/testimoni')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-lg">
      <div className="space-y-5">
        {/* Nama */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1.5">
            Nama Pelanggan <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={nama}
            onChange={e => setNama(e.target.value)}
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            placeholder="cth: Budi Santoso"
            required
          />
        </div>

        {/* Pesan */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1.5">
            Testimoni <span className="text-red-400">*</span>
          </label>
          <textarea
            value={pesan}
            onChange={e => setPesan(e.target.value)}
            rows={4}
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all resize-none"
            placeholder="Tuliskan ulasan pelanggan di sini..."
            required
          />
        </div>

        {/* Bintang */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">
            Rating Bintang
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setBintang(n)}
                className={`text-2xl transition-all ${n <= bintang ? 'opacity-100' : 'opacity-25'} hover:scale-110`}
              >
                ⭐
              </button>
            ))}
            <span className="ml-2 text-sm text-stone-500 self-center">{bintang}/5</span>
          </div>
        </div>

        {/* Produk */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1.5">
            Produk yang Dibeli <span className="text-stone-400 font-normal">(opsional)</span>
          </label>
          <input
            type="text"
            value={produk}
            onChange={e => setProduk(e.target.value)}
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            placeholder="cth: Kenari, Murai Batu, Jangkrik..."
          />
        </div>

        {/* Aktif toggle */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">Status Tampil</label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setAktif(!aktif)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${aktif ? 'bg-amber-500' : 'bg-gray-200'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${aktif ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm font-semibold ${aktif ? 'text-amber-600' : 'text-stone-400'}`}>
              {aktif ? 'Ditampilkan di website' : 'Disembunyikan'}
            </span>
          </div>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-amber-500 text-white py-2 text-sm rounded-lg font-bold hover:bg-amber-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Menyimpan...' : testimoni ? 'Simpan Perubahan' : 'Tambah Testimoni'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm border border-stone-200 rounded-lg font-semibold text-stone-600 hover:bg-gray-50 transition-colors"
          >
            Batal
          </button>
        </div>
      </div>
    </form>
  )
}
