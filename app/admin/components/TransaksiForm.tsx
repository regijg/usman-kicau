'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { createPortal } from 'react-dom'
import type { TransaksiWithItems } from '@/types'

function formatRp(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID')
}
function parseAngka(s: string): number {
  return parseInt(s.replace(/\D/g, '')) || 0
}
function formatAngka(n: number): string {
  return n > 0 ? n.toLocaleString('id-ID') : ''
}
function formatTanggalIndo(d: string) {
  return new Date(d + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

type JenisProduk = 'burung' | 'pakan' | 'lainnya'

type CartItem = {
  jenis_produk: JenisProduk
  produk_id: string
  nama_produk: string
  harga: number
  hargaStr: string
  jumlah: number
  gambar_url: string | null
}

type ProdukOption = {
  id: string
  nama: string
  harga: number
  gambar_url: string | null
}

interface Props {
  transaksi?: TransaksiWithItems
}

const STATUS_OPTS = [
  { value: 'Lunas'       as const, label: '✓ Lunas',       active: 'bg-green-500 text-white ring-2 ring-green-200' },
  { value: 'Belum Lunas' as const, label: '⏱ Belum Lunas', active: 'bg-red-500 text-white ring-2 ring-red-200'     },
  { value: 'Titip'       as const, label: '📦 Titip',       active: 'bg-amber-500 text-white ring-2 ring-amber-200' },
]

export default function TransaksiForm({ transaksi }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [namaPembeli, setNamaPembeli] = useState(transaksi?.nama_pembeli ?? '')
  const [tanggal, setTanggal] = useState(transaksi?.tanggal ?? new Date().toLocaleDateString('en-CA'))
  const [status, setStatus] = useState<'Lunas' | 'Belum Lunas' | 'Titip'>(transaksi?.status ?? 'Lunas')
  const [catatan, setCatatan] = useState(transaksi?.catatan ?? '')
  const [diskonInput, setDiskonInput] = useState(transaksi?.diskon ? formatAngka(transaksi.diskon) : '')

  const [cart, setCart] = useState<CartItem[]>(
    transaksi?.transaksi_item.map((i) => ({
      jenis_produk: i.jenis_produk as JenisProduk,
      produk_id: i.produk_id ?? '',
      nama_produk: i.nama_produk,
      harga: i.harga,
      hargaStr: formatAngka(i.harga),
      jumlah: i.jumlah,
      gambar_url: null,
    })) ?? []
  )

  const [burungList, setBurungList] = useState<ProdukOption[]>([])
  const [pakanList, setPakanList] = useState<ProdukOption[]>([])
  const [activeTab, setActiveTab] = useState<JenisProduk>('burung')
  const [customNama, setCustomNama] = useState('')
  const [customHarga, setCustomHarga] = useState('')

  // Checkout bottom sheet
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [checkoutVisible, setCheckoutVisible] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dateInputRef = useRef<HTMLInputElement>(null)

  // Bump animation on cart change
  const [bump, setBump] = useState(false)

  // Portal mount guard (avoids SSR hydration mismatch)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const supabase = createClient()
    supabase.from('burung').select('id, nama, harga, gambar_url').eq('tersedia', true).order('nama')
      .then(({ data }) => { if (data) setBurungList(data as ProdukOption[]) })
    supabase.from('pakan').select('id, nama, harga, gambar_url').eq('tersedia', true).order('nama')
      .then(({ data }) => { if (data) setPakanList(data as ProdukOption[]) })
  }, [])

  const subtotalItems = cart.reduce((sum, i) => sum + i.harga * i.jumlah, 0)
  const diskon = Math.min(parseAngka(diskonInput), subtotalItems)
  const total = subtotalItems - diskon
  const totalItems = cart.reduce((sum, i) => sum + i.jumlah, 0)

  function addToCart(produk: ProdukOption, jenis: 'burung' | 'pakan') {
    setCart((prev) => {
      const idx = prev.findIndex((i) => i.produk_id === produk.id)
      if (idx >= 0) {
        return prev.map((item, i) => i === idx ? { ...item, jumlah: item.jumlah + 1 } : item)
      }
      return [...prev, {
        jenis_produk: jenis,
        produk_id: produk.id,
        nama_produk: produk.nama,
        harga: produk.harga,
        hargaStr: formatAngka(produk.harga),
        jumlah: 1,
        gambar_url: produk.gambar_url,
      }]
    })
    // Bump animation
    setBump(true)
    setTimeout(() => setBump(false), 300)
  }

  function updateQty(idx: number, delta: number) {
    setCart((prev) => {
      const newQty = prev[idx].jumlah + delta
      if (newQty <= 0) return prev.filter((_, i) => i !== idx)
      return prev.map((item, i) => i === idx ? { ...item, jumlah: newQty } : item)
    })
  }

  function updateHargaInput(idx: number, raw: string) {
    const harga = parseInt(raw) || 0
    setCart((prev) => prev.map((item, i) => i === idx ? { ...item, harga, hargaStr: raw } : item))
  }

  function formatHargaInput(idx: number) {
    setCart((prev) => prev.map((item, i) =>
      i === idx ? { ...item, hargaStr: item.harga > 0 ? formatAngka(item.harga) : '' } : item
    ))
  }

  function removeFromCart(idx: number) {
    setCart((prev) => prev.filter((_, i) => i !== idx))
  }

  function addCustomItem() {
    if (!customNama.trim()) return
    const harga = parseAngka(customHarga)
    setCart((prev) => [...prev, {
      jenis_produk: 'lainnya',
      produk_id: '',
      nama_produk: customNama.trim(),
      harga,
      hargaStr: formatAngka(harga),
      jumlah: 1,
      gambar_url: null,
    }])
    setCustomNama('')
    setCustomHarga('')
  }

  function openCheckout() {
    setCheckoutOpen(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setCheckoutVisible(true), 10)
  }

  function closeCheckout() {
    setCheckoutVisible(false)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setCheckoutOpen(false), 320)
  }

  async function handleSubmit(e?: React.FormEvent | React.MouseEvent) {
    e?.preventDefault()
    if (!namaPembeli.trim()) { setError('Nama pembeli wajib diisi'); return }
    if (cart.length === 0) { setError('Keranjang masih kosong'); return }
    setLoading(true)
    setError('')

    try {
      const supabase = createClient()
      const payload = { nama_pembeli: namaPembeli, tanggal, subtotal: subtotalItems, diskon, total, status, catatan: catatan || null }
      const makeItems = (txId: string) =>
        cart.map((item) => ({
          transaksi_id: txId,
          produk_id: item.produk_id || null,
          jenis_produk: item.jenis_produk,
          nama_produk: item.nama_produk,
          harga: item.harga,
          jumlah: item.jumlah,
          subtotal: item.harga * item.jumlah,
        }))

      if (transaksi?.id) {
        const { error: e1 } = await supabase.from('transaksi').update(payload).eq('id', transaksi.id)
        if (e1) throw e1
        await supabase.from('transaksi_item').delete().eq('transaksi_id', transaksi.id)
        const { error: e2 } = await supabase.from('transaksi_item').insert(makeItems(transaksi.id))
        if (e2) throw e2
      } else {
        const { data, error: e1 } = await supabase.from('transaksi').insert(payload).select().single()
        if (e1 || !data) throw e1 ?? new Error('Gagal membuat transaksi')
        const { error: e2 } = await supabase.from('transaksi_item').insert(makeItems(data.id))
        if (e2) throw e2
      }

      router.push('/admin/transaksi')
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan')
      setLoading(false)
    }
  }

  const produkList = activeTab === 'burung' ? burungList : pakanList

  // ── Checkout form (shared by desktop cart panel + mobile sheet) ──
  const CheckoutForm = (
    <div className="flex flex-col h-full">
      {/* Cart items */}
      <div className="flex-1 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-stone-300 py-12">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            <p className="text-sm font-semibold">Keranjang kosong</p>
            <p className="text-xs">Klik produk untuk menambah</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {cart.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 px-4 py-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-amber-50 flex items-center justify-center text-lg">
                  {item.gambar_url
                    ? <img src={item.gambar_url} alt={item.nama_produk} className="w-full h-full object-cover" />
                    : <span>{item.jenis_produk === 'burung' ? '🐦' : item.jenis_produk === 'pakan' ? '🌾' : '📦'}</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-stone-800 truncate">{item.nama_produk}</p>
                  <div className="relative mt-0.5">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400 pointer-events-none">Rp</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={item.hargaStr}
                      placeholder="0"
                      className={`w-full pl-6 pr-2 py-1 text-xs rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-400 focus:border-transparent transition-colors ${
                        item.harga === 0
                          ? 'border border-amber-300 bg-amber-50 placeholder-amber-300'
                          : 'border border-stone-100 bg-transparent placeholder-stone-300 hover:border-stone-200'
                      }`}
                      onChange={(e) => updateHargaInput(idx, e.target.value.replace(/\D/g, ''))}
                      onBlur={() => formatHargaInput(idx)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); (e.target as HTMLInputElement).blur() } }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button type="button" onClick={() => updateQty(idx, -1)}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-red-50 hover:text-red-500 text-stone-600 font-bold text-sm transition-colors">
                    −
                  </button>
                  <span className="w-5 text-center text-sm font-black text-stone-800">{item.jumlah}</span>
                  <button type="button" onClick={() => updateQty(idx, +1)}
                    className="w-7 h-7 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-700 font-bold text-sm transition-colors">
                    +
                  </button>
                </div>
                <div className="flex-shrink-0 text-right w-20">
                  <p className="text-sm font-black text-amber-700">{formatRp(item.harga * item.jumlah)}</p>
                  <button type="button" onClick={() => removeFromCart(idx)}
                    className="text-[10px] text-stone-300 hover:text-red-400 font-semibold transition-colors">
                    hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form fields + totals */}
      <div className="border-t border-gray-100 p-4 space-y-3 flex-shrink-0">
        <input type="text" value={namaPembeli} onChange={(e) => setNamaPembeli(e.target.value)}
          className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
          placeholder="Nama pembeli *" required />

        <div className="grid grid-cols-2 gap-2">
          <div className="relative">
            <button type="button" onClick={() => dateInputRef.current?.showPicker()}
              className="w-full border border-stone-200 rounded-xl px-3 py-2.5 text-sm text-left text-stone-700 hover:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all bg-white">
              📅 {formatTanggalIndo(tanggal)}
            </button>
            <input ref={dateInputRef} type="date" value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="absolute inset-0 opacity-0 pointer-events-none" tabIndex={-1} />
          </div>
          <input type="text" value={catatan} onChange={(e) => setCatatan(e.target.value)}
            className="border border-stone-200 rounded-xl px-3 py-2.5 text-sm placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
            placeholder="Catatan..." />
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {STATUS_OPTS.map((s) => (
            <button key={s.value} type="button" onClick={() => setStatus(s.value)}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${
                status === s.value ? s.active : 'bg-gray-50 text-stone-500 border border-stone-200 hover:bg-gray-100'
              }`}>
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-stone-500 flex-shrink-0">Diskon</span>
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 pointer-events-none">Rp</span>
            <input type="text" inputMode="numeric" value={diskonInput}
              onChange={(e) => setDiskonInput(e.target.value.replace(/\D/g, ''))}
              onBlur={(e) => { const n = parseAngka(e.target.value); setDiskonInput(n > 0 ? formatAngka(n) : '') }}
              className="w-full border border-stone-200 rounded-xl pl-9 pr-3 py-2.5 text-sm placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              placeholder="0" />
          </div>
        </div>

        <div className="bg-amber-50 rounded-xl px-4 py-3 space-y-1.5 border border-amber-100">
          {diskon > 0 && (
            <>
              <div className="flex justify-between text-xs text-stone-500">
                <span>Subtotal</span><span>{formatRp(subtotalItems)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-500">Diskon</span>
                <span className="text-red-500 font-semibold">− {formatRp(diskon)}</span>
              </div>
            </>
          )}
          <div className="flex justify-between items-center">
            <span className="font-bold text-stone-800 text-sm">Total</span>
            <span className="text-2xl font-black text-amber-600">{formatRp(total)}</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs px-3 py-2.5 rounded-xl border border-red-100">
            ⚠ {error}
          </div>
        )}

        <button type="button" onClick={handleSubmit} disabled={loading || cart.length === 0}
          className="w-full bg-amber-500 text-white py-3.5 rounded-xl font-bold hover:bg-amber-600 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-sm">
          {loading ? 'Menyimpan...' : transaksi ? 'Simpan Perubahan' : '🧾 Buat Transaksi'}
        </button>
      </div>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">

      {/* ── Desktop: split layout ── */}
      <div className="hidden lg:flex gap-4" style={{ height: 'calc(100svh - 11rem)', minHeight: '560px' }}>
        {/* Left: Product grid */}
        <div className="flex flex-col flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <ProductGrid
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            burungList={burungList}
            pakanList={pakanList}
            cart={cart}
            onAdd={addToCart}
            customNama={customNama}
            setCustomNama={setCustomNama}
            customHarga={customHarga}
            setCustomHarga={setCustomHarga}
            onAddCustom={addCustomItem}
          />
        </div>
        {/* Right: Cart + form */}
        <div className="flex flex-col w-80 xl:w-96 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Pesanan</p>
            {cart.length > 0 && (
              <button type="button" onClick={() => setCart([])}
                className="text-xs text-red-400 hover:text-red-600 font-semibold">
                Kosongkan
              </button>
            )}
          </div>
          {CheckoutForm}
        </div>
      </div>

      {/* ── Mobile: full-width product grid ── */}
      <div className="lg:hidden flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
        style={{ height: 'calc(100svh - 10rem)', minHeight: '480px' }}>
        <ProductGrid
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          burungList={burungList}
          pakanList={pakanList}
          cart={cart}
          onAdd={addToCart}
          customNama={customNama}
          setCustomNama={setCustomNama}
          customHarga={customHarga}
          setCustomHarga={setCustomHarga}
          onAddCustom={addCustomItem}
        />
      </div>

      {/* ── Mobile sticky checkout bar ── */}
      {mounted && createPortal(
        <div className={`lg:hidden fixed bottom-0 inset-x-0 z-40 px-4 pb-5 transition-all duration-300 ${
          cart.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}>
          <button
            type="button"
            onClick={openCheckout}
            className={`w-full bg-amber-500 text-white rounded-2xl shadow-xl flex items-center justify-between px-5 py-4 transition-transform ${
              bump ? 'scale-[1.03]' : 'scale-100'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center text-sm font-black">
                {totalItems}
              </span>
              <span className="font-bold text-sm">Checkout</span>
            </div>
            <span className="font-black text-base">{formatRp(total)}</span>
          </button>
        </div>,
        document.body
      )}

      {/* ── Mobile checkout bottom sheet ── */}
      {checkoutOpen && mounted && createPortal(
        <div className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 transition-opacity duration-300"
            style={{ opacity: checkoutVisible ? 1 : 0 }}
            onClick={closeCheckout}
          />

          {/* Sheet */}
          <div
            className="relative bg-white rounded-t-3xl shadow-2xl flex flex-col transition-transform duration-300 ease-out"
            style={{
              transform: checkoutVisible ? 'translateY(0)' : 'translateY(100%)',
              maxHeight: '90svh',
            }}
          >
            {/* Handle + header */}
            <div className="flex-shrink-0">
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 bg-gray-200 rounded-full" />
              </div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                <div>
                  <p className="font-black text-stone-800">Pesanan</p>
                  <p className="text-xs text-stone-400">{totalItems} item · {formatRp(subtotalItems)}</p>
                </div>
                <button type="button" onClick={closeCheckout}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-stone-500 font-bold text-sm">
                  ✕
                </button>
              </div>
            </div>

            {/* CheckoutForm handles its own internal scroll — wrapper only sets height */}
            <div className="flex-1 min-h-0">
              {CheckoutForm}
            </div>
          </div>
        </div>,
        document.body
      )}

    </form>
  )
}

// ── Product Grid sub-component ──
function ProductGrid({
  activeTab, setActiveTab,
  burungList, pakanList, cart, onAdd,
  customNama, setCustomNama, customHarga, setCustomHarga, onAddCustom,
}: {
  activeTab: JenisProduk
  setActiveTab: (t: JenisProduk) => void
  burungList: ProdukOption[]
  pakanList: ProdukOption[]
  cart: CartItem[]
  onAdd: (p: ProdukOption, j: 'burung' | 'pakan') => void
  customNama: string
  setCustomNama: (v: string) => void
  customHarga: string
  setCustomHarga: (v: string) => void
  onAddCustom: () => void
}) {
  const produkList = activeTab === 'burung' ? burungList : pakanList

  return (
    <>
      {/* Tab bar */}
      <div className="flex gap-1 p-2.5 border-b border-gray-100 bg-gray-50 flex-shrink-0">
        {(['burung', 'pakan', 'lainnya'] as const).map((tab) => (
          <button key={tab} type="button" onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab
                ? 'bg-white text-amber-700 shadow-sm border border-amber-200'
                : 'text-stone-500 hover:text-stone-700 hover:bg-white/60'
            }`}>
            {tab === 'burung' ? '🐦 Burung' : tab === 'pakan' ? '🌾 Pakan' : '📦 Lainnya'}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="flex-1 overflow-y-auto p-3">
        {activeTab !== 'lainnya' ? (
          produkList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-stone-300 gap-2">
              <span className="text-4xl">{activeTab === 'burung' ? '🐦' : '🌾'}</span>
              <p className="text-sm">Belum ada produk tersedia</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5">
              {produkList.map((produk) => {
                const inCart = cart.find((i) => i.produk_id === produk.id)
                return (
                  <button
                    key={produk.id}
                    type="button"
                    onClick={() => onAdd(produk, activeTab as 'burung' | 'pakan')}
                    className={`relative flex flex-col rounded-xl border text-left overflow-hidden bg-white group active:scale-[0.96] transition-all ${
                      inCart ? 'border-amber-300 shadow-md shadow-amber-100' : 'border-gray-100 hover:border-amber-200 hover:shadow-md'
                    }`}
                  >
                    {/* Badge qty */}
                    {inCart && (
                      <span className="absolute top-2 right-2 z-10 min-w-[1.5rem] h-6 px-1.5 bg-amber-500 text-white text-xs font-black rounded-full flex items-center justify-center shadow-sm">
                        {inCart.jumlah}
                      </span>
                    )}
                    {/* Image */}
                    <div className="w-full aspect-square bg-amber-50/40 overflow-hidden">
                      {produk.gambar_url ? (
                        <img src={produk.gambar_url} alt={produk.nama}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          {activeTab === 'burung' ? '🐦' : '🌾'}
                        </div>
                      )}
                    </div>
                    {/* Info */}
                    <div className="p-2.5">
                      <p className="text-xs font-semibold text-stone-700 line-clamp-2 leading-tight min-h-[2.4em]">
                        {produk.nama}
                      </p>
                      <p className={`text-xs font-black mt-1 ${inCart ? 'text-amber-600' : 'text-stone-500'}`}>
                        {produk.harga > 0 ? formatRp(produk.harga) : 'Nego'}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>
          )
        ) : (
          <div className="max-w-sm space-y-3">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Item Manual</p>
            <input type="text" value={customNama} onChange={(e) => setCustomNama(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onAddCustom())}
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              placeholder="cth: Kandang, Ongkir, dll." />
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 pointer-events-none">Rp</span>
              <input type="text" inputMode="numeric" value={customHarga}
                onChange={(e) => setCustomHarga(e.target.value.replace(/\D/g, ''))}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), onAddCustom())}
                className="w-full border border-stone-200 rounded-xl pl-9 pr-4 py-3 text-sm placeholder-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                placeholder="0" />
            </div>
            <button type="button" onClick={onAddCustom} disabled={!customNama.trim()}
              className="w-full bg-stone-700 text-white py-3 rounded-xl text-sm font-bold hover:bg-stone-800 transition-colors disabled:opacity-40">
              + Tambah ke Keranjang
            </button>
          </div>
        )}
      </div>
    </>
  )
}
