export interface Burung {
  id: string
  nama: string
  kategori: 'Kicau' | 'Aviari' | 'Perkutut' | 'Lainnya'
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
