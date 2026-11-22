import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ShoppingCart, PackageX, ArrowRight } from 'lucide-react';
import type { Product } from '../lib/types';
import { useCart } from '../lib/cart';
import { useToast } from './ui/ToastProvider';
import { getProductVisual } from '../lib/productVisuals';

export function ProductThumb({ product, className = '' }: { product: Product; className?: string }) {
  const visual = getProductVisual(product);
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(()=>setImageFailed(false),[visual]);
  if (visual && !imageFailed) {
    return (
      <img
        src={visual}
        onError={() => setImageFailed(true)}
        alt={product.name}
        loading="lazy"
        className={`h-full w-full object-contain transition-transform duration-300 group-hover:scale-105 ${className}`}
      />
    );
  }
  return (
    <div className={`flex h-full w-full items-center justify-center bg-[#F4F7FB] ${className}`}>
      <PackageX className="h-8 w-8 text-[#8A9EB5]" />
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const { add, items } = useCart();
  const toast=useToast();
  const inStock = product.stock > 0;
  const brand = product.brand?.name ?? (product.name.match(/^(DELL|ACER|ASUS|HP|LENOVO|SONY|APPLE)/i)?.[1] ?? 'Ghaza');

  return (
    <article className="group flex min-h-[380px] flex-col rounded-2xl border border-[#DCE4EE] bg-white p-4 transition-all duration-200 hover:-translate-y-1 hover:border-[#8BAEF0] hover:shadow-[0_18px_40px_-20px_rgba(10,43,87,.24)]">
      {/* Product Image Frame */}
      <div className="relative flex h-44 w-full items-center justify-center rounded-xl border border-[#EAEFF7] bg-[#F4F7FB] p-3">
        {/* Brand Tag */}
        <div className="absolute left-2.5 top-2.5 rounded-[2px] bg-[#071936] px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-white">
          {brand}
        </div>
        
        <div className="h-32 w-full flex items-center justify-center">
          <ProductThumb product={product} />
        </div>
      </div>

      {/* Meta & Info */}
      <div className="flex flex-1 flex-col pt-3">
        {/* Monospace SKU / FRU line */}
        <div className="flex items-center justify-between text-[11px] text-[#5A6D88]">
          <span className="font-mono text-[11px] font-medium tracking-tight">
            PART: {product.part_number ? product.part_number.slice(0, 14) : 'OEM-COMP'}
          </span>
          <span className="font-mono text-[10px] font-semibold uppercase text-[#0B63F6]">
            {product.category?.name ?? 'PARTS'}
          </span>
        </div>

        {/* Product Title */}
        <Link
          to={`/product/${product.slug}`}
          className="mt-1.5 line-clamp-2 text-xs font-bold leading-snug text-[#051329] transition-colors hover:text-[#0B63F6]"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Stock Status Dot */}
        <div className="mt-2.5 flex items-center gap-1.5 text-[11px]">
          <span className={`h-1.5 w-1.5 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          <span className={`font-mono text-[11px] font-medium ${inStock ? 'text-emerald-700' : 'text-rose-600'}`}>
            {inStock ? `In Stock (${product.stock} pcs)` : 'Out of Stock'}
          </span>
        </div>

        {/* Price & Action Buttons */}
        <div className="mt-auto pt-3">
          <div className="flex items-baseline justify-between border-t border-[#F0F4FA] pt-2">
            <span className="font-mono text-[11px] text-[#8A9EB5]">PRICE (AED):</span>
            <span className="font-display text-lg font-extrabold tracking-tight text-[#051329]">
              AED {Number(product.price_aed).toFixed(2)}
            </span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              to={`/product/${product.slug}`}
              className="inline-flex h-9 items-center justify-center rounded-[3px] border border-[#DCE4EE] bg-white text-center text-[11px] font-bold uppercase tracking-wider text-[#051329] transition-colors hover:border-[#0B63F6] hover:bg-[#F4F7FB]"
            >
              Details
            </Link>
            <button
              onClick={() => { const existing=items.find(i=>i.product.id===product.id)?.qty||0; if(existing>=product.stock){toast.warning('Insufficient stock', 'The requested quantity exceeds available stock.');return;} add(product);toast.success('Added to cart', `${product.name} has been added to your cart.`); }}
              disabled={!inStock}
              className="inline-flex h-9 items-center justify-center gap-1 rounded-[3px] bg-[#0B63F6] px-2 text-center text-[11px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#0953d4] disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-400"
            >
              <ShoppingCart className="h-3 w-3" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
