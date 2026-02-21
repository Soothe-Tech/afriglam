import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { signIn, isAdmin } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (isAdmin) navigate('/admin/dashboard');
  }, [isAdmin, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Email and password are required.');
      return;
    }
    setLoading(true);
    signIn({ email, password })
      .then((result) => {
        if (result.error) {
          setError(result.error);
          return;
        }
        navigate('/admin/dashboard');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="font-display bg-background-light dark:bg-background-dark min-h-screen flex flex-col relative overflow-hidden items-center justify-center p-4">
      <div className="absolute inset-0 z-0 bg-background-dark">
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-transparent to-admin-primary/10"></div>
      </div>

      <div className="w-full max-w-[440px] bg-white dark:bg-[#1c2e24] rounded-2xl shadow-2xl border border-gray-200 dark:border-white/5 overflow-hidden backdrop-blur-sm relative z-10">
        <div className="relative pt-10 pb-6 px-8 text-center flex flex-col items-center">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-admin-primary/40 via-admin-primary to-admin-primary/40"></div>
          <div className="mb-4 h-12 w-12 rounded-lg bg-admin-primary/10 flex items-center justify-center text-admin-primary">
            <span className="material-symbols-outlined text-3xl">diamond</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">AfriGlam</h1>
          <p className="text-sm font-medium text-admin-primary uppercase tracking-widest mb-4">Admin Portal</p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-900/30 border border-emerald-500/20 text-emerald-500 text-xs font-medium">
            <span className="material-symbols-outlined text-[14px]">lock</span>
            <span>256-bit Secure SSL Connection</span>
          </div>
        </div>

        <div className="px-8 pb-10">
          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 rounded-lg border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent transition-all shadow-sm sm:text-sm"
                  type="email"
                  placeholder="admin@afriglam.com"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <span className="material-symbols-outlined text-[20px]">key</span>
                </div>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 rounded-lg border-gray-300 dark:border-white/10 bg-gray-50 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent transition-all shadow-sm sm:text-sm"
                  type="password"
                  placeholder="••••••••••••"
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button disabled={loading} type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-admin-primary hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-admin-primary transition-all duration-200 disabled:opacity-60">
              Sign in to Dashboard
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
