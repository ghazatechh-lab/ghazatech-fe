export type Category = { id: string; name: string; slug: string; image_url?: string | null };
export type Brand = { id: string; name: string };
export type Product = { id: string; name: string; slug: string; category_id: string | null; brand_id: string | null; price_aed: number; stock: number; part_number: string | null; description: string | null; image_url: string | null; featured: boolean; category?: Category | null; brand?: Brand | null };
export type RepairRequest = { id: string; reference: string; request_type: string; customer_name: string; phone: string; email: string | null; laptop_model: string | null; issue: string | null; status: string; created_at: string };
export type RepairType = 'part' | 'install' | 'repair';
export const REPAIR_TYPE_LABELS: Record<RepairType,{title:string;description:string}> = {
 part:{title:'I need a replacement part',description:'Check availability of the correct replacement part.'},
 install:{title:'I already have the part',description:'Request installation of a part you already have.'},
 repair:{title:'My laptop has a problem',description:'Describe the symptoms for diagnosis and quotation.'}
};
export const REPAIR_STATUS_STEPS = ['new','contacted','checking_availability','awaiting_customer','booked','received','diagnosing','awaiting_approval','approved','repairing','ready','completed'] as const;
export const STATUS_LABELS:Record<string,string> = {new:'Request received',contacted:'Customer contacted',checking_availability:'Checking availability',awaiting_customer:'Awaiting customer',booked:'Booked',received:'Laptop received',diagnosing:'Diagnosing',awaiting_approval:'Quotation approval pending',approved:'Approved',repairing:'Repair in progress',ready:'Ready for collection',completed:'Completed',rejected:'Quotation rejected',cancelled:'Cancelled'};
