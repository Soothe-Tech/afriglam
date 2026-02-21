import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../services/adminApi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, subtotalPln, subtotalNgn, clearCart } = useCart();
  const { user } = useAuth();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    address: '',
    city: '',
    market: 'PLN' as 'PLN' | 'NGN',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const amount = useMemo(() => (form.market === 'PLN' ? subtotalPln : subtotalNgn), [form.market, subtotalNgn, subtotalPln]);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.fullName || !form.email || !form.address || !form.city) {
      setError('Please fill all required fields.');
      return;
    }
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    if (!validEmail) {
      setError('Please provide a valid email address.');
      return;
    }
    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        currency: form.market,
        amount,
        userId: user?.id,
        email: form.email,
        fullName: form.fullName,
        address: form.address,
        city: form.city,
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
          unit_price_ngn: item.price_ngn,
          unit_price_pln: item.price_pln,
        })),
      };
      const response = await adminApi.createPaymentIntent(payload);
      if (!response?.checkoutUrl) {
        setError('Checkout failed. No redirect URL received.');
        setLoading(false);
        return;
      }
      setSuccess('Payment intent created. Redirecting...');
      setTimeout(() => {
        if (response.checkoutUrl.startsWith('http://') || response.checkoutUrl.startsWith('https://')) {
          window.location.href = response.checkoutUrl;
        } else {
          navigate(response.checkoutUrl);
        }
      }, 800);
    } catch (_e) {
      setError('Checkout failed. Please verify your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-8 space-y-6">
      <h1 className="text-3xl font-serif font-bold text-slate-900 dark:text-white">Checkout</h1>

      <form onSubmit={handleCheckout} className="space-y-4 rounded-xl border border-slate-200 dark:border-white/10 p-6">
        <input
          value={form.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          className="w-full rounded-lg border border-slate-200 dark:border-white/10 px-4 py-2.5"
          placeholder="Full name"
          aria-label="Full name"
        />
        <input
          type="email"
          value={form.email}
          onChange={(e) => handleChange('email', e.target.value)}
          className="w-full rounded-lg border border-slate-200 dark:border-white/10 px-4 py-2.5"
          placeholder="Email address"
          aria-label="Email address"
        />
        <input
          value={form.address}
          onChange={(e) => handleChange('address', e.target.value)}
          className="w-full rounded-lg border border-slate-200 dark:border-white/10 px-4 py-2.5"
          placeholder="Delivery address"
          aria-label="Delivery address"
        />
        <input
          value={form.city}
          onChange={(e) => handleChange('city', e.target.value)}
          className="w-full rounded-lg border border-slate-200 dark:border-white/10 px-4 py-2.5"
          placeholder="City"
          aria-label="City"
        />
        <input
          value={user?.id ?? ''}
          readOnly
          className="hidden"
          aria-hidden="true"
        />
        <select
          value={form.market}
          onChange={(e) => handleChange('market', e.target.value)}
          className="w-full rounded-lg border border-slate-200 dark:border-white/10 px-4 py-2.5"
          aria-label="Payment currency"
        >
          <option value="PLN">Poland / PLN</option>
          <option value="NGN">Nigeria / NGN</option>
        </select>

        <div className="bg-slate-50 dark:bg-white/5 rounded-lg p-4 text-sm">
          Payable amount: <span className="font-mono font-bold">{form.market === 'PLN' ? `${amount.toFixed(2)} PLN` : `₦${Math.round(amount).toLocaleString()}`}</span>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {success && <p className="text-sm text-emerald-500">{success}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-full bg-primary text-white font-bold disabled:opacity-60"
        >
          {loading ? 'Processing...' : 'Complete Checkout'}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
