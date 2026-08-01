import type { Metadata } from "next"
import LandingScreen from "@/components/pages/landing/LandingScreen"

export const metadata: Metadata = {
  title: "MK Luxe Divine | Fine Jewelry & Luxury Adornments",
  description: "Explore exquisite handcrafted luxury jewelry, celestial neckpieces, gold bangles, and diamond adornments at MK Luxe Divine.",
  alternates: {
    canonical: "https://mk-luxe-divine.in",
  },
  openGraph: {
    title: "MK Luxe Divine | Fine Jewelry & Luxury Adornments",
    description: "Explore exquisite handcrafted luxury jewelry, celestial neckpieces, gold bangles, and diamond adornments at MK Luxe Divine.",
    url: "https://mk-luxe-divine.in",
  },
}

export default function LandingPage() {
  return <LandingScreen />
}
