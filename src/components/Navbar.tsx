import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FileText, Headphones, Home, MapPin, Menu, Phone, RotateCcw, Search,
  Send, ShieldCheck, ShoppingCart, Truck, UserRound, Wrench, X,
  ArrowRight, PackageSearch,
} from 'lucide-react';
import { useCart } from '../lib/cart';
import { getCustomerToken } from '../lib/auth';
import './Navbar.css';

type NavItem = { to: string; label: string; icon: typeof Home };

const NAV_LINKS: NavItem[] = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/shop', label: 'Shop', icon: PackageSearch },
  { to: '/warranty', label: 'Warranty', icon: ShieldCheck },
  { to: '/repair', label: 'Repair', icon: Wrench },
  { to: '/track', label: 'Track Repair', icon: FileText },
  { to: '/support', label: 'Support', icon: Headphones },
  { to: '/about', label: 'About Us', icon: MapPin },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { count } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const menuButton = useRef<HTMLButtonElement>(null);
  const drawer = useRef<HTMLDivElement>(null);
  const wasOpen = useRef(false);
  const isAuth = Boolean(getCustomerToken());

  useEffect(() => { setOpen(false); }, [location.pathname, location.search]);

  useEffect(() => {
    if (!open) {
      if (wasOpen.current) menuButton.current?.focus();
      wasOpen.current = false;
      return;
    }
    wasOpen.current = true;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    drawer.current?.querySelector<HTMLInputElement>('input')?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
      if (event.key !== 'Tab' || !drawer.current) return;
      const focusables = Array.from(drawer.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input:not([disabled])'));
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // Close a mobile drawer that stays open when a user expands the viewport.
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const onResize = () => { if (mql.matches) setOpen(false); };
    mql.addEventListener('change', onResize);
    return () => mql.removeEventListener('change', onResize);
  }, []);

  const submitSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = query.trim();
    navigate(value ? `/shop?q=${encodeURIComponent(value)}` : '/shop');
    setOpen(false);
  };

  const isActive = (path: string) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <header className="ghz-site-header sticky top-0 z-50 w-full" role="banner">
      <div className="ghz-utility-bar">
        <div className="container-x ghz-utility-inner">
          <div className="ghz-benefits" aria-label="Shopping information">
            <span className="ghz-utility-item"><Truck aria-hidden="true" /> Free UAE Delivery Over AED 250</span>
            <span className="ghz-utility-item ghz-benefit-secondary"><ShieldCheck aria-hidden="true" /> Genuine &amp; Tested Parts</span>
            <span className="ghz-utility-item ghz-benefit-tertiary"><RotateCcw aria-hidden="true" /> Easy Returns (7 Days)</span>
          </div>
          <div className="ghz-utility-contact">
            <span className="ghz-location"><MapPin aria-hidden="true" /> Dubai, UAE</span>
            <a href="tel:+971563840130" className="ghz-phone"><Phone aria-hidden="true" /> +971 56 384 0130</a>
          </div>
        </div>
      </div>

      <div className="ghz-primary-bar">
        <div className="container-x ghz-primary-inner">
          <Link to="/" className="ghz-brand" aria-label="Ghaza Computer home">
            <span className="ghz-brand-mark" aria-hidden="true">GC</span>
            <span className="ghz-brand-copy">
              <strong>GHAZA COMPUTER TR LLC</strong>
              <small>LAPTOP PARTS &amp; COMPONENTS</small>
            </span>
          </Link>

          <form onSubmit={submitSearch} className="ghz-header-search" role="search" aria-label="Search the product catalog">
            <Search className="ghz-search-icon" aria-hidden="true" />
            <input aria-label="Search products" value={query} onChange={(e) => setQuery(e.target.value)}
              type="search" placeholder="Search model, part number, FRU or SKU" />
            <button type="submit" aria-label="Search products"><Search aria-hidden="true" /></button>
          </form>

          <div className="ghz-header-actions">
            <Link className="ghz-header-action" to={isAuth ? '/account' : '/login'} aria-label={isAuth ? 'My account' : 'Sign in or register'}>
              <UserRound aria-hidden="true" /> <span>{isAuth ? 'My Account' : 'Login / Sign up'}</span>
            </Link>
            <Link className="ghz-header-action ghz-cart-link" to="/cart" aria-label={`Cart, ${count} items`}>
              <span className="ghz-cart-icon"><ShoppingCart aria-hidden="true" /><span className="ghz-cart-badge">{count}</span></span>
              <span>Cart</span>
            </Link>
            <button className="ghz-menu-toggle" ref={menuButton} type="button" onClick={() => setOpen((prev) => !prev)}
              aria-controls="ghz-mobile-drawer" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open}>
              {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>

      <div className="ghz-nav-bar">
        <div className="container-x ghz-nav-inner">
          <Link to="/shop" className="ghz-categories-link"><Menu aria-hidden="true" /> All Categories</Link>
          <nav className="ghz-desktop-nav" aria-label="Primary navigation">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className={`ghz-nav-link${isActive(to) ? ' is-active' : ''}`}
                aria-current={isActive(to) ? 'page' : undefined}>
                <Icon aria-hidden="true" /><span>{label}</span>
              </Link>
            ))}
          </nav>
          <Link to="/repair" className="ghz-request-link"><Send aria-hidden="true" /> Request a Part <ArrowRight aria-hidden="true" /></Link>
        </div>
      </div>

      {open && <button type="button" className="ghz-drawer-backdrop" aria-label="Close navigation" onClick={() => setOpen(false)} />}
      <div id="ghz-mobile-drawer" ref={drawer} className={`ghz-mobile-drawer${open ? ' is-open' : ''}`}
        aria-hidden={!open} {...(!open ? { inert: true } : {})}>
        <div className="ghz-drawer-head"><span>Browse GhazaTech</span><button type="button" onClick={() => setOpen(false)} aria-label="Close menu"><X aria-hidden="true" /></button></div>
        <form className="ghz-drawer-search" onSubmit={submitSearch} role="search">
          <Search aria-hidden="true" /><input type="search" aria-label="Search product catalog" placeholder="Find model, part number or SKU" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button aria-label="Submit search" type="submit"><ArrowRight aria-hidden="true" /></button>
        </form>
        <nav aria-label="Mobile navigation" className="ghz-drawer-links">
          <Link className="ghz-drawer-category" to="/shop" onClick={() => setOpen(false)}><PackageSearch aria-hidden="true" /> All Categories <ArrowRight aria-hidden="true" /></Link>
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} aria-current={isActive(to) ? 'page' : undefined}
              className={`ghz-drawer-link${isActive(to) ? ' is-active' : ''}`} onClick={() => setOpen(false)}>
              <Icon aria-hidden="true" /><span>{label}</span><ArrowRight aria-hidden="true" />
            </Link>
          ))}
        </nav>
        <div className="ghz-drawer-bottom">
          <Link to={isAuth ? '/account' : '/login'} onClick={() => setOpen(false)}><UserRound aria-hidden="true" />{isAuth ? 'My Account' : 'Customer Login'}</Link>
          <Link to="/repair" onClick={() => setOpen(false)}><Send aria-hidden="true" />Request a Part</Link>
          <a href="tel:+971563840130"><Phone aria-hidden="true" />+971 56 384 0130</a>
        </div>
      </div>
    </header>
  );
}
