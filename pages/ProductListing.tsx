import React, { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import type { Product } from '../types';
import { storeApi } from '../services/storeApi';

const ProductListing: React.FC = () => {
  const { category = 'all' } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError('');
    storeApi
      .getProducts(category)
      .then((result) => {
        if (mounted) setProducts(result);
      })
      .catch(() => {
        if (mounted) setError('Unable to load products right now.');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [category]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return products;
    return products.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.sku.toLowerCase().includes(query)
    );
  }, [products, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-white">Products</h1>
          <p className="text-slate-500 dark:text-slate-400">
            {category === 'all' ? 'Browse all collections' : `Showing ${category} collection`}
          </p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-80 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20"
          placeholder="Search by name, category, SKU..."
          aria-label="Search products"
        />
      </div>

      {loading && <p className="text-slate-500">Loading products...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}

      {!loading && !error && filtered.length === 0 && (
        <div className="p-8 rounded-xl border border-slate-200 dark:border-white/10 text-center text-slate-500">
          No products match this filter.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <div key={product.id} className="group rounded-xl border border-slate-100 dark:border-white/10 overflow-hidden bg-white dark:bg-white/5">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full aspect-[3/4] object-cover" />
            ) : (
              <div className="w-full aspect-[3/4] bg-slate-200 dark:bg-slate-700 flex items-center justify-center" aria-hidden>
                <span className="material-symbols-outlined text-4xl text-slate-400">image</span>
              </div>
            )}
            <div className="p-4 space-y-2">
              <h3 className="font-serif text-lg text-slate-900 dark:text-white">{product.name}</h3>
              <p className="text-xs text-slate-500">{product.category}</p>
              <p className="font-mono font-bold text-primary">NGN {product.price_ngn.toLocaleString()} / {product.price_pln} PLN</p>
              <Link
                to={`/product/${product.id}`}
                className="inline-flex mt-2 px-4 py-2 rounded-full bg-primary text-white text-sm font-bold hover:bg-primary-hover transition-colors"
              >
                View Product
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListing;
