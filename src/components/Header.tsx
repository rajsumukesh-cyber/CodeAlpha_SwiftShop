import { ShoppingCart, Search, Menu, User, Heart, Scale, Globe, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Currency, CurrencyCode } from '../types';
import { useState } from 'react';
import { CURRENCIES } from '../lib/currency';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  compareCount: number;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  theme: 'light' | 'dark';
  onThemeToggle: () => void;
  onOpenCart: () => void;
}

export default function Header({ 
  cartCount, 
  wishlistCount, 
  compareCount, 
  currency, 
  onCurrencyChange, 
  theme,
  onThemeToggle,
  onOpenCart 
}: HeaderProps) {
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-4 md:px-8 py-4">
      <nav className="max-w-7xl mx-auto flex items-center justify-between glass-morphism dark:bg-neutral-900/80 dark:border-neutral-800 rounded-full px-6 py-3 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold tracking-tighter hover:opacity-70 transition-opacity dark:text-white">
            SWIFTSHOP
          </Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-500 dark:text-neutral-400">
            <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">Shop</Link>
            <Link to="/orders" className="hover:text-black dark:hover:text-white transition-colors">Orders</Link>
            <Link to="/compare" className="hover:text-black dark:hover:text-white transition-colors">Compare</Link>
            <Link to="/profile" className="hover:text-black dark:hover:text-white transition-colors">Profile</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onThemeToggle}
            className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-neutral-600 dark:text-neutral-400"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <div className="relative">
            <button 
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="flex items-center gap-1.5 p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors text-xs font-black uppercase tracking-widest text-neutral-600 dark:text-neutral-400"
            >
              <Globe size={16} />
              {currency.code}
            </button>
            <AnimatePresence>
              {isCurrencyOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-2 bg-white dark:bg-neutral-900 rounded-xl shadow-xl border border-neutral-100 dark:border-neutral-800 p-1 min-w-[100px] z-50"
                >
                  {(Object.keys(CURRENCIES) as CurrencyCode[]).map(code => (
                    <button
                      key={code}
                      onClick={() => {
                        onCurrencyChange(CURRENCIES[code]);
                        setIsCurrencyOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                        currency.code === code ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                      }`}
                    >
                      {CURRENCIES[code].symbol} {code}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-neutral-600 dark:text-neutral-400">
            <Search size={20} />
          </button>
          
          <Link to="/compare" className="relative p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-neutral-600 dark:text-neutral-400 hidden sm:block">
            <Scale size={20} />
            {compareCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-black dark:bg-white rounded-full border border-white dark:border-black" />
            )}
          </Link>

          <Link to="/wishlist" className="relative p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-neutral-600 dark:text-neutral-400">
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-black" />
            )}
          </Link>

          <Link to="/profile" className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-neutral-600 dark:text-neutral-400 hidden sm:block">
            <User size={20} />
          </Link>
          <button 
            onClick={onOpenCart}
            className="group relative flex items-center gap-2 p-1 pl-3 bg-black dark:bg-white text-white dark:text-black rounded-full hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all active:scale-95 shadow-lg"
          >
            <span className="text-xs font-semibold">{cartCount}</span>
            <div className="p-2 bg-white/20 dark:bg-black/10 rounded-full">
              <ShoppingCart size={18} />
            </div>
            {cartCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-neutral-900"
              />
            )}
          </button>
          <button className="md:hidden p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors text-neutral-600 dark:text-neutral-400">
            <Menu size={20} />
          </button>
        </div>
      </nav>
    </header>
  );
}
