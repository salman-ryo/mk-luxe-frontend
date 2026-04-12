import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, MessageCircle } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border/50 mt-auto">
      <div className="container mx-auto px-6 py-16">
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          
          {/* Brand Section - Takes more space */}
          <div className="lg:col-span-5 space-y-6">
            <Link href="/" className="inline-block">
              <Image
                src="/logo/mk-luxe-logo.png"
                alt="MK Luxe Divine"
                width={160}
                height={45}
                className="h-14 w-auto invert brightness-0 contrast-200 object-contain"
              />
            </Link>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Timeless jewelry pieces handcrafted with precision and passion. Each design tells a story of elegance and sophistication.
            </p>
            
            {/* WhatsApp CTA */}
            {/* <a
              href="https://wa.me/1234567890" // Replace with your number
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md transition-all duration-300 font-medium text-sm group"
            >
              <FaWhatsapp
 className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Chat with Us
            </a> */}
          </div>

          {/* Navigation */}
          <div className="lg:col-span-3 lg:col-start-7">
            <h4 className="font-semibold text-foreground mb-6 tracking-tight">Explore</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Shop Collection
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                  Get in Touch
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Social */}
          <div className="lg:col-span-3">
            <h4 className="font-semibold text-foreground mb-6 tracking-tight">Connect</h4>
            <div className="space-y-4 mb-6">
              <p className="text-sm text-muted-foreground">
                Questions about our pieces? We're here to help you find the perfect jewelry.
              </p>
              <a 
                href="mailto:hello@mkluxedivine.com" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block"
              >
                hello@mkluxedivine.com
              </a>
            </div>
            
            {/* Social Links */}
            <div className="flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-all"
                aria-label="Facebook"
              >
                <FaWhatsapp className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© {currentYear} MK Luxe Divine.</p>
          <div className="flex gap-6">
            <Link href="/terms-and-conditions" className="hover:text-foreground transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            {/* <Link href="/shipping" className="hover:text-foreground transition-colors">
              Shipping
            </Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
