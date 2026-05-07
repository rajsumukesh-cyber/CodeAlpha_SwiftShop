import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Eye, Star, Check } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../lib/currency';
import { useState } from 'react';

interface QuickViewProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  addToCart: (p: Product) => void;
  currency: Currency;
}

export default function QuickView({ product, isOpen, onClose, addToCart, currency }: QuickViewProps) {
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 ml-0">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-4xl bg-white dark:bg-neutral-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row overflow-y-auto max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 z-10 p-2 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-md rounded-full text-neutral-500 hover:text-black dark:hover:text-white hover:scale-110 transition-all shadow-sm"
            >
              <X size={24} />
            </button>

            {/* Image Section */}
            <div className="w-full md:w-1/2 aspect-square md:aspect-auto h-full bg-neutral-50 dark:bg-neutral-800">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Content Section */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
              <div className="mb-8">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-3">
                  <Eye size={12} className="text-black dark:text-white" />
                  Quick View
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-[10px] font-black uppercase tracking-widest rounded-full dark:text-neutral-400">{product.category}</span>
                  {product.inStock === false && (
                    <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">Sold Out</span>
                  )}
                  <div className="flex items-center gap-1 text-yellow-400 ml-auto">
                    <Star size={12} fill="currentColor" />
                    <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400">4.9 (120 reviews)</span>
                  </div>
                </div>
                <h2 className={`text-3xl font-bold tracking-tight mb-4 dark:text-white ${product.inStock === false ? 'opacity-70' : ''}`}>{product.name}</h2>
                <p className={`text-2xl font-mono font-bold text-neutral-900 dark:text-white mb-6 ${product.inStock === false ? 'opacity-70' : ''}`}>{formatPrice(product.price, currency)}</p>
                <p className={`text-neutral-500 dark:text-neutral-400 leading-relaxed line-clamp-4 ${product.inStock === false ? 'opacity-70' : ''}`}>
                  {product.description}
                </p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleAddToCart}
                  disabled={added || product.inStock === false}
                  className={`w-full py-5 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${
                    product.inStock === false
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed border-2 border-neutral-200 dark:border-neutral-700 shadow-none'
                    : added 
                      ? 'bg-green-500 text-white cursor-default' 
                      : 'bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100'
                  }`}
                >
                  {product.inStock === false ? 'Out of Stock' : added ? (
                    <>
                      <Check size={20} />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={20} />
                      Add to Cart
                    </>
                  )}
                </button>
                
                <button 
                  onClick={onClose}
                  className="w-full py-4 text-sm font-bold text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                >
                  Continue Browsing
                </button>
              </div>
              
              <div className="mt-12 grid grid-cols-2 gap-4">
                <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 bg-white dark:bg-neutral-700 rounded-lg shadow-sm flex items-center justify-center text-black dark:text-white">
                    <Check size={16} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 line-clamp-1">Fast Delivery</span>
                </div>
                <div className="p-4 bg-neutral-50 dark:bg-neutral-800 rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 bg-white dark:bg-neutral-700 rounded-lg shadow-sm flex items-center justify-center text-black dark:text-white">
                    <Check size={16} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400 line-clamp-1">Free Returns</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
