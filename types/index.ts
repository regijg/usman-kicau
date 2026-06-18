export interface Burung {
  id: string
  nama: string
  kategori: 'Kicau' | 'Aviari' | 'Masteran' | 'Lainnya'
  gambar_url: string | null
  tersedia: boolean
  created_at: string
}

export interface Pakan {
  id: string
  nama: string
  deskripsi: string | null
  gambar_url: string | null
  tags: string[] | null
  tersedia: boolean
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
