import { motion } from 'motion/react';
import { ShoppingBag, ArrowRight, Heart, Scale, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product, Currency } from '../types';
import { formatPrice } from '../lib/currency';

interface ProductCardProps {
  product: Product;
  addToCart: (p: Product) => void;
  toggleWishlist: (p: Product) => void;
  isWishlisted: boolean;
  toggleCompare: (p: Product) => void;
  isCompared: boolean;
  onQuickView: (p: Product) => void;
  currency: Currency;
  index: number;
  key?: string | number;
}

export default function ProductCard({ 
  product, 
  addToCart, 
  toggleWishlist, 
  isWishlisted, 
  toggleCompare,
  isCompared,
  onQuickView,
  currency,
  index 
}: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="minimal-card flex flex-col group h-full"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="px-2 py-1 bg-white/90 dark:bg-black/80 backdrop-blur text-[10px] font-bold uppercase tracking-widest rounded shadow-sm dark:text-neutral-400">
            {product.category}
          </span>
          {product.inStock === false && (
            <span className="px-2 py-1 bg-red-500 text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-sm">
              Sold Out
            </span>
          )}
        </div>
        
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button 
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all active:scale-90 shadow-sm ${
              isWishlisted ? 'bg-red-500 text-white' : 'bg-white/80 dark:bg-neutral-800/80 text-neutral-400 dark:text-neutral-500 hover:text-red-500'
            }`}
          >
            <Heart size={16} className={isWishlisted ? 'fill-current' : ''} />
          </button>

          <button 
            onClick={(e) => {
              e.preventDefault();
              toggleCompare(product);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all active:scale-90 shadow-sm ${
              isCompared ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-white/80 dark:bg-neutral-800/80 text-neutral-400 dark:text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            <Scale size={16} />
          </button>

          <button 
            onClick={(e) => {
              e.preventDefault();
              onQuickView(product);
            }}
            className="p-2 rounded-full backdrop-blur-md bg-white/80 dark:bg-neutral-800/80 text-neutral-400 dark:text-neutral-500 hover:text-black dark:hover:text-white transition-all active:scale-90 shadow-sm"
          >
            <Eye size={16} />
          </button>
        </div>

        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/50 to-transparent">
          <button 
            onClick={(e) => {
              e.preventDefault();
              if (product.inStock !== false) {
                addToCart(product);
              }
            }}
            disabled={product.inStock === false}
            className={`w-full py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-colors shadow-xl ${
              product.inStock === false 
              ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed opacity-80' 
              : 'bg-white dark:bg-black dark:text-white text-black hover:bg-neutral-100 dark:hover:bg-neutral-900'
            }`}
          >
            {product.inStock === false ? 'Sold Out' : (
              <>
                <ShoppingBag size={14} />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>
      
      <Link to={`/product/${product.id}`} className={`p-5 flex flex-col flex-grow ${product.inStock === false ? 'opacity-70' : ''}`}>
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-base font-semibold text-neutral-800 dark:text-neutral-200 line-clamp-1">{product.name}</h3>
          <p className="font-mono text-sm font-bold text-neutral-900 dark:text-white">{formatPrice(product.price, currency)}</p>
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-4 flex-grow">
          {product.description}
        </p>
        <div className="flex items-center text-xs font-bold uppercase tracking-wider text-neutral-400 group-hover:text-black dark:group-hover:text-white transition-colors">
          View Details <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </motion.div>
  );
}
