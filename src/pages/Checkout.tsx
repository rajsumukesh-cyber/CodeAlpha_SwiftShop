import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, CheckCircle2, ArrowLeft, Loader2, PackageCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { CartItem, Order, Currency } from '../types';
import { formatPrice } from '../lib/currency';

interface CheckoutProps {
  cart: CartItem[];
  clearCart: () => void;
  currency: Currency;
}

export default function Checkout({ cart, clearCart, currency }: CheckoutProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState<Order | null>(null);
  const [saveInfo, setSaveInfo] = useState(true);
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('guestInfo');
    return saved ? JSON.parse(saved) : {
      name: '',
      email: '',
      address: '',
      city: '',
      postalCode: ''
    };
  });

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 5000 ? 0 : 250;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (saveInfo) {
      localStorage.setItem('guestInfo', JSON.stringify(formData));
    } else {
      localStorage.removeItem('guestInfo');
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          total,
          customer: {
            name: formData.name,
            email: formData.email,
            address: `${formData.address}, ${formData.city}, ${formData.postalCode}`
          }
        })
      });

      if (response.ok) {
        const order = await response.json();
        setOrderComplete(order);
        // Save order ID to local history for guest viewing
        const history = JSON.parse(localStorage.getItem('orderHistory') || '[]');
        localStorage.setItem('orderHistory', JSON.stringify([...history, order.id]));
        clearCart();
      }
    } catch (error) {
      console.error('Failed to place order:', error);
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center text-center gap-6"
        >
          <div className="w-20 h-20 bg-green-50 dark:bg-green-950/30 text-green-500 dark:text-green-400 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={48} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2 dark:text-white">Order Confirmed</h1>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-sm mb-1 text-sm">
              Thank you for your purchase, {orderComplete.customer.name.split(' ')[0]}. 
              Your order <span className="font-mono text-black dark:text-white font-bold uppercase">{orderComplete.id}</span> is being processed.
            </p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500">A confirmation email has been sent to {orderComplete.customer.email}</p>
          </div>
          
          <div className="w-full max-w-md bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800 text-left">
            <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4 border-b border-neutral-200 dark:border-neutral-800 pb-2">Order Summary</h3>
            <div className="space-y-3">
               {orderComplete.items.map(item => (
                 <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-neutral-600 dark:text-neutral-400">{item.quantity}x {item.name}</span>
                    <span className="font-mono font-bold dark:text-white">{formatPrice(item.price * item.quantity, currency)}</span>
                 </div>
               ))}
               <div className="pt-3 border-t border-dotted border-neutral-300 dark:border-neutral-700 flex justify-between font-bold text-lg">
                 <span className="dark:text-white">Total Paid</span>
                 <span className="font-mono dark:text-white">{formatPrice(orderComplete.total, currency)}</span>
               </div>
            </div>
          </div>

          <Link to="/" className="mt-8 px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full font-bold hover:scale-105 transition-transform active:scale-95 shadow-lg">
            Return to Shop
          </Link>
        </motion.div>
      </div>
    );
  }

  if (cart.length === 0) {
     return (
       <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6">
         <div className="w-16 h-16 bg-neutral-50 dark:bg-neutral-900 rounded-full flex items-center justify-center text-neutral-400">
           <PackageCheck size={32} />
         </div>
         <h1 className="text-2xl font-bold dark:text-white">Your cart is empty</h1>
         <Link to="/" className="text-sm font-bold underline underline-offset-4 dark:text-neutral-400 hover:text-neutral-500 transition-colors">Start Shopping</Link>
       </div>
     );
  }

  return (
    <div className="pb-20">
      <Link to="/" className="flex items-center gap-2 text-sm font-semibold text-neutral-400 hover:text-black dark:hover:text-white transition-colors mb-12">
        <ArrowLeft size={16} /> Continue Shopping
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <div className="flex flex-col gap-2 mb-8">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Step 1 of 2</span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight dark:text-white">Checkout as Guest</h1>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              Already have an account? <button type="button" className="text-black dark:text-white font-bold hover:underline underline-offset-4">Sign in</button> for faster checkout.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 ml-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-neutral-800 transition-all dark:text-white"
                  placeholder="John Doe"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 ml-1">Email Address</label>
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-neutral-800 transition-all dark:text-white"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 ml-1">Shipping Address</label>
              <input 
                required
                type="text" 
                value={formData.address}
                onChange={e => setFormData({...formData, address: e.target.value})}
                className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-neutral-800 transition-all dark:text-white"
                placeholder="123 Modern Ave"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 ml-1">City</label>
                <input 
                  required
                  type="text" 
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                  className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-neutral-800 transition-all dark:text-white"
                  placeholder="New York"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 ml-1">Postal Code</label>
                <input 
                  required
                  type="text" 
                  value={formData.postalCode}
                  onChange={e => setFormData({...formData, postalCode: e.target.value})}
                  className="p-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-xl focus:outline-none focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-neutral-800 transition-all dark:text-white"
                  placeholder="10001"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl border border-neutral-100 dark:border-neutral-800 group cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors" onClick={() => setSaveInfo(!saveInfo)}>
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${saveInfo ? 'bg-black dark:bg-white border-black dark:border-white text-white dark:text-black' : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800'}`}>
                {saveInfo && <CheckCircle2 size={14} />}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold dark:text-white">Save my information for next time</span>
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-medium uppercase tracking-widest">We'll remember you for your next visit</span>
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden bg-black dark:bg-white text-white dark:text-black p-5 rounded-2xl font-bold flex items-center justify-center gap-3 active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl"
              >
                {loading ? (
                   <Loader2 size={24} className="animate-spin" />
                ) : (
                  <>Place Order <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-5">
           <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-3xl p-8 sticky top-24">
              <h2 className="text-xl font-bold mb-6 dark:text-white">Review Order</h2>
              <div className="space-y-4 mb-8">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white dark:bg-neutral-800 border border-neutral-100 dark:border-neutral-700 rounded flex-shrink-0 flex items-center justify-center overflow-hidden">
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      </div>
                       <span className="font-medium dark:text-neutral-200">{item.name} <span className="text-neutral-400 dark:text-neutral-500 ml-1">x{item.quantity}</span></span>
                    </div>
                    <span className="font-mono font-bold dark:text-white">{formatPrice(item.price * item.quantity, currency)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <div className="flex justify-between text-neutral-500 dark:text-neutral-400 text-sm">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatPrice(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between text-neutral-500 dark:text-neutral-400 text-sm">
                  <span>Shipping</span>
                  <span className="font-mono">{shipping === 0 ? 'FREE' : formatPrice(shipping, currency)}</span>
                </div>
                <div className="flex justify-between items-center text-xl font-black pt-4">
                  <span className="dark:text-white">Total</span>
                  <span className="font-mono dark:text-white">{formatPrice(total, currency)}</span>
                </div>
              </div>
              
              {shipping > 0 && (
                <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-950/50 rounded-xl text-orange-800 dark:text-orange-300 text-xs font-semibold flex items-center gap-2">
                  <span>💡 Add {formatPrice(5000 - subtotal, currency)} more for FREE shipping!</span>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
