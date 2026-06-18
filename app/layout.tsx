import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "USMAN - Usaha Manuk | Jual Burung Kicau",
    template: "%s | USMAN Usaha Manuk",
  },
  description: "Jual burung kicau pilihan, grosir & ecer. Stok selalu fresh, harga bersahabat, amanah. Kenari, Lovebird, Cucak Ijo, Murai Batu, dan banyak lagi.",
  keywords: ["jual burung kicau", "burung kicau", "grosir burung", "lovebird", "kenari", "murai batu", "cucak ijo", "pakan burung", "USMAN", "usaha manuk"],
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "USMAN - Usaha Manuk",
    title: "USMAN - Usaha Manuk | Jual Burung Kicau",
    description: "Jual burung kicau pilihan, grosir & ecer. Stok fresh, harga bersahabat.",
  },
  twitter: {
    card: "summary_large_image",
    title: "USMAN - Usaha Manuk",
    description: "Jual burung kicau pilihan, grosir & ecer.",
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        {/* Prevent flash of wrong theme */}
        <script dangerouslySetInnerHTML={{ __html: `try{const s=localStorage.getItem('theme');const p=window.matchMedia('(prefers-color-scheme:dark)').matches;if(s==='dark'||(s===null&&p))document.documentElement.classList.add('dark')}catch(e){}` }} />
      </head>
      <body className="bg-amber-50 dark:bg-stone-950 text-stone-800 dark:text-stone-100">
        {children}
      </body>
    </html>
  )
}
