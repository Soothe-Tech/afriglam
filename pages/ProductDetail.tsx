import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { storeApi } from '../services/storeApi';
import type { Product } from '../types';

const ProductDetail: React.FC = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [error, setError] = React.useState('');
  const [notice, setNotice] = React.useState('');
  const [quantity, setQuantity] = React.useState(1);
  const [selectedColor, setSelectedColor] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (!id) return;
    setError('');
    setNotice('');
    storeApi
      .getProductById(id)
      .then((result) => {
        setProduct(result ?? null);
        if (!result) setError('Product not found.');
      })
      .catch(() => setError('Failed to load product.'));
  }, [id]);

  if (error && !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Link to="/feed" className="text-primary font-semibold hover:underline">Back to shop</Link>
      </div>
    );
  }
  if (!product) {
    return <div className="max-w-7xl mx-auto px-4 py-10 text-slate-500">Loading product...</div>;
  }

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor);
    setNotice(`${product.name} added to cart.`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:px-10 md:py-12 animate-fadeIn">
      <div className="flex flex-wrap gap-2 mb-8 items-center text-sm">
        <Link to="/feed" className="text-gray-500 hover:text-primary transition-colors font-medium">Home</Link>
        <span className="text-gray-400 material-symbols-outlined !text-sm">chevron_right</span>
        <Link to={`/products/${encodeURIComponent(product.category)}`} className="text-gray-500 hover:text-primary transition-colors font-medium">{product.category}</Link>
        <span className="text-gray-400 material-symbols-outlined !text-sm">chevron_right</span>
        <span className="text-slate-900 dark:text-white font-medium">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
        <div className="lg:col-span-7 flex flex-col gap-6 h-fit sticky top-24">
          <div className="flex-1 aspect-[3/4] md:aspect-auto md:h-[700px] bg-neutral-100 dark:bg-white/5 rounded-2xl overflow-hidden relative group">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-700" aria-hidden>
                <span className="material-symbols-outlined text-6xl text-slate-400">image</span>
              </div>
            )}
            <div className="absolute top-4 left-4">
              <span className="bg-white/90 dark:bg-black/60 backdrop-blur text-primary dark:text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border border-white/20">
                {product.status}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 flex flex-col gap-8">
          <div className="space-y-4 border-b border-gray-100 dark:border-white/10 pb-6">
            <h1 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-slate-900 dark:text-white leading-[1.1] tracking-tight">{product.name}</h1>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="font-mono text-2xl text-primary dark:text-admin-primary font-bold tracking-tight">
                NGN {product.price_ngn.toLocaleString()} <span className="text-gray-400 font-normal mx-2 text-xl">/</span> {product.price_pln} PLN
              </div>
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-full">
                <div className="flex text-amber-400">
                  <span className="material-symbols-outlined !text-lg fill-current">star</span>
                  <span className="material-symbols-outlined !text-lg fill-current">star</span>
                  <span className="material-symbols-outlined !text-lg fill-current">star</span>
                  <span className="material-symbols-outlined !text-lg fill-current">star</span>
                  <span className="material-symbols-outlined !text-lg fill-current">star_half</span>
                </div>
                <span className="text-xs font-bold text-slate-900 dark:text-white border-l border-gray-300 pl-2 ml-1">4.8 (124)</span>
              </div>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
            {product.description || 'Elevate your routine with a premium product designed for a polished look, reliable wear, and all-day confidence.'}
          </p>
          {notice && <p className="text-sm text-emerald-600">{notice}</p>}

          <div className="space-y-8">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wider">Color</span>
                {selectedColor && <span className="text-sm text-gray-500">{selectedColor}</span>}
              </div>
              <div className="flex gap-3 flex-wrap">
                {['Jet Black', 'Espresso', 'Burgundy', 'Honey Gold'].map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setSelectedColor(label)}
                    className={`px-4 py-2 rounded-full border text-sm transition-all ${
                      selectedColor === label
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-200 dark:border-gray-700 text-slate-700 dark:text-slate-200 hover:border-primary'
                    }`}
                    aria-label={`Select color ${label}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex items-center justify-between px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-full w-full sm:w-32 bg-white dark:bg-white/5">
                <button onClick={() => setQuantity((prev) => Math.max(1, prev - 1))} className="text-gray-400 hover:text-primary transition-colors" aria-label="Decrease quantity">
                  <span className="material-symbols-outlined !text-xl">remove</span>
                </button>
                <span className="font-mono text-lg font-bold">{quantity}</span>
                <button onClick={() => setQuantity((prev) => prev + 1)} className="text-gray-400 hover:text-primary transition-colors" aria-label="Increase quantity">
                  <span className="material-symbols-outlined !text-xl">add</span>
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={product.status === 'Out of Stock'}
                className="flex-1 bg-primary hover:bg-primary-hover text-white rounded-full py-4 px-8 font-bold tracking-wide shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                <span>{product.status === 'Out of Stock' ? 'OUT OF STOCK' : 'ADD TO CART'}</span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
