import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3, Boxes, ChevronDown, ExternalLink,
  Headphones, LayoutDashboard, LogOut, Package, PanelLeftClose, PanelLeftOpen,
  RotateCcw, Shapes, ShieldCheck, ShoppingCart, Star, Tags, TicketPercent,
  Users, Wrench, X, type LucideIcon,
} from 'lucide-react';
import '../styles/crm-sidebar.css';

type NavItem = { key: string; label: string; icon: LucideIcon };
type NavGroup = { title: string; items: NavItem[] };
const NAV_GROUPS: NavGroup[] = [
  { title: 'Main', items: [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'reports', label: 'Analytics & Reports', icon: BarChart3 },
  ] },
  { title: 'Sales & Customers', items: [
    { key: 'orders', label: 'Orders', icon: ShoppingCart },
    { key: 'customers', label: 'Customers', icon: Users },
    { key: 'returns', label: 'Returns', icon: RotateCcw },
  ] },
  { title: 'Products & Inventory', items: [
    { key: 'products', label: 'Products', icon: Package },
    { key: 'categories', label: 'Categories', icon: Shapes },
    { key: 'brands', label: 'Brands', icon: Tags },
    { key: 'inventory', label: 'Inventory Ledger', icon: Boxes },
  ] },
  { title: 'Service Management', items: [
    { key: 'repairs', label: 'Repairs', icon: Wrench },
    { key: 'warranties', label: 'Warranties', icon: ShieldCheck },
    { key: 'support', label: 'Support Tickets', icon: Headphones },
  ] },
  { title: 'Marketing & Engagement', items: [
    { key: 'coupons', label: 'Coupons', icon: TicketPercent },
    { key: 'reviews', label: 'Reviews', icon: Star },
  ] },
];

interface Props {
  active: string;
  onNavigate: (key: string) => void;
  name: string;
  isSuperuser: boolean;
  onLogout: () => void;
  collapsed: boolean;
  onCollapse: (value: boolean) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

function SidebarBrand({ collapsed }: { collapsed: boolean }) {
  return <div className="gt-sidebar-brand">
    <Link to="/" className="gt-sidebar-brand-link" aria-label="GhazaTech storefront" title="GhazaTech storefront">
      <span className="gt-sidebar-brand-symbol" aria-hidden="true"><img src="/images/ghaza-logo.png" alt=""/></span>
      <span className="gt-sidebar-brand-words" aria-hidden={collapsed}><strong>GHAZA<span>TECH</span></strong><small>ADMIN CONSOLE</small></span>
    </Link>
  </div>;
}

function SidebarNavigationItem({ item, active, onNavigate, register }: {
  item: NavItem; active: boolean; onNavigate: (key: string) => void;
  register: (key: string, node: HTMLButtonElement | null) => void;
}) {
  const Icon = item.icon;
  return <button
    ref={node => register(item.key, node)} type="button" className={`gt-sidebar-item${active ? ' is-active' : ''}`}
    aria-current={active ? 'page' : undefined} aria-label={item.label} title={item.label}
    onClick={() => onNavigate(item.key)}
  >
    <Icon className="gt-sidebar-item-icon" size={19} strokeWidth={active ? 2.2 : 1.85} aria-hidden="true" />
    <span className="gt-sidebar-item-text">{item.label}</span>
    <span className="gt-sidebar-tooltip" aria-hidden="true">{item.label}</span>
  </button>;
}

function SidebarNavigationGroup({ group, active, onNavigate, register }: {
  group: NavGroup; active: string; onNavigate: (key: string) => void;
  register: (key: string, node: HTMLButtonElement | null) => void;
}) {
  return <div className="gt-sidebar-group">
    <div className="gt-sidebar-group-label"><span>{group.title}</span><span className="gt-sidebar-group-rule" /></div>
    <div className="gt-sidebar-group-items">
      {group.items.map(item => <SidebarNavigationItem key={item.key} item={item} active={active === item.key} onNavigate={onNavigate} register={register} />)}
    </div>
  </div>;
}

function SidebarProfile({ name, isSuperuser, onLogout, collapsed }: {
  name: string; isSuperuser: boolean; onLogout: () => void; collapsed: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const outside = (event: PointerEvent) => { if (!ref.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [open]);
  const initials = (name.trim().split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]).join('') || 'A').toUpperCase();
  return <div className="gt-sidebar-profile" ref={ref}>
    <div className="gt-sidebar-profile-popover" data-open={open} role="group" aria-label="Account actions" aria-hidden={!open}>
      <div className="gt-sidebar-profile-popover-head"><span>Signed in as</span><strong>{name || 'Administrator'}</strong></div>
      <Link to="/" tabIndex={open ? 0 : -1} className="gt-sidebar-profile-action" onClick={() => setOpen(false)}><ExternalLink size={17} />View storefront</Link>
      <button tabIndex={open ? 0 : -1} type="button" className="gt-sidebar-profile-action gt-sidebar-sign-out" onClick={onLogout}><LogOut size={17} />Sign out</button>
    </div>
    <button type="button" className="gt-sidebar-profile-trigger" onClick={() => setOpen(v => !v)} aria-expanded={open} aria-label={`Account menu for ${name || 'Administrator'}`} title={collapsed ? 'Account menu' : undefined}>
      <span className="gt-sidebar-avatar">{initials}</span>
      <span className="gt-sidebar-profile-info"><strong>{name || 'Administrator'}</strong><small>{isSuperuser ? 'Super administrator' : 'Staff member'}</small></span>
      <ChevronDown className={`gt-sidebar-profile-caret${open ? ' is-open' : ''}`} size={16} aria-hidden="true" />
    </button>
  </div>;
}

function SidebarCollapseButton({ collapsed, onCollapse }: { collapsed: boolean; onCollapse: (value: boolean) => void }) {
  return <button type="button" className="gt-sidebar-collapse" onClick={() => onCollapse(!collapsed)} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
    {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
  </button>;
}

function useFocusTrap(open: boolean, ref: RefObject<HTMLElement | null>, onClose: () => void) {
  const returnFocus = useRef<HTMLElement | null>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement;
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ref.current?.querySelector<HTMLButtonElement>('.gt-sidebar-close-mobile')?.focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); closeRef.current(); return; }
      if (event.key !== 'Tab' || !ref.current) return;
      const all = Array.from(ref.current.querySelectorAll<HTMLElement>('a[href],button:not([disabled]):not([tabindex="-1"])'))
        .filter(el => getComputedStyle(el).display !== 'none' && el.getClientRects().length > 0);
      if (!all.length) return;
      const first = all[0], last = all[all.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', keydown);
    return () => { document.body.style.overflow = priorOverflow; document.removeEventListener('keydown', keydown); returnFocus.current?.focus(); };
  }, [open, ref]);
}

