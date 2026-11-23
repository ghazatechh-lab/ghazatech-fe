import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CartProvider } from './lib/cart';
import './styles/storefront-premium.css';
import './styles/storefront-fluid.css';
import { ToastProvider, useToast } from './components/ui/ToastProvider';
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
 const location=useLocation(); const toast=useToast();
 useEffect(()=>{if(location.state?.loginSuccess)toast.success('Welcome back!', 'You have successfully signed in.');},[location.key]);
 return null;
}

function SiteShell() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/crm');

  useEffect(() => {
    if(isAdmin || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Smooth scrolling is storefront-only and disabled for reduced-motion users.
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
  }, [isAdmin]);

  return (
    <div className={`${isAdmin ? '' : 'ghz-storefront'} flex min-h-screen flex-col bg-[#F4F7FB] text-[#051329] antialiased`}>
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
      <ToastProvider><CartProvider>
        <SiteShell />
      </CartProvider></ToastProvider>
    </BrowserRouter>
  );
}
