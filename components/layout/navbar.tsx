"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Menu, X } from "lucide-react"
import clsx from "clsx"
import Image from "next/image"

const navItems = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
]

export function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    console.log("Mock Search:", searchQuery)
    alert(`Searching for: ${searchQuery}`)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/5 backdrop-blur-md py-3 px-4">
      {/* 
         LAYOUT FIX:
         - Mobile: 'flex justify-between' pushes content to edges.
         - Desktop: 'md:grid' takes over to perfectly center the nav.
      */}
      <div className="container mx-auto flex justify-between items-center md:grid md:grid-cols-[1fr_auto_1fr] px-4 h-16 md:h-auto">
        
        {/* Left: Logo */}
        <div className="flex justify-start">
          <Link href="/" className=" inline-block">
            <img
              src={"/logo/mk-luxe-logo.png"}
              alt="MK Luxe Divine Logo"
              className="object-contain h-12 w-auto md:h-16"
            />
          </Link>
        </div>

        {/* Center: Desktop Nav (Hidden on Mobile) */}
        <nav className="hidden md:flex items-center gap-10 text-xs uppercase tracking-widest font-medium  px-6 py-2">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "pb-1 transition-colors border-b",
                  isActive
                    ? "text-champagne-gold border-champagne-gold"
                    : "text-white/70 border-transparent hover:text-champagne-gold hover:border-champagne-gold/60"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right: Search Bar & Mobile Toggle */}
        <div className="flex justify-end items-center gap-4">
          
          {/* Desktop Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center border-b border-champagne-gold/50 hover:border-champagne-gold transition-colors pb-1">
            <input
              type="text"
              placeholder="SEARCH"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-champagne-gold placeholder:text-champagne-gold/50 text-xs uppercase tracking-widest focus:outline-none w-32"
            />
            <button type="submit" className="text-champagne-gold hover:text-white transition-colors">
              <Search className="w-4 h-4" />
            </button>
          </form>



          {/* Mobile Hamburger Menu Toggle */}
          <button 
            className="md:hidden text-champagne-gold"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-cyan-900 border-t border-border shadow-lg">
          <div className="container mx-auto px-4 py-6 flex flex-col gap-6">
            {/* Mobile Nav Items */}
            <nav className="flex flex-col gap-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-champagne-gold uppercase tracking-widest text-sm font-medium hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            
            {/* Mobile Search Input */}
            <form onSubmit={handleSearch} className="flex items-center border border-champagne-gold/30 p-2 rounded /20">
              <input
                 type="text"
                 placeholder="Search..."
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="bg-transparent text-champagne-gold placeholder:text-champagne-gold/50 text-xs w-full focus:outline-none"
              />
              <Search className="w-4 h-4 text-champagne-gold" />
            </form>
          </div>
        </div>
      )}
    </header>
  )
}