export default function CRMSidebar({ active, onNavigate, name, isSuperuser, onLogout, collapsed, onCollapse, mobileOpen, onMobileClose }: Props) {
  const aside = useRef<HTMLElement>(null);
  const nav = useRef<HTMLElement>(null);
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({});
  const [marker, setMarker] = useState<{ top: number; height: number; visible: boolean }>({ top: 0, height: 0, visible: false });
  const register = (key: string, node: HTMLButtonElement | null) => { buttons.current[key] = node; };
  useFocusTrap(mobileOpen, aside, onMobileClose);
  useLayoutEffect(() => {
    const update = () => {
      const node = buttons.current[active];
      const container = nav.current;
      if (!node || !container) return;
      const parentBounds = container.getBoundingClientRect();
      const bounds = node.getBoundingClientRect();
      setMarker({ top: bounds.top - parentBounds.top + container.scrollTop, height: bounds.height, visible: true });
    };
    update();
    const resize = new ResizeObserver(update);
    if (nav.current) resize.observe(nav.current);
    const container = nav.current;
    container?.addEventListener('scroll', update, { passive: true });
    return () => { resize.disconnect(); container?.removeEventListener('scroll', update); };
  }, [active, collapsed, mobileOpen]);
  return <>
    <div className={`gt-sidebar-backdrop${mobileOpen ? ' is-visible' : ''}`} aria-hidden="true" onClick={onMobileClose} />
    <aside ref={aside} className={`gt-sidebar${collapsed ? ' is-collapsed' : ''}${mobileOpen ? ' is-mobile-open' : ''}`} aria-label="CRM sidebar">
      <SidebarBrand collapsed={collapsed} />
      <button type="button" className="gt-sidebar-close-mobile" aria-label="Close navigation" onClick={onMobileClose}><X size={20}/></button>
          <nav ref={nav} className="gt-sidebar-navigation" aria-label="CRM navigation">
        <span className="gt-sidebar-moving-marker" style={{ transform: `translateY(${marker.top}px)`, height: marker.height, opacity: marker.visible ? 1 : 0 }} aria-hidden="true" />
        {NAV_GROUPS.map(group => <SidebarNavigationGroup key={group.title} group={group} active={active} onNavigate={onNavigate} register={register}/>)}
      </nav>
      <div className="gt-sidebar-footer">
        <div className="gt-sidebar-utility-row">
          <Link to="/" className="gt-sidebar-storefront" aria-label="Open storefront" title="Open storefront"><ExternalLink size={17} /><span>Storefront</span></Link>
          <SidebarCollapseButton collapsed={collapsed} onCollapse={onCollapse}/>
        </div>
        <SidebarProfile name={name} isSuperuser={isSuperuser} onLogout={onLogout} collapsed={collapsed}/>
      </div>
  
    </aside>
  </>;
}
