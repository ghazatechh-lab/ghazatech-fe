import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Headphones,
  Wrench,
  Search,
  ChevronRight,
  Star,
  Cpu,
  Layers,
  Battery,
  Package,
  HardDrive,
  Keyboard,
  Monitor,
  Fan,
  MemoryStick,
  Wifi,
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { fetchCategories, fetchBrands, fetchFeaturedProducts, fetchPublicReviews } from '../lib/api';
import type { CustomerReview } from '../lib/api';
import type { Category, Product, Brand } from '../lib/types';
import ProductCard from '../components/ProductCard';
import { CATEGORY_VISUALS } from '../lib/productVisuals';
import GoogleReviewsCarousel from '../components/GoogleReviewsCarousel';

gsap.registerPlugin(ScrollTrigger);

// ── 9 hardcoded design-spec categories (API only returns 5) ──────────────────
const DOCK_CATEGORIES = [
  { name: 'Batteries',           query: 'Battery',     image: '/images/cat-dock-batteries.webp' },
  { name: 'Chargers & Adapters', query: 'Charger',     image: '/images/cat-dock-chargers.webp' },
  { name: 'Motherboards',        query: 'Motherboard', image: '/images/cat-dock-motherboards.webp' },
  { name: 'Laptop Screens',      query: 'Screen',      image: '/images/cat-dock-screens.webp' },
  { name: 'Keyboards & Palmrests', query: 'Keyboard',  image: '/images/cat-dock-keyboards.webp' },
  { name: 'Cooling Parts',       query: 'Fan',         image: '/images/cat-dock-cooling.webp' },
  { name: 'Hinges & Brackets',   query: 'Hinges',      image: '/images/cat-dock-hinges.webp' },
  { name: 'SSD & RAM',           query: 'SSD',         image: '/images/cat-dock-ssd-ram.webp' },
  { name: 'Other Parts',         query: '',            image: '/images/cat-dock-other-parts.webp' },
];

// Trust items for right column
const TRUST_ITEMS = [
  { icon: Package,    title: 'Laptop Spare Parts',          sub: 'Browse available inventory' },
  { icon: Truck,      title: 'Delivery Enquiries',               sub: 'Ask us about delivery options' },
  { icon: ShieldCheck, title: 'Warranty Information',               sub: 'Check individual product coverage' },
  { icon: Headphones, title: 'Expert Assistance',               sub: 'Help to find the right part' },
];

const CATEGORY_ICONS: Record<string, typeof Battery> = {
  Battery,
  Bezel: Layers,
  Charger: Package,
  Fan,
  Hinges: Wrench,
  Keyboard,
  Motherboard: Cpu,
  Palmrest: Layers,
  Ram: MemoryStick,
  SSD: HardDrive,
  Screen: Monitor,
  Topcover: Layers,
  'Top cover': Layers,
  'Wifi Module': Wifi,
};

const WHY_CHOOSE_ITEMS = [
  { icon: ShieldCheck, title: 'Quality Checked', text: 'Tested & reliable parts' },
  { icon: Truck, title: 'UAE Delivery', text: 'Fast & secure shipping' },
  { icon: Sparkles, title: 'Warranty Support', text: 'After-sales assistance' },
  { icon: Headphones, title: 'Expert Assistance', text: 'Get the right part easily' },
];

