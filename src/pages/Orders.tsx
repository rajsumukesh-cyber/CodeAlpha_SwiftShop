import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, Calendar, Clock, ChevronRight, ShoppingBag, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Order } from '../types';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/orders')
      .then(res => res.json())
      .then(data => {
        setOrders(data.sort((a: Order, b: Order) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ));
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <div className="flex flex-col gap-2 mb-12">
        <h1 className="text-4xl font-bold tracking-tight dark:text-white">Your Orders</h1>
        <p className="text-neutral-500 dark:text-neutral-400">History and status of your recent purchases.</p>
      </div>

      {orders.length === 0 ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center gap-6 bg-neutral-50 dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800">
          <div className="w-16 h-16 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center text-neutral-300 dark:text-neutral-600">
            <Package size={24} />
          </div>
          <div className="text-center">
            <h2 className="font-bold text-lg mb-1 dark:text-white">No orders yet</h2>
            <p className="text-sm text-neutral-400 dark:text-neutral-500 mb-6">Looks like you haven't placed any orders yet.</p>
            <Link to="/" className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-bold hover:scale-105 transition-transform active:scale-95 shadow-lg">
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="minimal-card p-6 md:p-8"
            >
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex flex-col gap-4 flex-grow">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-mono text-sm font-bold bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-300 px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">
                      {order.id}
                    </span>
                    <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded shadow-sm ${
                      order.status === 'delivered' ? 'bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-400' : 'bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400'
                    }`}>
                      {order.status}
                    </span>
                    {JSON.parse(localStorage.getItem('orderHistory') || '[]').includes(order.id) && (
                      <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 flex items-center gap-1 shadow-sm">
                        <User size={10} /> Your Order
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 tracking-widest flex items-center gap-1">
                        <Calendar size={10} /> Date
                      </span>
                      <span className="text-sm font-medium dark:text-neutral-200">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 tracking-widest flex items-center gap-1">
                        <ShoppingBag size={10} /> Items
                      </span>
                      <span className="text-sm font-medium dark:text-neutral-200">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} units
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 dark:text-neutral-500 tracking-widest">Total</span>
                      <span className="text-sm font-mono font-bold dark:text-white">₹{order.total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex -space-x-3 overflow-hidden">
                    {order.items.slice(0, 3).map((item, i) => (
                      <div key={i} className="inline-block h-12 w-12 rounded-full ring-4 ring-white dark:ring-neutral-900 bg-neutral-100 dark:bg-neutral-800 overflow-hidden border border-neutral-200 dark:border-neutral-700">
                        <img src={item.image} alt="" className="h-full w-full object-cover" />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800 ring-4 ring-white dark:ring-neutral-900 border border-neutral-200 dark:border-neutral-700 text-[10px] font-bold dark:text-white">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                  <ChevronRight size={20} className="text-neutral-300 dark:text-neutral-700" />
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-800 flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500">
                  <Clock size={14} /> Estimated Delivery: 3-5 Business Days
                </div>
                <button className="text-xs font-bold uppercase tracking-widest text-black dark:text-white hover:underline underline-offset-4">
                  Track Shipment
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
