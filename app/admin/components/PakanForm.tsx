'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Pakan } from '@/types'

function toTitleCase(str: string): string {
  return str.replace(/(^\w|\s\w)/g, (char) => char.toUpperCase())
}

interface Props {
  pakan?: Pakan
}

export default function PakanForm({ pakan }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [nama, setNama] = useState(pakan?.nama ?? '')
  const [deskripsi, setDeskripsi] = useState(pakan?.deskripsi ?? '')
  const [harga, setHarga] = useState(pakan?.harga ?? 0)
  const [tags, setTags] = useState((pakan?.tags ?? []).join(', '))
  const [tersedia, setTersedia] = useState(pakan?.tersedia ?? true)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(pakan?.gambar_url ?? null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      let gambar_url = pakan?.gambar_url ?? null

      if (file) {
        const ext = file.name.split('.').pop()
        const filename = `pakan_${Date.now()}.${ext}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('produk-images')
          .upload(filename, file, { upsert: true })

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('produk-images')
          .getPublicUrl(uploadData.path)
        gambar_url = publicUrl
      }

      const tagArray = tags.split(',').map((t) => t.trim()).filter(Boolean)

      if (pakan?.id) {
        const { error: dbError } = await supabase
          .from('pakan')
          .update({ nama, deskripsi: deskripsi || null, harga, tersedia, gambar_url, tags: tagArray })
          .eq('id', pakan.id)
        if (dbError) throw dbError
      } else {
        const { error: dbError } = await supabase
          .from('pakan')
          .insert({ nama, deskripsi: deskripsi || null, harga, tersedia, gambar_url, tags: tagArray })
        if (dbError) throw dbError
      }

      router.push('/admin/pakan')
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi kesalahan'
      setError(msg)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 max-w-lg">
      <div className="space-y-5">
        {/* Nama */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1.5">
            Nama Produk <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={nama}
            onChange={(e) => setNama(toTitleCase(e.target.value))}
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            placeholder="cth: Ulat Hongkong"
            required
          />
        </div>

        {/* Harga */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1.5">
            Harga (Rp)
          </label>
          <input
            type="number"
            value={harga || ''}
            onChange={(e) => setHarga(parseInt(e.target.value) || 0)}
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            placeholder="cth: 15000"
            min="0"
          />
          <p className="text-xs text-stone-400 mt-1">Kosongkan jika harga nego / tidak ditampilkan</p>
        </div>

        {/* Deskripsi */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1.5">
            Deskripsi
          </label>
          <textarea
            value={deskripsi}
            onChange={(e) => setDeskripsi(e.target.value)}
            rows={3}
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all resize-none"
            placeholder="Deskripsi singkat produk pakan..."
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1.5">
            Tags
          </label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full border border-stone-200 rounded-xl px-4 py-3 text-stone-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            placeholder="cth: Segar, Protein Tinggi, Kering"
          />
          <p className="text-xs text-stone-400 mt-1">Pisahkan setiap tag dengan koma</p>
        </div>

        {/* Foto */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-1.5">
            Foto Produk
          </label>
          {preview && (
            <div className="mb-3">
              <img
                src={preview}
                alt="Preview"
                className="w-28 h-28 object-cover rounded-xl border border-stone-100"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-stone-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
          />
          <p className="text-xs text-stone-400 mt-1">JPG, PNG, WEBP — maks 5MB</p>
        </div>

        {/* Toggle Tersedia */}
        <div>
          <label className="block text-sm font-semibold text-stone-700 mb-2">
            Ketersediaan
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTersedia(!tersedia)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                tersedia ? 'bg-amber-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ${
                  tersedia ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className={`text-sm font-semibold ${tersedia ? 'text-amber-600' : 'text-stone-400'}`}>
              {tersedia ? 'Tersedia' : 'Tidak Tersedia'}
            </span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="flex gap-2 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-amber-500 text-white py-2 text-sm rounded-lg font-bold hover:bg-amber-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Menyimpan...' : pakan ? 'Simpan Perubahan' : 'Tambah Produk'}
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
