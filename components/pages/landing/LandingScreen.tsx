import { Suspense } from "react";
import HeroSection from "@/components/pages/landing/HeroSection";
import FeaturedCategories from "@/components/pages/landing/FeaturedCategories";
import FeaturedCategoriesSkeleton from "@/components/pages/landing/FeaturedCategoriesSkeleton";
import Bestsellers from "@/components/pages/landing/Bestsellers";
import BestsellersSkeleton from "@/components/pages/landing/BestsellersSkeleton";

export default function LandingScreen() {
  return (
    <div className="flex flex-col bg-midnight-charcoal">
      {/* Hero is static — no Suspense needed */}
      <HeroSection />

      {/* Streams in independently as soon as categories resolve */}
      <Suspense fallback={<FeaturedCategoriesSkeleton />}>
        <FeaturedCategories />
      </Suspense>

      {/* Streams in independently as soon as products resolve */}
      <Suspense fallback={<BestsellersSkeleton />}>
        <Bestsellers />
      </Suspense>
    </div>
  );
}