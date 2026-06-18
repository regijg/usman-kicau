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

-- =============================================
-- Tabel Testimoni
-- =============================================

CREATE TABLE IF NOT EXISTS testimoni (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama TEXT NOT NULL,
  pesan TEXT NOT NULL,
  bintang SMALLINT NOT NULL DEFAULT 5 CHECK (bintang BETWEEN 1 AND 5),
  produk TEXT,
  aktif BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE testimoni ENABLE ROW LEVEL SECURITY;

-- Publik hanya bisa baca yang aktif
CREATE POLICY "Publik bisa baca testimoni aktif" ON testimoni
  FOR SELECT USING (aktif = true);

-- Admin bisa akses semua
CREATE POLICY "Admin akses penuh testimoni" ON testimoni
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- =============================================
-- Sample Data Testimoni (3 contoh)
-- Jalankan setelah membuat tabel
-- =============================================

INSERT INTO testimoni (nama, pesan, bintang, produk) VALUES
(
  'Budi Santoso',
  'Alhamdulillah burung kenarinya sehat dan sudah mulai gacor sejak minggu pertama. Pelayanannya ramah dan respon WA cepat banget. Pasti balik lagi!',
  5,
  'Kenari'
),
(
  'Siti Rahayu',
  'Murai batunya bagus banget, kondisi prima dan sehat. Packing aman sampai rumah walaupun jauh. Terima kasih USMAN, sudah jadi langganan tetap!',
  5,
  'Murai Batu'
),
(
  'Ahmad Fauzi',
  'Udah langganan beli jangkrik dan voer di sini beberapa bulan. Selalu fresh, stok selalu ada, dan harga paling bersahabat. Recommended buat semua kicau mania!',
  5,
  'Jangkrik & Voer'
),
(
  'Rizky Pratama',
  'Lovebird sepasangnya aktif dan sehat banget, warnanya juga bagus. Harga jauh lebih murah dibanding toko lain. Pengiriman juga aman pakai packing khusus burung.',
  5,
  'Lovebird'
),
(
  'Dewi Lestari',
  'Pertama kali beli di USMAN, langsung cocok. Cucak ijonya sudah mulai bunyi dari hari ketiga. Penjual juga kasih tips perawatan gratis lewat WA. Mantap!',
  5,
  'Cucak Ijo'
),
(
  'Hendra Wijaya',
  'Beli kroto sama ulat hongkong rutin tiap minggu. Selalu segar dan burung makin gacor. Respon cepat, harga stabil, tidak pernah zonk. Top markotop!',
  5,
  'Kroto & Ulat Hongkong'
);
