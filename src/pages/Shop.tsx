import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ChevronDown, ChevronRight, Grid2X2, List, Search, SlidersHorizontal, X } from 'lucide-react';
import { fetchBrands, fetchCategories, fetchProducts } from '../lib/api';
import type { Brand, Category, Product } from '../lib/types';
import ProductCard from '../components/ProductCard';
import Reveal from '../components/Reveal';
import { CATEGORY_VISUALS } from '../lib/productVisuals';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const latestRequest = useRef(0);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sort, setSort] = useState('featured');
  const [listView, setListView] = useState(false);

  const categoryParam = searchParams.get('category') ?? '';
  const brandParam = searchParams.get('brand') ?? '';

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => setCategories([]));
    fetchBrands().then(setBrands).catch(() => setBrands([]));
  }, []);

  useEffect(() => {
    const requestId = ++latestRequest.current;
    setLoading(true);
    setError(null);
    fetchProducts({ categorySlug: categories.find((category) => category.name === categoryParam)?.slug, brandName: brandParam || undefined, search: searchParams.get('q') || undefined, maxPrice: maxPrice ? Number(maxPrice) : undefined })
      .then((items) => { if (latestRequest.current === requestId) setProducts(items); })
      .catch(() => { if (latestRequest.current === requestId) setError('We could not load products right now. Please try again.'); })
      .finally(() => { if (latestRequest.current === requestId) setLoading(false); });
    return () => { latestRequest.current++; };
  }, [categories, categoryParam, brandParam, searchParams, maxPrice]);

  const updateParams = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    setSearchParams(next);
  };

  const displayProducts = useMemo(() => {
    const result = [...products];
    if (sort === 'price-low') result.sort((a, b) => Number(a.price_aed) - Number(b.price_aed));
    if (sort === 'price-high') result.sort((a, b) => Number(b.price_aed) - Number(a.price_aed));
    if (sort === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [products, sort]);

  return (
    <div className="bg-[#f7fbff]">
      <section className="container-x pt-6"><div className="flex items-center gap-2 text-xs font-medium text-slate-500"><Link to="/" className="hover:text-brand-700">Home</Link><ChevronRight className="h-3.5 w-3.5" /><span className="font-semibold text-[#10264b]">Shop</span></div></section>
      <section className="container-x py-5">
        <div className="relative overflow-hidden rounded-3xl bg-[#dceeff] px-7 py-8 sm:px-11 sm:py-9"><div className="absolute inset-0 bg-gradient-to-r from-white/50 via-transparent to-blue-200/40" /><div className="relative z-10 max-w-lg"><h1 className="font-display text-3xl font-bold tracking-tight text-[#092c60] sm:text-4xl">Laptop Parts &amp; Accessories</h1><p className="mt-2 text-sm text-[#365474]">Genuine-quality replacement parts for laptops from trusted brands.</p></div><img src="/images/ghaza-hero-parts.webp" alt="Laptop parts" className="absolute -right-10 -top-12 hidden h-56 w-[47%] object-contain sm:block" /></div>
      </section>

      <section className="container-x pb-6"><div className="flex gap-2 overflow-x-auto pb-2">{categories.slice(0, 7).map((category) => <Link key={category.id} to={`/shop?category=${encodeURIComponent(category.name)}`} className={`flex min-w-[140px] items-center gap-2 rounded-xl border bg-white px-4 py-3 text-sm font-bold shadow-sm transition hover:-translate-y-0.5 hover:border-brand-300 ${categoryParam === category.name ? 'border-brand-600 text-brand-700' : 'border-slate-200 text-[#10264b]'}`}><img src={CATEGORY_VISUALS[category.name]} alt="" className="h-7 w-10 object-contain" />{category.name}</Link>)}<Link to="/shop" className="flex min-w-[150px] items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-brand-700 shadow-sm">View All Categories <ChevronRight className="h-4 w-4" /></Link></div></section>

      <section className="container-x pb-14"><div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        <aside className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}><div className="sticky top-36 rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><h2 className="flex items-center gap-2 font-display text-lg font-bold text-[#10264b]"><SlidersHorizontal className="h-4 w-4" /> Filters</h2><button onClick={() => { setMaxPrice(''); setSearchParams({}); }} className="text-xs font-bold text-brand-700">Clear All</button></div><div className="space-y-6 p-5"><div><div className="mb-3 flex items-center justify-between text-sm font-bold text-[#10264b]">Brand <ChevronDown className="h-4 w-4" /></div><div className="relative mb-3"><Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" /><input placeholder="Search brand..." className="h-9 w-full rounded-lg border border-slate-200 pl-9 text-xs outline-none focus:border-brand-500" /></div><div className="space-y-2">{brands.map((brand) => <button key={brand.id} onClick={() => updateParams('brand', brandParam === brand.name ? '' : brand.name)} className="flex w-full items-center gap-2 text-left text-sm text-slate-600"><span className={`flex h-4 w-4 items-center justify-center rounded border ${brandParam === brand.name ? 'border-brand-600 bg-brand-600 text-white' : 'border-slate-300'}`}>{brandParam === brand.name ? '✓' : ''}</span>{brand.name}</button>)}</div></div><div className="border-t border-slate-100 pt-5"><div className="mb-3 flex items-center justify-between text-sm font-bold text-[#10264b]">Category <ChevronDown className="h-4 w-4" /></div><div className="space-y-2">{categories.slice(0, 8).map((category) => <button key={category.id} onClick={() => updateParams('category', categoryParam === category.name ? '' : category.name)} className={`block text-sm ${categoryParam === category.name ? 'font-bold text-brand-700' : 'text-slate-600'}`}>{category.name}</button>)}</div></div><div className="border-t border-slate-100 pt-5"><div className="mb-3 text-sm font-bold text-[#10264b]">Price (AED)</div><div className="flex items-center gap-2"><input type="number" placeholder="Min" className="h-9 w-full rounded-lg border border-slate-200 px-2 text-xs outline-none" /><span className="text-slate-400">—</span><input type="number" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)} placeholder="Max" className="h-9 w-full rounded-lg border border-slate-200 px-2 text-xs outline-none" /></div></div></div></div></aside>

        <main><div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div><button onClick={() => setFiltersOpen((value) => !value)} className="btn-secondary mr-3 py-2 lg:hidden"><SlidersHorizontal className="h-4 w-4" /> Filters</button><span className="font-display text-xl font-bold text-[#10264b]">{loading ? 'Loading...' : `${displayProducts.length} Products Found`}</span></div><div className="flex items-center gap-2"><label className="hidden text-xs font-semibold text-slate-500 sm:inline">Sort By:</label><select value={sort} onChange={(event) => setSort(event.target.value)} className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-[#10264b] outline-none"><option value="featured">Featured</option><option value="price-low">Price: Low to high</option><option value="price-high">Price: High to low</option><option value="name">Name</option></select><button onClick={() => setListView(false)} className={`hidden rounded-lg p-2 sm:block ${!listView ? 'bg-brand-600 text-white' : 'bg-white text-slate-500'}`} aria-label="Grid view"><Grid2X2 className="h-4 w-4" /></button><button onClick={() => setListView(true)} className={`hidden rounded-lg p-2 sm:block ${listView ? 'bg-brand-600 text-white' : 'bg-white text-slate-500'}`} aria-label="List view"><List className="h-4 w-4" /></button></div></div>
          {(categoryParam || brandParam || searchParams.get('q') || maxPrice) && <div className="mb-5 flex flex-wrap gap-2">{[categoryParam, brandParam, searchParams.get('q') ? `"${searchParams.get('q')}"` : '', maxPrice ? `Under AED ${maxPrice}` : ''].filter(Boolean).map((filter) => <span key={filter} className="badge bg-brand-50 text-brand-700">{filter}<button onClick={() => { if (filter === categoryParam) updateParams('category', ''); else if (filter === brandParam) updateParams('brand', ''); else if (filter === `Under AED ${maxPrice}`) setMaxPrice(''); else { updateParams('q', ''); } }}><X className="h-3 w-3" /></button></span>)}</div>}
          {error ? <div className="rounded-xl bg-red-50 p-5 text-sm text-red-700">{error}</div> : loading ? <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-[330px] animate-pulse rounded-2xl bg-slate-200" />)}</div> : displayProducts.length === 0 ? <div className="rounded-2xl border border-slate-200 bg-white py-20 text-center"><Search className="mx-auto h-9 w-9 text-slate-300" /><h2 className="mt-4 font-display text-lg font-bold text-[#10264b]">No products found</h2><p className="mt-1 text-sm text-slate-500">Try another search or clear your filters.</p></div> : <div className={`grid gap-4 ${listView ? 'grid-cols-1' : 'sm:grid-cols-2 xl:grid-cols-3'}`}>{displayProducts.map((product, index) => <Reveal key={product.id} delay={(index % 3) * 60} variant="scale"><ProductCard product={product} /></Reveal>)}</div>}
        </main>
      </div></section>
    </div>
  );
}
