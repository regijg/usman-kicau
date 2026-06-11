import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "USMAN - Usaha Manuk",
  description: "Grosir dan Ecer Burung Kicau Berkualitas",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="bg-amber-50 text-stone-900">{children}</body>
    </html>
  )
}
