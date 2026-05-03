import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative h-[80vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-r from-background via-background/40 to-transparent z-10" />
      <img
        src="/images/hero/dark-moody-luxury-jewelry-necklace.jpg"
        alt="Hero Jewelry"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <div className="container mr-auto px-4 relative z-20 max-w-2xl pl-32">
        <h1 className="text-5xl font-serif mb-6 leading-tight uppercase tracking-tight">
          Unveil your inner <br />
          <span className="text-primary">Luminance</span>
        </h1>
        <p className="text-muted-foreground text-lg mb-10 max-w-md">
          Explore collections of rare and refined adornments designed to reflect
          your unique essence.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/shop"
            className="bg-champagne-gold text-black px-8 py-3 rounded-xs flex place-content-center uppercase tracking-widest text-sm font-bold hover:bg-champagne-gold/70 transition-colors"
          >
            Shop Now
          </Link>
          <Link
            href="/collections"
            className="border-[3px] border-champagne-gold text-champagne-gold px-8 py-3 rounded-xs flex place-content-center uppercase tracking-widest text-sm font-bold hover:bg-champagne-gold hover:text-black transition-colors"
          >
            View Collections
          </Link>
        </div>
      </div>
    </section>
  );
}