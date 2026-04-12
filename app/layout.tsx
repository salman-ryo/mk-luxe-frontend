import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })

export const metadata: Metadata = {
  title: "MK Luxe Divine",
  description: "Unveil your inner luminance with our collection of rare and refined adornments.",
  generator: 'v0.app',
  // This adds the apple-mobile-web-app-title meta tag
  appleWebApp: {
    title: "MK Luxe",
    statusBarStyle: "default",
  },
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <Navbar />
        <main className="grow">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
