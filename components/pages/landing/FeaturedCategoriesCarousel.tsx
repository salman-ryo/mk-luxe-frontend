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
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-xl uppercase tracking-[0.3em] text-primary underline underline-offset-8 decoration-champagne-gold decoration-2">
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
        - Mobile/tablet (<lg): CSS grid, same as before
        - Desktop (lg+):       flex row with hidden scrollbar
      */}
      <div
        ref={scrollRef}
        className={[
          // Base: grid for mobile/tablet
          'grid grid-cols-2 md:grid-cols-4 gap-8',
          // Desktop override: horizontal scroll strip
          'lg:flex lg:flex-row lg:overflow-x-auto lg:gap-8 lg:pb-2',
          // Hide scrollbar cross-browser
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        ].join(' ')}
      >
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            // On lg+: fixed width so items don't collapse in flex
            className="group aspect-square flex flex-col items-center justify-center gap-3 bg-deep-slate rounded-lg lg:shrink-0 lg:w-60"
          >
            <div className="relative w-40 h-40 rounded-full border-2 border-champagne-gold p-4 group-hover:border-primary transition-colors duration-700">
              <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                <img
                  src={cat.image_url || '/placeholder.svg'}
                  alt={cat.name}
                  className="w-2/3 h-2/3 object-contain"
                />
              </div>
            </div>
            <span className="uppercase tracking-widest text-xs font-bold group-hover:text-primary">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}