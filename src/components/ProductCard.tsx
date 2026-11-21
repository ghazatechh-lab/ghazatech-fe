import { Link } from 'react-router-dom';
import { ShoppingCart, PackageX } from 'lucide-react';
import type { Product } from '../lib/types';
import { useCart } from '../lib/cart';
import { getProductVisual } from '../lib/productVisuals';

export function ProductThumb({ product, className = '' }: { product: Product; className?: string }) {
  const visual = getProductVisual(product);
  if (visual) {
    return <img src={visual} alt={product.name} loading="lazy" className={`h-full w-full object-contain ${className}`} />;
  }
  return <div className={`flex h-full w-full items-center justify-center bg-slate-50 ${className}`}><PackageX className="h-10 w-10 text-slate-300" /></div>;
}

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const inStock = product.stock > 0;
  const brand = product.brand?.name ?? (product.name.match(/^(DELL|ACER|ASUS|HP|LENOVO|SONY|APPLE)/i)?.[1] ?? 'Ghaza');

  return (
    <article className="gt-premium-card group flex min-h-[365px] flex-col p-3.5">
      <div className="gt-product-media relative flex h-44 items-center justify-center overflow-hidden rounded-2xl">
        <div className="absolute left-2 top-2 rounded-md bg-brand-600 px-2.5 py-1 text-[10px] font-bold text-white">{brand}</div>
        <div className="h-36 w-4/5 transition duration-500 group-hover:scale-105"><ProductThumb product={product} /></div>
      </div>
      <div className="flex flex-1 flex-col px-1 pt-3">
        <Link to={`/product/${product.slug}`} className="line-clamp-2 text-sm font-bold leading-snug text-[#10264b] transition hover:text-brand-700">{product.name}</Link>
        <p className="mt-1 line-clamp-1 text-[11px] text-slate-500">Part No: {product.part_number ?? '—'} <span className="mx-1 text-slate-300">|</span> Condition: New</p>
        <div className="mt-3 font-display text-2xl font-bold tracking-tight text-brand-700">AED {Number(product.price_aed).toFixed(2)}</div>
        <div className={`mt-1 text-xs font-semibold ${inStock ? 'text-emerald-600' : 'text-red-500'}`}>
          <span className="mr-1">●</span>{inStock ? `In Stock (${product.stock} available)` : 'Out of Stock'}
        </div>
        <div className="mt-auto grid grid-cols-2 gap-2 pt-3">
          <Link to={`/product/${product.slug}`} className="inline-flex h-11 items-center justify-center rounded-xl border border-[#cedbeb] text-xs font-bold text-[#10264b] transition hover:border-brand-600 hover:bg-brand-50">View Details</Link>
          <button onClick={() => add(product)} disabled={!inStock} className="gt-visual-sheen inline-flex h-11 items-center justify-center gap-1 rounded-xl bg-brand-600 text-xs font-bold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-300"><ShoppingCart className="h-3.5 w-3.5" /> Add to Cart</button>
        </div>
      </div>
    </article>
  );
}
