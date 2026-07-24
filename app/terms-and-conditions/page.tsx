
// app/terms-and-conditions/page.tsx

import Link from "next/link"
import { FileText, Scale, ShieldCheck, Mail, Phone, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { termsPageData } from "@/lib/constants/legal-pages-data"

const iconMap = {
  scale: Scale,
  shield: ShieldCheck,
  file: FileText,
}

function SectionCard({
  title,
  content,
}: {
  title: string
  content: string[]
}) {
  return (
    <section className="bg-muted/20 border border-border/50 p-6 md:p-8 shadow-sm">
      <h2 className="text-xl md:text-2xl font-serif mb-4 text-foreground">
        {title}
      </h2>

      <div className="space-y-4">
        {content.map((paragraph) => (
          <p
            key={paragraph}
            className="text-sm md:text-base leading-7 text-muted-foreground"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  )
}

export default function TermsAndConditionsPage() {
  const { hero, sections, contact } = termsPageData

  return (
    <main className="min-h-screen bg-background text-foreground py-20 md:py-24 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-14 md:mb-16">
          <div className="hidden md:fixed bottom-4 left-4 border border-primary/25 bg-primary/5 px-4 py-2 uppercase tracking-[0.3em] text-xs text-primary">
          <div className="flex justify-center items-center gap-x-2">

            <Scale className="w-4 h-4" />
            {hero.eyebrow}
          </div>
          </div>

          <h1 className="text-4xl md:text-6xl font-serif mb-4">
            {hero.title}
          </h1>

          <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
            {hero.subtitle}
          </p>

          <p className="mt-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            {hero.updatedAt}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_0.9fr] gap-16">
          <div className="space-y-6">
            {sections.map((section) => (
              <SectionCard
                key={section.title}
                title={section.title}
                content={section.content}
              />
            ))}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-24 h-fit">
            <div className="bg-card border border-border/50 p-6 md:p-8">
              <h2 className="text-lg uppercase tracking-[0.3em] font-bold mb-5 text-primary">
                Quick Summary
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 w-9 h-9 rounded-full border border-primary/25 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    These terms cover browsing, enquiries, order handling, pricing, and product availability.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 w-9 h-9 rounded-full border border-primary/25 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    We keep the language simple so future changes are easy to update without changing the page structure.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border/50 p-6 md:p-8">
              <h3 className="text-sm uppercase tracking-[0.3em] font-bold text-primary mb-4">
                Contact
              </h3>

              <div className="space-y-4 text-sm text-muted-foreground">
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 hover:text-foreground transition-colors"
                >
                  <Mail className="w-4 h-4 text-primary" />
                  <span>{contact.email}</span>
                </a>

                <a
                  href={`https://wa.me/${contact.phone.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:text-foreground transition-colors"
                >
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{contact.phone}</span>
                </a>

                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span>{contact.address}</span>
                </div>
              </div>

              <div className="mt-6">
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="w-full rounded-none uppercase tracking-widest"
                  >
                    Get in Touch
                  </Button>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}