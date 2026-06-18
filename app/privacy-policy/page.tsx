import type { Metadata } from "next"
import Link from "next/link"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: "Kebijakan Privasi — USMAN Usaha Manuk",
  description: "Kebijakan privasi USMAN Usaha Manuk mengenai pengumpulan, penggunaan, dan perlindungan data pengunjung website.",
}

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-amber-50">
      {/* Mini Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-50 shadow-sm">
        <div className="container-custom py-4 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center text-lg shadow-sm">🐦</div>
            <div>
              <h1 className="text-lg font-black text-stone-900 leading-none tracking-tight">USMAN</h1>
              <p className="text-xs text-stone-400 font-medium">Usaha Manuk</p>
            </div>
          </Link>
          <span className="text-stone-300">›</span>
          <span className="text-sm text-stone-500 font-medium">Kebijakan Privasi</span>
        </div>
      </header>

      {/* Content */}
      <main className="container-custom py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Title */}
          <div className="mb-10">
            <span className="inline-block bg-amber-100 text-amber-700 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wide">Legal</span>
            <h1 className="text-3xl md:text-4xl font-black text-stone-900 mb-3">Kebijakan Privasi</h1>
            <p className="text-stone-500 text-sm">Terakhir diperbarui: Juni 2025</p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6 md:p-10 space-y-8 text-stone-700 leading-relaxed">

            <section>
              <p>
                Selamat datang di website <strong>USMAN – Usaha Manuk</strong> (<em>usaha-manuk.com</em>). Kami menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi yang Anda berikan saat mengunjungi website ini. Kebijakan privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda.
              </p>
            </section>

            <Section title="1. Informasi yang Kami Kumpulkan">
              <p>Kami mengumpulkan beberapa jenis informasi saat Anda mengunjungi website ini:</p>
              <ul className="list-disc list-inside space-y-1.5 mt-3 text-sm">
                <li><strong>Data Penggunaan:</strong> Informasi tentang cara Anda menggunakan website, termasuk halaman yang dikunjungi, waktu kunjungan, dan durasi kunjungan.</li>
                <li><strong>Data Teknis:</strong> Alamat IP, jenis browser, sistem operasi, dan perangkat yang digunakan.</li>
                <li><strong>Cookies:</strong> File kecil yang disimpan di perangkat Anda untuk meningkatkan pengalaman browsing.</li>
                <li><strong>Data Komunikasi:</strong> Jika Anda menghubungi kami melalui WhatsApp, nama dan nomor telepon Anda akan tersimpan di platform tersebut sesuai kebijakan WhatsApp.</li>
              </ul>
            </Section>

            <Section title="2. Cara Kami Menggunakan Informasi">
              <p>Informasi yang dikumpulkan digunakan untuk:</p>
              <ul className="list-disc list-inside space-y-1.5 mt-3 text-sm">
                <li>Menganalisis traffic dan penggunaan website untuk meningkatkan layanan</li>
                <li>Menampilkan iklan yang relevan melalui Google AdSense</li>
                <li>Memastikan keamanan dan stabilitas website</li>
                <li>Memahami preferensi pengunjung guna meningkatkan konten katalog produk</li>
              </ul>
            </Section>

            <Section title="3. Google AdSense & Cookies Pihak Ketiga">
              <p>
                Website ini menggunakan <strong>Google AdSense</strong> untuk menampilkan iklan. Google menggunakan cookies untuk menampilkan iklan berdasarkan kunjungan sebelumnya Anda ke website ini dan website lainnya.
              </p>
              <p className="mt-3">
                Anda dapat menonaktifkan penggunaan cookies yang dipersonalisasi dengan mengunjungi{" "}
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:underline font-medium">
                  Pengaturan Iklan Google
                </a>.
              </p>
              <p className="mt-3 text-sm">
                Selain itu, kami menggunakan cookies internal untuk melacak jumlah pengunjung harian guna keperluan analitik internal.
              </p>
            </Section>

            <Section title="4. Berbagi Data dengan Pihak Ketiga">
              <p>
                Kami <strong>tidak menjual</strong> data pribadi Anda kepada pihak ketiga. Data hanya dibagikan kepada:
              </p>
              <ul className="list-disc list-inside space-y-1.5 mt-3 text-sm">
                <li><strong>Google:</strong> Untuk keperluan iklan AdSense dan analitik</li>
                <li><strong>Supabase:</strong> Platform database kami yang menyimpan data produk dan visitor count</li>
                <li><strong>Kewajiban Hukum:</strong> Jika diwajibkan oleh peraturan perundang-undangan yang berlaku</li>
              </ul>
            </Section>

            <Section title="5. Keamanan Data">
              <p>
                Kami menggunakan langkah-langkah keamanan teknis yang sesuai untuk melindungi data Anda dari akses, perubahan, pengungkapan, atau penghancuran yang tidak sah. Namun, tidak ada metode transmisi data melalui internet yang 100% aman.
              </p>
            </Section>

            <Section title="6. Hak Anda">
              <p>Sebagai pengguna, Anda memiliki hak untuk:</p>
              <ul className="list-disc list-inside space-y-1.5 mt-3 text-sm">
                <li>Mengetahui data apa yang kami kumpulkan tentang Anda</li>
                <li>Meminta penghapusan data Anda</li>
                <li>Menonaktifkan cookies melalui pengaturan browser Anda</li>
                <li>Tidak menyetujui penggunaan data untuk iklan yang dipersonalisasi</li>
              </ul>
            </Section>

            <Section title="7. Perubahan Kebijakan">
              <p>
                Kami dapat memperbarui kebijakan privasi ini sewaktu-waktu. Perubahan akan diumumkan di halaman ini dengan tanggal pembaruan terbaru. Disarankan untuk memeriksa halaman ini secara berkala.
              </p>
            </Section>

            <Section title="8. Hubungi Kami">
              <p>Jika ada pertanyaan tentang kebijakan privasi ini, silakan hubungi kami:</p>
              <div className="mt-3 bg-amber-50 rounded-xl p-4 text-sm space-y-1">
                <p><strong>USMAN – Usaha Manuk</strong></p>
                <p>📍 Ujung Berung Batim, Jl. Ciwaru RT02/RW01</p>
                <p>📲 <a href="https://wa.me/6281287627817" className="text-amber-600 hover:underline font-medium">0812-8762-7817</a></p>
              </div>
            </Section>

          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium text-sm transition-colors">
              ← Kembali ke Beranda
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold text-stone-900 mb-3">{title}</h2>
      <div className="text-sm space-y-2">{children}</div>
    </section>
  )
}
