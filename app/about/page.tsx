import Image from "next/image"
import { Hammer, Heart, ShieldCheck, Award } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-start overflow-hidden">
        <Image
          src="/craftsman-working-on-jewellery.jpg"
          alt="Our Story"
          fill
          className="object-cover brightness-[0.4]"
          priority
        />
        <div className="relative z-10 px-4 text-start max-w-7xl md:ml-52 md:pt-10">
          <h1 className="text-5xl md:text-7xl uppercase font-serif mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            Our Story
          </h1>
          <p className="text-xl md:text-2xl text-primary font-medium mb-8 max-w-2xl mx-auto">
            Crafted with Passion, Timeless by Design.
          </p>
          <p className="text-white max-w-xl mx-auto mb-10 text-balance">
            Founded in 20XX, NOXUS has emerged from a passion for impeccable artistry. Each piece is a testament to our
            commitment to excellence and timeless beauty.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-start gap-4">
            <Button size="lg" className="px-10 py-6 text-base uppercase tracking-widest rounded-none" variant={"champagneGold"}>
              Shop Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-10 py-6 text-base uppercase tracking-widest rounded-none border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10 bg-transparent"
            >
              View Collections
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-[#0a0a0c]">
        <div className="container px-4 mx-auto">
          <div className="mb-16">
            <h2 className="text-sm uppercase tracking-[0.3em] font-bold text-primary inline-block border-b-2 border-primary pb-2 mb-4">
              Why Choose Us
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Hammer, title: "Our Origin", desc: "Crafted by master artisans with decades of experience." },
              { icon: Heart, title: "Ethical Sourcing", desc: "Every diamond and gemstone is responsibly sourced." },
              {
                icon: ShieldCheck,
                title: "Premium Quality",
                desc: "Rigorous standards for every single piece we create.",
              },
              { icon: Award, title: "Lifetime Warranty", desc: "We stand behind our craftsmanship forever." },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-muted/30 border border-border/50 p-10 flex flex-col items-center text-center group hover:border-primary/50 transition-all"
              >
                <div className="w-20 h-20 rounded-full border border-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-background transition-colors">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="text-lg uppercase tracking-widest font-bold mb-4">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-12 border-y border-border/50 bg-muted/10">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-4">
            <div className="text-primary font-bold tracking-[0.2em] uppercase">Milestones</div>
            <div className="hidden lg:block w-1px h-12 bg-border/50" />
            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
              {[
                { date: "20XX", title: "Foundation" },
                { date: "20XX", title: "First Collection Launch" },
                { date: "Today", title: "A Growing Legacy" },
              ].map((m, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <span className="text-primary font-bold">{m.date}:</span>
                  <span className="uppercase tracking-widest text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {m.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24">
        <div className="container px-4 mx-auto">
          <h2 className="text-sm uppercase tracking-[0.3em] font-bold text-primary mb-12">Meet The Founder</h2>
          <div className="bg-muted/20 border border-border/50 p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-primary p-2 shrink-0">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image src="/luxury-brand-founder-portrait.jpg" alt="Ava L." fill className="object-cover" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-serif mb-2">Ava L.</h3>
              <p className="text-primary uppercase tracking-widest text-sm font-bold mb-6">Founder & CEO</p>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl italic">
                "Driven by a relentless pursuit of excellence and a deep-seated love for fine jewellery, NOXUS was
                created to bridge the gap between traditional craftsmanship and modern elegance."
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
