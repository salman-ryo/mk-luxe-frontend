'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { animate, type AnimationPlaybackControls } from 'framer-motion';
import type { Product } from '@/types/api';

interface Props {
  products: Product[];
}

// ─── Auto-scroll tuning ────────────────────────────────────────────────────
const PX_PER_SECOND      = 50;   // Base drift speed (lower = slower)
const SEGMENT_MIN_PX     = 280;  // Shortest single scroll burst
const SEGMENT_MAX_PX     = 560;  // Longest single scroll burst
const DIR_FLIP_CHANCE    = 0.35; // Probability to reverse direction after a segment
const RESUME_DELAY_MS    = 1800; // Grace period before resuming after user interaction
const MOUNT_DELAY_MS     = 900;  // Wait for layout to settle before starting
// ───────────────────────────────────────────────────────────────────────────

const SCROLL_BTN_CLASS =
  'w-9 h-9 flex items-center justify-center border border-champagne-gold ' +
  'text-champagne-gold rounded-sm transition-colors duration-300 ' +
  'hover:bg-champagne-gold hover:text-black ' +
  'disabled:opacity-25 disabled:pointer-events-none';

export default function BestsellersCarousel({ products }: Props) {
  const scrollRef   = useRef<HTMLDivElement>(null);

  // Framer Motion animation controls — kept in a ref so stop/start never
  // trigger re-renders.
  const animRef     = useRef<AnimationPlaybackControls | null>(null);
  const dirRef      = useRef<1 | -1>(1);  // 1 = right, -1 = left
  const isHovered   = useRef(false);
  const isUserInput = useRef(false);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [canScrollLeft,  setCanScrollLeft]  = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // ── Scroll state (button enable/disable) ─────────────────────────────────
  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  // ── Guard: only run on desktop, respect reduced-motion preference ─────────
  const shouldAutoScroll = (): boolean => {
    if (typeof window === 'undefined') return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    if (!window.matchMedia('(min-width: 1024px)').matches) return false;
    return true;
  };

  // ── Core auto-scroll engine ───────────────────────────────────────────────
  // Declared with useCallback([]) so its reference is stable — safe to capture
  // inside onComplete without creating a stale-closure loop.
  const startAutoScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || isHovered.current || isUserInput.current) return;
    if (!shouldAutoScroll()) return;

    const maxScroll = el.scrollWidth - el.clientWidth;

    // Flip direction at the edges before choosing a target
    if (el.scrollLeft >= maxScroll - 4) dirRef.current = -1;
    if (el.scrollLeft <= 4)             dirRef.current =  1;

    // Random segment length → variable drift feel
    const segPx   = SEGMENT_MIN_PX + Math.random() * (SEGMENT_MAX_PX - SEGMENT_MIN_PX);
    const rawTarget = el.scrollLeft + dirRef.current * segPx;
    const target    = Math.max(0, Math.min(maxScroll, rawTarget));
    const distance  = Math.abs(target - el.scrollLeft);

    if (distance < 4) return; // Nothing to animate (already at edge)

    const duration = distance / PX_PER_SECOND;

    // framer-motion imperative animate: animates a number, fires onUpdate each frame
    animRef.current = animate(el.scrollLeft, target, {
      duration,
      ease: 'linear',
      onUpdate: (v) => {
        if (scrollRef.current) scrollRef.current.scrollLeft = v;
      },
      onComplete: () => {
        // Randomly decide whether to reverse direction for variety
        if (Math.random() < DIR_FLIP_CHANCE) {
          dirRef.current = dirRef.current === 1 ? -1 : 1;
        }
        startAutoScroll(); // Chain next segment
      },
    });
  }, []); // Stable reference — intentionally empty deps

  // ── Pause / schedule-resume helpers ──────────────────────────────────────
  const pauseAutoScroll = useCallback(() => {
    animRef.current?.stop();
    animRef.current = null;
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  const scheduleResume = useCallback(() => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => {
      if (!isHovered.current && !isUserInput.current) startAutoScroll();
    }, RESUME_DELAY_MS);
  }, [startAutoScroll]);

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Initial scroll-state check
    updateScrollState();
    el.addEventListener('scroll', updateScrollState, { passive: true });

    // ResizeObserver: re-check state on container resize (e.g. window resize,
    // mobile↔desktop switch)
    const ro = new ResizeObserver(() => {
      updateScrollState();
      // If we switched to desktop and auto-scroll isn't running, restart it.
      if (shouldAutoScroll() && !animRef.current) startAutoScroll();
    });
    ro.observe(el);

    // User-input detection — any wheel or touch pauses auto-scroll
    const onUserInput = () => {
      isUserInput.current = true;
      pauseAutoScroll();
      scheduleResume();
      // Clear the flag after the grace period
      setTimeout(() => { isUserInput.current = false; }, RESUME_DELAY_MS);
    };
    el.addEventListener('wheel',      onUserInput, { passive: true });
    el.addEventListener('touchstart', onUserInput, { passive: true });

    // Slight delay so layout/images have settled before we read scrollWidth
    mountTimer.current = setTimeout(startAutoScroll, MOUNT_DELAY_MS);

    return () => {
      el.removeEventListener('scroll',     updateScrollState);
      el.removeEventListener('wheel',      onUserInput);
      el.removeEventListener('touchstart', onUserInput);
      ro.disconnect();
      animRef.current?.stop();
      if (mountTimer.current)  clearTimeout(mountTimer.current);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
    };
  }, [updateScrollState, startAutoScroll, pauseAutoScroll, scheduleResume]);

  // ── Manual scroll buttons ─────────────────────────────────────────────────
  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;

    pauseAutoScroll();

    const firstChild = el.firstElementChild as HTMLElement | null;
    const itemWidth  = firstChild ? firstChild.offsetWidth + 32 : 420;

    el.scrollBy({
      left: direction === 'left' ? -(itemWidth * 2) : itemWidth * 2,
      behavior: 'smooth',
    });

    // Snap the auto-scroll direction to match the manual action so the next
    // auto-scroll segment continues in the same direction
    dirRef.current = direction === 'left' ? -1 : 1;
    scheduleResume();
  };

  // ── Hover: pause while the user inspects a card ───────────────────────────
  const handleMouseEnter = () => {
    isHovered.current = true;
    pauseAutoScroll();
  };

  const handleMouseLeave = () => {
    isHovered.current = false;
    scheduleResume();
  };

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* Header row: title left, scroll arrows right (lg+ only) */}
      <div className="flex items-center justify-between mb-12">
        <h2 className="text-xl uppercase tracking-[0.3em] text-primary underline underline-offset-8 decoration-champagne-gold decoration-2">
          Bestsellers
        </h2>

        <div className="hidden lg:flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Scroll bestsellers left"
            className={SCROLL_BTN_CLASS}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            aria-label="Scroll bestsellers right"
            className={SCROLL_BTN_CLASS}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={[
          // Mobile/tablet: normal grid
          'grid grid-cols-1 md:grid-cols-3 gap-8',
          // Desktop: horizontal scroll strip
          'lg:flex lg:flex-row lg:overflow-x-auto lg:gap-8 lg:pb-2',
          // Hide scrollbar cross-browser
          '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        ].join(' ')}
      >
        {products.map((product) => {
          const primaryMedia = product.media?.find((m) => m.is_primary) || product.media?.[0];
          const imageUrl = primaryMedia?.url || '/placeholder.svg';
          const altText = primaryMedia?.alt || product.name;

          const prices = product.variants?.map((v) => v.price).filter((p) => p !== undefined && p !== null) || [];
          const minPrice = prices.length ? Math.min(...prices) : 0;
          const maxPrice = prices.length ? Math.max(...prices) : 0;
          const formatINR = (value: number) => {
            return new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              maximumFractionDigits: 0,
            }).format(value);
          };
          const priceDisplay = minPrice === maxPrice ? formatINR(minPrice) : `${formatINR(minPrice)} - ${formatINR(maxPrice)}`;

          return (
            <div
              key={product.id}
              className="relative group overflow-hidden bg-deep-slate border border-border p-8 flex items-center gap-8 rounded-lg lg:shrink-0 lg:w-95"
            >
              <div className="shrink-0">
                <Image
                  src={imageUrl}
                  alt={altText}
                  width={400}
                  height={400}
                  className="w-auto h-32 object-cover group-hover:scale-105 transition-transform duration-500 rounded"
                />
              </div>

              <div className="w-1/2">
                <h3 className="text-base font-serif mb-2 uppercase">{product.name}</h3>
                <p className="text-primary font-bold mb-6">{priceDisplay}</p>

                <Link
                  href={`/product/${product.slug}`}
                  aria-label={`Buy ${product.name} now`}
                  className="inline-flex items-center gap-2 border border-primary px-6 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-primary hover:text-black transition-colors"
                >
                  Buy Now
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}