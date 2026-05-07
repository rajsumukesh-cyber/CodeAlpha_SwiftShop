import { motion, AnimatePresence } from 'motion/react';
import { X, Scale, Info, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product, Currency } from '../types';
import { formatPrice } from '../lib/currency';

interface CompareProps {
  compareList: Product[];
  toggleCompare: (p: Product) => void;
  addToCart: (p: Product) => void;
  currency: Currency;
}

export default function Compare({ compareList, toggleCompare, addToCart, currency }: CompareProps) {
  // Get all unique spec keys across all products in the compare list
  const allSpecKeys = Array.from(new Set(
    compareList.flatMap(p => Object.keys(p.specs || {}))
  ));

  if (compareList.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 bg-neutral-50 dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 p-8 text-center">
        <div className="w-20 h-20 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center text-neutral-300 dark:text-neutral-600 shadow-sm">
          <Scale size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2 dark:text-white">Compare Products</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8 max-w-md mx-auto">
            You haven't added any products to compare yet. Add items from the shop to see their specs side-by-side.
          </p>
          <Link to="/" className="px-8 py-3 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-bold hover:scale-105 transition-transform active:scale-95 shadow-lg">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2 dark:text-white">Comparison</h1>
          <p className="text-neutral-500 dark:text-neutral-400">Analyze specifications side-by-side to find the best fit for you.</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-bold text-neutral-400 uppercase tracking-widest">
          <Info size={14} />
          {compareList.length} {compareList.length === 1 ? 'Product' : 'Products'} selected
        </div>
      </div>

      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <div className="inline-flex min-w-full">
          {/* Header Column (Visible on Desktop) */}
          <div className="hidden lg:block w-64 flex-shrink-0 sticky left-0 z-20 bg-white dark:bg-neutral-950 pr-4 transition-colors">
            <div className="h-48 border-b border-neutral-100 dark:border-neutral-800 flex items-end pb-4">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Features & Price</span>
            </div>
            <div className="pt-8 space-y-8">
              <div className="h-12 flex items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Price</span>
              </div>
              <div className="h-12 flex items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Category</span>
              </div>
              <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300 dark:text-neutral-700">Technical Details</span>
              </div>
              {allSpecKeys.map(key => (
                <div key={key} className="h-12 flex items-center">
                  <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">{key}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Columns */}
          <div className="flex gap-4 flex-grow">
            {compareList.map((product, index) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="w-72 md:w-80 flex-shrink-0 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm p-6 relative overflow-hidden"
              >
                <button 
                  onClick={() => toggleCompare(product)}
                  className="absolute top-4 right-4 p-2 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 rounded-full transition-colors z-10"
                >
                  <X size={16} />
                </button>

                <div className="h-44 mb-6 relative group">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover rounded-2xl shadow-inner transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/5 dark:bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl" />
                </div>

                <div className="mb-8 h-24">
                  <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-2 dark:text-white">{product.name}</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">{product.description}</p>
                </div>

                {/* Mobile Labels + Values */}
                <div className="space-y-8">
                  <div className="h-12 flex flex-col justify-center border-t border-neutral-50 dark:border-neutral-800 lg:border-none">
                    <span className="lg:hidden text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300 dark:text-neutral-700 mb-1">Price</span>
                    <span className="font-mono font-bold text-lg dark:text-white">{formatPrice(product.price, currency)}</span>
                  </div>
                  
                  <div className="h-12 flex flex-col justify-center border-t border-neutral-50 dark:border-neutral-800 lg:border-none">
                    <span className="lg:hidden text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300 dark:text-neutral-700 mb-1">Category</span>
                    <span className="text-xs font-bold bg-neutral-100 dark:bg-neutral-800 px-3 py-1 rounded-full text-neutral-600 dark:text-neutral-400 self-start">
                      {product.category}
                    </span>
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800">
                    <span className="lg:hidden text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Specifications</span>
                  </div>

                  {allSpecKeys.map(key => (
                    <div key={key} className="h-12 flex flex-col justify-center border-t border-neutral-50 dark:border-neutral-800 lg:border-none">
                      <span className="lg:hidden text-[10px] font-black uppercase tracking-[0.2em] text-neutral-300 dark:text-neutral-700 mb-1">{key}</span>
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {product.specs?.[key] || <span className="text-neutral-300 dark:text-neutral-700">—</span>}
                      </span>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => addToCart(product)}
                  className="w-full mt-12 py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform shadow-xl shadow-black/10"
                >
                  <ShoppingBag size={18} />
                  Add to Cart
                </button>
              </motion.div>
            ))}

            {/* Placeholder to encourage adding more */}
            {compareList.length < 3 && (
              <Link 
                to="/"
                className="w-72 md:w-80 flex-shrink-0 border-2 border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl flex flex-col items-center justify-center gap-4 text-neutral-400 dark:text-neutral-600 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white transition-all group"
              >
                <div className="w-12 h-12 rounded-full border-2 border-neutral-100 dark:border-neutral-800 flex items-center justify-center group-hover:bg-black dark:group-hover:bg-white group-hover:text-white dark:group-hover:text-black transition-colors">
                  <Scale size={20} />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest">Add product to compare</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
