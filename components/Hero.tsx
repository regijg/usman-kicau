'use client'

import { useState, useEffect, useRef, type CSSProperties } from 'react'

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

function useTypewriter(text: string, speed = 50) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) { clearInterval(id); setDone(true) }
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return { displayed, done }
}

const PARTICLES = [
  { top: '18%', left: '6%',  delay: '0s',   dur: '2.5s' },
  { top: '32%', left: '89%', delay: '0.6s', dur: '3s'   },
  { top: '58%', left: '4%',  delay: '1.2s', dur: '2.8s' },
  { top: '42%', left: '93%', delay: '0.3s', dur: '3.5s' },
  { top: '72%', left: '11%', delay: '0.9s', dur: '2.6s' },
  { top: '20%', left: '79%', delay: '1.6s', dur: '3.2s' },
  { top: '64%', left: '86%', delay: '0.4s', dur: '2.9s' },
]

export default function Hero() {
  const [statsVisible, setStatsVisible] = useState(false)
  const [offsetY, setOffsetY] = useState(0)
  const [mounted, setMounted] = useState(false)
  const statsRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const { displayed: typedText, done: typeDone } = useTypewriter('Grosir & Ecer · Burung Kicau Berkualitas', 30)

  useEffect(() => { setMounted(true) }, [])

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

  useEffect(() => {
    let rafId: number
    const onScroll = () => {
      rafId = requestAnimationFrame(() => {
        const section = sectionRef.current
        if (!section) return
        const rect = section.getBoundingClientRect()
        if (rect.bottom < 0 || rect.top > window.innerHeight) return
        setOffsetY(window.scrollY * 0.35)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  const birdCount  = useCountUp(20,  1400, statsVisible)
  const hourCount  = useCountUp(24,  1000, statsVisible)
  const happyCount = useCountUp(500, 1800, statsVisible)

  function anim(delay: string): CSSProperties {
    return mounted
      ? { animation: `hero-in 0.7s ${delay} ease both` }
      : { opacity: 0 }
  }

  return (
    <section ref={sectionRef} className="relative text-white overflow-hidden">
      <style>{`
        @keyframes hero-in {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0);     opacity: 0.22; }
          50%       { transform: translateY(-18px); opacity: 0.5;  }
        }
      `}</style>

      {/* Parallax background */}
      <div
        className="absolute inset-0 -top-16 -bottom-16"
        style={{
          backgroundImage: "url('/img/bg/usman-banner.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'top',
          backgroundRepeat: 'no-repeat',
          transform: `translateY(${offsetY}px)`,
          willChange: 'transform',
        }}
      />
      <div className="absolute inset-0 bg-[#1a1208]/75"/>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(245,158,11,0.15)_0%,_transparent_60%)]"/>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(120,53,15,0.3)_0%,_transparent_60%)]"/>

      {/* Floating feathers */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute pointer-events-none select-none text-amber-300"
          style={{
            top: p.top,
            left: p.left,
            fontSize: i % 2 === 0 ? '1.1rem' : '0.7rem',
            animation: `float ${p.dur} ${p.delay} ease-in-out infinite`,
          }}
        >
          🪶
        </div>
      ))}

      <div className="relative container-custom pt-20 pb-8 md:pt-28 md:pb-12">
        <div className="text-center max-w-3xl mx-auto">

          {/* Logo */}
          <div style={anim('0s')} className="mb-6">
            <img
              src="/img/bg/usman-logo-3.png"
              alt="USMAN"
              className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover mx-auto shadow-2xl ring-4 ring-amber-500/40"
              style={{ filter: 'drop-shadow(0 0 20px rgba(245,158,11,0.5))' }}
            />
          </div>

          {/* Badge with typewriter */}
          <div style={anim('0.1s')} className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/30 rounded-full px-4 py-2 text-sm font-medium mb-6 text-amber-300">
            <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse flex-shrink-0"/>
            <span>
              {typedText}
              {!typeDone && <span className="animate-pulse ml-0.5">|</span>}
            </span>
          </div>

          {/* Title */}
          <div style={anim('0.2s')} className="mb-3">
            <h2 className="text-7xl md:text-8xl font-black tracking-tight text-white drop-shadow-lg">USMAN</h2>
          </div>

          {/* Subtitle */}
          <p style={anim('0.3s')} className="text-xl md:text-2xl font-semibold text-amber-400 mb-5 tracking-wide">
            Usaha Manuk
          </p>

          {/* Description */}
          <p style={anim('0.4s')} className="text-stone-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Penyedia burung kicau pilihan dengan harga bersahabat. Tersedia grosir dan ecer langsung dari tangan pertama.
          </p>

          {/* CTA Buttons */}
          <div style={anim('0.5s')} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <a
              href="#burung"
              className="bg-amber-500 hover:bg-amber-400 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-amber-500/30 text-base"
            >
              Lihat Masteran Burung
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
          <div ref={statsRef} style={anim('0.6s')} className="grid grid-cols-3 gap-4 border-t border-white/10 pt-10">
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

      {/* Scroll indicator */}
      <div style={anim('0.9s')} className="relative flex justify-center pb-6 -mt-4">
        <a href="#burung" aria-label="Scroll ke katalog" className="text-white/40 hover:text-amber-400 transition-colors duration-300 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </a>
      </div>

      {/* Wave */}
      <div className="relative h-16">
        <svg viewBox="0 0 1440 64" preserveAspectRatio="none" className="absolute bottom-0 w-full h-full">
          <path d="M0,64 C360,0 720,48 1080,24 C1260,12 1380,40 1440,32 L1440,64 Z" fill="#fffbeb"/>
        </svg>
      </div>
    </section>
  )
}
