'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Category } from '@/types/api';

interface Props {
  categories: Category[];
}

const SCROLL_BTN_CLASS =
  'w-9 h-9 flex items-center justify-center border border-champagne-gold ' +
  'text-champagne-gold rounded-sm transition-colors duration-300 ' +
  'hover:bg-champagne-gold hover:text-black ' +
  'disabled:opacity-25 disabled:pointer-events-none';

export default function FeaturedCategoriesCarousel({ categories }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });

    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);

    return () => {
      el.removeEventListener('scroll', updateScrollState);
      ro.disconnect();
    };
  }, [updateScrollState]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    // Scroll by 2 items worth — derived from actual first child width
    const firstChild = el.firstElementChild as HTMLElement | null;
    const itemWidth = firstChild ? firstChild.offsetWidth + 32 : 300; // 32px = gap-8
    el.scrollBy({ left: direction === 'left' ? -(itemWidth * 2) : itemWidth * 2, behavior: 'smooth' });
  };

  return (
    <>
      {/* Header row: title left, scroll arrows right (lg+ only) */}
      <div className="flex items-center justify-between mb-8 lg:mb-12">
        <h2 className="text-lg lg:text-xl uppercase tracking-[0.3em] text-primary underline underline-offset-8 decoration-champagne-gold decoration-2">
          Featured Categories
        </h2>

        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll categories left"
            className={SCROLL_BTN_CLASS}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll categories right"
            className={SCROLL_BTN_CLASS}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/*
        - Mobile/tablet (<lg): swipeable horizontal scroll with snap
        - Desktop (lg+): flex row with hidden scrollbar
      */}
      <div
        ref={scrollRef}
        className={[
          // Base: swipeable flex row for mobile/tablet
          'flex overflow-x-auto snap-x snap-mandatory gap-4 sm:gap-6 pb-6',
          // Desktop override: match original desktop layout
          'lg:flex-row lg:gap-8 lg:pb-2 lg:snap-none',
          // Hide scrollbar cross-browser
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        ].join(' ')}
      >
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className="group aspect-square flex flex-col items-center justify-center gap-3 bg-deep-slate rounded-lg p-4 shrink-0 w-[42vw] sm:w-[28vw] md:w-[22vw] snap-start lg:w-60 lg:snap-none"
          >
            <div className="relative size-24 sm:size-32 md:size-40 rounded-full border-2 border-champagne-gold p-2 sm:p-4 group-hover:border-primary transition-colors duration-700">
              <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                <img
                  src={cat.image_url || '/placeholder.svg'}
                  alt={cat.name}
                  className="size-full object-cover"
                />
              </div>
            </div>
            <span className="uppercase tracking-widest text-[10px] sm:text-xs font-bold group-hover:text-primary text-center">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}