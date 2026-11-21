import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Battery,
  ChevronRight,
  Cpu,
  Fan,
  HardDrive,
  Headphones,
  Keyboard,
  Layers,
  MemoryStick,
  Monitor,
  Package,
  Search,
  ShieldCheck,
  Star,
  Truck,
  Wifi,
  Wrench,
} from 'lucide-react';
import { fetchCategories, fetchFeaturedProducts, fetchPublicReviews } from '../lib/api';
import type { CustomerReview } from '../lib/api';
import type { Category, Product } from '../lib/types';
import ProductCard from '../components/ProductCard';
import Reveal from '../components/Reveal';
import { CATEGORY_VISUALS } from '../lib/productVisuals';

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
  'Wifi Module': Wifi,
};

const BRANDS = ['Apple', 'Acer', 'Asus', 'Dell', 'HP', 'Lenovo'];

const TRUST_ITEMS = [
  { icon: ShieldCheck, title: 'Quality Checked', text: 'Tested & reliable parts' },
  { icon: Truck, title: 'UAE Delivery', text: 'Fast & secure shipping' },
  { icon: BadgeCheck, title: 'Warranty Support', text: 'After-sales assistance' },
  { icon: Headphones, title: 'Expert Assistance', text: 'Get the right part easily' },
];

export default function Home() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let active = true;
    const refresh = () => {
      if (document.hidden) return;
      void fetchCategories().then(rows => { if (active) setCategories(rows); }).catch(() => {});
      void fetchFeaturedProducts().then(rows => { if (active) setFeatured(rows); }).catch(() => {}).finally(() => { if (active) setLoading(false); });
      void fetchPublicReviews().then(rows => { if (active) setReviews(rows); }).catch(() => {});
    };
    refresh();
    const interval = window.setInterval(refresh, 30000);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      active = false;
      window.clearInterval(interval);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, []);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    window.location.href = value ? `/shop?q=${encodeURIComponent(value)}` : '/shop';
  };

  const visibleCategories = categories.slice(0, 8);

  return (
    <div className="bg-white">
      <section className="gt-hero relative overflow-hidden border-b border-blue-950">
        <div className="pointer-events-none absolute inset-0 opacity-70" style={{ backgroundImage: 'linear-gradient(135deg, rgba(15,45,94,.36) 0%, transparent 44%), linear-gradient(315deg, rgba(6,182,212,.12) 0%, transparent 38%)' }} />
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 animate-blob rounded-full bg-blue-200/50 blur-3xl" />
        <div className="container-x relative z-10 grid min-h-[570px] items-center gap-8 py-16 lg:grid-cols-[.97fr_1.03fr] lg:py-24">
          <div className="z-10 max-w-xl">
            <Reveal>
              <div className="gt-eyebrow text-[11px] uppercase">Laptop spare parts specialists</div>
              <h1 className="mt-5 font-display text-5xl font-bold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-[70px]">The Exact Part<br />For Every <span className="bg-gradient-to-r from-sky-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent">Laptop.</span></h1>
              <p className="mt-6 max-w-lg text-sm leading-7 text-blue-100/85 sm:text-base">High-quality replacement parts, tested and reliable. For repair centers, businesses and individual customers across the UAE.</p>
            </Reveal>
            <Reveal delay={120}>
              <form onSubmit={submitSearch} className="gt-glass mt-8 flex max-w-[490px] rounded-2xl p-1.5 shadow-2xl shadow-blue-950/25">
                <div className="relative min-w-0 flex-1"><Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search model, part number, FRU or SKU..." className="h-10 w-full bg-transparent pl-10 pr-2 text-xs text-[#10264b] outline-none sm:text-sm" /></div>
                <button type="submit" className="rounded-lg bg-brand-600 px-4 text-xs font-bold text-white transition hover:bg-brand-700 sm:px-5 sm:text-sm">Find Part</button>
              </form>
            </Reveal>
            <Reveal delay={200}>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/shop" className="btn-primary gt-visual-sheen rounded-full px-6 py-3 shadow-lg shadow-blue-700/20">Shop Spare Parts <ArrowRight className="h-4 w-4" /></Link>
                <Link to="/repair" className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20">Book a Repair</Link>
              </div>
            </Reveal>
          </div>

          <div className="gt-hero-visual relative flex min-h-[280px] items-center justify-center lg:min-h-[450px]">
            <div className="absolute right-3 top-2 z-20 hidden w-56 rounded-2xl border border-white/80 bg-white/90 p-4 shadow-xl shadow-blue-900/10 backdrop-blur sm:block lg:right-0 lg:top-8">
              {[
                { icon: BadgeCheck, title: '30,000+', text: 'Parts in Stock' },
                { icon: Truck, title: 'Fast UAE Delivery', text: 'Across All Emirates' },
                { icon: ShieldCheck, title: 'Warranty Support', text: 'Genuine & tested parts' },
                { icon: Headphones, title: 'Expert Assistance', text: 'Help to find the right part' },
              ].map((item, index) => (
                <div key={item.title} className={`flex items-center gap-3 ${index > 0 ? 'mt-3 border-t border-slate-100 pt-3' : ''}`}>
                  <item.icon className="h-6 w-6 shrink-0 text-[#0b4d91]" />
                  <div><div className="text-xs font-bold text-[#10264b]">{item.title}</div><div className="text-[10px] text-slate-500">{item.text}</div></div>
                </div>
              ))}
            </div>
            <div className="absolute left-4 top-8 h-56 w-56 animate-blob rounded-full bg-cyan-400/20 blur-3xl" />
            <img src="/images/ghaza-hero-parts.webp" alt="Laptop spare parts" className="relative z-10 w-full max-w-[630px] animate-float-slow object-contain" />
          </div>
        </div>
      </section>

      <section className="container-x py-12 lg:py-16">
        <Reveal>
          <div className="mb-4 flex items-center justify-between"><h2 className="gt-section-title font-display text-2xl font-bold text-[#0b2b57] sm:text-3xl">Shop by Category</h2><Link to="/shop" className="hidden items-center gap-1 text-sm font-bold text-brand-700 sm:flex">View All Categories <ChevronRight className="h-4 w-4" /></Link></div>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {visibleCategories.map((category, index) => {
            const Icon = CATEGORY_ICONS[category.name] ?? Package;
            return <Reveal key={category.id} delay={index * 60} variant="scale"><Link to={`/shop?category=${encodeURIComponent(category.name)}`} className="gt-premium-card group flex h-[138px] flex-col items-center justify-center p-3 text-center"><div className="flex h-14 w-24 items-center justify-center"><img src={CATEGORY_VISUALS[category.name]} alt="" className="h-full w-full object-contain transition duration-500 group-hover:scale-110" /></div><span className="mt-2 text-xs font-bold text-[#10264b]">{category.name}</span><Icon className="sr-only" /></Link></Reveal>;
          })}
        </div>
        <Link to="/shop" className="mt-4 flex items-center justify-center gap-1 text-sm font-bold text-brand-700 sm:hidden">View All Categories <ChevronRight className="h-4 w-4" /></Link>
      </section>

      <section className="bg-[#f3f7fc] py-12 lg:py-16">
        <div className="container-x">
          <Reveal><div className="mb-4 flex items-center justify-between"><h2 className="gt-section-title font-display text-2xl font-bold text-[#0b2b57] sm:text-3xl">Featured Spare Parts</h2><Link to="/shop" className="hidden items-center gap-1 text-sm font-bold text-brand-700 sm:flex">View All Products <ChevronRight className="h-4 w-4" /></Link></div></Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {loading ? Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-[330px] animate-pulse rounded-2xl bg-slate-200" />) : featured.map((product, index) => <Reveal key={product.id} delay={index * 80} variant="scale"><ProductCard product={product} /></Reveal>)}
          </div>
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="border-t border-slate-100 bg-white py-12 lg:py-16" aria-labelledby="customer-reviews-title">
          <div className="container-x">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="text-xs font-bold uppercase tracking-widest text-brand-700">Customer feedback</div>
                <h2 id="customer-reviews-title" className="mt-2 font-display text-2xl font-bold text-[#0b2b57] sm:text-3xl">What Our Customers Say</h2>
              </div>
              <p className="text-sm text-slate-500">Reviews shared by our customers</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reviews.slice(0, 6).map((item) => (
                <article key={item.id} className="flex h-full flex-col rounded-2xl border border-slate-200 bg-[#f8fbff] p-6 shadow-sm">
                  <div className="flex gap-1" aria-label={`${item.rating} out of 5 stars`}>
                    {Array.from({ length: 5 }, (_, index) => (
                      <Star key={index} className={`h-4 w-4 ${index < item.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                    ))}
                  </div>
                  <p className="mt-4 flex-1 whitespace-pre-line break-words text-sm leading-7 text-slate-700">“{item.review}”</p>
                  <div className="mt-5 border-t border-slate-200 pt-4">
                    <p className="font-semibold text-[#0b2b57]">{item.customer_name}</p>
                    {(item.customer_type || item.related_item) && (
                      <p className="mt-1 text-xs text-slate-500">{[item.customer_type, item.related_item].filter(Boolean).join(' · ')}</p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container-x py-12 lg:py-16">
        <Reveal>
          <div className="flex flex-col gap-6 rounded-3xl bg-[#edf7ff] px-6 py-7 md:flex-row md:items-center md:justify-between md:px-10">
            <h2 className="max-w-[250px] font-display text-2xl font-bold leading-tight text-[#0b2b57]">Why Customers Choose Ghaza Computer</h2>
            <div className="grid flex-1 grid-cols-2 gap-5 md:grid-cols-4">
              {TRUST_ITEMS.map((item) => <div key={item.title} className="flex items-start gap-2.5 border-slate-200 md:border-l md:pl-5"><item.icon className="h-6 w-6 shrink-0 text-[#092c60]" /><div><div className="text-xs font-bold text-[#10264b] sm:text-sm">{item.title}</div><div className="mt-0.5 text-[11px] text-slate-500">{item.text}</div></div></div>)}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="border-y border-slate-100 py-10"><div className="container-x text-center"><div className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">Trusted brands</div><div className="mt-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">{BRANDS.map((brand) => <Link key={brand} to={`/shop?brand=${brand}`} className="font-display text-xl font-bold text-slate-400 transition hover:text-brand-700">{brand}</Link>)}</div></div></section>

      <section className="container-x py-12"><Reveal variant="scale"><div className="relative overflow-hidden rounded-3xl bg-[#092c60] px-7 py-12 text-center shadow-xl shadow-blue-900/15 sm:px-12"><div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 animate-blob rounded-full bg-blue-400/20 blur-3xl" /><Star className="relative mx-auto h-7 w-7 fill-current text-amber-300" /><h2 className="relative mt-3 font-display text-3xl font-bold text-white">Laptop down? We will get it fixed.</h2><p className="relative mx-auto mt-3 max-w-xl text-sm text-blue-100">Diagnosis, honest quotation and expert repair from our Sharjah workshop.</p><div className="relative mt-6 flex flex-wrap justify-center gap-3"><Link to="/repair" className="btn-primary rounded-full bg-white text-[#092c60] hover:bg-blue-50">Book a Repair <ArrowRight className="h-4 w-4" /></Link><Link to="/shop" className="rounded-full border border-white/40 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">Shop Parts</Link></div></div></Reveal></section>
    </div>
  );
}
