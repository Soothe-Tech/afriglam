import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CountrySelect: React.FC = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<'pl' | 'ng'>('pl');

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background-light dark:bg-background-dark font-display relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#1b4b2f 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>
      
      <div className="bg-white dark:bg-slate-800 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden relative z-10 flex flex-col md:flex-row">
        {/* Left Side Decorative Image */}
        <div className="hidden md:block w-1/3 bg-cover bg-center relative" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAZUn_mf_UgWa7aQyFeL0dpxhuuRMPXWqh70TcxMq5EX4lbQLhwvTyzgvylKPa_VA1MIsZDKE-08yd-iA7cxRZL-wDKk2j0BaRxOvFwxfM9vc8X7yU-vcbm1zJ_kfrfvbYX6xlo4E6jcT6kRsQM7jQM0iQgcT0jetH67vXjyx87pqj_j_XrRQO3xnyNuqxifiyD_10ZyEFWx2_xD6QaoCv1gSVmOMnbA_qh2NbXgvoOkyyWLCL7HXAyWavxb3KLIoHhX4zwRQLKxyE')" }}>
          <div className="absolute inset-0 bg-primary/40 mix-blend-multiply"></div>
          <div className="absolute bottom-8 left-8 text-white">
            <p className="font-bold text-lg mb-1">Luxury Nature</p>
            <p className="text-white/80 text-sm">Discover beauty rooted in African tradition.</p>
          </div>
        </div>

        {/* Right Side Content */}
        <div className="w-full md:w-2/3 p-8 md:p-12 flex flex-col justify-center">
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Where are you shopping from?</h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">Select your region to see local pricing and shipping options.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div 
              onClick={() => setSelected('pl')}
              className={`cursor-pointer h-full border-2 rounded-xl p-6 transition-all duration-300 flex flex-col justify-between gap-4 ${selected === 'pl' ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-slate-200 dark:border-slate-600 hover:border-primary/50'}`}
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm text-2xl">🇵🇱</div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selected === 'pl' ? 'border-primary bg-primary' : 'border-slate-300'}`}>
                  {selected === 'pl' && <span className="material-symbols-outlined text-white text-[16px] font-bold">check</span>}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1">Poland & EU</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">credit_card</span> Pay with BLIK or card
                </p>
              </div>
            </div>

            <div 
              onClick={() => setSelected('ng')}
              className={`cursor-pointer h-full border-2 rounded-xl p-6 transition-all duration-300 flex flex-col justify-between gap-4 ${selected === 'ng' ? 'border-primary bg-primary/5 dark:bg-primary/10' : 'border-slate-200 dark:border-slate-600 hover:border-primary/50'}`}
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shadow-sm text-2xl">🇳🇬</div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selected === 'ng' ? 'border-primary bg-primary' : 'border-slate-300'}`}>
                  {selected === 'ng' && <span className="material-symbols-outlined text-white text-[16px] font-bold">check</span>}
                </div>
              </div>
              <div>
                <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-1">Nigeria</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">payments</span> Pay with Paystack
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <button onClick={() => navigate('/feed')} className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 group">
              <span>Continue to Shop</span>
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
            <button onClick={() => navigate('/help')} className="text-slate-400 hover:text-primary text-sm font-medium flex items-center justify-center gap-1 transition-colors">
              <span className="material-symbols-outlined text-[18px]">help</span> Need help choosing?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountrySelect;
