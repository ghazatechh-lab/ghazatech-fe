import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CartProvider } from './lib/cart';
import { CheckCircle2, X } from 'lucide-react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Repair from './pages/Repair';
import Track from './pages/Track';
import Support from './pages/Support';
import About from './pages/About';
import Warranty from './pages/Warranty';
import AdminCRM from './pages/AdminCRM';
import CustomerAuth from './pages/CustomerAuth';
import CustomerProfile from './pages/CustomerProfile';

gsap.registerPlugin(ScrollTrigger);

function PageWrapper() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    ScrollTrigger.refresh();
  }, [location.pathname]);

  return (
    <Routes location={location}>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<CustomerAuth mode="register" />} />
      <Route path="/login" element={<CustomerAuth mode="login" />} />
      <Route path="/verify-email" element={<CustomerAuth mode="verify-email" />} />
      <Route path="/forgot-password" element={<CustomerAuth mode="forgot-password" />} />
      <Route path="/reset-password" element={<CustomerAuth mode="reset-password" />} />
      <Route path="/account" element={<CustomerProfile />} />
      <Route path="/resend-verification" element={<CustomerAuth mode="resend-verification" />} />
      <Route path="/crm" element={<AdminCRM />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/product/:slug" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/repair" element={<Repair />} />
      <Route path="/track" element={<Track />} />
      <Route path="/support" element={<Support />} />
      <Route path="/warranty" element={<Warranty />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<Home />} />
    </Routes>
  );
}

function LoginSuccessToast() {
  const location = useLocation();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!location.state?.loginSuccess) return;
    setVisible(true);
    const timeout = window.setTimeout(() => setVisible(false), 4500);
    return () => window.clearTimeout(timeout);
  }, [location.key, location.state]);
  if (!visible) return null;
  return (
    <div role="status" aria-live="polite" className="fixed right-4 top-24 z-[100] w-[min(24rem,calc(100vw-2rem))] rounded-[4px] border border-emerald-300 bg-white p-4 shadow-xl sm:right-6">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={20} />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-[#051329]">Login successful</p>
          <p className="mt-0.5 text-xs text-[#5A6D88]">Welcome back to GhazaTech portal.</p>
        </div>
        <button type="button" onClick={() => setVisible(false)} aria-label="Dismiss notification" className="rounded p-1 text-slate-400 hover:bg-slate-100"><X size={16}/></button>
      </div>
    </div>
  );
}

function SiteShell() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/crm');

  useEffect(() => {
    // Initialize tactile Lenis smooth scrolling with GSAP ticker binding
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const rafTicker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(rafTicker);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(rafTicker);
      lenis.destroy();
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F7FB] text-[#051329] antialiased">
      {!isAdmin && <Navbar />}
      <LoginSuccessToast />
      <main className="flex-1"><PageWrapper /></main>
      {!isAdmin && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <SiteShell />
      </CartProvider>
    </BrowserRouter>
  );
}
