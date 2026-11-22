import CRMSidebar from '../components/CRMSidebar';
import { apiUrl, mediaUrl } from '../lib/apiBase';
import ProductEditor from './ProductEditor';
import '../styles/crm-premium.css';
import '../styles/crm-2026-refined.css';
import { useEffect, useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { LayoutDashboard, Package, Layers, Tags, Shapes, ShoppingCart, Users, RotateCcw, Star, TicketPercent, Boxes, Truck, Wrench, Headphones, ShieldCheck, BarChart3, LogOut, Search, Plus, Pencil, X, RefreshCw, AlertTriangle, Trash2, Menu, PanelLeftClose, PanelLeftOpen, ChevronRight, ShieldAlert, XCircle, CheckCircle2, Eye, EyeOff, ArrowUpRight, TrendingUp, Clock3, Activity, SlidersHorizontal, ChevronDown, Download } from 'lucide-react';

const ROOT=apiUrl('/api/crm/');
const DELETABLE_SECTIONS = new Set(['products','categories','brands','variants','reviews','coupons']);
const icons: Record<string,typeof Package>={dashboard:LayoutDashboard,products:Package,variants:Layers,categories:Shapes,brands:Tags,orders:ShoppingCart,customers:Users,returns:RotateCcw,reviews:Star,coupons:TicketPercent,inventory:Boxes,repairs:Wrench,support:Headphones,warranties:ShieldCheck,reports:BarChart3};
const sectionGroups=[{label:'Overview',items:['dashboard','reports']},{label:'Catalog',items:['categories','brands','products','inventory']},{label:'Sales',items:['orders','customers','returns','coupons']},{label:'Engagement',items:['reviews','repairs','support','warranties']}];
const sections=[['dashboard','Overview'],['categories','Categories'],['brands','Brands'],['products','Products'],['inventory','Inventory ledger'],['orders','Orders'],['customers','Customers'],['returns','Returns'],['reviews','Reviews'],['coupons','Coupons'],['repairs','Repairs'],['support','Support tickets'],['warranties','Warranties'],['reports','Reports']];
type Field={key:string;label?:string;type?:string;required?:boolean;options?:string[];readOnly?:boolean};
type Row=Record<string,unknown>;
const fields:Record<string,Field[]>={
 products:[{key:'name',required:true},{key:'part_number',label:'SKU / Part number',required:true},{key:'category',type:'category',required:true},{key:'brand',type:'brand',required:true},{key:'condition',type:'select',options:['new','original','compatible','refurbished']},{key:'description',type:'textarea'},{key:'price',type:'number',required:true},{key:'stock',type:'number'},{key:'warranty_months',type:'number'},{key:'image',type:'file'},{key:'is_active',type:'bool'},{key:'is_featured',type:'bool'},{key:'featured_label'}],
 variants:[{key:'product',type:'product',required:true},{key:'sku',required:true},{key:'name',required:true},{key:'price',type:'number',required:true},{key:'stock',type:'number'},{key:'attributes',type:'json'},{key:'is_active',type:'bool'}],
 categories:[{key:'name',required:true},{key:'description',type:'textarea'},{key:'image',type:'file'}],
 brands:[{key:'name',required:true}],
 orders:[{key:'status',type:'select',options:['pending','confirmed','processing','shipped','delivered','cancelled']},{key:'payment_status',type:'select',options:['pending','paid','failed','refunded']},{key:'staff_notes',type:'textarea'}],
 returns:[{key:'order',type:'order',required:true},{key:'item',label:'Order item ID (optional)',type:'number'},{key:'quantity',type:'number',required:true},{key:'reason',type:'textarea',required:true},{key:'status',type:'select',options:['requested','approved','rejected','received','completed']},{key:'refund_amount',type:'number'},{key:'staff_notes',type:'textarea'}],
 reviews:[{key:'customer_name',required:true},{key:'customer_type'},{key:'review',type:'textarea',required:true},{key:'related_item'},{key:'rating',type:'number'},{key:'is_active',type:'bool'},{key:'display_order',type:'number'}],
 customers:[{key:'first_name'},{key:'last_name'},{key:'email'},{key:'is_active',type:'bool'}],
 coupons:[{key:'code',required:true},{key:'discount_type',type:'select',options:['percent','fixed']},{key:'value',type:'number',required:true},{key:'minimum_order',type:'number'},{key:'max_uses',type:'number'},{key:'is_active',type:'bool'},{key:'starts_at',type:'datetime-local'},{key:'expires_at',type:'datetime-local'}],
 repairs:[{key:'status',type:'select',options:['new','contacted','checking_availability','awaiting_customer','booked','received','diagnosing','awaiting_approval','approved','repairing','testing','ready','completed','rejected','cancelled']}],
 support:[{key:'status',type:'select',options:['new','in_progress','waiting_customer','resolved','closed']}]
};
const tableCols:Record<string,string[]>={products:['id','image_url','name','part_number','category_name','brand_name','price','stock','variant_count','is_active'],variants:['id','sku','name','product_name','price','stock'],categories:['id','name'],brands:['id','name'],inventory:['created_at','product_name','change','reason','creator'],orders:['order_number','created_at','full_name','total','status','payment_status'],customers:['username','email','mobile','order_count','total_spent'],returns:['id','order_number','quantity','status','refund_amount'],reviews:['id','customer_name','rating','related_item','is_active'],coupons:['code','discount_type','value','used_count','is_active'],repairs:['id','created_at','status'],support:['id','subject','status'],warranties:['id','order_number','customer_name','product_name']};
const statusTone: Record<string,string>={delivered:'success',completed:'success',paid:'success',resolved:'success',approved:'success',active:'success',pending:'warning',processing:'warning',requested:'warning',awaiting_approval:'warning',awaiting_customer:'warning',new:'info',confirmed:'info',shipped:'info',in_progress:'info',repairing:'info',testing:'info',ready:'info',received:'info',rejected:'danger',failed:'danger',cancelled:'danger',refunded:'info',closed:'neutral',inactive:'neutral'};
const money=(v:unknown)=>`AED ${Number(v||0).toLocaleString('en-AE',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
function display(v:unknown,key='') {
 if(v===null||v===undefined||v==='')return '—';
 if(key==='image_url')return <CrmImage src={mediaUrl(typeof v==='string'?v:'')}/>;
 if(typeof v==='boolean')return <span className={`crm-status ${v?'crm-status--success':'crm-status--neutral'}`}><span className="crm-status-dot"/>{v?'Active':'Inactive'}</span>;
 if(key==='status'||key==='payment_status')return <span className={`crm-status crm-status--${statusTone[String(v).toLowerCase()]||'neutral'}`}><span className="crm-status-dot"/>{String(v).replaceAll('_',' ')}</span>;
 if(['total','total_spent','price','refund_amount','revenue_paid','subtotal','vat_amount','delivery_charge'].includes(key))return <span className="crm-money">{money(v)}</span>;
 if(key==='created_at'||key==='updated_at') {const d=new Date(String(v));return Number.isNaN(d.getTime())?String(v):d.toLocaleString('en-AE',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}
 if(key==='change'&&typeof v==='number')return <span className={v>=0?'crm-positive':'crm-negative'}>{v>0?'+':''}{v}</span>;
 if(key==='rating')return <span className="crm-rating">{'★'.repeat(Math.max(0,Math.min(5,Number(v)||0)))}<span className="crm-rating-muted">{'☆'.repeat(Math.max(0,5-(Number(v)||0)))}</span></span>;
 if(typeof v==='object')return JSON.stringify(v);
 return String(v)
}
function CrmImage({src}:{src:string}){
 const [failed,setFailed]=useState(false);
 if(!src||failed)return <span className="text-xs text-slate-400" title="Image unavailable on API server">No image</span>;
 return <img src={src} loading="lazy" alt="Product" className="crm-product-thumb" onError={()=>setFailed(true)}/>;
}
function nice(key:string){return key.replaceAll('_',' ').replace(/\b\w/g,a=>a.toUpperCase())}
async function api(route:string,token:string,init:RequestInit={}){const headers=new Headers(init.headers);headers.set('Authorization',`Token ${token}`);if(!(init.body instanceof FormData)&&init.body)headers.set('Content-Type','application/json');const response=await fetch(`${ROOT}${route}`,{cache:'no-store',...init,headers});const contentType=response.headers.get('content-type')||'';const body=contentType.includes('json')?await response.json():{detail:await response.text()};if(!response.ok)throw new Error(body.detail||JSON.stringify(body));return body}
/** Collect Django REST Framework paginated CRM results using the same API origin. */
async function apiList(route: string, token: string): Promise<Row[]> {
 const all: Row[] = [];
 let current: string | null = route;
 const seen = new Set<string>();
 while (current && !seen.has(current)) {
  seen.add(current);
  const payload: Row[] | {results?: Row[]; next?: string | null} = await api(current, token);
  if (Array.isArray(payload)) { all.push(...payload); break; }
  all.push(...(Array.isArray(payload.results) ? payload.results : []));
  if (!payload.next) break;
  const next = new URL(payload.next, ROOT);
  // Do not send the staff token to a different host provided by an API response.
  const expected = new URL(ROOT);
  if (next.origin !== expected.origin) {
   // Local Vite proxy responses may contain the Django host instead of the Vite host.
   // Continue using our configured API origin and only the path/query.
   if (!next.pathname.startsWith('/api/crm/')) throw new Error('Unexpected CRM pagination URL');
  }
  if (!next.pathname.startsWith('/api/crm/')) throw new Error('Unexpected CRM pagination URL');
  current = next.pathname.slice('/api/crm/'.length) + next.search;
 }
 return all;
}

export default function AdminCRM(){
 const [searchParams,setSearchParams]=useSearchParams();
 const [token,setToken]=useState(()=>sessionStorage.getItem('ghaza_crm_token')||'');const [login,setLogin]=useState({username:'',password:''});const [section,setSection]=useState(()=>sections.some(([k])=>k===searchParams.get('section'))?searchParams.get('section')!:'dashboard');const [rows,setRows]=useState<Row[]>([]);const [stats,setStats]=useState<Row>({});const [report,setReport]=useState<Row>({});const [query,setQuery]=useState('');const [loading,setLoading]=useState(false);const [error,setError]=useState('');const [editing,setEditing]=useState<Row|null>(null);const [options,setOptions]=useState<Record<string,Row[]>>({});const [stock,setStock]=useState<Row|null>(null);const [adjust,setAdjust]=useState({change:'',reason:''});const [name,setName]=useState('');const [details,setDetails]=useState<Row|null>(null);const [notes,setNotes]=useState<Row[]>([]);const [note,setNote]=useState('');const [isSuperuser,setIsSuperuser]=useState(false);const [sidebarCollapsed,setSidebarCollapsed]=useState(()=>localStorage.getItem('ghaza_crm_sidebar_collapsed')==='true');const [mobileMenu,setMobileMenu]=useState(false);const [deleteCustomer,setDeleteCustomer]=useState<Row|null>(null);const [deleting,setDeleting]=useState(false);const [deleteRecord,setDeleteRecord]=useState<Row|null>(null);const [notice,setNotice]=useState('');const [showPassword,setShowPassword]=useState(false);
 useEffect(()=>{if(token)api('me/',token).then(v=>{setName(v.username);setIsSuperuser(Boolean(v.is_superuser))}).catch(()=>{sessionStorage.removeItem('ghaza_crm_token');setToken('');setError('Staff session expired. Please sign in again.')})},[token]);
 const load=async()=>{if(!token)return;setLoading(true);setError('');try{if(section==='dashboard'){setStats(await api('dashboard/',token));setRows([])}else if(section==='reports'){setReport(await api('reports/',token));setRows([])}else{setRows(await apiList(`${section}/?search=${encodeURIComponent(query)}`,token))} }catch(e){setError(String(e))}finally{setLoading(false)}};
 useEffect(()=>{void load()},[section,token]);
 // Refresh active CRM data without a manual browser reload; pause during editing.
 useEffect(() => {
  if (!token || editing || stock || details || deleteCustomer || deleteRecord) return;
  const refresh = () => { if (!document.hidden) void load(); };
  const timer = window.setInterval(refresh, 30000);
  window.addEventListener('focus', refresh);
  document.addEventListener('visibilitychange', refresh);
  return () => { window.clearInterval(timer); window.removeEventListener('focus', refresh); document.removeEventListener('visibilitychange', refresh); };
 }, [token, section, query, editing, stock, details, deleteCustomer, deleteRecord]);
 const removeCustomer=async()=>{
   if(!deleteCustomer || deleting)return;
   setDeleting(true);setError('');
   try{
     await api(`customers/${deleteCustomer.id}/delete-account/`,token,{method:'POST'});
     setDeleteCustomer(null);
     setNotice('Customer account permanently deleted. Existing orders and transaction history were preserved.');
     await load();
   }catch(e){setError(String(e));setDeleteCustomer(null)}finally{setDeleting(false)}
 };
 const deactivateCustomer=async()=>{
   if(!deleteCustomer || deleting)return;
   setDeleting(true);setError('');
   try{
     await api(`customers/${deleteCustomer.id}/`,token,{method:'PATCH',body:JSON.stringify({is_active:false})});
     setDeleteCustomer(null);
     setNotice('Customer account deactivated. Order history was preserved.');
     await load();
   }catch(e){setError(String(e));setDeleteCustomer(null)}finally{setDeleting(false)}
 };
 const removeRecord=async()=>{
  if(!deleteRecord || deleting || !DELETABLE_SECTIONS.has(section) || deleteRecord.id==null)return;
  setDeleting(true);setError('');
  try{
   await api(`${section}/${deleteRecord.id}/`,token,{method:'DELETE'});
   setDeleteRecord(null);
   setNotice(`${nice(section.slice(0,-1))} deleted successfully.`);
   await load();
  }catch(err){setError(`Delete failed: ${String(err)}`);setDeleteRecord(null)}
  finally{setDeleting(false)}
 };
 const navigateCRM=(key:string)=>{if(!sections.some(([item])=>item===key))return;setSection(key);setSearchParams(key==='dashboard'?{}:{section:key});setQuery('');setEditing(null);setMobileMenu(false)};
 useEffect(()=>{const requested=searchParams.get('section');const next=sections.some(([k])=>k===requested)?requested!:'dashboard';if(section!==next){setSection(next);setQuery('');setEditing(null);setMobileMenu(false)}},[searchParams,section]);
 useEffect(()=>{localStorage.setItem('ghaza_crm_sidebar_collapsed',String(sidebarCollapsed))},[sidebarCollapsed]);
 const signIn=async(e:FormEvent)=>{e.preventDefault();setError('');try{const r=await fetch(`${ROOT}login/`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(login)});const data=await r.json();if(!r.ok)throw Error(data.detail||'Login failed');sessionStorage.setItem('ghaza_crm_token',data.token);setToken(data.token)}catch(e){setError(String(e))}};
 const openEditor=async(row:Row)=>{
  if(section==='products' && row.id){
    setError('');
    try{
      // Fetch the latest full record before editing (not just the listing projection).
      const current=await api(`products/${row.id}/`,token);
      setEditing(current);
    }catch(err){setError(`Unable to open product editor: ${String(err)}`)}
    return;
  }
  setEditing(row);
  try{const keys=fields[section]?.filter(f=>['category','brand','product','order'].includes(f.type||'')).map(f=>f.type as string)||[];const results=await Promise.all(keys.map(k=>api(`${k==='category'?'categories':k==='brand'?'brands':k==='product'?'products':'orders'}/`,token)));const o:Record<string,Row[]>={};keys.forEach((k,i)=>o[k]=results[i]);setOptions(o)}catch(e){setError(String(e))}};
 const save=async(e:FormEvent<HTMLFormElement>)=>{e.preventDefault();if(!editing)return;setError('');const fd=new FormData(e.currentTarget);const data:Row={};let upload=false;for(const f of fields[section]||[]){if(f.type==='file'){const file=fd.get(f.key);if(file instanceof File&&file.size){data[f.key]=file;upload=true}continue}if(f.type==='bool'){data[f.key]=fd.get(f.key)==='on';continue}const raw=fd.get(f.key);if(raw===null||raw==='')continue;if(f.type==='json'){try{data[f.key]=JSON.parse(String(raw))}catch{setError(`Invalid JSON in ${f.key}`);return}}else if(['number','category','brand','product','order'].includes(f.type||'')){data[f.key]=Number(raw)}else if(f.type==='datetime-local')data[f.key]=new Date(String(raw)).toISOString();else data[f.key]=String(raw)}
 const edit=editing.id!==undefined;let body:BodyInit;if(upload){const form=new FormData();for(const [key,val] of Object.entries(data))form.append(key,val instanceof File?val:typeof val==='object'?JSON.stringify(val):String(val));body=form}else body=JSON.stringify(data);
 try{await api(`${section}/${edit?`${editing.id}/`:''}`,token,{method:edit?'PATCH':'POST',body});setEditing(null);await load()}catch(err){setError(String(err))}};
 const viewOrder=async(row:Row)=>{setDetails(row);try{setNotes(await api(`notes/?order=${row.id}`,token))}catch(e){setError(String(e))}};
 const addNote=async(e:FormEvent)=>{e.preventDefault();if(!details)return;try{await api('notes/',token,{method:'POST',body:JSON.stringify({order:details.id,text:note})});setNote('');setNotes(await api(`notes/?order=${details.id}`,token))}catch(e){setError(String(e))}};
 const adjustStock=async(e:FormEvent)=>{e.preventDefault();if(!stock)return;try{await api(`products/${stock.id}/stock_adjust/`,token,{method:'POST',body:JSON.stringify({change:Number(adjust.change),reason:adjust.reason})});setStock(null);setAdjust({change:'',reason:''});await load()}catch(e){setError(String(e))}};
 if(!token)return <div className="crm-login-screen">
   <div className="crm-login-brand"><Link to="/" className="crm-login-back">← Back to storefront</Link><div className="crm-login-identity"><div className="crm-login-symbol"><Layers size={28}/></div><span>GHAZA<span className="text-sky-400">TECH</span></span></div><div className="crm-login-art"><span className="crm-login-orb"/><div className="crm-login-chart"><Activity size={38}/><div><strong>Commerce intelligence.</strong><span>One place to manage your business.</span></div></div></div><p className="crm-login-eyebrow">ENTERPRISE COMMERCE WORKSPACE</p><h1>Powerful operations.<br/><span>Beautifully simple.</span></h1><p className="crm-login-description">Manage your products, orders, customers and operations with confidence from one secure workspace.</p><span className="crm-login-copyright">© 2026 Ghaza Computer Trading LLC</span></div>
   <div className="crm-login-form-wrap"><div className="crm-login-form-card"><span className="crm-login-kicker"><ShieldCheck size={16}/> SECURE STAFF ACCESS</span><h2>Welcome back</h2><p>Sign in to your administration workspace.</p><form onSubmit={signIn} className="crm-login-form"><label>Username<input autoComplete="username" required value={login.username} onChange={e=>setLogin({...login,username:e.target.value})} placeholder="Enter your username"/></label><label>Password<div className="crm-password-field"><input autoComplete="current-password" type={showPassword?'text':'password'} placeholder="Enter your password" required value={login.password} onChange={e=>setLogin({...login,password:e.target.value})}/><button type="button" aria-label={showPassword?'Hide password':'Show password'} onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button></div></label>{error&&<div role="alert" className="crm-inline-error">{error}</div>}<button className="crm-primary-action">Sign in to dashboard <ArrowUpRight size={18}/></button></form><p className="crm-login-footer">Restricted to authorized GhazaTech team members.</p></div></div>
 </div>;

 return <div className="gt-crm-shell crm-premium-shell min-h-screen text-slate-800 lg:flex">
   <CRMSidebar active={section} onNavigate={navigateCRM} name={name} isSuperuser={isSuperuser}
     onLogout={()=>{sessionStorage.removeItem('ghaza_crm_token');setToken('');setMobileMenu(false)}}
     collapsed={sidebarCollapsed} onCollapse={setSidebarCollapsed} mobileOpen={mobileMenu} onMobileClose={()=>setMobileMenu(false)}/>
   <div className="flex-1 min-w-0 crm-workspace">
     <header className="crm-main-header sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-7 py-4 flex items-center justify-between gap-3">
       <div className="flex gap-3 items-center min-w-0"><button className="lg:hidden p-2 rounded-xl border border-slate-200" aria-label="Open menu" onClick={()=>setMobileMenu(true)}><Menu size={21}/></button><div className="min-w-0"><p className="text-xs text-slate-400">Administration <span className="mx-1">/</span> {section==='dashboard'?'Dashboard':section==='reports'?'Analytics & Reports':nice(section)}</p><h1 className="text-xl sm:text-2xl tracking-tight font-extrabold truncate">{section==='reports'?'Analytics & Reports':section==='dashboard'?'Dashboard':sections.find(s=>s[0]===section)?.[1]}</h1></div></div>
       <div className="crm-header-actions flex items-center gap-2"><span className="hidden md:flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700"><CheckCircle2 size={14}/> Auto-refresh enabled</span><Link to="/" className="hidden sm:flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-50"><ArrowUpRight size={15}/> Storefront</Link><button onClick={()=>void load()} title="Refresh data" aria-label="Refresh data" disabled={loading} className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 disabled:opacity-50"><RefreshCw size={17} className={loading?'animate-spin':undefined}/></button></div>
     </header>
     <main className="max-w-[1680px] mx-auto p-4 md:p-6 lg:p-7 crm-content">
       {notice&&<div role="status" className="mb-5 flex gap-2 items-center rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-emerald-800 text-sm"><CheckCircle2 size={18}/>{notice}<button onClick={()=>setNotice('')} className="ml-auto" aria-label="Dismiss notice"><X size={16}/></button></div>}
{error&&<div className="mb-5 flex gap-2 items-center rounded-xl border border-red-200 bg-red-50 p-3 text-red-700 text-sm"><AlertTriangle size={18}/><span className="break-all">{error}</span><button className="ml-auto" onClick={()=>setError('')}><X size={16}/></button></div>}{section==='products'&&<div className="crm-catalog-quicklinks"><div><strong>Product catalog</strong><span>Manage your inventory in one place</span></div><div><button onClick={()=>navigateCRM('categories')}>Categories</button><button onClick={()=>navigateCRM('brands')}>Brands</button></div></div>}{section==='dashboard'?<>
 <div className="crm-welcome"><div><p className="crm-eyebrow">BUSINESS OVERVIEW</p><h2>Good to see you, {name||'Administrator'} <span className="crm-wave">✦</span></h2><p>Your commerce performance and the operational items that need attention.</p></div><button className="crm-secondary-action" onClick={()=>navigateCRM('reports')}><BarChart3 size={16}/> Explore reports <ArrowUpRight size={15}/></button></div>
 <div className="crm-metric-grid">{[
  {label:'Paid revenue',value:money(stats.revenue_paid),icon:TrendingUp,tone:'blue',hint:'Confirmed paid orders',to:'reports'},
  {label:'Total orders',value:String(stats.orders??0),icon:ShoppingCart,tone:'violet',hint:'All order statuses',to:'orders'},
  {label:'Products',value:String(stats.products??0),icon:Package,tone:'cyan',hint:`${String(stats.active_products??0)} currently active`,to:'products'},
  {label:'Customers',value:String(stats.customers??0),icon:Users,tone:'emerald',hint:'Registered customers',to:'customers'},
 ].map(m=><button key={m.label} className="crm-kpi" onClick={()=>navigateCRM(m.to)}><div className="crm-kpi-top"><span>{m.label}</span><span className={`crm-kpi-icon crm-kpi-icon--${m.tone}`}><m.icon size={20}/></span></div><strong>{m.value}</strong><span className="crm-kpi-foot">{m.hint}<ArrowUpRight size={15}/></span></button>)}</div>
 <div className="crm-operations"><div className="crm-panel-heading"><div><h3>Operations at a glance</h3><p>Keep on top of what needs your attention</p></div><Activity size={20} className="text-slate-400"/></div><div className="crm-ops-grid">{[
  {label:'Pending orders',value:stats.pending_orders,icon:Clock3,to:'orders',tone:'amber'},
  {label:'Low stock',value:stats.low_stock,icon:Boxes,to:'products',tone:'rose'},
  {label:'Open repairs',value:stats.repairs_open,icon:Wrench,to:'repairs',tone:'blue'},
  {label:'Pending returns',value:stats.returns_pending,icon:RotateCcw,to:'returns',tone:'violet'},
 ].map(m=><button key={m.label} onClick={()=>navigateCRM(m.to)} className="crm-op-card"><span className={`crm-op-icon crm-op-icon--${m.tone}`}><m.icon size={19}/></span><span className="crm-op-copy"><strong>{String(m.value??0)}</strong><span>{m.label}</span></span><ChevronRight size={16} className="crm-op-arrow"/></button>)}</div></div>
 <div className="crm-dashboard-bottom"><div className="crm-surface"><div className="crm-panel-heading"><div><h3>Recent orders</h3><p>Your latest customer purchases</p></div><button onClick={()=>navigateCRM('orders')} className="crm-text-link">View all orders <ArrowUpRight size={16}/></button></div><DataTable rows={(stats.recent_orders as Row[])||[]} cols={tableCols.orders} emptyTitle="No recent orders" emptyDescription="Customer purchases will appear here when orders are placed."/></div><div className="crm-surface crm-action-panel crm-command-center"><div className="crm-panel-heading"><div><h3>Quick actions</h3><p>Jump straight into your workflow</p></div></div>{[{name:'Create product',desc:'Add a new catalog item',icon:Plus,to:'products'},{name:'Manage orders',desc:'Review fulfillment and payments',icon:ShoppingCart,to:'orders'},{name:'Customer directory',desc:'View your customers',icon:Users,to:'customers'},{name:'Sales analytics',desc:'Explore business performance',icon:BarChart3,to:'reports'}].map(a=><button className="crm-quick-action crm-command" key={a.name} onClick={()=>{navigateCRM(a.to);if(a.to==='products' && a.name==='Create product')setEditing({})}}><span><a.icon size={18}/></span><div><strong>{a.name}</strong><small>{a.desc}</small></div><ArrowUpRight size={16}/></button>)}</div></div>
 </>:section==='reports'?<div className="crm-report-grid">{[
 ['Sales by day','sales_by_day','date','total'],['Order status','status','status','count'],['Payments','payments','payment_status','total'],['Top products','top_products','name','ordered']
 ].map(([title,key,labelKey,numKey])=>{const data=(report[key] as Row[])||[];const values=data.map(r=>Math.max(0,Number(r[numKey])||0));const max=Math.max(1,...values);return <section className="crm-surface crm-report-card" key={key}><div className="crm-panel-heading"><div><h3>{title}</h3><p>{data.length} {data.length===1?'record':'records'} · live backend data</p></div><BarChart3 size={20} className="text-blue-500"/></div>{data.length?<><div className="crm-bar-chart" role="img" aria-label={`${title} chart`}>{data.slice(0,12).map((r,i)=><div className="crm-bar-column" key={i} title={`${String(r[labelKey]??'')}: ${numKey==='total'?money(r[numKey]):String(r[numKey]??0)}`}><div className="crm-bar-track"><div style={{height:`${Math.max(4,(Number(r[numKey])||0)/max*100)}%`}} className="crm-bar-fill"/></div><span title={String(r[labelKey]??'')}>{String(r[labelKey]??'—').slice(0,9)}</span></div>)}</div><DataTable rows={data} cols={Object.keys(data[0]||{})}/></>:<div className="crm-empty-chart"><BarChart3 size={28}/><p>No report data for this period</p></div>}</section>})}</div>:<><div className="crm-table-toolbar flex flex-wrap gap-3 items-center justify-between mb-5"><form onSubmit={e=>{e.preventDefault();void load()}} className="flex items-center gap-2 bg-white rounded-xl border px-3 py-2 w-full max-w-sm"><Search size={18}/><input className="outline-none flex-1 text-sm" placeholder={`Search ${section}...`} value={query} onChange={e=>setQuery(e.target.value)}/><button className="text-sm text-blue-600">Find</button></form>{fields[section]&& !['orders','repairs','support','customers'].includes(section)&&<button className="bg-blue-700 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 font-semibold text-sm" onClick={()=>void openEditor({})}><Plus size={16}/> Add {section.slice(0,-1)}</button>}</div><div className="crm-table-wrapper bg-white rounded-2xl border shadow-sm overflow-auto">{section==='products'?<ProductsTable rows={rows} onEdit={openEditor} onStock={setStock} onDelete={setDeleteRecord}/>:<DataTable rows={rows} cols={tableCols[section]||[]} actions={row=><div className="flex gap-2">{fields[section]&&<button type="button" title={section==='products'?'Edit product':'Edit'} aria-label={section==='products'?`Edit product ${String(row.name||row.id)}`:'Edit record'} onClick={()=>void openEditor(row)} className="rounded-lg border px-3 py-2 text-blue-700 hover:bg-blue-50 inline-flex items-center gap-1.5 text-xs font-bold whitespace-nowrap"><Pencil size={16}/>{section==='products'?'Edit product':'Edit'}</button>}{DELETABLE_SECTIONS.has(section)&&row.id!=null&&<button type="button" title={`Delete ${section.slice(0,-1)}`} aria-label={`Delete ${section.slice(0,-1)}`} onClick={()=>setDeleteRecord(row)} className="rounded-lg border border-red-100 px-3 py-2 text-red-600 hover:bg-red-50 inline-flex items-center gap-1.5 text-xs font-bold"><Trash2 size={15}/> Delete</button>}{section==='orders'&&<button title="Order details" onClick={()=>void viewOrder(row)} className="rounded-lg border p-2 text-blue-700">Details</button>}{section==='customers'&&isSuperuser&&<button title="Delete customer" onClick={()=>setDeleteCustomer(row)} className="rounded-lg border border-red-100 p-2 text-red-600 hover:bg-red-50"><Trash2 size={16}/></button>}{section==='products'&&<button title="Adjust stock" onClick={()=>setStock(row)} className="rounded-lg border p-2 text-slate-700"><Boxes size={16}/></button>}</div>}/>}</div>{section!=='products'&&<p className="mt-3 text-xs text-slate-400">Use search to narrow large record lists. Core transactions cannot be deleted here.</p>}</>}{loading&&<p className="mt-4 text-sm text-slate-500">Loading…</p>}
     </main>
   </div>
   {deleteRecord&&<div className="fixed inset-0 z-[75] flex items-center justify-center bg-slate-950/60 p-4" role="dialog" aria-modal="true" aria-label="Confirm record deletion"><div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><div className="flex items-center gap-3"><span className="rounded-xl bg-red-50 p-3 text-red-600"><Trash2 size={20}/></span><h2 className="text-lg font-bold text-slate-900">Delete {nice(section.slice(0,-1))}?</h2></div><p className="mt-4 text-sm leading-6 text-slate-600">Permanently delete <strong>{String(deleteRecord.name||deleteRecord.code||deleteRecord.sku||`#${deleteRecord.id}`)}</strong>? This cannot be undone. If it is referenced by other records, Django may reject deletion.</p><div className="mt-6 flex justify-end gap-3"><button type="button" disabled={deleting} onClick={()=>setDeleteRecord(null)} className="rounded-xl border px-4 py-2 text-sm font-semibold">Cancel</button><button type="button" disabled={deleting} onClick={()=>void removeRecord()} className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"><Trash2 size={16}/>{deleting?'Deleting…':'Delete permanently'}</button></div></div></div>}
   {deleteCustomer&&<div className="fixed inset-0 z-[70] bg-slate-950/60 p-4 flex items-center justify-center" role="dialog" aria-modal="true" aria-label="Delete customer"><div className="w-full max-w-md rounded-3xl bg-white shadow-2xl p-7"><div className="flex justify-between items-center"><div className="rounded-2xl bg-red-50 text-red-600 p-3"><ShieldAlert size={25}/></div><button onClick={()=>setDeleteCustomer(null)} title="Close" className="p-2 rounded-xl hover:bg-slate-100"><X size={19}/></button></div><h2 className="mt-5 text-xl font-extrabold">Delete customer account?</h2><p className="mt-2 text-sm leading-6 text-slate-600">Customer: <b>{String(deleteCustomer.username||deleteCustomer.email)}</b>. Permanent deletion cannot be undone. Their orders and transaction history will be retained as guest orders, but their account and login access will be permanently removed.</p><div className="mt-6 grid gap-2"><button disabled={deleting} onClick={()=>void removeCustomer()} className="rounded-xl py-3 bg-red-600 text-white text-sm font-semibold disabled:opacity-50">Permanently delete account</button><button disabled={deleting} onClick={()=>void deactivateCustomer()} className="rounded-xl py-3 bg-slate-900 text-white text-sm font-semibold disabled:opacity-50">Deactivate account instead</button><button disabled={deleting} onClick={()=>setDeleteCustomer(null)} className="rounded-xl py-2 text-sm text-slate-600 hover:bg-slate-50">Cancel</button></div></div></div>}
{editing&&section==='products'&&<ProductEditor product={editing} token={token} onClose={()=>setEditing(null)} onSaved={load}/>}
{editing&&section!=='products'&&<div className="fixed inset-0 bg-slate-950/60 z-50 flex justify-end"><div className="gt-modal-panel bg-white h-full w-full max-w-lg overflow-auto shadow-xl p-6"><div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold">{editing.id?'Edit':'New'} {nice(section)}</h2><button onClick={()=>setEditing(null)}><X/></button></div><form onSubmit={save} className="space-y-4">{(fields[section]||[]).map(f=><label className="block" key={f.key}><span className="text-sm font-medium">{f.label||nice(f.key)}{f.required?' *':''}</span>{f.type==='bool'?<input type="checkbox" name={f.key} defaultChecked={editing.id ? Boolean(editing[f.key]) : f.key==='is_active'} className="block mt-2 h-5 w-5"/>:f.type==='textarea'||f.type==='json'?<textarea className="w-full border rounded-lg p-3 mt-1" rows={3} name={f.key} defaultValue={f.type==='json'?JSON.stringify(editing[f.key]||{},null,2):String(editing[f.key]||'')}/>:f.type==='select'||['category','brand','product','order'].includes(f.type||'')?<select className="w-full border rounded-lg p-3 mt-1 bg-white" name={f.key} defaultValue={String(editing[f.key]||'')} required={f.required}><option value="">Choose</option>{f.type==='select'?f.options?.map(v=><option key={v} value={v}>{nice(v)}</option>):options[f.type||'']?.map(o=><option key={String(o.id)} value={String(o.id)}>{String(o.name||o.order_number||o.id)}</option>)}</select>:<input className="w-full border rounded-lg p-3 mt-1" name={f.key} type={f.type==='number'?'number':f.type==='file'?'file':f.type==='datetime-local'?'datetime-local':'text'} step={f.type==='number'?'any':undefined} defaultValue={f.type==='file'?undefined:String(editing[f.key]??'')} required={f.required&&!editing.id} accept={f.type==='file'?'image/*':undefined}/>}</label>)}<button className="w-full rounded-xl bg-blue-700 py-3 font-semibold text-white">Save changes</button></form></div></div>}{details&&<div className="fixed inset-0 z-50 bg-slate-950/60 flex justify-end"><div className="gt-modal-panel bg-white h-full w-full max-w-xl overflow-y-auto p-7"><div className="flex justify-between items-center"><h2 className="text-xl font-bold">Order {String(details.order_number)}</h2><button onClick={()=>setDetails(null)}><X/></button></div><div className="mt-6 space-y-2 text-sm">{['full_name','email','mobile','address','city','emir','status','payment_status','payment_method','subtotal','vat_amount','delivery_charge','total'].map(k=><p key={k}><b>{nice(k)}:</b> {display(details[k])}</p>)}</div><h3 className="font-bold mt-7 mb-3">Order items</h3><DataTable rows={(details.items as Row[])||[]} cols={['product_name','part_number','quantity','price']}/><h3 className="font-bold mt-7 mb-3">Internal notes</h3><div className="space-y-2">{notes.map(n=><div key={String(n.id)} className="border rounded-lg p-3 text-sm"><p>{String(n.text)}</p><p className="text-xs text-slate-400 mt-2">{String(n.creator||'Staff')} · {String(n.created_at||'')}</p></div>)}</div><form onSubmit={addNote} className="mt-4 space-y-2"><textarea required className="border rounded-xl p-3 w-full" placeholder="Add internal staff note" value={note} onChange={e=>setNote(e.target.value)}/><button className="bg-blue-700 text-white rounded-lg px-4 py-2">Save note</button></form></div></div>}{stock&&<div className="fixed inset-0 z-50 bg-slate-900/60 flex items-center justify-center p-4"><form onSubmit={adjustStock} className="bg-white rounded-2xl p-7 max-w-sm w-full space-y-4"><h2 className="font-bold text-xl">Adjust inventory</h2><p className="text-sm">{String(stock.name)} — current: {String(stock.stock)}</p><label className="block text-sm">Change (e.g. +5 or -2)<input className="w-full border rounded-lg p-3 mt-1" type="number" required value={adjust.change} onChange={e=>setAdjust({...adjust,change:e.target.value})}/></label><label className="block text-sm">Reason<input className="w-full border rounded-lg p-3 mt-1" required value={adjust.reason} onChange={e=>setAdjust({...adjust,reason:e.target.value})}/></label><div className="flex gap-2"><button type="button" className="flex-1 border rounded-lg p-3" onClick={()=>setStock(null)}>Cancel</button><button className="flex-1 bg-blue-700 text-white rounded-lg p-3">Confirm</button></div></form></div>}</div>
}

function ProductsTable({rows,onEdit,onStock,onDelete}:{rows:Row[];onEdit:(row:Row)=>void|Promise<void>;onStock:(row:Row)=>void;onDelete:(row:Row)=>void}){
 const [sort,setSort]=useState<'name'|'price'|'stock'>('name');
 const [desc,setDesc]=useState(false);
 const sorted=[...rows].sort((a,b)=>{
  const result=sort==='name'?String(a.name||'').localeCompare(String(b.name||''),undefined,{numeric:true}):Number(a[sort]||0)-Number(b[sort]||0);
  return desc?-result:result;
 });
 const setSorting=(field:'name'|'price'|'stock')=>{if(sort===field)setDesc(!desc);else{setSort(field);setDesc(false)}};
 return <div className="crm-products-list">
   <div className="crm-table-scroll"><table className="crm-products-table">
    <thead><tr>
     <th><button onClick={()=>setSorting('name')}>Product <ChevronDown size={13}/></button></th>
     <th>Category / Brand</th>
     <th><button onClick={()=>setSorting('price')}>Price <ChevronDown size={13}/></button></th>
     <th><button onClick={()=>setSorting('stock')}>Stock <ChevronDown size={13}/></button></th>
     <th>Status</th>
     <th className="crm-products-actions-title">Actions</th>
    </tr></thead>
    <tbody>{sorted.map((r,i)=>{
     const name=String(r.name||'Untitled product');
     const stock=Number(r.stock||0);
     const active=Boolean(r.is_active);
     return <tr key={String(r.id??i)}>
      <td><div className="crm-products-identity">
       <CrmImage src={mediaUrl(String(r.image_url||r.image||''))}/>
       <div className="crm-products-identity-copy">
        <button type="button" className="crm-products-name" title={name} onClick={()=>void onEdit(r)}>{name}</button>
        {Boolean(r.part_number)&&<span className="crm-products-sku">{String(r.part_number)}</span>}
       </div>
      </div></td>
      <td><div className="crm-products-group"><strong>{String(r.category_name||'Uncategorized')}</strong><span>{String(r.brand_name||'No brand')}</span></div></td>
      <td><strong className="crm-products-price">{money(r.price)}</strong></td>
      <td><span className={`crm-products-stock ${stock<=0?'is-empty':stock<=5?'is-low':''}`}>{stock}</span></td>
      <td><span className={`crm-status crm-status--${active?'success':'neutral'}`}><span className="crm-status-dot"/>{active?'Active':'Inactive'}</span></td>
      <td><div className="crm-products-actions">
       <button type="button" className="crm-products-edit" aria-label={`Edit ${name}`} onClick={()=>void onEdit(r)}><Pencil size={15}/> Edit</button>
       <button type="button" title={`Delete ${name}`} aria-label={`Delete ${name}`} onClick={()=>onDelete(r)} className="inline-flex items-center justify-center rounded-lg border border-red-100 px-2.5 py-2 text-red-600 hover:bg-red-50"><Trash2 size={16}/></button>
       <button type="button" className="crm-products-stock-btn" title={`Adjust stock for ${name}`} aria-label={`Adjust stock for ${name}`} onClick={()=>onStock(r)}><Boxes size={17}/></button>
      </div></td>
     </tr>;
    })}</tbody>
   </table></div>
   {!rows.length&&<div className="crm-table-empty"><span><Package size={24}/></span><strong>No products found</strong><p>Try a different search or add a product.</p></div>}
   <div className="crm-table-footer"><span>{rows.length} {rows.length===1?'product':'products'}</span><span>Select a product or Edit to update details</span></div>
 </div>;
}

function DataTable({rows,cols,actions,onProductEdit,emptyTitle="No records yet",emptyDescription="Records will appear here when available."}:{rows:Row[];cols:string[];actions?:(r:Row)=>React.ReactNode;onProductEdit?:(r:Row)=>void;emptyTitle?:string;emptyDescription?:string}){
 const [column,setColumn]=useState('');const [descending,setDescending]=useState(false);
 const sorted=[...rows].sort((a,b)=>{if(!column)return 0;const av=a[column],bv=b[column];const an=Number(av),bn=Number(bv);const result=av!==null&&bv!==null&&av!==''&&bv!==''&&Number.isFinite(an)&&Number.isFinite(bn)?an-bn:String(av??'').localeCompare(String(bv??''),undefined,{numeric:true});return descending?-result:result});
 return <div className="crm-table-scroll"><table className="crm-data-table"><thead><tr>{cols.map(c=><th key={c}><button type="button" title={`Sort by ${nice(c)}`} onClick={()=>{setDescending(column===c?!descending:false);setColumn(c)}}>{nice(c==='image_url'?'Image':c)}{column===c&&<ChevronDown size={13} className={descending?'rotate-180':''}/>}</button></th>)}{actions&&<th>Actions</th>}</tr></thead><tbody>{sorted.map((r,i)=><tr key={String(r.id??i)}>{cols.map(k=><td key={k} title={typeof r[k]==='string'?String(r[k]):''}>{k==='name'||k==='full_name'||k==='username'?<strong className="crm-cell-primary">{k==='name' && 'part_number' in r?<button type="button" className="text-left text-blue-700 hover:underline" title="Edit product" onClick={()=>void onProductEdit?.(r)}>{display(r[k],k)}</button>:display(r[k],k)}</strong>:k==='image_url'?<CrmImage src={mediaUrl(String(r.image_url||r.image||''))}/>:display(r[k],k)}</td>)}{actions&&<td><div className="crm-row-actions">{actions(r)}</div></td>}</tr>)}</tbody></table>{!rows.length&&<div className="crm-table-empty"><span><Search size={24}/></span><strong>{emptyTitle}</strong><p>{emptyDescription}</p></div>}<div className="crm-table-footer"><span>Showing {sorted.length} {sorted.length===1?'record':'records'}</span><span>Sort columns by selecting their headings</span></div></div>
}
