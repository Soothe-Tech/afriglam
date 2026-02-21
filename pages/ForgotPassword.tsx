import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ForgotPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setLoading(true);
    const result = await resetPassword(email);
    if (result.error) {
      setError(result.error);
    } else {
      setMessage('Password reset link sent. Please check your inbox.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold mb-3 text-slate-900 dark:text-white">Reset password</h1>
      <p className="text-sm text-slate-500 mb-6">We will send you a secure reset link.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-slate-200 dark:border-white/10 px-4 py-3"
          placeholder="name@example.com"
          aria-label="Email address"
        />
        {error && <p className="text-sm text-red-500">{error}</p>}
        {message && <p className="text-sm text-emerald-500">{message}</p>}
        <button type="submit" disabled={loading} className="w-full rounded-full bg-primary text-white py-3 font-bold disabled:opacity-60">
          {loading ? 'Sending...' : 'Send reset link'}
        </button>
      </form>
      <Link to="/login" className="inline-block mt-6 text-primary hover:underline">Back to login</Link>
    </div>
  );
};

export default ForgotPassword;
