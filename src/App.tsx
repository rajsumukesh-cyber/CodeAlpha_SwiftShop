/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import Wishlist from './pages/Wishlist';
import Compare from './pages/Compare';
import Profile from './pages/Profile';
import CartDrawer from './components/CartDrawer';
import { Product, CartItem, UserProfile, Currency } from './types';
import { Scale, X, ArrowRight } from 'lucide-react';
import { CURRENCIES } from './lib/currency';

export default function App() {
  const location = useLocation();
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem('currency');
    return saved ? JSON.parse(saved) : CURRENCIES.INR;
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'light';
  });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    const saved = localStorage.getItem('wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('user-profile');
    return saved ? JSON.parse(saved) : {
      name: 'Mukesh Rajsu',
      email: 'rajsumukesh@gmail.com',
      addresses: ['123 Innovation Drive, Bangalore, KA 560001, India']
    };
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('currency', JSON.stringify(currency));
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('user-profile', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      return [...prev, product];
    });
  };

  const toggleCompare = (product: Product) => {
    setCompareList(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      if (prev.length >= 4) return prev; // Limit to 4 products
      return [...prev, product];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const clearCart = () => setCart([]);

  return (
    <div className="min-h-screen font-sans selection:bg-neutral-200 dark:bg-neutral-950 dark:text-white transition-colors duration-300">
      <Header 
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} 
        wishlistCount={wishlist.length}
        compareCount={compareList.length}
        currency={currency}
        onCurrencyChange={setCurrency}
        theme={theme}
        onThemeToggle={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
        onOpenCart={() => setIsCartOpen(true)} 
      />
      
      <main className="pt-20 px-4 md:px-8 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Routes location={location}>
              <Route path="/" element={
                <Home 
                  addToCart={addToCart} 
                  wishlist={wishlist} 
                  toggleWishlist={toggleWishlist} 
                  compareList={compareList}
                  toggleCompare={toggleCompare}
                  currency={currency}
                />
              } />
              <Route path="/product/:id" element={
                <ProductDetails 
                  addToCart={addToCart} 
                  wishlist={wishlist} 
                  toggleWishlist={toggleWishlist} 
                  compareList={compareList}
                  toggleCompare={toggleCompare}
                  currency={currency}
                />
              } />
              <Route path="/wishlist" element={
                <Wishlist 
                  wishlist={wishlist} 
                  toggleWishlist={toggleWishlist} 
                  addToCart={addToCart}
                  compareList={compareList}
                  toggleCompare={toggleCompare}
                  currency={currency}
                />
              } />
              <Route path="/compare" element={
                <Compare 
                  compareList={compareList} 
                  toggleCompare={toggleCompare} 
                  addToCart={addToCart}
                  currency={currency}
                />
              } />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={
                <Profile 
                  user={user} 
                  onUpdate={setUser} 
                />
              } />
              <Route 
                path="/checkout" 
                element={<Checkout cart={cart} clearCart={clearCart} currency={currency} />} 
              />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer 
            isOpen={isCartOpen} 
            onClose={() => setIsCartOpen(false)} 
            cart={cart}
            updateQuantity={updateQuantity}
            removeFromCart={removeFromCart}
            currency={currency}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {compareList.length > 0 && location.pathname !== '/compare' && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 w-[90vw] max-w-2xl"
          >
            <div className="bg-black dark:bg-white text-white dark:text-black rounded-full px-6 py-3 flex items-center justify-between shadow-2xl shadow-black/20 gap-4">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {compareList.map(p => (
                    <div key={p.id} className="relative group">
                      <img 
                        src={p.image} 
                        alt="" 
                        className="w-10 h-10 rounded-full border-2 border-black dark:border-white object-cover"
                      />
                      <button 
                        onClick={() => toggleCompare(p)}
                        className="absolute -top-1 -right-1 bg-white dark:bg-black text-black dark:text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={10} strokeWidth={3} />
                      </button>
                    </div>
                  ))}
                </div>
                <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Compare Mode ({compareList.length}/4)</span>
              </div>
              <Link 
                to="/compare"
                className="bg-white dark:bg-black text-black dark:text-white px-6 py-2 rounded-full text-xs font-bold flex items-center gap-2 hover:scale-105 transition-transform"
              >
                Compare <ArrowRight size={14} />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="mt-20 py-12 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <h2 className="text-xl font-bold tracking-tight mb-4 text-black dark:text-white">SwiftShop</h2>
            <p className="text-neutral-500 dark:text-neutral-400 max-w-md">
              Crafting premium experiences for the modern explorer. Our products are designed with 
              precision and sustainability in mind.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-xs uppercase tracking-widest text-neutral-400">Links</h3>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400 font-medium">
              <li><Link to="/" className="hover:text-black dark:hover:text-white transition-colors">Shop</Link></li>
              <li><Link to="/orders" className="hover:text-black dark:hover:text-white transition-colors">Orders</Link></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Journal</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4 text-xs uppercase tracking-widest text-neutral-400">Social</h3>
            <ul className="space-y-2 text-neutral-600 dark:text-neutral-400 font-medium">
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Instagram</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">Twitter</a></li>
              <li><a href="#" className="hover:text-black dark:hover:text-white transition-colors">LinkedIn</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-neutral-400">© 2026 SwiftShop E-Commerce. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
