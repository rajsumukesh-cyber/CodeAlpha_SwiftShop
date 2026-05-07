import { useState } from 'react';
import { motion } from 'motion/react';
import { Heart, PackageSearch } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import QuickView from '../components/QuickView';
import { Product, Currency } from '../types';

interface WishlistProps {
  wishlist: Product[];
  toggleWishlist: (p: Product) => void;
  addToCart: (p: Product) => void;
  compareList: Product[];
  toggleCompare: (p: Product) => void;
  currency: Currency;
}

export default function Wishlist({ wishlist, toggleWishlist, addToCart, compareList, toggleCompare, currency }: WishlistProps) {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

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
      <div className="flex flex-col gap-2 mb-12">
        <h1 className="text-4xl font-bold tracking-tight dark:text-white">Your Wishlist</h1>
        <p className="text-neutral-500 dark:text-neutral-400">Items you've saved for later.</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-6 bg-neutral-50 dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800">
          <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center text-neutral-300 dark:text-neutral-600">
            <Heart size={24} />
          </div>
          <div className="text-center">
            <h2 className="font-bold text-lg mb-1 dark:text-white">Wishlist is empty</h2>
            <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-6">Start exploring to find items you love.</p>
            <Link to="/" className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-bold hover:scale-105 transition-transform active:scale-95 shadow-lg">
              Explore Products
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {wishlist.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              addToCart={addToCart} 
              toggleWishlist={toggleWishlist}
              isWishlisted={true}
              toggleCompare={toggleCompare}
              isCompared={compareList.some(p => p.id === product.id)}
              onQuickView={handleQuickView}
              currency={currency}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
}
