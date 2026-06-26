import type { Metadata } from "next"
import Link from "next/link"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: "Tentang Kami — USMAN Usaha Manuk",
  description: "Mengenal USMAN Usaha Manuk, penyedia burung kicau dan pakan berkualitas di Ujung Berung, Bandung. Grosir dan ecer langsung dari tangan pertama.",
}

export default function TentangKamiPage() {
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Mini Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-50 shadow-sm">
        <div className="container-custom py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/img/bg/usman-logo-3.png" alt="USMAN" className="w-9 h-9 rounded-xl object-cover shadow-sm" />
            <div>
              <h1 className="text-lg font-black text-stone-900 leading-none tracking-tight">USMAN</h1>
              <p className="text-xs text-stone-400 font-medium">Usaha Manuk</p>
            </div>
          </Link>
          <span className="text-stone-300">›</span>
          <span className="text-sm text-stone-500 font-medium">Tentang Kami</span>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-[#1a1208] text-white py-16 md:py-24">
          <div className="container-custom text-center">
            <span className="inline-block bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide border border-amber-500/30">
              Tentang Kami
            </span>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
              USMAN<br />
              <span className="text-amber-400">Usaha Manuk</span>
            </h1>
            <p className="text-stone-300 text-lg max-w-xl mx-auto leading-relaxed">
              Penyedia burung kicau dan pakan berkualitas di Ujung Berung, Bandung. Grosir dan ecer langsung dari tangan pertama.
            </p>
          </div>
        </section>

        {/* Cerita Kami */}
        <section className="py-14 md:py-20">
          <div className="container-custom">
            <div className="max-w-3xl mx-auto">
              <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">Cerita Kami</span>
              <h2 className="text-3xl md:text-4xl font-black text-stone-900 mb-6">Berawal dari Hobi,<br/>Tumbuh Jadi Usaha</h2>
              <div className="space-y-4 text-stone-600 leading-relaxed">
                <p>
                  USMAN – Usaha Manuk lahir dari kecintaan mendalam terhadap dunia burung kicau. Apa yang dimulai sebagai hobi memelihara burung di rumah, perlahan berkembang menjadi usaha yang melayani sesama pecinta burung di seluruh Indonesia.
                </p>
                <p>
                  Berlokasi di <strong className="text-stone-800">Ujung Berung Batim, Jl. Ciwaru RT02/RW01, Bandung</strong>, kami menyediakan berbagai jenis burung kicau pilihan — dari jenis kicau lomba, aviari, Masteran, hingga jenis lainnya — dengan kondisi sehat, jinak, dan terawat.
                </p>
                <p>
                  Selain burung, kami juga menyediakan berbagai jenis pakan berkualitas tinggi yang diformulasikan khusus untuk menjaga kesehatan dan performa suara burung Anda.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-white py-12 border-y border-stone-100">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { emoji: "🐦", value: "20+", label: "Koleksi Burung" },
                { emoji: "🌿", value: "10+", label: "Jenis Pakan" },
                { emoji: "⭐", value: "100+", label: "Pelanggan Puas" },
                { emoji: "📅", value: "24 Jam", label: "Siap Melayani" },
              ].map((s) => (
                <div key={s.label} className="p-4">
                  <div className="text-3xl mb-2">{s.emoji}</div>
                  <div className="text-2xl md:text-3xl font-black text-amber-500 mb-1">{s.value}</div>
                  <div className="text-sm text-stone-500 font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Keunggulan */}
        <section className="py-14 md:py-20">
          <div className="container-custom">
            <div className="text-center mb-10">
              <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">Keunggulan</span>
              <h2 className="text-3xl md:text-4xl font-black text-stone-900">Kenapa Pilih USMAN?</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                {
                  emoji: "🏆",
                  title: "Kualitas Terjamin",
                  desc: "Semua burung dipilih secara selektif — sehat, aktif, dan bersuara merdu. Pakan diformulasikan untuk menjaga stamina dan performa.",
                },
                {
                  emoji: "💰",
                  title: "Harga Terjangkau",
                  desc: "Langsung dari tangan pertama, tanpa perantara. Harga grosir tersedia untuk pembelian dalam jumlah banyak.",
                },
                {
                  emoji: "🤝",
                  title: "Amanah & Terpercaya",
                  desc: "Kami menjaga kepercayaan pelanggan dengan pelayanan jujur dan transparan. Kepuasan Anda adalah prioritas utama kami.",
                },
              ].map((k) => (
                <div key={k.title} className="card p-6 text-center">
                  <div className="text-4xl mb-4">{k.emoji}</div>
                  <h3 className="font-bold text-stone-900 mb-2">{k.title}</h3>
                  <p className="text-sm text-stone-500 leading-relaxed">{k.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Kontak */}
        <section className="bg-[#1a1208] py-14 md:py-20">
          <div className="container-custom">
            <div className="text-center mb-10">
              <span className="inline-block bg-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide border border-amber-500/30">Kontak</span>
              <h2 className="text-3xl md:text-4xl font-black text-white">Hubungi Kami</h2>
              <p className="text-stone-400 mt-2">Siap melayani Anda 24 jam sehari</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[
                {
                  emoji: "📲",
                  label: "WhatsApp",
                  value: "0812-8762-7817",
                  href: "https://wa.me/6281287627817",
                },
                {
                  emoji: "📍",
                  label: "Lokasi",
                  value: "Ujung Berung Batim, Jl. Ciwaru RT02/RW01, Bandung",
                  href: "https://maps.google.com/?q=Ujung+Berung+Bandung",
                },
                {
                  emoji: "⏰",
                  label: "Jam Buka",
                  value: "Buka 24 Jam Sehudangna",
                  href: null,
                },
              ].map((c) => (
                <div key={c.label} className="bg-white/5 rounded-2xl p-5 border border-white/10 text-center">
                  <div className="text-3xl mb-3">{c.emoji}</div>
                  <p className="text-stone-400 text-xs uppercase tracking-wide mb-1">{c.label}</p>
                  {c.href ? (
                    <a href={c.href} target="_blank" rel="noopener noreferrer" className="text-amber-400 font-semibold text-sm hover:text-amber-300 transition-colors">
                      {c.value}
                    </a>
                  ) : (
                    <p className="text-white font-semibold text-sm">{c.value}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <a
                href="https://wa.me/6281287627817"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-wa inline-flex px-8 py-3 text-base font-bold"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Chat WhatsApp Sekarang
              </a>
            </div>
          </div>
        </section>

        {/* Back to home */}
        <section className="py-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors">
            ← Kembali ke Beranda
          </Link>
        </section>
      </main>

      <Footer />
    </div>
  )
}
