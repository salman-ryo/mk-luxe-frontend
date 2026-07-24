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
      <section className="relative min-h-[85vh] md:min-h-0 md:h-[70vh] py-24 md:py-0 flex items-center justify-start overflow-hidden">
        <Image
          src={hero.image}
          alt={hero.imageAlt}
          fill
          className="object-cover brightness-[0.4]"
          priority
        />

        <div className="relative z-10 px-4 text-start w-full max-w-7xl md:ml-52 md:pt-10 max-md:px-6 sm:max-md:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-7xl uppercase font-serif mb-4 md:mb-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {hero.title}
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-primary font-medium mb-6 md:mb-8 max-w-2xl">
            {hero.subtitle}
          </p>

          <p className="text-sm sm:text-base md:text-lg text-white max-w-xl mb-8 md:mb-10 text-balance">
            {hero.description}
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-4 w-full sm:w-auto">
            <Link href={hero.primaryButton.href} className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto px-6 py-6 md:px-10 text-sm md:text-base uppercase tracking-widest rounded-none"
                variant="champagneGold"
              >
                {hero.primaryButton.label}
              </Button>
            </Link>
            {hero.secondaryButton?.href && (
              <Link href={hero.secondaryButton.href} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto px-6 py-6 md:px-10 text-sm md:text-base uppercase tracking-widest rounded-none border-champagne-gold text-champagne-gold hover:bg-champagne-gold/10 bg-transparent"
                >
                  {hero.secondaryButton.label}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-16 bg-[#0a0a0c]">
        <div className="container px-4 mx-auto">
          <div className="mb-10 md:mb-16">
            <h2 className="text-xs md:text-sm uppercase tracking-[0.3em] font-bold text-primary inline-block border-b-2 border-primary pb-2 mb-4">
              {features.sectionTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.items.map((item: FeatureItem) => {
              const Icon = iconMap[item.icon];

              return (
                <div
                  key={item.title}
                  className="bg-muted/30 border border-border/50 p-6 md:p-10 flex flex-col items-center text-center group hover:border-primary/50 transition-all"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-primary flex items-center justify-center mb-4 md:mb-6 group-hover:bg-primary group-hover:text-background transition-colors">
                    <Icon className="w-6 h-6 md:w-8 md:h-8" />
                  </div>

                  <h3 className="text-base md:text-lg uppercase tracking-widest font-bold mb-3 md:mb-4">
                    {item.title}
                  </h3>

                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-10 md:py-12 px-4 sm:px-6 md:px-16 border-y border-border/50 bg-muted/10">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8 py-2 md:py-4">
            <div className="text-primary font-bold tracking-[0.2em] uppercase text-center lg:text-left text-sm md:text-base">
              {milestones.sectionTitle}
            </div>

            <div className="hidden lg:block w-px h-12 bg-border/50" />

            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-16 items-center w-full sm:w-auto">
              {milestones.items.map((item, index) => (
                <div key={index} className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4 group text-center sm:text-left">
                  <span className="text-primary font-bold text-sm md:text-base">{item.date}:</span>

                  <span className="uppercase tracking-widest text-xs md:text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    {item.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="py-16 md:py-24 px-4 sm:px-6 md:px-16">
        <div className="container px-4 mx-auto">
          <h2 className="text-xs md:text-sm uppercase tracking-[0.3em] font-bold text-primary mb-8 md:mb-12">
            {founder.sectionTitle}
          </h2>

          <div className="bg-muted/20 border border-border/50 p-6 sm:p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="relative w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-2 border-primary p-2 shrink-0">
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
              <h3 className="text-xl sm:text-2xl md:text-3xl font-serif mb-2">
                {founder.name}
              </h3>

              <p className="text-primary uppercase tracking-widest text-xs md:text-sm font-bold mb-4 md:mb-6">
                {founder.role}
              </p>

              <p className="text-sm md:text-lg text-muted-foreground leading-relaxed max-w-2xl italic">
                "{founder.quote}"
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}