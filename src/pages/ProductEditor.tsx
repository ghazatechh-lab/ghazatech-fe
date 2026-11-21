import { useEffect, useState, type FormEvent } from 'react';
import { apiUrl, mediaUrl } from '../lib/apiBase';
import { Plus, X, Package, Layers, ImagePlus, CheckCircle2 } from 'lucide-react';

type RecordValue=Record<string,any>;
type Variant={id?:number;sku:string;name:string;price:string;stock:string;attributes:Record<string,string>;is_active:boolean};
const emptyVariant=():Variant=>({sku:'',name:'',price:'',stock:'0',attributes:{},is_active:true});
const input='mt-1 block w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100';
const lbl='block text-sm font-semibold text-slate-700';

export default function ProductEditor({product,token,onClose,onSaved}:{product:RecordValue;token:string;onClose:()=>void;onSaved:()=>Promise<void>}){
 const edit=Boolean(product.id);
 const [categories,setCategories]=useState<RecordValue[]>([]);
 const [brands,setBrands]=useState<RecordValue[]>([]);
 const [variants,setVariants]=useState<Variant[]>(()=>Array.isArray(product.variants)?product.variants.map((v:RecordValue)=>({...v,price:String(v.price),stock:String(v.stock),attributes:v.attributes||{}})):[]);
 const [hasVariants,setHasVariants]=useState(()=>Boolean(product.variant_count||product.variants?.length));
 const [busy,setBusy]=useState(false);const [error,setError]=useState('');
 const [preview,setPreview]=useState<string>(mediaUrl(String(product.image_url||'')));
 useEffect(()=>{const headers={Authorization:`Token ${token}`};Promise.all(['categories','brands'].map(async name=>{const r=await fetch(apiUrl(`/api/crm/${name}/`),{headers});if(!r.ok)throw Error(`Unable to load ${name}`);const data=await r.json();return Array.isArray(data)?data:data.results||[]})).then(([c,b])=>{setCategories(c);setBrands(b)}).catch(e=>setError(String(e)))},[token]);
 const change=(i:number,key:keyof Variant,value:any)=>setVariants(v=>v.map((item,j)=>i===j?{...item,[key]:value}:item));
 const submit=async(e:FormEvent<HTMLFormElement>)=>{
  e.preventDefault();setError('');setBusy(true);
  try{
   const form=new FormData(e.currentTarget);
   if(!(form.get('image') instanceof File) || !(form.get('image') as File).size)form.delete('image');
   for(const key of ['is_active','is_featured'])form.set(key,form.has(key)?'true':'false');
   if(hasVariants){
    for(const [i,v] of variants.entries()){
     if(!v.name.trim()||!v.sku.trim()||v.price==='')throw Error(`Variant ${i+1} needs name, SKU and price.`);
     if(Number(v.price)<0||!Number.isFinite(Number(v.price))||!Number.isInteger(Number(v.stock))||Number(v.stock)<0)throw Error(`Variant ${i+1} has invalid price or stock.`);
    }
    form.set('variant_items',JSON.stringify(variants.map(v=>({...v,stock:Number(v.stock),price:v.price,attributes:v.attributes||{}}))));
   }
   // When the switch is off, omit variant_items; existing variants are never deleted implicitly.
   const response=await fetch(apiUrl(`/api/crm/products/${edit?`${product.id}/`:''}`),{method:edit?'PATCH':'POST',headers:{Authorization:`Token ${token}`},body:form});
   if(!response.ok){const message=await response.json().catch(()=>({detail:'Save failed'}));throw Error(message.detail||JSON.stringify(message))}
   await onSaved();onClose();
  }catch(err){setError(String(err))}finally{setBusy(false)}
 };
 return <div className="fixed inset-0 z-50 bg-slate-950/60 flex justify-end" role="dialog" aria-modal="true" aria-label="Product editor">
 <div className="flex h-full w-full max-w-3xl flex-col overflow-hidden bg-[#f7f9fd] shadow-2xl">
  <div className="flex items-center justify-between border-b bg-white px-6 py-5"><div className="flex items-center gap-3"><div className="rounded-xl bg-blue-100 p-3 text-blue-700"><Package size={21}/></div><div><h2 className="text-xl font-extrabold text-slate-900">{edit?'Edit product':'Create a product'}</h2><p className="text-xs text-slate-500">Catalog / Products / {edit?'Edit':'New'}</p></div></div><button onClick={onClose} aria-label="Close" className="rounded-xl p-2 hover:bg-slate-100"><X/></button></div>
  <form onSubmit={submit} className="flex min-h-0 flex-1 flex-col"><div className="flex-1 space-y-5 overflow-y-auto p-5 md:p-7">
   {error&&<div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}
   <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900"><Package size={19} className="text-blue-600"/> Product information</h3>
    <div className="grid gap-4 sm:grid-cols-2"><label className={lbl+" sm:col-span-2"}>Product name *<input name="name" required maxLength={250} defaultValue={String(product.name||'')} placeholder="Example: Acer Aspire Laptop Battery" className={input}/></label>
    <label className={lbl}>Part number / Base SKU *<input name="part_number" required maxLength={100} defaultValue={String(product.part_number||'')} className={input}/></label>
    <label className={lbl}>Condition<select name="condition" defaultValue={String(product.condition||'new')} className={input}>{['new','original','compatible','refurbished'].map(c=><option key={c} value={c}>{c[0].toUpperCase()+c.slice(1)}</option>)}</select></label>
    <label className={lbl}>Category *<select name="category" required defaultValue={String(product.category||'')} className={input}><option value="">Select category</option>{categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
    <label className={lbl}>Brand *<select name="brand" required defaultValue={String(product.brand||'')} className={input}><option value="">Select brand</option>{brands.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}</select></label>
    <label className={lbl+" sm:col-span-2"}>Description<textarea name="description" rows={3} defaultValue={String(product.description||'')} placeholder="Product specification and compatibility" className={input}/></label></div>
   </section>
   <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><h3 className="mb-4 font-bold text-slate-900">Pricing & stock</h3><div className="grid gap-4 sm:grid-cols-3"><label className={lbl}>Base price (AED) *<input name="price" required type="number" min="0" step="0.01" defaultValue={String(product.price??'0')} className={input}/></label><label className={lbl}>Base stock *<input name="stock" required type="number" min="0" step="1" defaultValue={String(product.stock??'0')} className={input}/></label><label className={lbl}>Warranty (months)<input name="warranty_months" type="number" min="0" step="1" defaultValue={String(product.warranty_months??0)} className={input}/></label></div></section>
   <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><div className="flex items-center justify-between gap-4"><div><h3 className="flex items-center gap-2 font-bold"><Layers size={19} className="text-blue-600"/> Product variants</h3><p className="mt-1 text-xs text-slate-500">Optional. Leave off for products with a single SKU.</p></div><label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-700"><input type="checkbox" checked={hasVariants} onChange={e=>{setHasVariants(e.target.checked);if(e.target.checked&&!variants.length)setVariants([emptyVariant()])}} className="h-5 w-5 accent-blue-600"/> Has variants</label></div>
    {hasVariants&&<div className="mt-5 space-y-4">{variants.map((v,i)=><div key={v.id||`new-${i}`} className="rounded-xl border border-blue-100 bg-blue-50/40 p-4"><div className="mb-3 flex justify-between"><span className="text-sm font-bold text-blue-900">Variant {i+1}{v.id?' · Existing':''}</span>{!v.id&&<button type="button" aria-label="Remove unsaved variant" onClick={()=>setVariants(items=>items.filter((_,j)=>j!==i))} className="text-slate-500 hover:text-red-600"><X size={17}/></button>}</div><div className="grid gap-3 sm:grid-cols-2"><label className={lbl}>Variant name *<input required value={v.name} onChange={e=>change(i,'name',e.target.value)} placeholder="e.g. 11.1V / 4400mAh" className={input}/></label><label className={lbl}>Variant SKU *<input required value={v.sku} onChange={e=>change(i,'sku',e.target.value)} className={input}/></label><label className={lbl}>Price (AED) *<input required type="number" min="0" step="0.01" value={v.price} onChange={e=>change(i,'price',e.target.value)} className={input}/></label><label className={lbl}>Stock *<input required type="number" min="0" step="1" value={v.stock} onChange={e=>change(i,'stock',e.target.value)} className={input}/></label><label className={lbl+" sm:col-span-2"}>Attributes (example: Voltage / Capacity)<input value={Object.entries(v.attributes||{}).map(([k,val])=>`${k}: ${val}`).join(', ')} onChange={e=>change(i,'attributes',Object.fromEntries(e.target.value.split(',').map(part=>part.split(':').map(x=>x.trim())).filter(parts=>parts.length===2&&parts[0])))} placeholder="Voltage: 11.1V, Capacity: 4400mAh" className={input}/></label><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={v.is_active} onChange={e=>change(i,'is_active',e.target.checked)}/> Active variant</label></div></div>)}<button type="button" onClick={()=>setVariants(v=>[...v,emptyVariant()])} className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700 hover:bg-blue-100"><Plus size={16}/> Add another variant</button><p className="text-xs text-amber-700">Existing variants are not deleted when switching this section off. Set a variant to inactive to hide it.</p></div>}
   </section>
   <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm"><h3 className="mb-4 flex items-center gap-2 font-bold"><ImagePlus size={19} className="text-blue-600"/> Images & visibility</h3><div className="grid gap-4 sm:grid-cols-2"><label className={lbl}>Product image<input type="file" name="image" accept="image/*" className={input} onChange={e=>{const f=e.target.files?.[0];if(f){const reader=new FileReader();reader.onload=()=>setPreview(String(reader.result));reader.readAsDataURL(f)}}}/></label>{preview&&<img src={preview} alt="Product preview" className="h-28 w-36 rounded-xl border object-contain"/>}<label className={lbl}>Featured label<input name="featured_label" defaultValue={String(product.featured_label||'')} maxLength={30} className={input} placeholder="Popular / New"/></label><div className="flex flex-wrap items-center gap-5"><label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" name="is_active" defaultChecked={edit?Boolean(product.is_active):true}/> Active product</label><label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" name="is_featured" defaultChecked={Boolean(product.is_featured)}/> Featured</label></div></div></section>
  </div><div className="flex items-center justify-end gap-3 border-t bg-white px-6 py-4"><button type="button" onClick={onClose} className="rounded-xl border px-5 py-2.5 text-sm font-semibold">Cancel</button><button disabled={busy} className="flex items-center gap-2 rounded-xl bg-blue-700 px-6 py-2.5 text-sm font-bold text-white disabled:opacity-60"><CheckCircle2 size={17}/>{busy?'Saving…':edit?'Save product':'Create product'}</button></div></form>
 </div></div>;
}
