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
  RotateCcw,
  Sparkles,
  Phone,
  MapPin,
  X,
  UserRound,
  Send,
  Home as HomeIcon,
  Headphones,
} from 'lucide-react';
import { useCart } from '../lib/cart';
import { getCustomerToken } from '../lib/auth';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/shop', label: 'Shop', dropdown: true },
  { to: '/warranty', label: 'Warranty', icon: ShieldCheck },
  { to: '/repair', label: 'Repair', icon: Wrench },
  { to: '/track', label: 'Track Repair', icon: FileText },
  { to: '/support', label: 'Support', icon: Headphones },
  { to: '/about', label: 'About Us' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { count } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const submitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = query.trim();
    navigate(value ? `/shop?q=${encodeURIComponent(value)}` : '/shop');
    setOpen(false);
  };

  const isAuth = Boolean(getCustomerToken());

  return (
    <header className="sticky top-0 z-50 w-full shadow-md">
      {/* TIER 1: Top Utility Strip (#051329) */}
      <div className="border-b border-[#162744] bg-[#051329] text-[#CAD5E3]">
        <div className="container-x flex h-8 items-center justify-between gap-4 text-[11px] font-medium">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Truck className="h-3.5 w-3.5 text-[#2B85FF]" />
              <span>Free UAE Delivery Over AED 250</span>
            </span>
            <span className="hidden items-center gap-1.5 md:flex hover:text-white transition-colors">
              <ShieldCheck className="h-3.5 w-3.5 text-[#2B85FF]" />
              <span>Genuine &amp; Tested Parts</span>
            </span>
            <span className="hidden items-center gap-1.5 lg:flex hover:text-white transition-colors">
              <RotateCcw className="h-3.5 w-3.5 text-[#2B85FF]" />
              <span>Easy Returns (7 Days)</span>
            </span>
            <span className="hidden items-center gap-1.5 xl:flex hover:text-white transition-colors">
              <Sparkles className="h-3.5 w-3.5 text-[#2B85FF]" />
              <span>Warranty Support</span>
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 font-mono text-[11px]">
            <div className="flex items-center gap-1 text-[#CAD5E3] hover:text-white cursor-pointer">
              <span className="text-sm">🇦🇪</span>
              <span className="font-semibold text-xs font-sans">UAE</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </div>
            <a href="tel:+971563840130" className="flex items-center gap-1.5 text-white hover:text-[#2B85FF] transition-colors">
              <Phone className="h-3 w-3 text-[#2B85FF]" />
              <span className="font-mono text-[11px]">+971 56 384 0130</span>
            </a>
            <span className="hidden sm:flex items-center gap-1 text-[#8A9EB5]">
              <MapPin className="h-3 w-3 text-[#2B85FF]" />
              <span>Dubai, UAE</span>
            </span>
          </div>
        </div>
      </div>

      {/* TIER 2: Main Header (#071936) */}
      <div className="border-b border-[#1A2B49] bg-[#071936] py-3 text-white">
        <div className="container-x flex items-center justify-between gap-4 lg:gap-8">
          {/* Logo Mark */}
          <Link to="/" className="flex shrink-0 items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-[3px] bg-[#0B63F6] font-display text-lg font-black tracking-tighter text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              GC
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-sm sm:text-base font-extrabold tracking-tight text-white group-hover:text-[#2B85FF] transition-colors">
                GHAZA COMPUTER TR LLC
              </span>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#2B85FF]">
                Laptop Parts
              </span>
            </div>
          </Link>

          {/* Wide Central Search Bar */}
          <form onSubmit={submitSearch} className="relative hidden max-w-2xl flex-1 md:flex">
            <div className="relative flex w-full items-center">
              <Search className="absolute left-3.5 h-4 w-4 text-[#8A9EB5] pointer-events-none" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by model, part number, FRU or SKU..."
                className="h-10 w-full rounded-l-[3px] border border-[#1A2B49] bg-[#051329] pl-10 pr-4 text-xs font-medium text-white placeholder-[#8A9EB5] outline-none transition focus:border-[#0B63F6] focus:bg-[#091F40]"
              />
              <button
                type="submit"
                aria-label="Search catalog"
                className="flex h-10 w-12 shrink-0 items-center justify-center rounded-r-[3px] bg-[#0B63F6] text-white transition-colors hover:bg-[#0953d4] active:scale-[0.98]"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to={isAuth ? '/account' : '/login'}
              className="flex items-center gap-2 text-xs font-semibold text-white hover:text-[#2B85FF] transition-colors"
            >
              <UserRound className="h-5 w-5 text-[#2B85FF]" />
              <span className="hidden lg:inline">{isAuth ? 'My Account' : 'Login / Sign up'}</span>
            </Link>

            <Link
              to="/cart"
              className="relative flex items-center gap-2 text-xs font-semibold text-white hover:text-[#2B85FF] transition-colors"
            >
              <div className="relative">
                <ShoppingCart className="h-5 w-5 text-[#2B85FF]" />
                <span className="absolute -right-2 -top-2 flex h-4 min-w-[16px] items-center justify-center rounded-[2px] bg-[#0B63F6] px-1 font-mono text-[10px] font-bold text-white shadow">
                  {count}
                </span>
              </div>
              <span className="hidden sm:inline">Cart</span>
            </Link>

            <button
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-[3px] border border-[#1A2B49] bg-[#051329] text-white lg:hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* TIER 3: Sub-Navigation Bar (#071936 / #051329) */}
      <div className="hidden border-b border-[#1A2B49] bg-[#051329] lg:block">
        <div className="container-x flex h-11 items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            {/* All Categories Dropdown Button */}
            <Link
              to="/shop"
              className="flex h-8 items-center gap-2 rounded-[3px] bg-[#0B63F6] px-3.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#0953d4]"
            >
              <Menu className="h-3.5 w-3.5" />
              <span>All Categories</span>
              <ChevronDown className="h-3 w-3" />
            </Link>

            {/* Navbar Navigation Links */}
            <nav className="flex items-center gap-5" aria-label="Main navigation">
              {NAV_LINKS.map((link) => {
                const active = link.to === '/' ? location.pathname === '/' : location.pathname.startsWith(link.to);
                const Icon = link.icon;
                return (
                  <Link
                    key={`${link.label}-${link.to}`}
                    to={link.to}
                    className={`relative flex items-center gap-1.5 py-3 text-xs font-semibold tracking-wide transition-colors ${
                      active ? 'text-[#2B85FF]' : 'text-[#CAD5E3] hover:text-white'
                    }`}
                  >
                    {Icon && <Icon className={`h-3.5 w-3.5 ${active ? 'text-[#2B85FF]' : 'text-[#8A9EB5]'}`} />}
                    <span>{link.label}</span>
                    {link.dropdown && <ChevronDown className="h-3 w-3 text-slate-400" />}
                    {active && (
                      <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[#0B63F6]" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action Button: Request a Part */}
          <Link
            to="/repair"
            className="flex h-8 items-center gap-1.5 rounded-[3px] border border-[#2B85FF]/50 bg-[#0B63F6]/10 px-3.5 text-xs font-bold uppercase tracking-wider text-white transition-all hover:border-[#2B85FF] hover:bg-[#0B63F6] hover:text-white"
          >
            <Send className="h-3 w-3 text-[#2B85FF]" />
            <span>Request a Part</span>
          </Link>
        </div>
      </div>

      {/* Mobile Drawer */}
      {open && (
        <div className="border-b border-[#1A2B49] bg-[#071936] text-white lg:hidden">
          <div className="container-x space-y-3 py-4">
            <form onSubmit={submitSearch} className="relative flex">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search parts, model, FRU..."
                className="h-10 w-full rounded-[3px] border border-[#1A2B49] bg-[#051329] pl-10 pr-3 text-xs text-white outline-none focus:border-[#0B63F6]"
              />
            </form>
            <Link
              to="/shop"
              className="flex items-center justify-between rounded-[3px] bg-[#0B63F6] px-3 py-2 text-xs font-bold uppercase tracking-wider text-white"
            >
              <span>All Categories</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </Link>
            <div className="divide-y divide-[#1A2B49]">
              {NAV_LINKS.map((link) => (
                <Link
                  key={`${link.label}-${link.to}`}
                  to={link.to}
                  className="flex items-center gap-2 py-2.5 text-xs font-semibold text-[#CAD5E3] hover:text-white"
                >
                  {link.icon && <link.icon className="h-4 w-4 text-[#2B85FF]" />}
                  <span>{link.label}</span>
                </Link>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <Link
                to={isAuth ? '/account' : '/login'}
                className="flex-1 rounded-[3px] border border-[#1A2B49] bg-[#051329] py-2 text-center text-xs font-semibold text-white"
              >
                {isAuth ? 'My Account' : 'Customer Login'}
              </Link>
              <Link
                to="/repair"
                className="flex-1 rounded-[3px] bg-[#0B63F6] py-2 text-center text-xs font-bold uppercase tracking-wider text-white"
              >
                Request a Part
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
