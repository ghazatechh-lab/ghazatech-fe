import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { CartProvider } from './lib/cart';
import { CheckCircle2, X } from 'lucide-react';
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

function PageWrapper() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
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
    <div role="status" aria-live="polite" className="fixed right-4 top-20 z-[100] w-[min(24rem,calc(100vw-2rem))] rounded-2xl border border-emerald-200 bg-white p-4 shadow-2xl sm:right-6 sm:top-24">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="mt-0.5 shrink-0 text-emerald-600" size={23} />
        <div className="min-w-0 flex-1">
          <p className="font-bold text-slate-900">Login successful!</p>
          <p className="mt-1 text-sm text-slate-600">Welcome back to GhazaTech.</p>
        </div>
        <button type="button" onClick={() => setVisible(false)} aria-label="Dismiss notification" className="rounded-lg p-1 text-slate-500 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600"><X size={18}/></button>
      </div>
    </div>
  );
}

function SiteShell() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/crm');
  return <div className="flex min-h-screen flex-col">
    {!isAdmin && <Navbar />}
    <LoginSuccessToast />
    <main className="flex-1"><PageWrapper /></main>
    {!isAdmin && <Footer />}
  </div>;
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