// ── HeroImage — clean, static hardware visual seamlessly resolved into background ──
// Uses hero-parts-podium.webp with a mathematically feathered alpha channel
// where all 4 borders fade smoothly to 0% opacity into the #051329 background.
function HeroImage() {
  return (
    <div className="relative flex items-center justify-center w-full select-none">
      <img
        src="/images/hero-parts-podium.webp"
        alt="Laptop spare parts on glowing podium — Ghaza Computer TR LLC"
        loading="eager"
        draggable={false}
        className="relative w-full max-w-[660px] object-contain select-none"
      />
    </div>
  );
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [brands,setBrands] = useState<Brand[]>([]);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [query, setQuery] = useState('');
  const heroRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    fetchCategories()
      .then((rows) => {
        if (active) setCategories(rows);
      })
      .catch(() => {});

    fetchBrands().then(rows=>{if(active)setBrands(rows);}).catch(()=>{});
    fetchFeaturedProducts()
      .then((rows) => {
        if (active) setFeatured(rows.slice(0, 8));
      })
      .catch(() => {});

    fetchPublicReviews()
      .then((rows) => {
        if (active) setReviews(rows);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  // GSAP Entrance Physics
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.gsap-hero-anim', {
        y: 12,
        opacity: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power2.out',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    navigate(q ? `/shop?q=${encodeURIComponent(q)}` : '/shop');
  };

  return (
    <div ref={heroRef} className="ghz-home min-h-screen bg-[#F4F7FB]">
      {/* ======================================================== */}
      {/* BAND 1: DEEP MIDNIGHT NAVY HERO (#051329)               */}
      {/* ======================================================== */}
      <section className="relative border-b border-[#1A2B49] bg-[#051329] text-white overflow-hidden">
        <div className="container-x ghz-hero-inner relative z-10">

          {/*
            RESPONSIVE LAYOUT
            ─ Mobile  (<lg) : stacked column  → text | stage | trust-grid
            ─ Desktop (≥lg) : 3-col side-by-side → [text | stage | trust-stack]
          */}
          <div className="ghz-hero-grid flex flex-col gap-8 lg:grid lg:grid-cols-[minmax(0,1.04fr)_minmax(0,1.2fr)_minmax(220px,.7fr)] lg:items-center lg:gap-6">

            {/* ── COL 1: Eyebrow + Headline + Subtitle + Search + CTAs ── */}
            <div className="ghz-hero-copy gsap-hero-anim flex flex-col space-y-5">
              {/* Eyebrow */}
              <div className="inline-flex w-fit items-center gap-2 rounded-[2px] border border-[#2B85FF]/40 bg-[#0B63F6]/15 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-[#7DD3FC]">
                <Cpu className="h-3.5 w-3.5 text-[#2B85FF]" />
                <span>Laptop Spare Parts Specialists</span>
              </div>

              {/* Headline */}
              <h1 className="font-display text-4xl font-extrabold leading-[1.04] tracking-tight text-white sm:text-5xl xl:text-[54px]">
                The Exact Part<br />
                For <span className="text-[#2B85FF]">Every Laptop.</span>
              </h1>

              <p className="max-w-sm text-sm leading-relaxed text-[#CAD5E3]">
                High-quality replacement parts, tested and reliable. For repair centers, businesses and individual customers across the UAE.
              </p>

              {/* Search bar */}
              <form onSubmit={handleHeroSearch} className="relative flex max-w-[420px] items-center">
                <Search className="absolute left-3.5 h-4 w-4 text-[#8A9EB5]" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search model, part number, FRU or SKU..."
                  className="h-11 w-full rounded-l-[3px] border border-[#1A2B49] bg-[#071936] pl-10 pr-3 font-mono text-xs text-white placeholder-[#94A3B8] outline-none transition focus:border-[#0B63F6]"
                />
                <button
                  type="submit"
                  className="flex h-11 shrink-0 items-center justify-center rounded-r-[3px] bg-[#0B63F6] px-5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#0953d4]"
                >
                  Find Part
                </button>
              </form>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/shop"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-[3px] bg-[#0B63F6] px-6 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-[#0953d4] active:scale-[0.99]"
                >
                  <span>Shop Spare Parts</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/repair"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-[3px] border border-[#2B85FF]/60 bg-white/5 px-6 text-xs font-bold uppercase tracking-wider text-white hover:border-[#2B85FF] hover:bg-white/10 active:scale-[0.99]"
                >
                  <Wrench className="h-4 w-4 text-[#2B85FF]" />
                  <span>Book a Repair</span>
                </Link>
              </div>
            </div>

            {/* ── COL 2 (CENTER): Static hero image seamlessly dissolved into background ── */}
            {/* On mobile: full width, capped. On desktop: fills the 1fr column. */}
            <div className="ghz-hero-image w-full max-w-[580px] mx-auto lg:max-w-none">
              <HeroImage />
            </div>

            {/* ── COL 3 (RIGHT): Trust card with glowing HUD styling ── */}
            <div className="ghz-hero-trust gsap-hero-anim w-full">
              <div className="rounded-[16px] border border-[#2B85FF]/35 bg-[#071936]/85 p-5 shadow-[0_0_30px_rgba(11,99,246,0.18)] backdrop-blur-md">
                <div className="flex flex-col gap-5">
                  {TRUST_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="flex items-start gap-3.5 group">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[8px] border border-[#2B85FF]/40 bg-[#0B63F6]/15 transition-all group-hover:border-[#2B85FF] group-hover:bg-[#0B63F6]/25">
                          <Icon className="h-5 w-5 text-[#2B85FF]" />
                        </div>
                        <div>
                          <div className="font-display text-sm font-bold text-white leading-tight">
                            {item.title}
                          </div>
                          <div className="mt-1 font-mono text-[11px] text-[#8EA2B9]">
                            {item.sub}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* BAND 2: SHOP BY CATEGORY — IMAGE TILE GRID             */}
      {/* ======================================================== */}
      <section className="bg-white py-9 sm:py-11 lg:py-12" aria-labelledby="shop-by-category-title">
        <div className="container-x">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3 sm:mb-6">
            <div>
              <h2 id="shop-by-category-title" className="font-display text-[23px] font-extrabold tracking-tight text-[#091A34] sm:text-[28px]">
                Shop by Category
              </h2>
              <p className="mt-1 text-sm text-[#66758B]">Find the right parts for your laptop</p>
            </div>
            <Link
              to="/shop"
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-semibold text-[#075BD5] transition-colors hover:bg-[#EAF3FF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B63F6]"
            >
              View All Categories <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          {categories.length > 0 ? (
            <div className="ghz-category-grid grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 lg:gap-4">
              {categories.slice(0, 6).map((category) => {
                const normalizedName = category.name.trim().toLowerCase();
                const visual = DOCK_CATEGORIES.find((item) => item.query && normalizedName === item.query.toLowerCase())
                  || DOCK_CATEGORIES.find((item) => item.query && normalizedName.includes(item.query.toLowerCase()))
                  || DOCK_CATEGORIES.find((item) => item.query && item.query.toLowerCase().includes(normalizedName));
                const fallbackImage = visual?.image || CATEGORY_VISUALS[category.name] || '/images/cat-dock-other-parts.webp';
                return (
                  <Link
                    key={category.id}
                    to={`/shop?category=${encodeURIComponent(category.name)}`}
                    aria-label={`Shop ${category.name}`}
                    className="group flex min-h-[142px] flex-col items-center justify-between overflow-hidden rounded-xl border border-[#DBE5F0] bg-gradient-to-b from-[#FFFFFF] to-[#F0F6FD] px-3 pb-3 pt-3 text-center shadow-[0_2px_9px_rgba(13,36,65,0.035)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[#9CC5FB] hover:shadow-[0_10px_26px_rgba(13,62,138,0.11)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B63F6] sm:min-h-[160px]"
                  >
                    <div className="flex h-[92px] w-full items-center justify-center sm:h-[108px]">
                      <img
                        src={category.image_url || fallbackImage}
                        alt=""
                        loading="lazy"
                        onError={(event) => {
                          if (event.currentTarget.src !== new URL(fallbackImage, window.location.href).href) {
                            event.currentTarget.src = fallbackImage;
                          }
                        }}
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.07]"
                      />
                    </div>
                    <span className="mt-2 line-clamp-2 min-h-[2.5em] text-[13px] font-bold leading-tight text-[#15243B] transition-colors group-hover:text-[#0B63F6] sm:text-sm">
                      {category.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-[#DBE5F0] bg-[#F7FAFF] p-8 text-center">
              <p className="font-semibold text-[#15243B]">Categories are currently unavailable.</p>
              <p className="mt-1 text-sm text-[#66758B]">Browse the product catalog to explore available parts.</p>
              <Link to="/shop" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#075BD5] hover:underline">Browse products <ArrowRight className="h-4 w-4" /></Link>
            </div>
          )}
        </div>
      </section>

      {/* ======================================================== */}
      {/* BAND 3: 3-COLUMN SERVICE & SUPPORT BANNERS (#FFFFFF)     */}
      {/* ======================================================== */}
      <section className="container-x py-12 lg:py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {/* Card 1: Repair Services */}
          <Link
            to="/repair"
            className="group relative flex flex-col justify-between overflow-hidden rounded-[4px] border border-[#1A2B49] bg-[#071936] p-6 text-white transition-all hover:border-[#2B85FF] hover:shadow-lg"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-[#2B85FF]">
                <Wrench className="h-3.5 w-3.5" />
                <span>Express Workshop</span>
              </div>
              <h3 className="font-display text-lg font-bold text-white group-hover:text-[#2B85FF] transition-colors">
                Repair Services
              </h3>
              <p className="text-xs leading-relaxed text-[#CAD5E3]">
                Professional laptop repair &amp; part replacement. Genuine diagnosis and rapid turnaround in Sharjah &amp; Dubai.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-[#1A2B49] pt-4 font-mono text-xs font-semibold text-[#2B85FF]">
              <span>Book Diagnosis</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-[2px] bg-[#0B63F6] text-white transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
          </Link>

          {/* Card 2: Warranty Support */}
          <Link
            to="/warranty"
            className="group relative flex flex-col justify-between overflow-hidden rounded-[4px] border border-[#1A2B49] bg-[#071936] p-6 text-white transition-all hover:border-[#2B85FF] hover:shadow-lg"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-[#2B85FF]">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Verified Coverage</span>
              </div>
              <h3 className="font-display text-lg font-bold text-white group-hover:text-[#2B85FF] transition-colors">
                Warranty Support
              </h3>
              <p className="text-xs leading-relaxed text-[#CAD5E3]">
                Genuine parts backed with reliable after-sales replacement warranty. Track certificate online anytime.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-[#1A2B49] pt-4 font-mono text-xs font-semibold text-[#2B85FF]">
              <span>Check Certificate</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-[2px] bg-[#0B63F6] text-white transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
          </Link>

          {/* Card 3: Need Help / Technical Hotline */}
          <Link
            to="/support"
            className="group relative flex flex-col justify-between overflow-hidden rounded-[4px] border border-[#1A2B49] bg-[#071936] p-6 text-white transition-all hover:border-[#2B85FF] hover:shadow-lg"
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-wider text-[#2B85FF]">
                <Headphones className="h-3.5 w-3.5" />
                <span>Technical Assistance</span>
              </div>
              <h3 className="font-display text-lg font-bold text-white group-hover:text-[#2B85FF] transition-colors">
                Need Help?
              </h3>
              <p className="text-xs leading-relaxed text-[#CAD5E3]">
                Chat with our hardware engineers for model matching, FRU identification and wholesale quotations.
              </p>
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-[#1A2B49] pt-4 font-mono text-xs font-semibold text-[#2B85FF]">
              <span>Contact Support</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-[2px] bg-[#0B63F6] text-white transition-transform group-hover:translate-x-1">
                →
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ======================================================== */}
      {/* BAND 4: SHOP BY BRAND MATRIX (#FFFFFF)                   */}
      {/* ======================================================== */}
      <section className="border-y border-[#DCE4EE] bg-white py-10">
        <div className="container-x">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-display text-lg font-bold tracking-tight text-[#051329]">
              <span className="h-4 w-1 bg-[#0B63F6]" />
              Shop by Brand
            </h2>
            <Link
              to="/shop"
              className="font-mono text-xs font-semibold text-[#0B63F6] hover:underline flex items-center gap-1"
            >
              View All Brands →
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-10">
            {brands.slice(0, 10).map((brand) => (
              <Link
                key={brand.name}
                to={`/shop?brand=${encodeURIComponent(brand.name)}`}
                className="flex h-14 items-center justify-center rounded-[3px] border border-[#DCE4EE] bg-[#F4F7FB] px-3 font-display text-sm font-extrabold text-[#051329] transition-all hover:border-[#0B63F6] hover:bg-white hover:text-[#0B63F6]"
              >
                {brand.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* BAND 5: FEATURED SPARE PARTS (OLD ITEMS WITH NEW DESIGN) */}
      {/* ======================================================== */}
      <section className="container-x py-12 lg:py-16">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-[#0B63F6]">
              DIRECT FROM WAREHOUSE
            </div>
            <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-[#051329] sm:text-3xl">
              Featured Spare Parts
            </h2>
          </div>
          <Link
            to="/shop"
            className="hidden items-center gap-1.5 font-mono text-xs font-bold text-[#0B63F6] hover:underline sm:flex"
          >
            <span>View All Products</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CUSTOMER REVIEWS (IF PRESENT) */}
      {reviews.length > 0 && (
        <section className="border-t border-[#DCE4EE] bg-white py-12 lg:py-16">
          <div className="container-x">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0B63F6]">
                  CUSTOMER FEEDBACK
                </div>
                <h2 className="mt-1 font-display text-2xl font-extrabold text-[#051329] sm:text-3xl">
                  What Our Customers Say
                </h2>
              </div>
              <p className="font-mono text-xs text-[#5A6D88]">Verified purchases across the UAE</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reviews.slice(0, 6).map((item) => (
                <article
                  key={item.id}
                  className="flex h-full flex-col rounded-[3px] border border-[#DCE4EE] bg-[#F4F7FB] p-5 shadow-sm"
                >
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star
                        key={index}
                        className={`h-3.5 w-3.5 ${
                          index < item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="mt-3 flex-1 font-sans text-xs leading-relaxed text-[#051329]">
                    “{item.review}”
                  </p>
                  <div className="mt-4 border-t border-[#EAEFF7] pt-3">
                    <p className="font-display text-xs font-bold text-[#051329]">{item.customer_name}</p>
                    {(item.customer_type || item.related_item) && (
                      <p className="mt-0.5 font-mono text-[10px] text-[#5A6D88]">
                        {[item.customer_type, item.related_item].filter(Boolean).join(' · ')}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Curated customer Google reviews — snapshot captured in recording; not live API data. */}
      <GoogleReviewsCarousel />

      {/* WHY CHOOSE GHAZA COMPUTER */}
      <section className="container-x py-12">
        <div className="rounded-[4px] border border-[#DCE4EE] bg-white p-6 sm:p-8">
          <div className="grid gap-6 md:grid-cols-[280px_1fr] md:items-center">
            <div>
              <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0B63F6]">
                OUR COMMITMENT
              </div>
              <h2 className="mt-1 font-display text-2xl font-extrabold text-[#051329]">
                Why Choose Ghaza Computer
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-[#5A6D88]">
                Direct distributor pricing and dedicated technician support for all laptop makes.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {WHY_CHOOSE_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-[3px] border border-[#EAEFF7] bg-[#F4F7FB] p-3.5">
                    <Icon className="h-5 w-5 text-[#0B63F6]" />
                    <div className="mt-2 font-display text-xs font-bold text-[#051329]">{item.title}</div>
                    <div className="mt-0.5 font-mono text-[10px] text-[#5A6D88]">{item.text}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA WORKSHOP DIAGNOSIS BANNER */}
      <section className="container-x pb-14">
        <div className="relative overflow-hidden rounded-[4px] border border-[#1A2B49] bg-[#071936] px-6 py-10 text-white sm:px-10">
          <div className="max-w-2xl space-y-2">
            <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#2B85FF]">
              SHARJAH &amp; DUBAI WORKSHOP
            </span>
            <h2 className="font-display text-2xl font-extrabold sm:text-3xl text-white">
              Laptop down? We will get it fixed.
            </h2>
            <p className="text-xs text-[#CAD5E3]">
              Diagnosis, honest quotation, and expert motherboard/screen replacement from our certified technicians.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/repair"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-[3px] bg-[#0B63F6] px-5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-[#0953d4]"
            >
              <span>Book a Repair</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/shop"
              className="inline-flex h-10 items-center justify-center rounded-[3px] border border-[#2B85FF]/50 bg-white/5 px-5 text-xs font-bold uppercase tracking-wider text-white hover:bg-white/10"
            >
              Shop Parts
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
