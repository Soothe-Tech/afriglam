import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import { storeApi } from '../services/storeApi';
import { useAuth } from '../contexts/AuthContext';

const Feed: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const categories = ['All', 'Wigs', 'Braids', 'Makeup', 'Extensions', 'Skincare', 'Fragrance'];

  React.useEffect(() => {
    setLoading(true);
    setError('');
    storeApi
      .getProducts('all')
      .then((result) => setProducts(result))
      .catch(() => setError('Unable to load the featured catalog right now.'))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter((product) => product.category.toLowerCase().includes(activeCategory.toLowerCase()));

  const displayName =
    [user?.user_metadata?.full_name, user?.user_metadata?.name].filter(Boolean)[0] ??
    (user?.email ? user.email.split('@')[0] : null) ??
    'there';

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8 space-y-12 animate-fadeIn">
      <section className="flex flex-col gap-1">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary dark:text-white">
          Good morning, {displayName} <span className="inline-block animate-pulse">Hello</span>
        </h2>
        <p className="text-gray-500 dark:text-gray-400">Discover today&apos;s curated luxury essentials.</p>
      </section>

      <section className="relative w-full rounded-2xl overflow-hidden shadow-2xl group cursor-pointer h-[500px] md:h-[600px]">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-slate-800 dark:from-primary/80 dark:via-slate-900 dark:to-slate-950 transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3 lg:w-1/2 flex flex-col items-start gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-mono tracking-wider uppercase">
            <span className="material-symbols-outlined text-sm">local_shipping</span> Free Delivery
          </div>
          <h2 className="font-serif text-5xl md:text-6xl text-white leading-[1.1] drop-shadow-lg">The New Ankara Collection</h2>
          <p className="text-white/90 text-lg md:text-xl font-light max-w-md">
            Vibrant patterns meeting luxury skincare. Experience the fusion of tradition and modern beauty.
          </p>
          <Link to="/products/Braids" className="mt-4 px-8 py-4 bg-white text-primary rounded-full font-bold text-sm tracking-widest uppercase hover:bg-gray-100 transition-colors shadow-lg">
            Shop The Collection
          </Link>
        </div>
      </section>

      <section className="w-full overflow-x-auto hide-scrollbar pb-2">
        <div className="flex gap-4 min-w-max px-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full text-sm transition-transform hover:scale-105 shadow-md ${
                activeCategory === cat
                  ? 'bg-primary text-white shadow-primary/20'
                  : 'bg-white dark:bg-gray-800 text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:text-primary dark:hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between border-b border-gray-200 dark:border-gray-800 pb-4 mb-8">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Trending Now</h2>
          <Link to="/products/all" className="text-primary dark:text-admin-primary font-medium hover:underline flex items-center gap-1">
            View All <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>

        {loading && <p className="text-slate-500">Loading featured products...</p>}
        {error && <p className="text-sm text-red-500">{error}</p>}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 dark:border-white/10 p-10 text-center text-slate-500">
            No products are available in this category yet.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group flex flex-col gap-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                {product.isNew && <span className="absolute top-3 left-3 z-10 bg-primary text-white text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-sm">New</span>}
                {product.isSale && <span className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-sm">Sale</span>}
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center" aria-hidden>
                    <span className="material-symbols-outlined text-4xl text-slate-400">image</span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Link to={`/product/${product.id}`} className="block w-full py-3 bg-white text-primary text-center rounded-lg font-bold text-sm hover:bg-gray-50 shadow-lg">
                    View Details
                  </Link>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-medium text-slate-900 dark:text-white leading-tight">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
                <div className="pt-2 font-mono text-primary dark:text-admin-primary font-bold">
                  NGN {product.price_ngn.toLocaleString()} <span className="text-gray-400 font-normal text-xs mx-1">/</span> {product.price_pln} PLN
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-primary dark:bg-background-dark border border-white/10 overflow-hidden relative isolate">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: '24px 24px' }}></div>
        <div className="p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-mono tracking-wider uppercase">
              <span className="material-symbols-outlined text-sm">stars</span> Premium Service
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight">Expert Styling,<br />At Your Doorstep</h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto lg:mx-0">
              Book a professional stylist for your next event or personal makeover. Available in Lagos and Warsaw.
            </p>
            <button onClick={() => navigate('/book-stylist')} className="inline-flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-xl">
              <span>Book a Stylist</span>
              <span className="material-symbols-outlined">calendar_month</span>
            </button>
          </div>
          <div className="flex-1 flex justify-center lg:justify-end gap-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-xl -rotate-6 transform hover:rotate-0 transition-transform duration-300 w-48 flex flex-col items-center justify-center min-h-[200px]">
              <span className="material-symbols-outlined text-6xl text-primary dark:text-admin-primary">style</span>
              <p className="mt-3 font-bold text-slate-900 dark:text-white">Our stylists</p>
              <p className="text-xs text-gray-500 dark:text-slate-400">Expert styling</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Feed;
