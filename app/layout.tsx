import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })

export const metadata: Metadata = {
  metadataBase: new URL("https://mk-luxe-divine.in"),
  title: {
    default: "MK Luxe Divine | Fine Jewelry & Luxury Adornments",
    template: "%s | MK Luxe Divine",
  },
  description: "Unveil your inner luminance with our collection of rare and refined luxury fine jewelry, diamonds, handcrafted bangles, and bespoke adornments.",
  keywords: [
    "MK Luxe Divine",
    "Luxury Jewelry",
    "Fine Jewelry India",
    "Gold Necklaces",
    "Diamond Rings",
    "Handcrafted Adornments",
    "Bespoke Jewelry",
    "Celestial Jewelry Collection",
  ],
  authors: [{ name: "MK Luxe Divine" }],
  creator: "MK Luxe Divine",
  publisher: "MK Luxe Divine",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mk-luxe-divine.in",
    siteName: "MK Luxe Divine",
    title: "MK Luxe Divine | Fine Jewelry & Luxury Adornments",
    description: "Unveil your inner luminance with our collection of rare and refined luxury fine jewelry and bespoke adornments.",
    images: [
      {
        url: "/logo/mk-luxe-logo.png",
        width: 1200,
        height: 630,
        alt: "MK Luxe Divine Luxury Jewelry",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MK Luxe Divine | Fine Jewelry & Luxury Adornments",
    description: "Unveil your inner luminance with our collection of rare and refined luxury fine jewelry and bespoke adornments.",
    images: ["/logo/mk-luxe-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  verification: {
    google: "GOOGLE_SEARCH_CONSOLE_VERIFICATION_TOKEN",
  },
  appleWebApp: {
    title: "MK Luxe",
    statusBarStyle: "default",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://mk-luxe-divine.in/#organization",
      "name": "MK Luxe Divine",
      "url": "https://mk-luxe-divine.in",
      "logo": "https://mk-luxe-divine.in/logo/mk-luxe-logo.png",
      "description": "Unveil your inner luminance with our collection of rare and refined luxury fine jewelry and adornments."
    },
    {
      "@type": "WebSite",
      "@id": "https://mk-luxe-divine.in/#website",
      "url": "https://mk-luxe-divine.in",
      "name": "MK Luxe Divine",
      "description": "Exquisite luxury fine jewelry, gold, diamonds, and refined adornments.",
      "publisher": {
        "@id": "https://mk-luxe-divine.in/#organization"
      },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://mk-luxe-divine.in/shop?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: 'dark' }}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <Providers>
          <Navbar />
          <main className="grow">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
