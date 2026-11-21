import type { Brand, Category, Product, RepairRequest, RepairType } from './types';
const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
async function json<T>(path:string, options?:RequestInit):Promise<T>{
 const response=await fetch(`${base}${path}`, { ...options, headers:{ ...(options?.body ? {'Content-Type':'application/json'} : {}), ...(options?.headers || {}) }});
 const data=await response.json().catch(()=>null);
 if(!response.ok){const details=data && typeof data==='object' ? Object.entries(data).map(([k,v])=>`${k}: ${Array.isArray(v)?v.join(', '):String(v)}`).join('; ') : '';throw new Error(details || `Request failed (${response.status})`);}
 return data as T;
}
type RawProduct={id:number;name:string;part_number:string;category:number;category_name:string;brand:number;brand_name:string;price:string;stock:number;description:string;image_url:string|null;is_featured:boolean};
const slug=(v:string)=>v.toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const mapProduct=(p:RawProduct):Product=>({id:String(p.id),name:p.name,slug:String(p.id),category_id:String(p.category),brand_id:String(p.brand),price_aed:Number(p.price),stock:p.stock,part_number:p.part_number,description:p.description,image_url:p.image_url,featured:p.is_featured,category:{id:String(p.category),name:p.category_name,slug:slug(p.category_name)},brand:{id:String(p.brand),name:p.brand_name}});
export async function fetchCategories():Promise<Category[]>{const rows=await json<Array<{id:number;name:string;image_url?:string}>>('/api/store/categories/');return rows.map(c=>({...c,id:String(c.id),slug:slug(c.name)}));}
export async function fetchBrands():Promise<Brand[]>{const rows=await json<Array<{id:number;name:string}>>('/api/store/brands/');return rows.map(b=>({...b,id:String(b.id)}));}
export type ProductFilters={categorySlug?:string;brandName?:string;search?:string;maxPrice?:number};
export async function fetchProducts(filters:ProductFilters={}):Promise<Product[]>{
 const params=new URLSearchParams({page_size:'100'});
 if(filters.brandName)params.set('brand',filters.brandName);
 if(filters.search)params.set('q',filters.search);
 const all:RawProduct[]=[];let page=1;
 do{params.set('page',String(page));const r=await json<{results:RawProduct[];next:string|null}>(`/api/store/products/?${params}`);all.push(...r.results);if(!r.next)break;page++;}while(page<=10);
 return all.map(mapProduct).filter(p=>(!filters.categorySlug || p.category?.slug===filters.categorySlug) && (filters.maxPrice==null || p.price_aed<=filters.maxPrice));
}
export async function fetchFeaturedProducts():Promise<Product[]>{const rows=await json<{results:RawProduct[]}>('/api/store/products/?featured=true&page_size=100');return rows.results.map(mapProduct);}
export async function fetchProductBySlug(id:string):Promise<Product|null>{if(!/^\d+$/.test(id))return null;try{return mapProduct(await json<RawProduct>(`/api/store/products/${id}/`));}catch{return null;}}
export type RepairSubmission={requestType:RepairType;customerName:string;phone:string;email?:string;laptopModel?:string;issue?:string};
export async function submitRepairRequest(input:RepairSubmission):Promise<string>{
 const data=await json<{reference_number:string}>('/api/services/repair/',{method:'POST',body:JSON.stringify({full_name:input.customerName,mobile:input.phone,email:input.email||'',laptop_brand:'Other',laptop_model:input.laptopModel||'',flow_type:({part:'replacement',install:'installation',repair:'repair'} as const)[input.requestType],service_type:input.requestType==='install'?'Part Installation':'Other',delivery_option:'service_centre',preferred_contact:'whatsapp',problem_description:input.issue||'Service requested via website'})});return data.reference_number;
}
export async function trackRepair(reference:string,mobile:string):Promise<RepairRequest|null>{
 try{const p=await json<any>('/api/services/repair/track/',{method:'POST',body:JSON.stringify({reference_number:reference,mobile})});return {id:String(p.id),reference:p.reference_number,request_type:p.flow_type||p.service_type,customer_name:p.full_name,phone:p.mobile,email:p.email,laptop_model:p.laptop_model,issue:p.problem_description,status:p.status,created_at:p.created_at};}catch(e){if(String(e).includes('404'))return null;throw e;}
}
export type SupportSubmission={name:string;email:string;phone?:string;subject:string;message:string};
export async function submitSupportTicket(input:SupportSubmission):Promise<void>{
 await json('/api/services/support/',{method:'POST',body:JSON.stringify({full_name:input.name,mobile:input.phone||'',email:input.email,subject:input.subject,message:input.message,request_type:input.subject.toLowerCase().includes('warranty')?'warranty':input.subject.toLowerCase().includes('order')?'order':'product'})});
}
export type CheckoutInput={full_name:string;email:string;mobile:string;address:string;city:string;emir:string;items:{product_id:number;quantity:number}[]};
export async function checkoutOrder(input:CheckoutInput):Promise<{order_number:string;total:string}>{return json('/api/orders/checkout/',{method:'POST',body:JSON.stringify({...input,payment_method:'cash_on_delivery'})});}

export type CustomerReview = {
 id:number; customer_name:string; customer_type:string; review:string; related_item:string; rating:number;
};
export async function fetchPublicReviews():Promise<CustomerReview[]>{
 return json<CustomerReview[]>('/api/store/reviews/');
}
