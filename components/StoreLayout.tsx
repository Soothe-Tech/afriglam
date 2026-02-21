import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export const StoreLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const { itemCount } = useCart();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const isSplash = location.pathname === '/';
  const isOnboarding = location.pathname === '/onboarding';
  const [search, setSearch] = React.useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const category = search.trim() ? search.trim().toLowerCase() : 'all';
    navigate(`/products/${category}`);
  };

  if (isSplash || isOnboarding) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {!isAuthPage && (
        <header className="sticky top-0 z-50 bg-white/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-gray-100 dark:border-white/10 px-4 md:px-10 py-3 transition-colors">
          <div className="max-w-7xl mx-auto flex items-center justify-between whitespace-nowrap">
            <div className="flex items-center gap-8">
              <Link to="/feed" className="flex items-center gap-2 group">
                <div className="size-8 text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined !text-3xl">spa</span>
                </div>
                <h2 className="text-primary dark:text-white text-xl font-bold leading-tight tracking-[-0.015em] font-serif">AfriGlam</h2>
              </Link>
              <nav className="hidden lg:flex items-center gap-9">
                <Link to="/feed" className="text-[#131614] dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors text-sm font-medium leading-normal">Shop</Link>
                <Link to="/products/all" className="text-[#131614] dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors text-sm font-medium leading-normal">Collections</Link>
                <Link to="/about" className="text-[#131614] dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors text-sm font-medium leading-normal">About</Link>
                <Link to="/admin/login" className="text-[#131614] dark:text-slate-300 hover:text-primary dark:hover:text-white transition-colors text-sm font-medium leading-normal">Admin</Link>
              </nav>
            </div>
            <div className="flex flex-1 justify-end gap-4 md:gap-8 items-center">
              <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
                <div className="flex w-full flex-1 items-stretch rounded-full h-full border border-gray-200 dark:border-gray-700 bg-[#f1f3f2] dark:bg-surface-dark overflow-hidden focus-within:ring-2 ring-primary/20 transition-shadow">
                  <div className="text-gray-500 flex items-center justify-center pl-4 pr-2">
                    <span className="material-symbols-outlined text-lg">search</span>
                  </div>
                  <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent border-none text-sm text-[#131614] dark:text-white placeholder:text-gray-500 focus:ring-0 h-full" placeholder="Search..." />
                </div>
              </form>
              <div className="flex gap-2">
                {user ? (
                  <button onClick={() => signOut()} className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center rounded-full h-10 px-6 bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all">
                    <span>Log Out</span>
                  </button>
                ) : (
                  <Link to="/login" className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center rounded-full h-10 px-6 bg-primary hover:bg-primary-hover text-white text-sm font-bold shadow-lg shadow-primary/20 transition-all">
                    <span>Log In</span>
                  </Link>
                )}
                <Link to="/cart" className="flex size-10 cursor-pointer items-center justify-center rounded-full bg-[#f1f3f2] dark:bg-surface-dark text-[#131614] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors relative">
                  <span className="material-symbols-outlined">shopping_cart</span>
                  {itemCount > 0 && <span className="absolute top-0 right-0 h-5 min-w-5 px-1 bg-red-500 rounded-full border-2 border-white dark:border-surface-dark text-[10px] text-white flex items-center justify-center">{itemCount}</span>}
                </Link>
              </div>
            </div>
          </div>
        </header>
      )}
      <main className="flex-grow w-full">
        {children}
      </main>
      {!isAuthPage && (
        <footer className="mt-auto border-t border-gray-200 dark:border-white/10 bg-white dark:bg-background-dark py-12 px-6">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            <p className="text-gray-400 text-sm">© 2024 AfriGlam. All rights reserved.</p>
            <div className="flex gap-6">
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-primary transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-gray-500 hover:text-primary transition-colors">Terms of Service</Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};
