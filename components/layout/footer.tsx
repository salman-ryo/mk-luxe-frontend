"use client"

// components/layout/footer.tsx

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

import {
  Instagram,
  Facebook,
  Mail,
  Phone,
} from "lucide-react"

import { FaWhatsapp } from "react-icons/fa"

import { siteConfig } from "@/lib/constants/site-config"

const socialIcons = {
  instagram: Instagram,
  facebook: Facebook,
  whatsapp: FaWhatsapp,
  mail: Mail,
  phone: Phone,
}

export function Footer() {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null;

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border/50 mt-auto pt-24 pb-6 px-6 md:px-16 max-md:pt-10">
      <div className="container mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="inline-block">
              <Image
                src="/logo/mk-luxe-logo.png"
                alt={siteConfig.brand.name}
                width={160}
                height={45}
                className="h-14 w-auto invert brightness-0 contrast-200 object-contain"
              />
            </Link>

            <p className="text-muted-foreground leading-relaxed max-w-md">
              {siteConfig.brand.description}
            </p>

            {/* WhatsApp CTA */}
            {/* <a
              href={`https://wa.me/${siteConfig.brand.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition-all duration-300 font-medium text-sm group"
            >
              <FaWhatsapp className="w-4 h-4 group-hover:scale-110 transition-transform" />

              <span>Chat with Us</span>
            </a> */}
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3 lg:col-start-7">
            <h4 className="font-semibold text-foreground mb-6 tracking-tight">
              Explore
            </h4>

            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/shop"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Shop Collection
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Our Story
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Get in Touch
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="lg:col-span-3">
            <h4 className="font-semibold text-foreground mb-6 tracking-tight">
              Connect
            </h4>

            <div className="space-y-4 mb-6">
              <p className="text-sm text-muted-foreground">
                Questions about our collections? Reach out anytime and
                we'll help you find the right piece.
              </p>

              <a
                href={`mailto:${siteConfig.brand.email}`}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="w-4 h-4" />

                <span>{siteConfig.brand.email}</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-3">
              {siteConfig.socials
                .filter((social) =>
                  ["instagram", "facebook", "whatsapp"].includes(
                    social.icon
                  )
                )
                .map((social) => {
                  const Icon =
                    socialIcons[
                    social.icon as keyof typeof socialIcons
                    ]

                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all"
                      aria-label={social.label}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  )
                })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>
            © {currentYear} {siteConfig.brand.name}.
          </p>

          <div className="flex gap-6">
            <Link
              href="/terms-and-conditions"
              className="hover:text-foreground transition-colors"
            >
              Terms & Conditions
            </Link>

            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}