import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowDown, SlidersHorizontal, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import QuickView from '../components/QuickView';
import { Product, Currency } from '../types';

interface HomeProps {
  addToCart: (p: Product) => void;
  wishlist: Product[];
  toggleWishlist: (p: Product) => void;
  compareList: Product[];
  toggleCompare: (p: Product) => void;
  currency: Currency;
}

export default function Home({ addToCart, wishlist, toggleWishlist, compareList, toggleCompare, currency }: HomeProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const sortOptions = [
    { id: 'featured', label: 'Featured' },
    { id: 'price-asc', label: 'Price: Low to High' },
    { id: 'price-desc', label: 'Price: High to Low' },
    { id: 'name-asc', label: 'Name: A-Z' },
  ];

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const sortedProducts = useMemo(() => {
    let result = [...products];
    if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'name-asc') result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [products, sortBy]);

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  return (
    <div className="pb-20">
      <QuickView 
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        addToCart={addToCart}
        currency={currency}
      />
      {/* Hero Section */}
      <section className="py-20 mb-12">
        <div className="flex flex-col items-start gap-6 max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 text-xs font-bold uppercase tracking-widest"
          >
            <Sparkles size={14} /> New Arrivals 2026
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter leading-tight dark:text-white"
          >
            Essentials for the <br />
            <span className="text-neutral-400 dark:text-neutral-600">Modern Lifestyle.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-neutral-500 dark:text-neutral-400 max-w-xl"
          >
            Explore our curated collection of high-performance gear, lifestyle accessories, 
            and home essentials designed to elevate your daily routine.
          </motion.p>
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.4 }}
             className="pt-4"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-400 dark:text-neutral-600">
              Scroll to explore <ArrowDown size={14} className="animate-bounce" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Sort & Filter Header */}
      <section className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-100 dark:border-neutral-900">
        <div className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">
          Showing {sortedProducts.length} Products
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setIsSortOpen(!isSortOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-50 dark:bg-neutral-900 border border-transparent dark:border-neutral-800 rounded-full text-xs font-bold hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors dark:text-white"
          >
            <SlidersHorizontal size={14} />
            Sorting: {sortOptions.find(o => o.id === sortBy)?.label}
            <ChevronDown size={14} className={`transition-transform duration-200 ${isSortOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isSortOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-48 bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl shadow-xl z-20 overflow-hidden p-1"
              >
                {sortOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => {
                      setSortBy(option.id);
                      setIsSortOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                      sortBy === option.id ? 'bg-black dark:bg-white text-white dark:text-black' : 'hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Product List */}
      <section id="shop" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse flex flex-col gap-4">
              <div className="aspect-[4/5] bg-neutral-100 dark:bg-neutral-900 rounded-xl" />
              <div className="h-4 bg-neutral-100 dark:bg-neutral-900 rounded w-3/4" />
              <div className="h-4 bg-neutral-100 dark:bg-neutral-900 rounded w-1/4" />
            </div>
          ))
        ) : (
          sortedProducts.map((product, index) => (
            <ProductCard 
              key={`${product.id}-${sortBy}`} 
              product={product} 
              addToCart={addToCart} 
              toggleWishlist={toggleWishlist}
              isWishlisted={wishlist.some(p => p.id === product.id)}
              toggleCompare={toggleCompare}
              isCompared={compareList.some(p => p.id === product.id)}
              onQuickView={handleQuickView}
              currency={currency}
              index={index}
            />
          ))
        )}
      </section>
    </div>
  );
}
