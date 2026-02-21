import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isAuthPage = location.pathname === '/admin/login';
  const displayName = [user?.user_metadata?.full_name, user?.user_metadata?.name].filter(Boolean)[0] ?? user?.email ?? 'Admin';
  const avatarUrl = user?.user_metadata?.avatar_url ?? '';

  if (isAuthPage) {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard' },
    { name: 'Orders', icon: 'shopping_bag', path: '/admin/orders' },
    { name: 'Bookings', icon: 'spa', path: '/admin/bookings' },
    { name: 'Products', icon: 'inventory_2', path: '/admin/products' },
    { name: 'Customers', icon: 'group', path: '/admin/customers' },
  ];

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <div className="flex h-screen w-full bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 overflow-hidden font-display">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col bg-[#0f1c15] border-r border-white/5 h-full transition-all duration-300 flex-shrink-0">
        <div className="flex h-20 items-center gap-3 px-6 border-b border-white/10">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-admin-primary to-emerald-800 text-white shadow-lg">
            <span className="material-symbols-outlined">diamond</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-white text-lg font-bold tracking-tight font-serif">AfriGlam</h1>
            <span className="text-emerald-400/80 text-[10px] font-medium tracking-widest uppercase">Admin Console</span>
          </div>
        </div>
        
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          <div className="px-2 pb-2 text-xs font-semibold text-emerald-500/60 uppercase tracking-wider">Overview</div>
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link 
                key={item.path} 
                to={item.path} 
                className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group ${
                  active ? 'bg-admin-primary text-white shadow-md' : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <span className={`material-symbols-outlined ${active ? '' : 'group-hover:text-admin-primary transition-colors'}`}>{item.icon}</span>
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
          
          <div className="mt-8 px-2 pb-2 text-xs font-semibold text-emerald-500/60 uppercase tracking-wider">Management</div>
          <Link 
            to="/admin/analytics" 
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group ${
                isActive('/admin/analytics') ? 'bg-admin-primary text-white shadow-md' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive('/admin/analytics') ? '' : 'group-hover:text-admin-primary transition-colors'}`}>bar_chart</span>
            <span className="font-medium">Analytics</span>
          </Link>
          <Link 
            to="/admin/settings" 
            className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group ${
                isActive('/admin/settings') ? 'bg-admin-primary text-white shadow-md' : 'text-slate-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            <span className={`material-symbols-outlined ${isActive('/admin/settings') ? '' : 'group-hover:text-admin-primary transition-colors'}`}>settings</span>
            <span className="font-medium">Settings</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button onClick={() => signOut()} className="w-full text-left flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
            <div className="h-10 w-10 rounded-full bg-cover bg-center border-2 border-admin-primary shrink-0" style={{ backgroundImage: avatarUrl ? `url('${avatarUrl}')` : undefined, backgroundColor: !avatarUrl ? 'var(--admin-primary)' : undefined }} />
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-white truncate">{displayName}</span>
              <span className="text-xs text-emerald-400">Log out</span>
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative bg-white dark:bg-background-dark">
        {mobileOpen && (
          <div className="lg:hidden absolute inset-0 z-40 bg-black/50" onClick={() => setMobileOpen(false)}>
            <nav className="w-72 h-full bg-[#0f1c15] p-4 space-y-2" onClick={(e) => e.stopPropagation()}>
              {navItems.map((item) => (
                <Link key={item.path} to={item.path} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group ${isActive(item.path) ? 'bg-admin-primary text-white shadow-md' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </Link>
              ))}
              <Link to="/admin/analytics" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group ${isActive('/admin/analytics') ? 'bg-admin-primary text-white shadow-md' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                <span className="material-symbols-outlined">bar_chart</span>
                <span className="font-medium">Analytics</span>
              </Link>
              <Link to="/admin/settings" onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all group ${isActive('/admin/settings') ? 'bg-admin-primary text-white shadow-md' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                <span className="material-symbols-outlined">settings</span>
                <span className="font-medium">Settings</span>
              </Link>
              <button onClick={() => signOut()} className="mt-4 w-full rounded-lg bg-admin-primary py-2 text-white font-semibold">Log Out</button>
            </nav>
          </div>
        )}

        <header className="lg:hidden h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-white/10 bg-white dark:bg-background-dark">
           <div className="flex items-center gap-2">
             <span className="material-symbols-outlined text-admin-primary">diamond</span>
             <span className="font-bold font-serif text-lg dark:text-white">AfriGlam</span>
           </div>
           <button onClick={() => setMobileOpen(true)} className="text-gray-500" aria-label="Open admin menu"><span className="material-symbols-outlined">menu</span></button>
        </header>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
