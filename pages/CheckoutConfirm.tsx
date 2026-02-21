import React from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { adminApi } from '../services/adminApi';
import { useCart } from '../contexts/CartContext';

const CheckoutConfirm: React.FC = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');
  const [message, setMessage] = React.useState('');
  const confirmedIntentRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    const intentId = params.get('intentId');
    const orderId = params.get('orderId');
    if (!intentId) {
      setError('Missing payment intent identifier.');
      setLoading(false);
      return;
    }
    if (confirmedIntentRef.current === intentId) {
      setLoading(false);
      return;
    }

    adminApi
      .confirmPaymentIntent({ intentId, orderId })
      .then((response) => {
        confirmedIntentRef.current = intentId;
        clearCart();
        setMessage(response.message);
      })
      .catch(() => {
        setError('We could not confirm your payment right now.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [clearCart, params]);

  return (
    <div className="max-w-2xl mx-auto px-4 md:px-8 py-12">
      <div className="rounded-2xl border border-slate-200 dark:border-white/10 p-8 text-center space-y-4">
        <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Payment Confirmation</h1>
        {loading && <p className="text-slate-500">Finalizing your order...</p>}
        {!loading && error && <p className="text-red-500">{error}</p>}
        {!loading && !error && <p className="text-emerald-600">{message || 'Payment confirmed.'}</p>}
        <div className="pt-4 flex items-center justify-center gap-3">
          <Link to="/feed" className="px-5 py-2.5 rounded-full bg-primary text-white font-semibold">Continue Shopping</Link>
          <button onClick={() => navigate('/cart')} className="px-5 py-2.5 rounded-full border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-200 font-semibold">
            Back to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutConfirm;
