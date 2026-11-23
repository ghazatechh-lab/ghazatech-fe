import { useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, ExternalLink, MessageSquareQuote } from 'lucide-react';
import { CURATED_GOOGLE_REVIEWS } from '../lib/curatedGoogleReviews';
import { GOOGLE_REVIEWS_URL } from '../lib/googleReviews';

/** A touch-scrollable carousel of selected, manually entered customer reviews. */
export default function GoogleReviewsCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState<number[]>([]);
  const total = CURATED_GOOGLE_REVIEWS.length;

  const scrollToReview = (index: number) => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const safe = Math.max(0, Math.min(total - 1, index));
    const item = scroller.children.item(safe) as HTMLElement | null;
    if (item) scroller.scrollTo({ left: item.offsetLeft, behavior: 'smooth' });
    setActive(safe);
  };

  const syncActive = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const items = Array.from(scroller.children) as HTMLElement[];
    const left = scroller.scrollLeft;
    let nearest = 0;
    let distance = Infinity;
    items.forEach((item, index) => {
      const nextDistance = Math.abs(item.offsetLeft - left);
      if (nextDistance < distance) { distance = nextDistance; nearest = index; }
    });
    setActive(nearest);
  };

  const toggleExpanded = (index: number) => {
    setExpanded((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
  };

  return (
    <section className="border-y border-[#DCE4EE] bg-[#F4F8FF] py-12 sm:py-16" aria-labelledby="google-reviews-heading">
      <div className="container-x">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-2xl">
            <div className="mb-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-[#0B63F6]">
              <MessageSquareQuote className="h-4 w-4" aria-hidden="true" /> Google customer feedback
            </div>
            <h2 id="google-reviews-heading" className="font-display text-2xl font-extrabold tracking-tight text-[#051329] sm:text-3xl">
              Trusted by laptop owners across the UAE
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#5A6D88]">
              Selected positive reviews shared by our customers on Google. This is a curated selection, not a live review feed.
            </p>
          </div>
          <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-[#BFD3ED] bg-white px-4 py-2 text-sm font-bold text-[#125CC3] shadow-sm transition hover:border-[#0B63F6] hover:bg-[#EAF2FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B63F6]">
            View more reviews <ExternalLink className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>

        <div className="relative">
          <div ref={scrollerRef} onScroll={syncActive}
            aria-label="Selected Google customer reviews"
            aria-roledescription="carousel"
            className="relative flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollPaddingInline: 2 }}>
            {CURATED_GOOGLE_REVIEWS.map((item, index) => {
              const isExpanded = expanded.includes(index);
              const longReview = item.review.length > 190;
              return (
                <article key={`${item.name}-${index}`} aria-label={`Review ${index + 1} of ${total} by ${item.name}`}
                  className="flex w-[88%] shrink-0 snap-start flex-col rounded-2xl border border-[#DEE7F3] bg-white p-5 shadow-[0_5px_24px_rgba(19,48,91,0.055)] sm:w-[calc((100%-16px)/2)] lg:w-[calc((100%-32px)/3)]">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#EAF2FF] text-sm font-extrabold text-[#1559BF]" aria-hidden="true">
                      {item.name.trim().split(/\s+/).slice(0, 2).map((word) => word[0]?.toUpperCase()).join('')}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-sm font-bold text-[#17243B]">{item.name}</h3>
                      <p className="truncate text-xs text-[#718096]">{item.profile ? `${item.profile} · ` : ''}{item.posted}</p>
                    </div>
                    <span className="shrink-0 rounded-md bg-[#F3F7FC] px-2 py-1 text-[10px] font-semibold text-[#55718F]">Google</span>
                  </div>
                  <p className={`text-sm leading-7 text-[#394C66] ${!isExpanded ? 'line-clamp-5' : ''}`}>{item.review}</p>
                  {longReview && (
                    <button type="button" onClick={() => toggleExpanded(index)} aria-expanded={isExpanded}
                      className="mt-2 self-start rounded text-xs font-bold text-[#0B63F6] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0B63F6]">
                      {isExpanded ? 'Show less' : 'Read full review'}
                    </button>
                  )}
                  <div className="mt-auto pt-5">
                    {item.ownerReply && (
                      <details className="rounded-xl bg-[#F5F8FD] px-3 py-2.5 text-xs text-[#536781]">
                        <summary className="cursor-pointer font-semibold text-[#37567B]">Response from Ghaza Computer</summary>
                        <p className="pt-2 leading-relaxed">{item.ownerReply}</p>
                      </details>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[#6A7D95]">Selected reviews · Swipe or use arrows to explore</p>
          <div className="flex items-center gap-2">
            <span className="mr-2 text-xs tabular-nums text-[#718096]" aria-live="polite">{active + 1} / {total}</span>
            <button type="button" onClick={() => scrollToReview(active - 1)} disabled={active === 0} aria-label="Previous review"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C9D8ED] bg-white text-[#0B63F6] transition hover:bg-[#EAF2FF] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0B63F6]">
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => scrollToReview(active + 1)} disabled={active >= total - 1} aria-label="Next review"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C9D8ED] bg-white text-[#0B63F6] transition hover:bg-[#EAF2FF] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0B63F6]">
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
            <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer"
              className="ml-2 inline-flex items-center gap-1 text-xs font-bold text-[#0B63F6] hover:underline">More on Google <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
