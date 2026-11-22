import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2, Truck } from 'lucide-react';
import { useCart } from '../lib/cart';
import { ProductThumb } from '../components/ProductCard';
import { checkoutOrder } from '../lib/api';
import { useToast } from '../components/ui/ToastProvider';
import ConfirmDialog from '../components/ui/ConfirmDialog';

const FREE_DELIVERY_THRESHOLD = 250;

export default function Cart() {
  const { items, setQty, remove, total, clear } = useCart();
  const toast=useToast();
  const [confirmClear,setConfirmClear]=useState(false);
  const [placing, setPlacing] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [orderNo,setOrderNo] = useState('');
  const [orderError,setOrderError] = useState('');
  const [customer,setCustomer]=useState({full_name:'',email:'',mobile:'',address:'',city:'',emir:'Dubai'});
  const delivery = total >= FREE_DELIVERY_THRESHOLD || total === 0 ? 0 : 30;
  const vat=Number((total*.05).toFixed(2));
  async function placeOrder(event:React.FormEvent){event.preventDefault();if(placing||!items.length)return;setPlacing(true);setOrderError('');try{const order=await checkoutOrder({...customer,items:items.map(i=>({product_id:Number(i.product.id),quantity:i.qty}))});setOrderNo(order.order_number);clear();setPlaced(true);toast.success('Order placed successfully',`Order ${order.order_number} has been received.`);}catch(err){setOrderError(err instanceof Error?err.message:'Unable to place order');toast.error('Unable to place order',err instanceof Error?err.message:'Please try again. Your cart has been preserved.');}finally{setPlacing(false);}}

  if (placed) {
    return (
      <div className="container-x flex flex-col items-center py-24 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <Truck className="h-8 w-8" />
        </span>
        <h1 className="mt-6 font-display text-3xl font-bold text-ink-950">Order received</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-500">
          Order {orderNo} has been saved. Our team will contact you on the phone number provided to
          confirm delivery or collection of your parts.
        </p>
        <Link to="/shop" className="btn-primary mt-8">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x py-12 animate-fade-in">
      <h1 className="font-display text-3xl font-bold tracking-tight text-ink-950">Your Cart</h1>

      {items.length === 0 ? (
        <div className="card mt-8 flex flex-col items-center py-20 text-center animate-fade-up">
          <ShoppingCart className="h-10 w-10 animate-float text-ink-300" />
          <h2 className="mt-4 font-display text-lg font-semibold text-ink-900">
            Your cart is empty
          </h2>
          <p className="mt-1 text-sm text-ink-500">Browse our range of quality laptop parts.</p>
          <Link to="/shop" className="btn-primary mt-6">
            Shop Spare Parts
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {items.map(({ product, qty }, i) => (
              <div
                key={product.id}
                className="card flex gap-4 p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-md animate-fade-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <Link
                  to={`/product/${product.slug}`}
                  className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-ink-50"
                >
                  <ProductThumb product={product} />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        to={`/product/${product.slug}`}
                        className="text-sm font-semibold text-ink-900 transition hover:text-brand-700"
                      >
                        {product.name}
                      </Link>
                      <div className="mt-0.5 text-xs text-ink-400">
                        {product.category?.name} · AED {Number(product.price_aed).toFixed(2)} each
                      </div>
                    </div>
                    <button
                      onClick={() => {remove(product.id);toast.info('Item removed', `${product.name} was removed from your cart.`);}}
                      className="text-ink-400 transition hover:text-red-500"
                      aria-label={`Remove ${product.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-lg border border-ink-200">
                      <button
                        onClick={() => setQty(product.id, qty - 1)}
                        className="flex h-8 w-8 items-center justify-center text-ink-500 hover:text-ink-900"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                      <button
                        onClick={() => setQty(product.id, Math.min(qty + 1, Math.max(1,product.stock)))}
                        className="flex h-8 w-8 items-center justify-center text-ink-500 hover:text-ink-900"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="font-display text-base font-bold text-ink-950">
                      AED {(qty * Number(product.price_aed)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={() => setConfirmClear(true)}
              className="text-sm font-medium text-ink-400 transition hover:text-red-500"
            >
              Clear cart
            </button>
            <ConfirmDialog open={confirmClear} title="Clear your cart?" description="All items will be removed from your shopping cart." confirmLabel="Clear cart" danger onCancel={()=>setConfirmClear(false)} onConfirm={()=>{clear();setConfirmClear(false);toast.info('Cart cleared','Your shopping cart is now empty.');}} />
          </div>

          <aside>
            <div className="card sticky top-32 p-6">
              <h2 className="font-display text-lg font-bold text-ink-950">Order Summary</h2>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-500">Subtotal</dt>
                  <dd className="font-semibold text-ink-900">AED {total.toFixed(2)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-500">Delivery (UAE)</dt>
                  <dd className="font-semibold text-ink-900">
                    {delivery === 0 ? 'Free' : `AED ${delivery.toFixed(2)}`}
                  </dd>
                </div>
                <div className="flex justify-between"><dt className="text-ink-500">VAT (5%)</dt><dd>AED {vat.toFixed(2)}</dd></div>
                <div className="border-t border-ink-100 pt-3">
                  <div className="flex justify-between">
                    <dt className="font-semibold text-ink-900">Total</dt>
                    <dd className="font-display text-xl font-bold text-ink-950">
                      AED {(total + vat + delivery).toFixed(2)}
                    </dd>
                  </div>
                </div>
              </dl>
              {total < FREE_DELIVERY_THRESHOLD && (
                <p className="mt-4 rounded-lg bg-brand-50 p-3 text-xs text-brand-700">
                  Add AED {(FREE_DELIVERY_THRESHOLD - total).toFixed(2)} more for free UAE delivery.
                </p>
              )}
              <form onSubmit={placeOrder} className="mt-6 space-y-3">
                <h3 className="text-sm font-bold text-ink-900">Delivery details</h3>
                {([['full_name','Full name'],['email','Email'],['mobile','Mobile number'],['address','Street address'],['city','City']] as const).map(([key,label])=><label key={key} className="block text-xs font-semibold text-ink-600">{label}<input required type={key==='email'?'email':'text'} value={customer[key]} onChange={e=>setCustomer(c=>({...c,[key]:e.target.value}))} className="input mt-1" /></label>)}
                <label className="block text-xs font-semibold text-ink-600">Emirate<select className="input mt-1" value={customer.emir} onChange={e=>setCustomer(c=>({...c,emir:e.target.value}))}>{['Dubai','Sharjah','Abu Dhabi','Ajman','Umm Al Quwain','Ras Al Khaimah','Fujairah'].map(x=><option key={x}>{x}</option>)}</select></label>
                {orderError&&<p role="alert" className="rounded-lg bg-red-50 p-3 text-xs text-red-700">{orderError}</p>}
                <button type="submit" disabled={placing} className="btn-primary w-full">{placing?'Placing order...':'Place Order (Cash on Delivery)'}</button>
              </form>
              <p className="mt-3 text-center text-xs text-ink-400">
                Pay on delivery or collection. Our team will call to confirm.
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
