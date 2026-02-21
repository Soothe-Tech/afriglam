import React from 'react';
import { Link } from 'react-router-dom';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-serif text-4xl font-bold text-primary dark:text-white mb-6">Privacy Policy</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">Last updated: 2024</p>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-4 text-slate-600 dark:text-slate-300">
          <p>AfriGlam respects your privacy. We collect only the information needed to process orders, manage your account, and improve our services.</p>
          <p>We do not sell your personal data. Data may be shared with payment and shipping partners only as necessary to fulfill your orders.</p>
          <p>For questions or to request access or deletion of your data, please contact us through the app or at the support email provided in Settings.</p>
        </div>
        <Link to="/feed" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline mt-8">
          <span>Back to Shop</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
};

export default Privacy;
