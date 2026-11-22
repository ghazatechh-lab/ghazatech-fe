import {useEffect, useRef, useState, type FormEvent} from 'react';
import {Link, useNavigate, useSearchParams} from 'react-router-dom';
import {accountApi, saveCustomerToken, getCustomerToken, type Customer} from '../lib/auth';
import { useToast } from '../components/ui/ToastProvider';
import {ArrowRight, CheckCircle2, MailCheck, ShieldCheck, Eye, EyeOff} from 'lucide-react';

type Mode = 'login'|'register'|'verify-email'|'resend-verification'|'forgot-password'|'reset-password'|'account';
export default function CustomerAuth({mode}: {mode:Mode}) {
 const [params] = useSearchParams(); const navigate=useNavigate(); const toast=useToast();
 const token=params.get('token')||'';
 const [fields,setFields]=useState<Record<string,string>>({email:params.get('email')||''});
 const [error,setError]=useState(''); const [message,setMessage]=useState(''); const [busy,setBusy]=useState(false);
 const [showPassword,setShowPassword]=useState(false);
 const verificationRequest=useRef<Promise<{detail:string}>|null>(null);
 useEffect(()=>{setError('');setMessage('');setFields({email:params.get('email')||''});verificationRequest.current=null;},[mode]);
 useEffect(()=>{
   if(mode==='verify-email' && token) {
     let active=true;
     setBusy(true);setError('');
     if(!verificationRequest.current) verificationRequest.current=accountApi<{detail:string}>('verify-email/',{token});
     verificationRequest.current.then(()=>{if(active)navigate('/login?verified=1',{replace:true});})
       .catch(e=>{if(active)setError(e instanceof Error?e.message:'Unable to verify your email.');})
       .finally(()=>{if(active)setBusy(false);});
     return ()=>{active=false;};
   }
 },[mode,token,navigate]);
 useEffect(()=>{if(mode==='account')navigate(getCustomerToken()?'/account':'/login',{replace:true});},[mode,navigate]);
 const set=(key:string,value:string)=>setFields(old=>({...old,[key]:value}));
 const verified=mode==='login'&&params.get('verified')==='1';
 const resetDone=mode==='login'&&params.get('reset')==='1';
 const next=params.get('next')||'';
 const destination=next.startsWith('/')&&!next.startsWith('//')&&!next.includes('\\')?next:'/';
 const titles:Record<Mode,string>={login:'Welcome back',register:'Create your account','verify-email':'Verify your email','resend-verification':'Resend verification email','forgot-password':'Forgot your password?','reset-password':'Set a new password',account:'My account'};
 async function submit(e:FormEvent){
  e.preventDefault();if(busy)return;setBusy(true);setError('');setMessage('');
  try {
   if(['register','reset-password'].includes(mode) && fields.password !== fields.confirm_password){setError('Passwords do not match.');return;}
   if(mode==='login') {const result=await accountApi<{token:string;customer:Customer}>('login/',fields);saveCustomerToken(result.token);navigate(destination,{replace:true,state:{loginSuccess:true}});}
   else if(mode==='register') {await accountApi('register/',fields);toast.success('Registration submitted','Check your email for verification instructions.');navigate(`/resend-verification?email=${encodeURIComponent(fields.email)}&sent=1`,{replace:true});}
   else if(mode==='resend-verification'||mode==='verify-email') {const r=await accountApi<{detail:string}>('resend-verification/',{email:fields.email});setMessage(r.detail);toast.info('Check your email',r.detail);}
   else if(mode==='forgot-password') {const r=await accountApi<{detail:string}>('forgot-password/',{email:fields.email});setMessage(r.detail);toast.info('Check your email',r.detail);}
   else if(mode==='reset-password') {await accountApi('reset-password/',{...fields,uid:params.get('uid')||'',token:token});toast.success('Password updated','You can now sign in with your new password.');navigate('/login?reset=1',{replace:true});}
  } catch(e){setError(e instanceof Error?e.message:'Request failed. Please try again.');toast.error('Request unsuccessful',e instanceof Error?e.message:'Please try again.');}
  finally {setBusy(false);}
 }
 const input=(name:string,label:string,type='text',required=true)=> <label key={name} className="block text-sm font-semibold text-slate-700">{label}<div className="relative mt-1.5"><input name={name} type={type==='password'&&showPassword?'text':type} required={required} value={fields[name]||''} onChange={e=>set(name,e.target.value)} autoComplete={name==='email'?'email':name==='first_name'?'given-name':name==='last_name'?'family-name':name==='mobile_number'?'tel':name==='password'?(mode==='login'?'current-password':'new-password'):'off'} className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 outline-none transition focus:border-blue-600 focus:ring-4 focus:ring-blue-100"/>{type==='password'&&<button type="button" aria-label={showPassword?'Hide password':'Show password'} onClick={()=>setShowPassword(x=>!x)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500">{showPassword?<EyeOff size={18}/>:<Eye size={18}/>}</button>}</div></label>;
 return <section className="min-h-[75vh] bg-[#f4f8fe] px-4 py-12 lg:py-20"><div className="mx-auto grid max-w-5xl overflow-hidden rounded-[30px] border border-[#dbe7f5] bg-white shadow-[0_30px_95px_-50px_rgba(6,21,43,.45)] lg:grid-cols-[.85fr_1.15fr]">
 <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#06152b] p-10 text-white lg:flex"><div className="absolute -right-24 top-12 h-80 w-80 rounded-full bg-blue-500/25 blur-3xl"/><div className="relative"><span className="text-xs font-bold uppercase tracking-[.3em] text-sky-300">Ghaza Computer</span><h2 className="mt-12 text-4xl font-extrabold leading-tight">Technology you trust.<br/><span className="text-cyan-300">Service you deserve.</span></h2><p className="mt-5 leading-7 text-slate-300">Manage your orders, warranties, and account information in one secure place.</p></div><div className="relative flex items-center gap-3 text-sm text-slate-200"><ShieldCheck className="text-cyan-300"/> Secure customer portal</div></aside>
 <div className="p-7 sm:p-12 lg:p-14"><p className="mb-2 text-xs font-bold uppercase tracking-widest text-blue-600">GhazaTech Customer Portal</p><h1 className="mb-5 text-3xl font-extrabold text-[#0b2b57]">{titles[mode]}</h1>
 {verified&&<div role="status" className="mb-5 flex gap-2 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800"><CheckCircle2 className="shrink-0"/> Your email is verified. Sign in to continue.</div>}
 {resetDone&&<div role="status" className="mb-5 rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">Password reset successfully. Sign in with your new password.</div>}
 {params.get('sent')==='1'&&mode==='resend-verification'&&<div role="status" className="mb-5 rounded-xl bg-blue-50 p-4 text-sm text-blue-800">Registration submitted. Check your inbox and spam folder. If necessary, resend your verification email below.</div>}
 {error&&<div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}{mode==='login'&&error.toLowerCase().includes('not verified')&&<Link to="/resend-verification" className="mt-2 block font-bold underline">Resend verification email</Link>}</div>}
 {message&&<div role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{message}</div>}
 {mode==='verify-email'&&token? <div className="space-y-5">{busy?<p className="text-slate-600" role="status">Verifying your email…</p>:<p className="text-sm text-slate-600">If your link has expired, request a new verification email.</p>}<Link className="inline-flex items-center gap-2 font-semibold text-blue-700" to="/resend-verification">Resend verification <ArrowRight size={16}/></Link></div>:
 <form onSubmit={submit} className="space-y-4">
 {mode==='verify-email'&&<div className="flex items-center gap-3 text-sm text-slate-600"><MailCheck className="text-blue-600"/> Enter your email to receive a new verification link.</div>}
 {mode==='register'&&<>{input('first_name','First name')}{input('last_name','Last name','text',false)}</>}
 {['register','login','forgot-password','resend-verification','verify-email'].includes(mode)&&input('email','Email address','email')}
 {mode==='register'&&input('mobile_number','Mobile number (with country code)','tel')}
 {['register','login','reset-password'].includes(mode)&&input('password',mode==='reset-password'?'New password':'Password','password')}
 {['register','reset-password'].includes(mode)&&input('confirm_password','Confirm password','password')}
 <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3.5 font-bold text-white transition hover:bg-blue-800 disabled:cursor-wait disabled:opacity-60">{busy?'Please wait…':mode==='register'?'Create account':mode==='login'?'Sign in':mode==='forgot-password'?'Send reset link':mode==='reset-password'?'Update password':'Resend verification email'}<ArrowRight size={17}/></button>
 </form>}
 <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-blue-700">{mode!=='login'&&<Link to="/login">Sign in</Link>}{mode!=='register'&&<Link to="/register">Create account</Link>}{mode!=='forgot-password'&&<Link to="/forgot-password">Forgot password?</Link>}{mode!=='resend-verification'&&<Link to="/resend-verification">Resend verification</Link>}</div>
 </div></div></section>;
}
