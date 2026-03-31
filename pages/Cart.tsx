import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotalNgn, subtotalPln, updateQuantity, removeFromCart } = useCart();

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="rounded-xl border border-slate-200 dark:border-white/10 p-8 text-center space-y-4">
          <p className="text-slate-500">Your cart is empty.</p>
          <Link to="/feed" className="inline-flex px-6 py-3 rounded-full bg-primary text-white font-bold">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 border-b border-slate-100 dark:border-white/5 last:border-b-0">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-24 h-24 rounded-lg object-cover" />
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-slate-200 dark:bg-slate-700 flex items-center justify-center" aria-hidden>
                    <span className="material-symbols-outlined text-slate-400">image</span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 dark:text-white">{item.name}</h3>
                  <p className="text-xs text-slate-500">{item.category}</p>
                  <p className="font-mono text-primary font-semibold mt-1">{item.price_pln} PLN / NGN {item.price_ngn.toLocaleString()}</p>
                  {item.selectedColor && <p className="text-xs text-slate-500 mt-1">Color: {item.selectedColor}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 border border-slate-200 rounded"
                    aria-label={`Decrease quantity for ${item.name}`}
                  >
                    -
                  </button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 border border-slate-200 rounded"
                    aria-label={`Increase quantity for ${item.name}`}
                  >
                    +
                  </button>
                </div>
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 text-sm font-semibold">
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 dark:border-white/10 p-6 space-y-2">
            <p className="text-slate-600 dark:text-slate-300">Subtotal (PLN): <span className="font-mono font-bold">{subtotalPln.toFixed(2)} PLN</span></p>
            <p className="text-slate-600 dark:text-slate-300">Subtotal (NGN): <span className="font-mono font-bold">NGN {subtotalNgn.toLocaleString()}</span></p>
            <button
              onClick={() => navigate('/checkout')}
              className="mt-4 px-6 py-3 rounded-full bg-primary text-white font-bold hover:bg-primary-hover transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
