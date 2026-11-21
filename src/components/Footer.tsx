import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';

const SHOP_LINKS = [
  { to: '/shop', label: 'All Products' },
  { to: '/shop?category=Battery', label: 'Batteries' },
  { to: '/shop?category=Keyboard', label: 'Keyboards' },
  { to: '/shop?category=Screen', label: 'Screens' },
];

const CARE_LINKS = [
  { to: '/repair', label: 'Book a Repair' },
  { to: '/track', label: 'Track Repair' },
  { to: '/warranty', label: 'Warranty Certificates' },
  { to: '/support', label: 'Support' },
  { to: '/about', label: 'About Us' },
];

export default function Footer() {
  return (
    <footer className="bg-ink-950 text-ink-200">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <img src="/images/ghaza-logo.png" alt="Ghaza Computer TR.LLC" className="h-9 w-9 rounded-lg object-cover" />
            <span className="font-display text-sm font-bold tracking-tight text-white">
              GHAZA COMPUTER TR.LLC
            </span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink-300">
            High-quality laptop replacement parts and reliable repair solutions for leading
            brands. Serving repair centres, businesses, resellers and individual customers
            across the UAE.
          </p>
          <a
            href="https://wa.me/971563840130"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-400 transition hover:bg-emerald-500/20"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp Support
          </a>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">Shop</h4>
          <ul className="mt-4 space-y-2.5">
            {SHOP_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm text-ink-300 transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">
            Customer Care
          </h4>
          <ul className="mt-4 space-y-2.5">
            {CARE_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm text-ink-300 transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-400">
            Contact
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-ink-300">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
              <span>
                Second Industrial Street, Industrial Area 2
                <br />
                Sharjah, UAE
              </span>
            </li>
            <li>
              <a href="tel:+971563840130" className="flex items-center gap-2.5 hover:text-white">
                <Phone className="h-4 w-4 shrink-0 text-brand-400" />
                +971 56 384 0130
              </a>
            </li>
            <li>
              <a href="mailto:info@ghazacomp.com" className="flex items-center gap-2.5 hover:text-white">
                <Mail className="h-4 w-4 shrink-0 text-brand-400" />
                info@ghazacomp.com
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-ink-800">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-5 text-xs text-ink-400 sm:flex-row">
          <span>© {new Date().getFullYear()} Ghaza Computer Trading LLC. All rights reserved.</span>
          <span>Laptop parts · Repairs · Sharjah, UAE</span>
        </div>
      </div>
      <a
        href="https://wa.me/971563840130"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-[#16a34a] px-4 py-3 text-xs font-bold text-white shadow-xl shadow-green-900/20 transition hover:-translate-y-1 hover:bg-[#128c41] sm:bottom-7 sm:right-7"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="hidden sm:inline">WhatsApp Support</span>
      </a>
    </footer>
  );
}
