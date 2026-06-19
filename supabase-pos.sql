-- =============================================
-- USMAN - POS (Point of Sale) Migration
-- Jalankan di Supabase > SQL Editor
-- =============================================

-- Tambah kolom harga ke burung (jika belum ada)
ALTER TABLE burung ADD COLUMN IF NOT EXISTS harga INTEGER DEFAULT 0;

-- Tambah kolom harga ke pakan (jika belum ada)
ALTER TABLE pakan ADD COLUMN IF NOT EXISTS harga INTEGER DEFAULT 0;

-- =============================================
-- Tabel Transaksi
-- =============================================
CREATE TABLE IF NOT EXISTS transaksi (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_pembeli TEXT NOT NULL,
  tanggal DATE NOT NULL DEFAULT CURRENT_DATE,
  subtotal INTEGER NOT NULL DEFAULT 0,
  diskon INTEGER NOT NULL DEFAULT 0,
  total INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Lunas' CHECK (status IN ('Lunas', 'Belum Lunas', 'Titip')),
  catatan TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Jika tabel transaksi sudah ada sebelumnya, jalankan ini untuk menambah kolom:
-- ALTER TABLE transaksi ADD COLUMN IF NOT EXISTS subtotal INTEGER NOT NULL DEFAULT 0;
-- ALTER TABLE transaksi ADD COLUMN IF NOT EXISTS diskon INTEGER NOT NULL DEFAULT 0;

-- =============================================
-- Tabel Item Transaksi
-- =============================================
CREATE TABLE IF NOT EXISTS transaksi_item (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaksi_id UUID NOT NULL REFERENCES transaksi(id) ON DELETE CASCADE,
  produk_id TEXT,
  jenis_produk TEXT NOT NULL CHECK (jenis_produk IN ('burung', 'pakan', 'lainnya')),
  nama_produk TEXT NOT NULL,
  harga INTEGER NOT NULL DEFAULT 0,
  jumlah INTEGER NOT NULL DEFAULT 1,
  subtotal INTEGER NOT NULL DEFAULT 0
);

-- =============================================
-- Row Level Security
-- =============================================
ALTER TABLE transaksi ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaksi_item ENABLE ROW LEVEL SECURITY;

-- Hanya admin (authenticated) yang bisa akses
CREATE POLICY "Admin akses penuh transaksi" ON transaksi
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Admin akses penuh transaksi_item" ON transaksi_item
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
