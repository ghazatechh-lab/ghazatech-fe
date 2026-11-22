import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, LoaderCircle, X } from 'lucide-react';
export type ToastKind = 'success' | 'error' | 'warning' | 'info' | 'loading';
type Toast = { id: number; kind: ToastKind; title: string; description?: string; duration: number };
type Notify = (kind: ToastKind, title: string, description?: string) => void;
const ToastContext = createContext<Notify | null>(null);
let nextToastId = 0;
export function ToastProvider({children}: {children:ReactNode}) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const dismiss = useCallback((id:number) => setToasts(current => current.filter(t => t.id !== id)), []);
  const notify = useCallback<Notify>((kind,title,description) => {
    setToasts(current => {
      // Prevent the same operation being announced twice within a visible stack.
      if (current.some(t => t.kind === kind && t.title === title && t.description === description)) return current;
      return [...current.slice(-3), {id: ++nextToastId,kind,title,description,duration: kind==='error'?6500:kind==='loading'?0:4200}];
    });
  },[]);
  return <ToastContext.Provider value={notify}>{children}<div aria-label="Notifications" className="ghz-toast-stack pointer-events-none fixed right-3 top-20 z-[9999] flex w-[min(400px,calc(100vw-24px))] flex-col gap-2 sm:right-6 sm:top-24">
    {toasts.map(t=><ToastItem key={t.id} toast={t} dismiss={dismiss}/>)}</div></ToastContext.Provider>;
}
function ToastItem({toast,dismiss}:{toast:Toast;dismiss:(id:number)=>void}) {
  useEffect(()=>{if(!toast.duration)return;const timer=setTimeout(()=>dismiss(toast.id),toast.duration);return ()=>clearTimeout(timer);},[toast,dismiss]);
  const icons={success:CheckCircle2,error:AlertCircle,warning:AlertTriangle,info:Info,loading:LoaderCircle};
  const Icon=icons[toast.kind];
  const color={success:'text-emerald-600',error:'text-rose-600',warning:'text-amber-600',info:'text-blue-600',loading:'text-blue-600'}[toast.kind];
  return <section role={toast.kind==='error'?'alert':'status'} aria-live={toast.kind==='error'?'assertive':'polite'} className="ghz-toast pointer-events-auto flex items-start gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-[0_16px_50px_-20px_rgba(10,30,65,.45)] backdrop-blur-xl">
    <Icon className={`mt-0.5 shrink-0 ${color} ${toast.kind==='loading'?'animate-spin':''}`} size={20}/><div className="min-w-0 flex-1"><p className="text-sm font-bold text-slate-900">{toast.title}</p>{toast.description&&<p className="mt-1 break-words text-xs leading-5 text-slate-600">{toast.description}</p>}</div><button type="button" className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-500" onClick={()=>dismiss(toast.id)} aria-label="Dismiss notification"><X size={17}/></button>
  </section>;
}
export function useToast(){const notify=useContext(ToastContext);if(!notify)throw Error('ToastProvider is required');return useMemo(()=>({success:(title:string,desc?:string)=>notify('success',title,desc),error:(title:string,desc?:string)=>notify('error',title,desc),warning:(title:string,desc?:string)=>notify('warning',title,desc),info:(title:string,desc?:string)=>notify('info',title,desc),loading:(title:string,desc?:string)=>notify('loading',title,desc)}),[notify]);}
