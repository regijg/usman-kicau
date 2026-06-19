-- Jalankan di Supabase SQL Editor

CREATE TABLE IF NOT EXISTS pembayaran (
  id           UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  transaksi_id UUID    NOT NULL REFERENCES transaksi(id) ON DELETE CASCADE,
  jumlah       INTEGER NOT NULL DEFAULT 0,
  tanggal      DATE    NOT NULL DEFAULT CURRENT_DATE,
  catatan      TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE pembayaran ENABLE ROW LEVEL SECURITY;

CREATE POLICY "authenticated_all" ON pembayaran
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
