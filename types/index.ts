export interface Burung {
  id: string
  nama: string
  kategori: 'Kicau' | 'Aviari' | 'Masteran' | 'Lainnya'
  gambar_url: string | null
  tersedia: boolean
  harga: number
  created_at: string
}

export interface Pakan {
  id: string
  nama: string
  deskripsi: string | null
  gambar_url: string | null
  tags: string[] | null
  tersedia: boolean
  harga: number
  created_at: string
}

export interface Testimoni {
  id: string
  nama: string
  pesan: string
  bintang: number
  produk: string | null
  aktif: boolean
  created_at: string
}

export interface Transaksi {
  id: string
  nama_pembeli: string
  tanggal: string
  subtotal: number
  diskon: number
  total: number
  status: 'Lunas' | 'Belum Lunas' | 'Titip'
  catatan: string | null
  created_at: string
}

export interface TransaksiItem {
  id: string
  transaksi_id: string
  produk_id: string | null
  jenis_produk: 'burung' | 'pakan' | 'lainnya'
  nama_produk: string
  harga: number
  jumlah: number
  subtotal: number
}

export interface Pembayaran {
  id: string
  transaksi_id: string
  jumlah: number
  tanggal: string
  catatan: string | null
  created_at: string
}

export interface TransaksiWithItems extends Transaksi {
  transaksi_item: TransaksiItem[]
  pembayaran: Pembayaran[]
}
