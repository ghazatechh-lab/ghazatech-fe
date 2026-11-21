import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown,
  Menu,
  Search,
  ShoppingCart,
  Wrench,
  FileText,
  ShieldCheck,
  Truck,
  X,
  UserRound,
} from 'lucide-react';
import { useCart } from '../lib/cart';
import {getCustomerToken} from '../lib/auth';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop', dropdown: true },
  { to: '/warranty', label: 'Warranty', icon: ShieldCheck },
  { to: '/repair', label: 'Repair', icon: Wrench },
  { to: '/track', label: 'Track Repair', icon: FileText },
  { to: '/support', label: 'Support' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [query, setQuery] = useState('');
  const { count } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', onKey); };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = query.trim();
    navigate(value ? `/shop?q=${encodeURIComponent(value)}` : '/shop');
    setOpen(false);
  };

  return (
    <header className={`gt-top-nav sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-xl shadow-slate-900/10' : ''}`}>
      <div className="bg-[#072d62] text-white">
        <div className="container-x flex min-h-9 items-center justify-between gap-5 text-[11px] font-semibold sm:text-xs">
          <div className="hidden items-center gap-2 sm:flex"><Truck className="h-4 w-4" /> Free UAE Delivery Over AED 250</div>
          <div className="hidden items-center gap-2 md:flex"><ShieldCheck className="h-4 w-4" /> Genuine &amp; Tested Parts</div>
          <div className="hidden items-center gap-2 lg:flex">↻ Easy Returns</div>
          <a href="tel:+971563840130" className="ml-auto hover:text-brand-200">+971 56 384 0130</a>
          <span className="hidden sm:inline text-blue-200">Dubai, UAE</span>
        </div>
      </div>

      <div className="border-b border-slate-100 bg-white/95">
        <div className="container-x flex min-h-[72px] items-center gap-4">
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <img src="/images/ghaza-logo.png" alt="Ghaza Computer TR.LLC" className="h-11 w-11 rounded-xl object-cover shadow-sm" />
            <span className="hidden leading-none sm:flex sm:flex-col">
              <span className="font-display text-base font-bold tracking-tight text-[#0b2b57]">GHAZA COMPUTER TR.LLC</span>
              <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-brand-600">Laptop Parts</span>
            </span>
          </Link>

          <form onSubmit={submitSearch} className="relative hidden min-w-0 flex-1 md:flex">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by model, part number, SKU or product..."
              className="h-11 w-full rounded-l-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-100"
            />
            <button type="submit" className="flex h-11 w-14 items-center justify-center rounded-r-xl bg-brand-600 text-white transition hover:bg-brand-700" aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
          </form>

          <div className="ml-auto flex items-center gap-4 text-[#0b2b57] sm:gap-5">
            <Link to={getCustomerToken()?'/account':'/login'} className="flex items-center gap-2 text-sm font-semibold" aria-label="Customer account"><UserRound className="h-6 w-6"/><span className="hidden lg:inline">{getCustomerToken()?'My Account':'Login / Sign up'}</span></Link>


            <Link to="/cart" className="gt-animated-count relative flex items-center gap-2 text-sm font-semibold">
              <ShoppingCart className="h-6 w-6" />
              <span className="hidden lg:inline">Cart</span>
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[10px] font-bold text-white">{count}</span>
            </Link>
            <button onClick={() => setOpen((value) => !value)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 lg:hidden" aria-label="Toggle menu" aria-expanded={open} aria-controls="mobile-shop-navigation">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <div className="container-x hidden items-center gap-7 pb-3 lg:flex">
          <Link to="/shop" className="flex h-10 items-center gap-2 rounded-xl bg-brand-600 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700"><Menu className="h-4 w-4" /> All Categories</Link>
          {NAV_LINKS.map((link) => {
            const active = link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to);
            const Icon = link.icon;
            return (
              <Link key={`${link.label}-${link.to}`} to={link.to} className={`group relative flex items-center gap-1.5 py-2 text-sm font-semibold transition ${active ? 'text-brand-700' : 'text-slate-700 hover:text-brand-700'}`}>
                {Icon && <Icon className="h-4 w-4" />}
                {link.label}
                {link.dropdown && <ChevronDown className="h-3.5 w-3.5 transition group-hover:rotate-180" />}
                <span className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-brand-600 transition-all ${active ? 'w-full' : 'w-0 group-hover:w-full'}`} />
              </Link>
            );
          })}
        </div>
      </div>

      {open && (
        <div id="mobile-shop-navigation" className="animate-slide-down border-t border-slate-100 bg-white lg:hidden" role="navigation" aria-label="Mobile navigation">
          <div className="container-x py-4">
            <form onSubmit={submitSearch} className="relative mb-3 flex md:hidden">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search products..." className="input pl-10" />
            </form>
            {NAV_LINKS.map((link) => <Link key={`${link.label}-${link.to}`} to={link.to} className="block rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-700">{link.label}</Link>)}
            <Link to="/login" className="block rounded-lg px-3 py-3 text-sm font-semibold text-blue-700">Customer Login</Link><Link to="/register" className="block rounded-lg px-3 py-3 text-sm font-semibold text-blue-700">Sign up</Link>
          </div>
        </div>
      )}
    </header>
  );
}
