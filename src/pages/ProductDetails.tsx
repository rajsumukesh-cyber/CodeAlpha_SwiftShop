import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ShoppingBag, Check, ShieldCheck, Truck, RefreshCw, Star, MessageSquarePlus, User, Heart, Scale, Sparkles, ChevronRight } from 'lucide-react';
import { Product, Review, Currency } from '../types';
import { getRecommendations, summarizeReviews } from '../services/aiService';
import { formatPrice } from '../lib/currency';

interface ProductDetailsProps {
  addToCart: (p: Product) => void;
  wishlist: Product[];
  toggleWishlist: (p: Product) => void;
  compareList: Product[];
  toggleCompare: (p: Product) => void;
  currency: Currency;
}

export default function ProductDetails({ addToCart, wishlist, toggleWishlist, compareList, toggleCompare, currency }: ProductDetailsProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [recsLoading, setRecsLoading] = useState(false);
  const [reviewSummary, setReviewSummary] = useState<string>('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  
  // Review Form State
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchProduct = () => {
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
        // Once product is loaded, fetch recommendations and summary
        fetchRecommendations(data);
        if (data.reviews && data.reviews.length > 0) {
          fetchReviewSummary(data.reviews);
        } else {
          setReviewSummary('');
        }
      });
  };

  const fetchReviewSummary = async (reviews: Review[]) => {
    setSummaryLoading(true);
    try {
      const summary = await summarizeReviews(reviews);
      setReviewSummary(summary);
    } catch (err) {
      console.error('Failed to summarize reviews:', err);
    } finally {
      setSummaryLoading(false);
    }
  };

  const fetchRecommendations = async (current: Product) => {
    setRecsLoading(true);
    try {
      const res = await fetch('/api/products');
      const all: Product[] = await res.json();
      const recs = await getRecommendations(current, all);
      setRecommendations(recs);
    } catch (err) {
      console.error('Failed to load recommendations:', err);
    } finally {
      setRecsLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!product) return <div className="h-screen flex items-center justify-center">Product not found</div>;

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          userName: reviewName,
          rating: reviewRating,
          comment: reviewComment
        })
      });

      if (response.ok) {
        setReviewName('');
        setReviewRating(5);
        setReviewComment('');
        fetchProduct(); // Refresh reviews
      }
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const averageRating = product.reviews?.length 
    ? (product.reviews.reduce((acc, rev) => acc + rev.rating, 0) / product.reviews.length).toFixed(1)
    : '0';

  return (
    <div className="pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm font-semibold text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft size={16} /> Back to Shop
        </button>

        <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
          <Link to="/" className="hover:text-black dark:hover:text-white transition-colors">Home</Link>
          <ChevronRight size={10} className="text-neutral-300" />
          <span className="hover:text-black dark:hover:text-white transition-colors cursor-pointer">{product.category}</span>
          <ChevronRight size={10} className="text-neutral-300" />
          <span className="text-neutral-800 dark:text-neutral-200">{product.name}</span>
        </nav>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative aspect-square bg-neutral-100 dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl shadow-neutral-200 dark:shadow-black/50 group cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
        >
          <img 
            src={product.image} 
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out"
            style={{ 
              transform: zoom ? 'scale(2)' : 'scale(1)',
              transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`
            }}
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-6 left-6 flex gap-2">
            {product.inStock === false && (
              <span className="px-3 py-1.5 bg-red-500 text-white text-xs font-black uppercase tracking-widest rounded-lg shadow-xl animate-pulse">
                Sold Out
              </span>
            )}
          </div>
          <button 
            onClick={() => toggleWishlist(product)}
            className={`absolute top-6 right-6 p-3 rounded-full backdrop-blur-md transition-all active:scale-90 shadow-lg ${
              wishlist.some(p => p.id === product.id) 
              ? 'bg-red-500 text-white' 
              : 'bg-white/80 dark:bg-neutral-800/80 text-neutral-400 dark:text-neutral-500 hover:text-red-500 dark:hover:text-red-400'
            }`}
          >
            <Heart size={20} className={wishlist.some(p => p.id === product.id) ? 'fill-current' : ''} />
          </button>
        </motion.div>

        <div className="flex flex-col gap-8">
          <div className={product.inStock === false ? 'opacity-70' : ''}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-sm font-bold dark:text-neutral-300">
                <Star size={14} className="fill-black text-black dark:fill-white dark:text-white" />
                <span>{averageRating}</span>
                <span className="text-neutral-400 font-medium">({product.reviews?.length || 0})</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 dark:text-white">{product.name}</h1>
            <p className="text-2xl font-mono font-bold text-neutral-900 dark:text-white">{formatPrice(product.price, currency)}</p>
          </div>

          <p className={`text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed ${product.inStock === false ? 'opacity-70' : ''}`}>
            {product.description}
          </p>

          <div className={`flex flex-col gap-4 ${product.inStock === false ? 'opacity-70' : ''}`}>
            <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-400">Key Features</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.highlights.map((h, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <div className="w-1.5 h-1.5 bg-black dark:bg-white rounded-full" /> {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={handleAddToCart}
                disabled={added || product.inStock === false}
                className={`flex-grow py-4 rounded-full flex items-center justify-center gap-2 text-lg font-bold transition-all shadow-lg ${
                  product.inStock === false
                  ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400 cursor-not-allowed border-2 border-neutral-200 dark:border-neutral-700 shadow-none'
                  : added 
                    ? 'bg-green-500 text-white' 
                    : 'bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 active:scale-95'
                }`}
              >
                {product.inStock === false ? 'Currently Sold Out' : added ? (
                  <><Check size={20} /> Added to Cart</>
                ) : (
                  <><ShoppingBag size={20} /> Add to Cart</>
                )}
              </button>

              <button 
                onClick={() => toggleCompare(product)}
                className={`px-8 py-4 rounded-full flex items-center justify-center gap-2 font-bold transition-all border-2 shadow-sm ${
                  compareList.some(p => p.id === product.id)
                  ? 'bg-black dark:bg-white border-black dark:border-white text-white dark:text-black'
                  : 'bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 hover:border-black dark:hover:border-white text-black dark:text-white'
                }`}
              >
                {compareList.some(p => p.id === product.id) ? (
                  <><Check size={20} /> Added to Compare</>
                ) : (
                  <><Scale size={20} /> Compare</>
                )}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 py-4 border-y border-neutral-100 dark:border-neutral-800 mt-4">
              <div className="flex flex-col items-center gap-2 text-center">
                <Truck size={18} className="text-neutral-400" />
                <span className="text-[10px] font-bold uppercase tracking-tighter dark:text-neutral-500">Fast Shipping</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center border-x border-neutral-100 dark:border-neutral-800">
                <ShieldCheck size={18} className="text-neutral-400" />
                <span className="text-[10px] font-bold uppercase tracking-tighter dark:text-neutral-500">Secured Data</span>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <RefreshCw size={18} className="text-neutral-400" />
                <span className="text-[10px] font-bold uppercase tracking-tighter dark:text-neutral-500">Free Returns</span>
              </div>
            </div>

            {/* Social Sharing */}
            <div className="pt-6 flex flex-col gap-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-neutral-400">
                Share this product
              </div>
              <div className="flex flex-wrap gap-3">
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all active:scale-95 shadow-sm"
                  title="Share on Facebook"
                >
                  <span className="font-bold text-lg">f</span>
                </a>
                <a 
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(`Check out this ${product.name}!`)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all active:scale-95 shadow-sm"
                  title="Share on Twitter"
                >
                  <span className="font-bold text-lg">𝕏</span>
                </a>
                <a 
                  href={`https://pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(product.image)}&description=${encodeURIComponent(product.description)}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all active:scale-95 shadow-sm"
                  title="Share on Pinterest"
                >
                  <span className="font-bold text-lg">P</span>
                </a>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    // Add a temporary subtle feedback if needed, but keeping it simple for now
                  }}
                  className="flex items-center gap-2 px-4 h-10 rounded-full bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all active:scale-95 shadow-sm"
                >
                  <RefreshCw size={14} className="rotate-45" /> Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="mt-32 pt-20 border-t border-neutral-100 dark:border-neutral-800">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
          <div className="lg:col-span-4">
            <div className="sticky top-24">
              <h2 className="text-3xl font-bold tracking-tight mb-4 text-black dark:text-white">Customer Reviews</h2>
              <div className="flex items-center gap-4 mb-8">
                <div className="text-5xl font-black dark:text-white">{averageRating}</div>
                <div className="flex flex-col">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={16} className={`${s <= Math.round(Number(averageRating)) ? 'fill-black text-black dark:fill-white dark:text-white' : 'text-neutral-200 dark:text-neutral-700'}`} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">Based on {product.reviews?.length || 0} reviews</span>
                </div>
              </div>

              {/* Review Form */}
              <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-100 dark:border-neutral-800">
                <h3 className="font-bold text-sm mb-4 flex items-center gap-2 dark:text-white">
                  <MessageSquarePlus size={18} /> Share your thoughts
                </h3>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1 block">Your Name</label>
                    <input 
                      required
                      type="text" 
                      value={reviewName}
                      onChange={e => setReviewName(e.target.value)}
                      placeholder="e.g. John D."
                      className="w-full p-3 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:border-black dark:focus:border-white transition-colors dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1 block">Rating</label>
                    <div className="flex gap-2 p-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl">
                      {[1, 2, 3, 4, 5].map(num => (
                        <button 
                          key={num}
                          type="button"
                          onClick={() => setReviewRating(num)}
                          className={`flex-grow py-1 rounded transition-colors ${reviewRating === num ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-1 block">Comment</label>
                    <textarea 
                      required
                      value={reviewComment}
                      onChange={e => setReviewComment(e.target.value)}
                      placeholder="What did you like about this product?"
                      className="w-full p-3 text-sm bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl focus:outline-none focus:border-black dark:focus:border-white transition-colors min-h-[100px] resize-none dark:text-white"
                    />
                  </div>
                  <button 
                    disabled={submittingReview}
                    className="w-full py-3 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors disabled:opacity-50 active:scale-95 shadow-lg"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="space-y-12">
              {/* AI Summary Card */}
              {product.reviews && product.reviews.length > 0 && (
                <div className="bg-black dark:bg-white text-white dark:text-black rounded-3xl p-8 mb-16 relative overflow-hidden group shadow-2xl">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                    <Sparkles size={120} />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/50 dark:text-black/50 mb-4">
                      <Sparkles size={14} className="text-white dark:text-black" />
                      AI Insights
                    </div>
                    <h3 className="text-2xl font-bold tracking-tight mb-4">Review Summary</h3>
                    {summaryLoading ? (
                      <div className="space-y-2">
                        <div className="h-4 w-full bg-white/10 dark:bg-black/10 rounded animate-pulse" />
                        <div className="h-4 w-5/6 bg-white/10 dark:bg-black/10 rounded animate-pulse" />
                        <div className="h-4 w-4/6 bg-white/10 dark:bg-black/10 rounded animate-pulse" />
                      </div>
                    ) : (
                      <p className="text-lg leading-relaxed text-white/90 dark:text-black/90 italic">
                        "{reviewSummary || "No summary available."}"
                      </p>
                    )}
                  </div>
                </div>
              )}

              <AnimatePresence>
                {!product.reviews?.length ? (
                  <div className="py-12 text-center text-neutral-400 border-2 border-dashed border-neutral-100 rounded-3xl">
                    No reviews yet. Be the first to share your experience!
                  </div>
                ) : (
                  product.reviews.map((rev, i) => (
                    <motion.div 
                      key={rev.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex flex-col gap-4 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center text-neutral-500">
                            <User size={20} />
                          </div>
                          <div>
                            <div className="font-bold text-sm dark:text-white">{rev.userName}</div>
                            <div className="text-[10px] text-neutral-400 font-medium">{new Date(rev.createdAt).toLocaleDateString()}</div>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} size={12} className={`${s <= rev.rating ? 'fill-black text-black dark:fill-white dark:text-white' : 'text-neutral-200 dark:text-neutral-700'}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed italic">"{rev.comment}"</p>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Section */}
      <section className="mt-32 pt-20 border-t border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">
              <Sparkles size={14} className="text-black dark:text-white" />
              Tailored for you
            </div>
            <h2 className="text-4xl font-bold tracking-tight dark:text-white">Recommended for You</h2>
          </div>
        </div>

        {recsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="aspect-[4/5] bg-neutral-50 dark:bg-neutral-800 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {recommendations.map((rec, i) => (
              <motion.div 
                key={rec.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group flex flex-col gap-4"
              >
                <div className="relative aspect-[4/5] bg-neutral-50 dark:bg-neutral-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl dark:hover:shadow-black transition-all duration-500">
                  <img 
                    src={rec.image} 
                    alt={rec.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <button 
                      onClick={() => navigate(`/product/${rec.id}`)}
                      className="w-full py-3 bg-white dark:bg-neutral-900 text-black dark:text-white font-bold text-sm rounded-2xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-transform"
                    >
                      View Product
                    </button>
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{rec.category}</span>
                    <span className="font-mono font-bold text-sm dark:text-white">{formatPrice(rec.price, currency)}</span>
                  </div>
                  <h3 className="font-bold text-neutral-800 dark:text-neutral-200 line-clamp-1 group-hover:text-black dark:group-hover:text-white transition-colors">{rec.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
