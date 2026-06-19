import { createClient } from '@/lib/supabase/server'
import LaporanFilter from '../../components/LaporanFilter'
import type { LaporanMode } from '../../components/LaporanFilter'
import type { TransaksiItem } from '@/types'

function formatRp(n: number) {
  return 'Rp ' + n.toLocaleString('id-ID')
}

const BULAN_ID    = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']
const BULAN_SHORT = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']
const HARI_ID     = ['Sen','Sel','Rab','Kam','Jum','Sab','Min']

function addDays(iso: string, n: number): string {
  const d = new Date(iso + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().split('T')[0]
}

function addMonths(iso: string, n: number): string {
  // iso = YYYY-MM-DD, returns first day of target month
  const [y, m] = iso.split('-').map(Number)
  const total = y * 12 + (m - 1) + n
  const ny = Math.floor(total / 12)
  const nm = (total % 12) + 1
  return `${ny}-${String(nm).padStart(2, '0')}-01`
}

function getMondayISO(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z')
  const dow = d.getUTCDay() // 0=Sun
  const diff = dow === 0 ? -6 : 1 - dow
  d.setUTCDate(d.getUTCDate() + diff)
  return d.toISOString().split('T')[0]
}

function formatDateID(iso: string): string {
  const d = new Date(iso + 'T00:00:00Z')
  return `${d.getUTCDate()} ${BULAN_ID[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

type ChartBar = { label: string; value: number; highlight: boolean }

export default async function LaporanPage({
  searchParams,
}: {
  searchParams: {
    mode?: string; start?: string; bulan?: string; tahun?: string; dari?: string; sampai?: string
  }
}) {
  const WIB     = 7 * 60 * 60 * 1000
  const now     = new Date(Date.now() + WIB)
  const today   = now.toISOString().split('T')[0]
  const mode    = (searchParams.mode ?? 'minggu') as LaporanMode

  // ─── Compute period ──────────────────────────────────────────────────────
  let startDate: string
  let endDate:   string  // exclusive upper bound
  let label:     string
  let prevHref:  string
  let nextHref:  string
  let bars:      ChartBar[]

  if (mode === 'minggu') {
    const monday = searchParams.start ? getMondayISO(searchParams.start) : getMondayISO(today)
    startDate = monday
    endDate   = addDays(monday, 7)

    const s = new Date(startDate + 'T00:00:00Z')
    const e = new Date(addDays(endDate, -1) + 'T00:00:00Z')
    label = s.getUTCMonth() === e.getUTCMonth()
      ? `${s.getUTCDate()} – ${e.getUTCDate()} ${BULAN_ID[e.getUTCMonth()]} ${e.getUTCFullYear()}`
      : `${formatDateID(startDate)} – ${formatDateID(addDays(endDate, -1))}`

    prevHref = `/admin/laporan?mode=minggu&start=${addDays(monday, -7)}`
    nextHref = `/admin/laporan?mode=minggu&start=${addDays(monday,  7)}`
    bars = HARI_ID.map((lbl, i) => ({
      label: lbl, value: 0, highlight: addDays(monday, i) === today,
    }))

  } else if (mode === 'tahun') {
    const tahun = parseInt(searchParams.tahun ?? String(now.getUTCFullYear()))
    startDate = `${tahun}-01-01`
    endDate   = `${tahun + 1}-01-01`
    label     = String(tahun)
    prevHref  = `/admin/laporan?mode=tahun&tahun=${tahun - 1}`
    nextHref  = `/admin/laporan?mode=tahun&tahun=${tahun + 1}`
    bars = BULAN_SHORT.map((lbl, i) => ({
      label: lbl, value: 0,
      highlight: tahun === now.getUTCFullYear() && i === now.getUTCMonth(),
    }))

  } else if (mode === 'custom') {
    const dari   = searchParams.dari   ?? today
    const sampai = searchParams.sampai ?? today
    startDate = dari
    endDate   = addDays(sampai, 1)
    label     = `${formatDateID(dari)} – ${formatDateID(sampai)}`
    prevHref  = ''
    nextHref  = ''

    const msDay   = 86400000
    const dariD   = new Date(dari   + 'T00:00:00Z')
    const sampaiD = new Date(sampai + 'T00:00:00Z')
    const nDays   = Math.round((sampaiD.getTime() - dariD.getTime()) / msDay) + 1

    if (nDays <= 35) {
      bars = Array.from({ length: nDays }, (_, i) => {
        const isoD = addDays(dari, i)
        const d    = new Date(isoD + 'T00:00:00Z')
        return { label: String(d.getUTCDate()), value: 0, highlight: isoD === today }
      })
    } else {
      // Per month
      const startM = dariD.getUTCFullYear() * 12 + dariD.getUTCMonth()
      const endM   = sampaiD.getUTCFullYear() * 12 + sampaiD.getUTCMonth()
      bars = Array.from({ length: endM - startM + 1 }, (_, i) => {
        const total = startM + i
        const ny = Math.floor(total / 12)
        const nm = total % 12
        return {
          label: `${BULAN_SHORT[nm]} ${ny !== now.getUTCFullYear() ? ny : ''}`.trim(),
          value: 0,
          highlight: ny === now.getUTCFullYear() && nm === now.getUTCMonth(),
        }
      })
    }

  } else {
    // bulan (default)
    const tahun   = parseInt(searchParams.tahun ?? String(now.getUTCFullYear()))
    const bulan   = parseInt(searchParams.bulan ?? String(now.getUTCMonth() + 1))
    const bulanS  = String(bulan).padStart(2, '0')
    startDate = `${tahun}-${bulanS}-01`
    endDate   = addMonths(startDate, 1)
    label     = `${BULAN_ID[bulan - 1]} ${tahun}`

    const prev  = addMonths(startDate, -1)
    const next  = addMonths(startDate,  1)
    const [py, pm] = prev.split('-')
    const [ny, nm] = next.split('-')
    prevHref = `/admin/laporan?mode=bulan&bulan=${parseInt(pm)}&tahun=${py}`
    nextHref = `/admin/laporan?mode=bulan&bulan=${parseInt(nm)}&tahun=${ny}`

    const daysInMonth = new Date(tahun, bulan, 0).getDate()
    bars = Array.from({ length: daysInMonth }, (_, i) => ({
      label: String(i + 1), value: 0,
      highlight: tahun === now.getUTCFullYear() && bulan === now.getUTCMonth() + 1 && i + 1 === now.getUTCDate(),
    }))
  }

  // ─── Fetch ───────────────────────────────────────────────────────────────
  const supabase = createClient()

  const { data: trxRaw } = await supabase
    .from('transaksi')
    .select('*')
    .gte('tanggal', startDate)
    .lt('tanggal', endDate)
    .order('tanggal', { ascending: true })

  const trxAll = trxRaw ?? []
  const trxIds = trxAll.map((t: { id: string }) => t.id)

  const { data: itemRaw } = trxIds.length > 0
    ? await supabase
        .from('transaksi_item')
        .select('nama_produk, jenis_produk, jumlah, subtotal')
        .in('transaksi_id', trxIds)
    : { data: [] }

  const items = (itemRaw as TransaksiItem[]) ?? []

  // ─── Fill chart bars ─────────────────────────────────────────────────────
  for (const t of trxAll) {
    const tD   = new Date(t.tanggal + 'T00:00:00Z')
    const total = t.total ?? 0

    if (mode === 'minggu') {
      const dow = tD.getUTCDay()
      const idx = dow === 0 ? 6 : dow - 1   // Mon=0 … Sun=6
      if (bars[idx]) bars[idx].value += total

    } else if (mode === 'tahun') {
      bars[tD.getUTCMonth()].value += total

    } else if (mode === 'custom') {
      const dari   = searchParams.dari ?? today
      const sampai = searchParams.sampai ?? today
      const dariD  = new Date(dari + 'T00:00:00Z')
      const nDays  = Math.round((new Date(sampai + 'T00:00:00Z').getTime() - dariD.getTime()) / 86400000) + 1

      if (nDays <= 35) {
        const idx = Math.round((tD.getTime() - dariD.getTime()) / 86400000)
        if (idx >= 0 && idx < bars.length) bars[idx].value += total
      } else {
        const startM = dariD.getUTCFullYear() * 12 + dariD.getUTCMonth()
        const tM     = tD.getUTCFullYear()    * 12 + tD.getUTCMonth()
        const idx    = tM - startM
        if (idx >= 0 && idx < bars.length) bars[idx].value += total
      }

    } else {
      // bulan: index = day - 1
      bars[tD.getUTCDate() - 1].value += total
    }
  }

  // ─── Summary ─────────────────────────────────────────────────────────────
  const totalOmzet      = trxAll.reduce((s: number, t: { total: number }) => s + (t.total ?? 0), 0)
  const totalLunas      = trxAll.filter((t: { status: string }) => t.status === 'Lunas').reduce((s: number, t: { total: number }) => s + t.total, 0)
  const totalBelum      = trxAll.filter((t: { status: string }) => t.status !== 'Lunas').reduce((s: number, t: { total: number }) => s + t.total, 0)
  const jumlahTransaksi = trxAll.length

  const produkMap: Record<string, { nama: string; jenis: string; jumlah: number; omzet: number }> = {}
  for (const item of items) {
    if (!produkMap[item.nama_produk]) {
      produkMap[item.nama_produk] = { nama: item.nama_produk, jenis: item.jenis_produk, jumlah: 0, omzet: 0 }
    }
    produkMap[item.nama_produk].jumlah += item.jumlah
    produkMap[item.nama_produk].omzet  += item.subtotal
  }
  const topProduk = Object.values(produkMap).sort((a, b) => b.jumlah - a.jumlah).slice(0, 8)

  const statusCount = {
    Lunas:       trxAll.filter((t: { status: string }) => t.status === 'Lunas').length,
    'Belum Lunas': trxAll.filter((t: { status: string }) => t.status === 'Belum Lunas').length,
    Titip:       trxAll.filter((t: { status: string }) => t.status === 'Titip').length,
  }

  const maxBar = Math.max(...bars.map((b) => b.value), 1)

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-black text-stone-900">Laporan</h1>
      </div>

      <LaporanFilter
        mode={mode}
        label={label}
        prevHref={prevHref}
        nextHref={nextHref}
        defaultDari={searchParams.dari  ?? today}
        defaultSampai={searchParams.sampai ?? today}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { icon: '💰', value: formatRp(totalOmzet),      sub: 'Total Omzet',    cls: 'text-stone-900'  },
          { icon: '✅', value: formatRp(totalLunas),      sub: 'Sudah Lunas',    cls: 'text-green-600'  },
          { icon: '⏳', value: formatRp(totalBelum),      sub: 'Belum / Titip',  cls: 'text-amber-600'  },
          { icon: '🧾', value: String(jumlahTransaksi),   sub: 'Transaksi',      cls: 'text-stone-900'  },
        ].map((c) => (
          <div key={c.sub} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="text-2xl mb-2">{c.icon}</div>
            <div className={`text-xl sm:text-2xl font-black leading-tight ${c.cls}`}>{c.value}</div>
            <div className="text-stone-400 text-xs mt-1">{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Bar chart */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
        <h2 className="font-black text-stone-900 mb-5">Omzet — {label}</h2>
        {totalOmzet === 0 ? (
          <div className="text-center py-8 text-stone-400 text-sm">Belum ada transaksi di periode ini</div>
        ) : (
          <>
            <div className="flex items-end gap-0.5 overflow-x-auto" style={{ height: '120px' }}>
              {bars.map((bar, i) => {
                const pct = (bar.value / maxBar) * 100
                return (
                  <div key={i} className="flex-1 min-w-[10px] flex flex-col items-center gap-1 h-full">
                    <div className="w-full flex items-end flex-1">
                      <div
                        title={`${bar.label}: ${formatRp(bar.value)}`}
                        className={`w-full rounded-t cursor-default transition-all ${
                          bar.highlight ? 'bg-amber-500' : bar.value > 0 ? 'bg-amber-300' : 'bg-gray-100'
                        }`}
                        style={{ height: `${Math.max(pct, bar.value > 0 ? 4 : 1)}%` }}
                      />
                    </div>
                    <span className={`text-[9px] font-semibold ${bar.highlight ? 'text-amber-600' : 'text-stone-400'}`}>
                      {bar.label}
                    </span>
                  </div>
                )
              })}
            </div>
            <p className="text-xs text-stone-400 mt-3">Hover batang untuk melihat nominal</p>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        {/* Status */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-black text-stone-900 mb-4">Status Transaksi</h2>
          <div className="space-y-3">
            {([
              { label: 'Lunas',       color: 'bg-green-500' },
              { label: 'Belum Lunas', color: 'bg-red-400'   },
              { label: 'Titip',       color: 'bg-amber-400' },
            ] as const).map((s) => (
              <div key={s.label} className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${s.color} flex-shrink-0`} />
                <span className="text-sm font-semibold text-stone-700 flex-1">{s.label}</span>
                <span className="text-sm font-black text-stone-800">{statusCount[s.label]}</span>
                <span className="text-xs text-stone-400 w-8 text-right">
                  {jumlahTransaksi > 0 ? Math.round((statusCount[s.label] / jumlahTransaksi) * 100) : 0}%
                </span>
              </div>
            ))}
            {jumlahTransaksi === 0 && <p className="text-sm text-stone-400 text-center py-4">Belum ada data</p>}
          </div>
        </div>

        {/* Produk terlaris */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-black text-stone-900 mb-4">Produk Terlaris</h2>
          {topProduk.length === 0 ? (
            <p className="text-sm text-stone-400 text-center py-4">Belum ada data</p>
          ) : (
            <div className="space-y-2.5">
              {topProduk.map((p, i) => (
                <div key={p.nama} className="flex items-center gap-3">
                  <span className="text-xs font-black text-stone-400 w-5 text-center">{i + 1}</span>
                  <span className="text-sm">{p.jenis === 'burung' ? '🐦' : p.jenis === 'pakan' ? '🌾' : '📦'}</span>
                  <span className="text-sm font-semibold text-stone-700 flex-1 truncate">{p.nama}</span>
                  <span className="text-xs font-bold text-stone-500 whitespace-nowrap">×{p.jumlah}</span>
                  <span className="text-xs font-bold text-amber-700 whitespace-nowrap">{formatRp(p.omzet)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
