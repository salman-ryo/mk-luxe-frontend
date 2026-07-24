import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative h-[70vh] lg:h-[80vh] flex items-center overflow-hidden max-md:px-8">
      <div className="absolute inset-0 bg-linear-to-r from-background via-background/60 lg:via-background/40 to-transparent z-10" />
      <img
        src="/images/hero/dark-moody-luxury-jewelry-necklace.jpg"
        alt="Hero Jewelry"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <div className="container mr-auto px-4 relative z-20 max-w-2xl pl-4 sm:pl-16 lg:pl-32">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-4 sm:mb-6 leading-tight uppercase tracking-tight text-center sm:text-left">
          Unveil your inner <br />
          <span className="text-primary">Luminance</span>
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg mb-8 sm:mb-10 max-w-md mx-auto sm:mx-0 text-center sm:text-left">
          Explore collections of rare and refined adornments designed to reflect
          your unique essence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/shop"
            className="w-full sm:w-auto bg-champagne-gold text-black px-8 py-3 rounded-xs flex place-content-center uppercase tracking-widest text-sm font-bold hover:bg-champagne-gold/70 transition-colors"
          >
            Shop Now
          </Link>
          <Link
            href="/collections"
            className="w-full sm:w-auto border-[3px] border-champagne-gold text-champagne-gold px-8 py-3 rounded-xs flex place-content-center uppercase tracking-widest text-sm font-bold hover:bg-champagne-gold hover:text-black transition-colors"
          >
            View Collections
          </Link>
        </div>
      </div>
    </section>
  );
}