-- =============================================
-- Jalankan ini di Supabase SQL Editor
-- (tambahan untuk visitor tracking)
-- =============================================

CREATE TABLE IF NOT EXISTS visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page TEXT NOT NULL DEFAULT '/',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Siapapun bisa insert (tracking dari website)
CREATE POLICY "Allow anonymous insert" ON visitors
  FOR INSERT WITH CHECK (true);

-- Hanya admin yang bisa baca
CREATE POLICY "Admin can read visitors" ON visitors
  FOR SELECT USING (auth.role() = 'authenticated');
