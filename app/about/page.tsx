// app/about/page.tsx

import Image from "next/image";
import Link from "next/link";

import { Hammer, Heart, ShieldCheck, Award } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  aboutPageData,
  type FeatureItem,
} from "@/lib/constants/about-page-data";

const iconMap = {
  hammer: Hammer,
  heart: Heart,
  shield: ShieldCheck,
  award: Award,
};

export default function AboutPage() {
  const { hero, features, milestones, founder } = aboutPageData;

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-start overflow-hidden">
        <Image
          src={hero.image}
          alt={hero.imageAlt}
          fill
          className="object-cover brightness-[0.4]"
          priority
        />

        <div className="relative z-10 px-4 text-start max-w-7xl md:ml-52 md:pt-10">
          <h1 className="text-5xl md:text-7xl uppercase font-serif mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {hero.title}
          </h1>

          <p className="text-xl md:text-2xl text-primary font-medium mb-8 max-w-2xl">
            {hero.subtitle}
          </p>

          <p className="text-white max-w-xl mb-10 text-balance">
            {hero.description}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-start gap-4">
            <Link href={hero.primaryButton.href}>
              <Button
                size="lg"
                className="px-10 py-6 text-base uppercase tracking-widest rounded-none"
                variant="champagneGold"
              >
                {hero.primaryButton.label}
              </Button>
            </Link>
            {hero.secondaryButton?.href && (
              <Link href={hero.secondaryButton.href}>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-10 py-6 text-base uppercase tracking-widest rounded-none border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10 bg-transparent"
                >
                  {hero.secondaryButton.label}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 px-16 bg-[#0a0a0c]">
        <div className="container px-4 mx-auto">
          <div className="mb-16">
            <h2 className="text-sm uppercase tracking-[0.3em] font-bold text-primary inline-block border-b-2 border-primary pb-2 mb-4">
              {features.sectionTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.items.map((item: FeatureItem) => {
              const Icon = iconMap[item.icon];

              return (
                <div
                  key={item.title}
                  className="bg-muted/30 border border-border/50 p-10 flex flex-col items-center text-center group hover:border-primary/50 transition-all"
                >
                  <div className="w-20 h-20 rounded-full border border-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-background transition-colors">
                    <Icon className="w-8 h-8" />
                  </div>

                  <h3 className="text-lg uppercase tracking-widest font-bold mb-4">
                    {item.title}
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-12 px-16 border-y border-border/50 bg-muted/10">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-4">
            <div className="text-primary font-bold tracking-[0.2em] uppercase">
              {milestones.sectionTitle}
            </div>

            <div className="hidden lg:block w-px h-12 bg-border/50" />

            <div className="flex flex-col md:flex-row gap-8 md:gap-16 items-center">
              {milestones.items.map((item, index) => (
                <div key={index} className="flex items-center gap-4 group">
                  <span className="text-primary font-bold">{item.date}:</span>

                  <span className="uppercase tracking-widest text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-24 px-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-sm uppercase tracking-[0.3em] font-bold text-primary mb-12">
            {founder.sectionTitle}
          </h2>

          <div className="bg-muted/20 border border-border/50 p-8 md:p-12 flex flex-col md:flex-row items-center gap-12">
            <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-primary p-2 shrink-0">
              <div className="relative w-full h-full rounded-full overflow-hidden">
                <Image
                  src={founder.image}
                  alt={founder.name}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-serif mb-2">
                {founder.name}
              </h3>

              <p className="text-primary uppercase tracking-widest text-sm font-bold mb-6">
                {founder.role}
              </p>

              <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl italic">
                "{founder.quote}"
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
