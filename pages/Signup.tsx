import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signUp, signInWithProvider, authEnabled } = useAuth();
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!fullName || !email || !password) {
      setError('Please complete all fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);
    signUp({ email, password, name: fullName })
      .then((result) => {
        if (result.error) {
          setError(result.error);
          return;
        }
        navigate('/feed');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="min-h-screen flex w-full bg-white dark:bg-background-dark font-display">
      {/* Right Column - Image (Hidden on Mobile) - Order swapped for Signup */}
      <div className="hidden lg:block lg:w-1/2 xl:w-7/12 relative bg-primary order-2">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB4-Ka1CaN6dTQ_5D6lHuhKitg6kYeF6tBR-i9HA9uaHK4Ev11vl-vugFlWPpHycahTCccaZ9HhvBLv90tnLwIKQqEYLhWGQ-3SEJ7h93cgD-6Eb99ReYq6ZrPLfGJVbGL7Sg7_3rqfgig0s3ykbhCUnmpKJA-EV8sF2vRchHWdPJvookPH4eDmZWRGNI0Hld4bgb-BEZJrjUWf6wTTiAki1N9TjvnNveHwAd1cKbwkdrnfiY4oH-njPRwoibpRx-kB3eLWGBOp_SA')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/30"></div>
        <div className="absolute bottom-16 right-16 max-w-lg text-white text-right">
          <h2 className="font-serif text-5xl font-bold leading-tight mb-4">Start Your Journey</h2>
          <p className="text-lg text-white/90">Get exclusive access to new drops, personal stylist bookings, and member-only discounts.</p>
        </div>
      </div>

      {/* Left Column - Form - Order 1 */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 lg:px-24 xl:px-32 py-12 relative z-10 order-1">
        <Link to="/feed" className="absolute top-8 left-8 sm:left-12 flex items-center gap-2 text-slate-500 hover:text-primary transition-colors">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          <span className="text-sm font-medium">Back to Store</span>
        </Link>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
             <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-3xl text-primary">diamond</span>
              <span className="font-serif text-2xl font-bold text-slate-900 dark:text-white">AfriGlam</span>
            </div>
            <h1 className="font-serif text-4xl font-bold text-slate-900 dark:text-white mb-3">Create Account</h1>
            <p className="text-slate-500 dark:text-slate-400">Join the AfriGlam community today.</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name</label>
              <div className="relative">
                  <input 
                    type="text" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Amara Okafor" 
                    className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-3.5 text-slate-400">person</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
              <div className="relative">
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com" 
                    className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-3.5 text-slate-400">mail</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a strong password" 
                    className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <span className="material-symbols-outlined absolute right-3 top-3.5 text-slate-400">lock</span>
              </div>
            </div>
            
            {!authEnabled && <p className="text-xs text-amber-600">Auth is running in fallback mode. Configure Supabase env vars to enable real signup.</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="pt-2">
                <button disabled={loading} type="submit" className="w-full bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-bold py-3.5 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2">
                <span>Join AfriGlam</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </button>
            </div>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px bg-slate-200 dark:bg-white/10 flex-1"></div>
            <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Or sign up with</span>
            <div className="h-px bg-slate-200 dark:bg-white/10 flex-1"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button type="button" onClick={() => signInWithProvider('google')} className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Google</span>
            </button>
            <button type="button" onClick={() => signInWithProvider('apple')} className="flex items-center justify-center gap-2 px-4 py-3 border border-slate-200 dark:border-white/10 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <svg className="w-5 h-5 text-slate-900 dark:text-white" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M13.0729 1.9375C13.8854 0.9375 15.2083 0.229167 16.3229 0.25C16.4271 1.34375 15.9375 2.5 15.1979 3.375C14.4688 4.22917 13.0417 4.90625 12.0417 4.83333C11.8854 3.71875 12.3542 2.76042 13.0729 1.9375ZM15.8229 15.6562C14.5417 17.5208 13.0833 17.5521 12.0104 17.5521C10.7917 17.5521 10.3958 16.8229 8.98958 16.8229C7.57292 16.8229 6.94792 17.5208 5.92708 17.5521C4.08333 17.625 2.10417 14.2812 2.10417 11.25C2.10417 8.71875 3.65625 7.42708 5.4375 7.375C6.70833 7.32292 7.625 8.23958 8.4375 8.23958C9.25 8.23958 10.4271 7.22917 11.75 7.35417C12.3021 7.375 13.9167 7.57292 14.9271 9.07292C14.8542 9.125 12.5625 10.4583 12.5938 13.2708C12.6146 15.5833 14.5938 16.3542 14.5938 16.3542C14.5625 16.4583 14.2708 17.5 13.7812 18.2396C13.3854 18.8125 12.9688 19.3333 12.5521 19.8542C12.1562 20.3542 11.7708 20.8542 11.4583 21.3229C11.3333 21.5104 11.2083 21.6875 11.0833 21.875C10.9583 22.0625 10.8333 22.25 10.7292 22.4167C10.625 22.5833 10.5417 22.7292 10.4792 22.8542C10.4167 22.9792 10.375 23.0833 10.3542 23.1667C10.3333 23.25 10.3333 23.3125 10.3333 23.3542C10.3333 23.4167 10.3542 23.5208 10.3958 23.6875C10.4375 23.8542 10.5208 24.0625 10.6458 24.2917C10.7708 24.5208 10.9583 24.75 11.2083 24.9583C11.4583 25.1667 11.7708 25.3333 12.1667 25.4375C12.5625 25.5417 13.0208 25.5625 13.5625 25.5H16.3229C16.8646 25.5625 17.3229 25.5417 17.7188 25.4375C18.1146 25.3333 18.4271 25.1667 18.6771 24.9583C18.9271 24.75 19.1146 24.5208 19.2396 24.2917C19.3646 24.0625 19.4479 23.8542 19.4896 23.6875C19.5312 23.5208 19.5521 23.4167 19.5521 23.3542C19.5521 23.3125 19.5521 23.25 19.5312 23.1667C19.5104 23.0833 19.4688 22.9792 19.4062 22.8542C19.3438 22.7292 19.2604 22.5833 19.1562 22.4167C19.0521 22.25 18.9271 22.0625 18.8021 21.875C18.6771 21.6875 18.5521 21.5104 18.4271 21.3229C18.1146 20.8542 17.7292 20.3542 17.3333 19.8542C16.9167 19.3333 16.5 18.8125 16.1042 18.2396C15.6146 17.5 15.3229 16.4583 15.2917 16.3542C15.2917 16.3542 17.2708 15.5833 17.2917 13.2708C17.3229 10.4583 15.0312 9.125 14.9583 9.07292C15.9688 7.57292 17.5833 7.375 18.1354 7.35417H19.5521V4.83333H17.2917C16.8438 4.83333 16.3125 4.83333 15.8229 4.83333V4.83333Z" fill="currentColor"/></svg>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Apple</span>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-500 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-primary hover:text-primary-hover hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
