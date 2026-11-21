export type Customer = {id:number; email:string; first_name:string; last_name:string; full_name:string; mobile_number:string};
const ROOT='/api/accounts/';
const TOKEN_KEY='ghazatech_customer_token';
export function getCustomerToken(){return localStorage.getItem(TOKEN_KEY) || '';}
export function saveCustomerToken(token:string){localStorage.setItem(TOKEN_KEY,token);window.dispatchEvent(new Event('ghaza-auth-changed'));}
export function clearCustomerToken(){localStorage.removeItem(TOKEN_KEY);window.dispatchEvent(new Event('ghaza-auth-changed'));}
export async function accountApi<T=any>(path:string,data?:Record<string,unknown>,auth=false):Promise<T>{
 const response=await fetch(ROOT+path,{method:data?'POST':'GET',headers:{...(data?{'Content-Type':'application/json'}:{}),...(auth?{'Authorization':`Token ${getCustomerToken()}`}:{})},body:data?JSON.stringify(data):undefined});
 const result=await response.json().catch(()=>({detail:'Could not contact the server.'}));
 if(!response.ok){
  const fieldLabels:Record<string,string>={email:'Email',mobile_number:'Mobile number',password:'Password',confirm_password:'Confirm password',first_name:'First name',last_name:'Last name',non_field_errors:'Registration'};
  let description='';
  if(result && typeof result==='object'){
   const parts=Object.entries(result).filter(([key])=>key!=='code').map(([key,value])=>{
    const msg=Array.isArray(value)?value.join(' '):typeof value==='string'?value:JSON.stringify(value);
    return key==='detail'?msg:`${fieldLabels[key] || key}: ${msg}`;
   });
   description=parts.filter(Boolean).join(' • ');
  }
  throw new Error(description || `Request failed (${response.status}). Please try again.`);
 }
 return result as T;
}

export async function accountPatch<T=Customer>(path:string,data:Record<string,unknown>):Promise<T>{
 const response=await fetch(ROOT+path,{method:'PATCH',headers:{'Content-Type':'application/json','Authorization':`Token ${getCustomerToken()}`},body:JSON.stringify(data)});
 const json=await response.json().catch(()=>({detail:'Unable to contact server.'}));
 if(!response.ok) throw new Error(Object.entries(json).map(([key,value])=>`${key}: ${Array.isArray(value)?value.join(' '):String(value)}`).join(' • '));
 return json as T;
}
