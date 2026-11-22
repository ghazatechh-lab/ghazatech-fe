import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, MessageCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

const SHOP_LINKS = [
  { to: '/shop', label: 'All Products' },
  { to: '/shop?category=Battery', label: 'Batteries' },
  { to: '/shop?category=Keyboard', label: 'Keyboards' },
  { to: '/shop?category=Screen', label: 'Laptop Screens' },
  { to: '/shop?category=Charger', label: 'Chargers & Adapters' },
  { to: '/shop?category=Fan', label: 'Cooling Fans' },
];

const CARE_LINKS = [
  { to: '/repair', label: 'Book a Repair' },
  { to: '/track', label: 'Track Repair' },
  { to: '/warranty', label: 'Warranty Certificates' },
  { to: '/support', label: 'Support Portal' },
  { to: '/about', label: 'About Us' },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#162744] bg-[#051329] text-[#CAD5E3]">
      <div className="container-x grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand & Description */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[3px] bg-[#0B63F6] font-display text-base font-black text-white shadow-sm">
              GC
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-sm font-extrabold tracking-tight text-white">
                GHAZA COMPUTER TR LLC
              </span>
              <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[#2B85FF]">
                Laptop Parts
              </span>
            </div>
          </div>
          <p className="text-xs leading-relaxed text-[#8A9EB5]">
            High-quality laptop replacement parts and reliable repair solutions for leading
            brands. Serving repair centres, businesses, resellers and individual customers
            across the UAE.
          </p>
          <a
            href="https://wa.me/971563840130"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-[3px] border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 font-mono text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20"
          >
            <MessageCircle className="h-4 w-4 text-emerald-400" />
            <span>WhatsApp Support</span>
          </a>
        </div>

        {/* Shop Links */}
        <div>
          <h4 className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#2B85FF]">
            Shop Catalog
          </h4>
          <ul className="mt-4 space-y-2 text-xs">
            {SHOP_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-[#8A9EB5] transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#2B85FF]">
            Customer Care
          </h4>
          <ul className="mt-4 space-y-2 text-xs">
            {CARE_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-[#8A9EB5] transition hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#2B85FF]">
            Showroom &amp; Workshop
          </h4>
          <ul className="mt-4 space-y-3 text-xs text-[#8A9EB5]">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#2B85FF]" />
              <span>
                Second Industrial Street, Industrial Area 2
                <br />
                Sharjah, UAE (Serving Dubai &amp; All Emirates)
              </span>
            </li>
            <li>
              <a href="tel:+971563840130" className="flex items-center gap-2.5 hover:text-white transition">
                <Phone className="h-4 w-4 shrink-0 text-[#2B85FF]" />
                <span className="font-mono">+971 56 384 0130</span>
              </a>
            </li>
            <li>
              <a href="mailto:info@ghazacomp.com" className="flex items-center gap-2.5 hover:text-white transition">
                <Mail className="h-4 w-4 shrink-0 text-[#2B85FF]" />
                <span>info@ghazacomp.com</span>
              </a>
            </li>
            <li className="pt-1 flex items-center gap-1.5 text-[11px] text-[#2B85FF]">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Verified Commercial Registration</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal & Payment Badges */}
      <div className="border-t border-[#162744] bg-[#030d1c]">
        <div className="container-x flex flex-col items-center justify-between gap-4 py-4 text-xs text-[#8A9EB5] sm:flex-row">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2">
            <span>© {new Date().getFullYear()} Ghaza Computer Trading LLC. All rights reserved.</span>
            <span className="hidden sm:inline text-slate-600">|</span>
            <span className="font-mono text-[11px]">Laptop parts · Repairs · Dubai &amp; Sharjah, UAE</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="rounded-[2px] border border-[#1A2B49] bg-[#071936] px-2 py-0.5 text-white">VISA</span>
            <span className="rounded-[2px] border border-[#1A2B49] bg-[#071936] px-2 py-0.5 text-white">MASTERCARD</span>
            <span className="rounded-[2px] border border-[#1A2B49] bg-[#071936] px-2 py-0.5 text-white">APPLE PAY</span>
            <span className="rounded-[2px] border border-[#1A2B49] bg-[#071936] px-2 py-0.5 text-[#2B85FF]">COD</span>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Support Action */}
      <a
        href="https://wa.me/971563840130"
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-[4px] bg-[#16a34a] px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-xl shadow-green-950/30 transition-transform hover:-translate-y-0.5 hover:bg-[#128c41]"
        aria-label="Direct WhatsApp Support"
      >
        <MessageCircle className="h-4 w-4" />
        <span className="hidden sm:inline">WhatsApp Support</span>
      </a>
    </footer>
  );
}
