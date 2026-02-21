import React from 'react';
import { Link } from 'react-router-dom';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-serif text-4xl font-bold text-primary dark:text-white mb-6">Terms of Service</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Last updated: 2024</p>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-4 text-slate-600 dark:text-slate-300">
          <p>By using AfriGlam you agree to these terms. You must be of legal age to purchase and use our services in your region.</p>
          <p>Orders are subject to availability. We reserve the right to cancel or refuse orders. Refunds and returns follow our stated policy at checkout.</p>
          <p>Content and branding are owned by AfriGlam. You may not copy or resell our products or services without permission.</p>
        </div>
        <Link to="/feed" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline mt-8">
          <span>Back to Shop</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
};

export default Terms;
