import { motion } from 'motion/react';
import { X, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { CartItem, Currency } from '../types';
import { formatPrice } from '../lib/currency';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  currency: Currency;
}

export default function CartDrawer({ isOpen, onClose, cart, updateQuantity, removeFromCart, currency }: CartDrawerProps) {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      {/* Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 px-4"
      />
      
      {/* Drawer */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-neutral-950 z-[60] shadow-2xl flex flex-col"
      >
        <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight dark:text-white">Shopping Cart</h2>
            <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-400 rounded text-xs font-bold">{cart.length}</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-neutral-500 hover:text-black dark:hover:text-white">
            <X size={20} />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                <Trash2 size={24} className="dark:text-white" />
              </div>
              <p className="font-semibold dark:text-white">Your cart is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="w-20 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-bold text-sm dark:text-white">{item.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-neutral-300 dark:text-neutral-600 hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <p className="text-xs text-neutral-400 dark:text-neutral-500 mb-4">{item.category}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-900 rounded-full p-1 border border-neutral-100 dark:border-neutral-800">
                      <button 
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 hover:bg-white dark:hover:bg-neutral-800 rounded-full transition-shadow hover:shadow-sm dark:text-neutral-400"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-xs font-bold w-4 text-center dark:text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 hover:bg-white dark:hover:bg-neutral-800 rounded-full transition-shadow hover:shadow-sm dark:text-neutral-400"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="font-mono text-sm font-bold dark:text-white">{formatPrice(item.price * item.quantity, currency)}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-neutral-500 dark:text-neutral-400">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal, currency)}</span>
              </div>
              <div className="flex justify-between text-sm text-neutral-500 dark:text-neutral-400">
                <span>Shipping</span>
                <span className="text-green-600 dark:text-green-400 font-semibold uppercase text-[10px] tracking-widest bg-green-50 dark:bg-green-950/30 px-2 py-0.5 rounded">Calculated at next step</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-neutral-200 dark:border-neutral-700">
                <span className="dark:text-white">Total</span>
                <span className="font-mono dark:text-white">{formatPrice(subtotal, currency)}</span>
              </div>
            </div>
            
            <Link 
              to="/checkout" 
              onClick={onClose}
              className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center gap-2 font-bold hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all active:scale-[0.98] shadow-lg"
            >
              Checkout <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </motion.div>
    </>
  );
}
