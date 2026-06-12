'use client'

const WA_ICON = (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current flex-shrink-0">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
)

export default function ContactInfo() {
  return (
    <section id="kontak" className="py-16 md:py-24 bg-amber-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <span className="inline-block bg-amber-100 text-amber-700 text-sm font-bold px-4 py-1.5 rounded-full mb-4 border border-amber-200">
            📞 Hubungi Kami
          </span>
          <h2 className="section-title mb-4">Siap Melayani 24 Jam</h2>
          <p className="text-stone-500 max-w-md mx-auto">
            Hubungi kami kapanpun, kami siap melayani dengan sepenuh hati
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Info Card */}
          <div className="card p-6 md:p-8 bg-white">
            <h3 className="text-xl font-bold text-stone-900 mb-6">Informasi Kontak</h3>

            <div className="space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">📲</div>
                <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-1">WhatsApp</p>
                  <a
                    href="https://wa.me/6281287627817"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:text-amber-700 font-black text-lg transition-colors"
                  >
                    0812-8762-7817
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🏠</div>
                <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-1">Alamat</p>
                  <p className="text-stone-800 font-semibold">Ujung Berung Batim</p>
                  <p className="text-stone-500 text-sm">Jl. Ciwaru RT02/RW01</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-sky-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">⏰</div>
                <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-1">Jam Buka</p>
                  <p className="text-stone-800 font-semibold">Sehudangna (24 Jam)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-11 h-11 bg-red-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">📍</div>
                <div>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-wide mb-1">Lokasi</p>
                  <a
                    href="https://www.google.com/maps/place/Rumah+Mas+Wahyu/@-6.9009527,107.7141345,17z/data=!4m15!1m8!3m7!1s0x2e68dd568864adb5:0x2000d9585f9b5957!2sRumah+Mas+Wahyu!8m2!3d-6.9009527!4d107.7167094!10e1!16s%2Fg%2F11sbx4t67r!3m5!1s0x2e68dd568864adb5:0x2000d9585f9b5957!8m2!3d-6.9009527!4d107.7167094!16s%2Fg%2F11sbx4t67r?entry=ttu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
                  >
                    Rumah Mas Wahyu → Google Maps ↗
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Card — dark warm, bukan hijau */}
          <div className="bg-[#1a1208] rounded-2xl p-6 md:p-8 text-white flex flex-col">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2 text-white">Hubungi Langsung</h3>
              <p className="text-stone-400 text-sm mb-6 leading-relaxed">
                Tanya stok, harga grosir/ecer, atau mau langsung pesan? Chat atau telepon sekarang!
              </p>

              <div className="space-y-3 mb-8">
                <a
                  href="https://wa.me/6281287627817?text=Assalamualaikum%20Kak%2C%20saya%20ingin%20bertanya%20tentang%20burung%20dan%20pakan%20di%20USMAN%20%F0%9F%99%8F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe59] text-white font-bold px-5 py-3.5 rounded-xl transition-all w-full justify-center shadow-md"
                >
                  {WA_ICON}
                  Chat WhatsApp Sekarang
                </a>

                <a
                  href="tel:081287627817"
                  className="flex items-center gap-3 bg-white/10 hover:bg-white/15 text-white font-bold px-5 py-3.5 rounded-xl transition-all w-full justify-center border border-white/10"
                >
                  📞 Telepon Sekarang
                </a>
              </div>
            </div>

            <div className="border-t border-white/10 pt-6">
              <p className="text-amber-500 text-xs font-bold uppercase tracking-wider mb-3">Catatan Penting</p>
              <ul className="text-sm text-stone-400 space-y-2">
                <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> Teliti Sebelum Membeli</li>
                <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> Semoga Jadi Amanah</li>
                <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> Harga Bersahabat Burung Sehat</li>
                <li className="flex items-center gap-2"><span className="text-amber-500">✓</span> Rawatlah Burungmu Dengan Kasih Sayang</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
