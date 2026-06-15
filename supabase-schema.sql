-- =============================================
-- USMAN - Usaha Manuk | Supabase Schema
-- Jalankan file ini di Supabase SQL Editor
-- =============================================

-- Tabel Burung
CREATE TABLE IF NOT EXISTS burung (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL,
  kategori TEXT NOT NULL CHECK (kategori IN ('Kicau', 'Aviari', 'Perkutut', 'Lainnya')),
  gambar_url TEXT,
  tersedia BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel Pakan
CREATE TABLE IF NOT EXISTS pakan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL,
  deskripsi TEXT,
  gambar_url TEXT,
  tags TEXT[],
  tersedia BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Aktifkan Row Level Security
ALTER TABLE burung ENABLE ROW LEVEL SECURITY;
ALTER TABLE pakan ENABLE ROW LEVEL SECURITY;

-- Publik bisa baca (untuk tampilan frontend)
CREATE POLICY "Publik bisa baca burung" ON burung
  FOR SELECT USING (true);

CREATE POLICY "Publik bisa baca pakan" ON pakan
  FOR SELECT USING (true);

-- Admin (user yang login) bisa CRUD penuh
CREATE POLICY "Admin akses penuh burung" ON burung
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin akses penuh pakan" ON pakan
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- =============================================
-- STORAGE: Buat bucket "produk-images"
-- Lakukan ini di Supabase > Storage > New Bucket
-- Nama: produk-images | Public: ON
-- =============================================
-- Policy storage untuk upload (authenticated users)
INSERT INTO storage.buckets (id, name, public) VALUES ('produk-images', 'produk-images', true)
  ON CONFLICT DO NOTHING;

CREATE POLICY "Admin bisa upload gambar" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'produk-images');

CREATE POLICY "Admin bisa hapus gambar" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'produk-images');

CREATE POLICY "Publik bisa lihat gambar" ON storage.objects
  FOR SELECT USING (bucket_id = 'produk-images');
