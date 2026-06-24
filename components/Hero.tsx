'use client'

import { useState, useEffect, useRef } from 'react'

const WA_ICON = (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)

function useCountUp(target: number, duration: number, active: boolean) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    const start = performance.now()
    function tick(now: number) {
      const t = Math.min((now - start) / duration, 1)
      setValue(Math.round(t * target))
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [active, target, duration])
  return value
}

export default function Hero() {
  const [statsVisible, setStatsVisible] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.5 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const birdCount = useCountUp(20, 1400, statsVisible)
  const hourCount = useCountUp(24, 1000, statsVisible)
  const happyCount = useCountUp(500, 1800, statsVisible)

  return (
    <section
      className="relative text-white overflow-hidden"
      style={{
        backgroundImage: "url('/img/bg/usman-banner.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'top',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-[#1a1208]/75"/>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(245,158,11,0.15)_0%,_transparent_60%)]"/>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(120,53,15,0.3)_0%,_transparent_60%)]"/>

      <div className="relative container-custom pt-20 pb-8 md:pt-28 md:pb-12">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-2 text-sm font-medium mb-8 text-amber-300">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse"/>
            Grosir &amp; Ecer · Burung Kicau Berkualitas
          </div>

          <div className="mb-3">
            <h2 className="text-7xl md:text-8xl font-black tracking-tight text-white">USMAN</h2>
          </div>
          <p className="text-xl md:text-2xl font-semibold text-amber-400 mb-5 tracking-wide">Usaha Manuk</p>
          <p className="text-stone-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Penyedia burung kicau pilihan dengan harga bersahabat. Tersedia grosir dan ecer langsung dari tangan pertama.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a
              href="#burung"
              className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-amber-500/30 text-base"
            >
              🐦 Lihat Koleksi Burung
            </a>
            <a
              href="https://wa.me/6281287627817?text=Assalamualaikum%2C%20saya%20ingin%20tanya%20tentang%20burung%20di%20USMAN"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#1ebe59] text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg text-base flex items-center justify-center gap-2"
            >
              {WA_ICON}
              Chat WhatsApp
            </a>
          </div>

          {/* Animated Stats */}
          <div ref={statsRef} className="grid grid-cols-3 gap-4 border-t border-white/10 pt-10">
            <div>
              <p className="text-4xl md:text-5xl font-black text-amber-400">
                {statsVisible ? `${birdCount}+` : '—'}
              </p>
              <p className="text-sm text-stone-500 mt-1">Jenis Burung</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-black text-amber-400">
                {statsVisible ? `${happyCount}+` : '—'}
              </p>
              <p className="text-sm text-stone-500 mt-1">Pelanggan Puas</p>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-black text-amber-400">
                {statsVisible ? `${hourCount} Jam` : '—'}
              </p>
              <p className="text-sm text-stone-500 mt-1">Siap Melayani</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative h-16">
        <svg viewBox="0 0 1440 64" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
          <path d="M0,64 C360,0 720,48 1080,24 C1260,12 1380,40 1440,32 L1440,64 Z" fill="#fffbeb"/>
        </svg>
      </div>
    </section>
  )
}
