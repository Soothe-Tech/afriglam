import React from 'react';
import { Link } from 'react-router-dom';

const Help: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-serif text-4xl font-bold text-primary dark:text-white mb-6">Need Help Choosing?</h1>
        <div className="space-y-6 text-slate-600 dark:text-slate-300">
          <p className="text-lg">Select your region to see the right prices and payment options:</p>
          <ul className="list-disc list-inside space-y-2">
            <li><strong>Poland and EU</strong> — Prices in PLN; pay with BLIK or card.</li>
            <li><strong>Nigeria</strong> — Prices in NGN; pay with Paystack.</li>
          </ul>
          <p>You can change your region later from your account or at checkout. For more questions, contact support from the app.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link to="/country-select" className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 px-6 rounded-full hover:bg-primary-hover">
            <span>Choose region</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </Link>
          <Link to="/feed" className="inline-flex items-center justify-center gap-2 text-primary font-semibold hover:underline">
            Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Help;
