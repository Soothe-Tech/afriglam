import React from 'react';
import { Link } from 'react-router-dom';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="font-serif text-4xl font-bold text-primary dark:text-white mb-6">About AfriGlam</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
          AfriGlam brings together premium African-inspired beauty, hair, and fashion — for customers in Poland, Nigeria, and beyond.
        </p>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
          We believe in beauty rooted in heritage and delivered with care. Shop our collections or book a stylist for your next event.
        </p>
        <Link to="/feed" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline">
          <span>Back to Shop</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
};

export default About;
