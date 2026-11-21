import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, ShieldCheck, Truck, BadgeCheck, Wrench } from 'lucide-react';
import { fetchProductBySlug, fetchProducts } from '../lib/api';
import type { Product } from '../lib/types';
import { useCart } from '../lib/cart';
import ProductCard, { ProductThumb } from '../components/ProductCard';
import Reveal from '../components/Reveal';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { add } = useCart();

  useEffect(() => {
    setLoading(true);
    if (!slug) return;
    fetchProductBySlug(slug)
      .then((p) => {
        setProduct(p);
        if (p?.category_id) {
          fetchProducts({ categorySlug: p.category?.slug })
            .then((list) => setRelated(list.filter((r) => r.id !== p.id).slice(0, 4)))
            .catch(() => setRelated([]));
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="container-x py-20">
        <div className="card h-96 animate-pulse bg-ink-100" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-x flex flex-col items-center py-24 text-center">
        <h1 className="font-display text-2xl font-bold text-ink-950">Product not found</h1>
        <p className="mt-2 text-sm text-ink-500">
          This part may have been removed or the link is incorrect.
        </p>
        <Link to="/shop" className="btn-primary mt-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>
      </div>
    );
  }

  const inStock = product.stock > 0;

  const handleAdd = () => {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="animate-fade-in">
      <div className="container-x py-10">
        <button
          onClick={() => window.history.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-ink-500 transition hover:text-brand-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="grid gap-10 lg:grid-cols-2">
          <Reveal variant="left">
            <div className="card group overflow-hidden">
              <div className="aspect-square overflow-hidden">
                <div className="h-full w-full transition duration-700 group-hover:scale-105">
                  <ProductThumb product={product} />
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal variant="right">
            <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge bg-brand-50 text-brand-700">
                {product.category?.name ?? 'Part'}
              </span>
              {product.brand && (
                <span className="badge bg-ink-100 text-ink-600">{product.brand.name}</span>
              )}
              <span
                className={`badge ${
                  inStock ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
                }`}
              >
                {inStock ? `${product.stock} available` : 'Out of stock'}
              </span>
            </div>
            <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-ink-950">
              {product.name}
            </h1>
            {product.part_number && (
              <p className="mt-2 text-sm text-ink-400">Part number: {product.part_number}</p>
            )}
            <div className="mt-5 font-display text-4xl font-bold text-ink-950">
              AED {Number(product.price_aed).toFixed(2)}
            </div>
            <p className="mt-5 leading-relaxed text-ink-600">
              {product.description ??
                'Quality-checked replacement part, tested before dispatch from our Sharjah warehouse.'}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={handleAdd}
                disabled={!inStock}
                className={`btn-primary flex-1 transition-all sm:flex-none sm:px-10 ${added ? 'scale-105 !bg-emerald-600' : ''}`}
              >
                <ShoppingCart className={`h-4 w-4 ${added ? 'animate-pop-in' : ''}`} />
                {added ? 'Added to cart' : inStock ? 'Add to Cart' : 'Unavailable'}
              </button>
              <Link to="/cart" className="btn-secondary flex-1 sm:flex-none sm:px-10">
                View Cart
              </Link>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                { icon: ShieldCheck, text: 'Quality checked before dispatch' },
                { icon: Truck, text: 'Free UAE delivery over AED 250' },
                { icon: BadgeCheck, text: 'Warranty support included' },
                { icon: Wrench, text: 'Installation available in Sharjah' },
              ].map((f) => (
                <div
                  key={f.text}
                  className="flex items-center gap-2.5 rounded-xl border border-ink-100 p-3 text-xs font-medium text-ink-600 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-sm"
                >
                  <f.icon className="h-4 w-4 shrink-0 text-brand-600 transition hover:scale-125" />
                  {f.text}
                </div>
              ))}
            </div>
            </div>
          </Reveal>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <Reveal>
              <h2 className="font-display text-2xl font-bold tracking-tight text-ink-950">
                More {product.category?.name ?? 'parts'}
              </h2>
            </Reveal>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((p, i) => (
                <Reveal key={p.id} delay={i * 90} variant="scale">
                  <ProductCard product={p} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
