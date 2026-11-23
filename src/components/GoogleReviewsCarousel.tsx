import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Quote, Star, CheckCircle2 } from 'lucide-react';
import { CURATED_GOOGLE_REVIEWS } from '../lib/curatedGoogleReviews';
import { GOOGLE_REVIEWS_URL } from '../lib/googleReviews';
import './GoogleReviewsCarousel.css';

// Snapshot observed in the business's Google Maps screen recording; not live data.
const RECORDED_RATING = 4.3;
const RECORDED_COUNT = 1555;

function Stars({ rating, label = true }: { rating: number; label?: boolean }) {
  return (
    <span className="grc-stars" aria-label={`${rating} out of 5 stars`} role="img">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className="grc-star" aria-hidden="true">
          <Star size={16} strokeWidth={1.7} fill="transparent" />
          <span className="grc-star-fill" style={{ width: `${Math.max(0, Math.min(1, rating - i)) * 100}%` }}>
            <Star size={16} strokeWidth={1.7} fill="currentColor" />
          </span>
        </span>
      ))}
      {label && <span className="grc-stars-number">{rating.toFixed(1)}</span>}
    </span>
  );
}

export default function GoogleReviewsCarousel() {
  const scroller = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState<number[]>([]);
  const [paused, setPaused] = useState(false);
  const reviews = CURATED_GOOGLE_REVIEWS;
  const count = reviews.length;

  const go = useCallback((index: number) => {
    const el = scroller.current;
    if (!el || count === 0) return;
    const next = ((index % count) + count) % count;
    const card = el.children.item(next) as HTMLElement | null;
    if (!card) return;
    const left = card.offsetLeft - (el.children.item(0) as HTMLElement).offsetLeft;
    el.scrollTo({ left, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    setActive(next);
  }, [count]);

  const onScroll = () => {
    const el = scroller.current;
    const first = el?.children.item(0) as HTMLElement | null;
    if (!el || !first) return;
    const left = el.scrollLeft;
    let best = 0;
    let distance = Infinity;
    Array.from(el.children).forEach((child, index) => {
      const offset = (child as HTMLElement).offsetLeft - first.offsetLeft;
      const difference = Math.abs(offset - left);
      if (difference < distance) { distance = difference; best = index; }
    });
    setActive(best);
  };

  useEffect(() => {
    if (paused || count < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const timer = window.setInterval(() => {
      if (document.visibilityState === 'visible') setActive(current => {
        const next = (current + 1) % count;
        const el = scroller.current;
        const first = el?.children.item(0) as HTMLElement | null;
        const item = el?.children.item(next) as HTMLElement | null;
        if (el && first && item) el.scrollTo({ left: item.offsetLeft - first.offsetLeft, behavior: 'smooth' });
        return next;
      });
    }, 6500);
    return () => window.clearInterval(timer);
  }, [paused, count]);

  const toggle = (index: number) => setExpanded(current => current.includes(index) ? current.filter(i => i !== index) : [...current, index]);

  return (
    <section className="grc-section" aria-labelledby="grc-heading">
      <div className="container-x grc-container">
        <div className="grc-heading-row">
          <div className="grc-copy">
            <div className="grc-eyebrow"><span className="grc-eyebrow-dot" /> REAL CUSTOMER STORIES</div>
            <h2 id="grc-heading">Words from people who <em>trust us.</em></h2>
            <p>Customers share their experiences with laptop parts, repairs and service at Ghaza Computer.</p>
          </div>
          <div className="grc-rating-panel" aria-label={`Google rating ${RECORDED_RATING} out of 5, ${RECORDED_COUNT.toLocaleString()} reviews at time of recording`}>
            <div className="grc-rating-heading"><span className="grc-google-mark" aria-hidden="true">G</span><span>Google Reviews</span><CheckCircle2 size={16} aria-hidden="true" /></div>
            <div className="grc-rating-line"><strong>{RECORDED_RATING.toFixed(1)}</strong><Stars rating={RECORDED_RATING} label={false} /></div>
            <div className="grc-rating-caption">{RECORDED_COUNT.toLocaleString()} reviews <span>· Snapshot from recording</span></div>
          </div>
        </div>

        <div className="grc-carousel-shell" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocusCapture={() => setPaused(true)} onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setPaused(false); }}>
          <div className="grc-surface-glow" aria-hidden="true" />
          <div ref={scroller} className="grc-track" onScroll={onScroll} aria-roledescription="carousel" aria-label="Selected customer reviews from Google" tabIndex={0}>
            {reviews.map((item, index) => {
              const showAll = expanded.includes(index);
              const long = item.review.length > 185;
              return (
                <article className="grc-card" key={`${item.name}-${index}`} aria-label={`${index + 1} of ${count}, ${item.name}`}>
                  <div className="grc-card-top">
                    <div className="grc-reviewer"><span className="grc-initials" aria-hidden="true">{item.name.trim().split(/\s+/).slice(0, 2).map(w => w.charAt(0).toUpperCase()).join('')}</span>
                      <div className="grc-reviewer-text"><h3>{item.name}</h3><p>{item.profile || 'Google reviewer'} · {item.posted}</p></div>
                    </div>
                    <Quote className="grc-quote" size={25} strokeWidth={1.7} aria-hidden="true" />
                  </div>
                  <div className="grc-card-stars">{typeof item.rating === 'number' ? <Stars rating={item.rating} label={false} /> : <span className="grc-unrated">Review shared on Google</span>}</div>
                  <div className="grc-review-body">
                    <p className={showAll ? '' : 'grc-clamp'}>{item.review}</p>
                    {long && <button className="grc-read-more" type="button" aria-expanded={showAll} onClick={() => toggle(index)}>{showAll ? 'Read less' : 'Read full review'}</button>}
                  </div>
                  <div className="grc-card-bottom">
                    {item.ownerReply ? <details className="grc-owner-reply"><summary>Response from Ghaza Computer</summary><p>{item.ownerReply}</p></details> : <span className="grc-verified-text">Shared by a Google reviewer</span>}
                  </div>
                </article>
              );
            })}
          </div>
          <div className="grc-footer-row">
            <div className="grc-progress-wrap"><span className="grc-counter">{String(active + 1).padStart(2, '0')} <span>/ {String(count).padStart(2, '0')}</span></span><div className="grc-progress-track" aria-hidden="true"><div style={{ width: `${((active + 1) / count) * 100}%` }} /></div></div>
            <div className="grc-controls"><button type="button" onClick={() => go(active - 1)} aria-label="Previous customer review"><ChevronLeft size={20} /></button><button type="button" onClick={() => go(active + 1)} aria-label="Next customer review"><ChevronRight size={20} /></button></div>
          </div>
        </div>
        <div className="grc-bottom-line"><p>Selected customer feedback, manually curated from Google. Reviews and ratings are not live.</p><a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">View more reviews on Google <ArrowUpRight size={17} aria-hidden="true" /></a></div>
      </div>
    </section>
  );
}
