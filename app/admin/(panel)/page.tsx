import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = createClient()

  const today = new Date()
  const todayStr = today.toISOString().split('T')[0]
  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(today.getDate() - 6)
  const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0]

  const [
    { count: jumlahBurung },
    { count: jumlahPakan },
    { data: semuaBurung },
    { count: kunjunganHariIni },
    { data: kunjungan7Hari },
  ] = await Promise.all([
    supabase.from('burung').select('*', { count: 'exact', head: true }),
    supabase.from('pakan').select('*', { count: 'exact', head: true }),
    supabase.from('burung').select('kategori'),
    supabase
      .from('visitors')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', `${todayStr}T00:00:00`),
    supabase
      .from('visitors')
      .select('created_at')
      .gte('created_at', `${sevenDaysAgoStr}T00:00:00`)
      .order('created_at', { ascending: true }),
  ])

  const kategoriCount = (semuaBurung ?? []).reduce(
    (acc: Record<string, number>, b: { kategori: string }) => {
      acc[b.kategori] = (acc[b.kategori] || 0) + 1
      return acc
    },
    {}
  )

  // Kelompokkan kunjungan per hari (7 hari terakhir)
  const visitsByDay: Record<string, number> = {}
  for (let i = 0; i < 7; i++) {
    const d = new Date(sevenDaysAgo)
    d.setDate(sevenDaysAgo.getDate() + i)
    visitsByDay[d.toISOString().split('T')[0]] = 0
  }
  for (const v of kunjungan7Hari ?? []) {
    const day = (v.created_at as string).split('T')[0]
    if (day in visitsByDay) visitsByDay[day]++
  }

  const maxVisits = Math.max(...Object.values(visitsByDay), 1)
  const totalVisits7Hari = Object.values(visitsByDay).reduce((a, b) => a + b, 0)

  const HARI = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-black text-stone-900">Dashboard</h1>
        <p className="text-stone-500 text-sm mt-0.5">Selamat datang di panel admin USMAN 🐦</p>
      </div>

      {/* Stats produk */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="text-2xl mb-2">🐦</div>
          <div className="text-3xl font-black text-stone-900">{jumlahBurung ?? 0}</div>
          <div className="text-stone-500 text-xs mt-1">Total Burung</div>
          <Link href="/admin/burung" className="text-amber-600 text-xs font-bold mt-2 inline-block hover:underline">
            Kelola →
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="text-2xl mb-2">🌾</div>
          <div className="text-3xl font-black text-stone-900">{jumlahPakan ?? 0}</div>
          <div className="text-stone-500 text-xs mt-1">Produk Pakan</div>
          <Link href="/admin/pakan" className="text-amber-600 text-xs font-bold mt-2 inline-block hover:underline">
            Kelola →
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="text-2xl mb-2">👁️</div>
          <div className="text-3xl font-black text-stone-900">{kunjunganHariIni ?? 0}</div>
          <div className="text-stone-500 text-xs mt-1">Kunjungan Hari Ini</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="text-2xl mb-2">📈</div>
          <div className="text-3xl font-black text-stone-900">{totalVisits7Hari}</div>
          <div className="text-stone-500 text-xs mt-1">Kunjungan 7 Hari</div>
        </div>
      </div>

      {/* Grafik kunjungan 7 hari */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
        <h2 className="font-black text-stone-900 mb-5">Kunjungan 7 Hari Terakhir</h2>
        <div className="flex items-end gap-2 h-36">
          {Object.entries(visitsByDay).map(([date, count]) => {
            const pct = maxVisits > 0 ? (count / maxVisits) * 100 : 0
            const d = new Date(date + 'T00:00:00')
            const isToday = date === todayStr
            return (
              <div key={date} className="flex-1 flex flex-col items-center gap-1.5">
                <span className="text-xs font-bold text-stone-600">{count > 0 ? count : ''}</span>
                <div className="w-full flex items-end" style={{ height: '80px' }}>
                  <div
                    className={`w-full rounded-t-lg transition-all ${isToday ? 'bg-amber-500' : 'bg-amber-200'}`}
                    style={{ height: `${Math.max(pct, count > 0 ? 8 : 2)}%` }}
                  />
                </div>
                <span className={`text-xs font-semibold ${isToday ? 'text-amber-600' : 'text-stone-400'}`}>
                  {HARI[d.getDay()]}
                </span>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-stone-400 mt-3">
          Batang kuning = hari ini · Setiap sesi browser dihitung 1 kunjungan
        </p>
      </div>

      {/* Burung per Kategori */}
      {Object.keys(kategoriCount).length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <h2 className="font-black text-stone-900 mb-4">Burung per Kategori</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Object.entries(kategoriCount).map(([kat, count]) => (
              <div key={kat} className="bg-amber-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-black text-amber-700">{count as number}</div>
                <div className="text-stone-600 text-sm font-semibold mt-1">{kat}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Aksi Cepat */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="font-black text-stone-900 mb-4">Aksi Cepat</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/burung/tambah" className="bg-amber-500 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-amber-600 transition-colors">
            + Tambah Burung
          </Link>
          <Link href="/admin/pakan/tambah" className="bg-stone-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-stone-800 transition-colors">
            + Tambah Pakan
          </Link>
          <Link href="/" target="_blank" className="border border-stone-200 text-stone-600 px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-50 transition-colors">
            Lihat Website →
          </Link>
        </div>
      </div>
    </div>
  )
}
