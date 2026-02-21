import React from 'react';
import { useNavigate } from 'react-router-dom';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen w-full flex-col lg:flex-row font-display bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 overflow-hidden">
      {/* Left Side: Image */}
      <div className="relative flex-1 hidden lg:flex items-center justify-center p-4 pr-0 h-screen">
        <div className="relative w-full h-full rounded-3xl lg:rounded-r-none lg:rounded-l-3xl overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-primary/10 z-10 mix-blend-multiply"></div>
          <div className="w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD2CQkVa9DPaVJclGCyLwSnhT5h18U2pm7Bd630-MCpZGxLDB2fR4Edy_CxfXpb6Aa7Ax__4R2NWg-QWdorwKw1WSaOpn5ftvZ3sVOL9YKzMyLRwuEjdeh-T21yh3ikGPMEG8TsJSufq4eB7Cz_QTo3CW1d8IGQVEs5EE4-CYS3Xlahzy2fsHtjEzZt7hRCjgsdQNAOCAuZ8KAmOW4E3NSdYl7gB-Fe5B5nCmAe8hjs54CB6w4aFukSjuz6wk3mwPcoQ6jrOHYysbg')" }}></div>
          <div className="absolute bottom-12 left-12 z-20">
            <div className="backdrop-blur-md bg-white/20 border border-white/30 rounded-xl p-4 text-white max-w-[200px]">
              <p className="font-serif text-lg italic opacity-90">"Beauty rooted in heritage."</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side: Content */}
      <div className="flex-1 flex flex-col relative h-screen bg-[#F9F7F2]/50 dark:bg-background-dark/50">
        <header className="flex items-center justify-between px-8 py-6 lg:px-16 lg:py-10 z-20">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="size-8 bg-primary text-white rounded-lg flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-all duration-300">
              <span className="material-symbols-outlined text-xl">diamond</span>
            </div>
            <h2 className="text-primary dark:text-white text-xl font-bold tracking-tight">AfriGlam</h2>
          </div>
          <button onClick={() => navigate('/feed')} className="text-primary/70 hover:text-primary dark:text-slate-400 dark:hover:text-white font-medium text-sm transition-colors flex items-center gap-1 group">
            <span>Skip Intro</span>
            <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </header>

        <main className="flex-1 flex flex-col justify-center px-8 lg:px-24 max-w-3xl mx-auto w-full z-10">
          <div className="lg:hidden w-full h-64 rounded-2xl overflow-hidden mb-8 shadow-lg relative">
             <div className="w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAfyk47ta1M50hrMyUqVfsJ9ukXaHl5M8lWbYz6xyAx8PR8Hj6TrgV-qIS1SA0OQqFDhm5L2zlBkKAJA8_YysLhxWveZV_XXIrukYhAJ3yXFKxag5x6SQZlH0on8j-AyKUkn_mNwJSflvNuS8FDwbdIJj5l_6rmTq0CAlpTrOPmxxjxOrgd-rBYeUf_0i4t8iQb_RFBjtbOLTCIBpYqqvKsU8gyOERkkHZppUE5CWLPNW4t0BZzpKETkYslRv91GZlA8r63YONZ5TU')" }}></div>
          </div>

          <div className="flex flex-col gap-6 lg:gap-8 animate-fadeIn">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider w-fit">New Collection</span>
              <h1 className="font-serif text-4xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-[1.1]">
                Your Beauty, <br />
                <span className="text-primary italic">Your Culture</span>
              </h1>
              <p className="text-slate-600 dark:text-slate-300 text-lg lg:text-xl font-light leading-relaxed max-w-lg">
                Shop premium African-inspired hair, beauty & fashion — delivered with care across Europe.
              </p>
            </div>

            <div className="flex flex-col gap-8 mt-4">
              <div className="flex gap-3 items-center">
                <div className="h-2 w-8 bg-primary rounded-full transition-all duration-300"></div>
                <div className="h-2 w-2 bg-primary/20 rounded-full cursor-pointer hover:bg-primary/40 transition-colors"></div>
                <div className="h-2 w-2 bg-primary/20 rounded-full cursor-pointer hover:bg-primary/40 transition-colors"></div>
              </div>

              <div className="flex items-center gap-4">
                <button onClick={() => navigate('/country-select')} className="flex items-center justify-center gap-3 bg-primary hover:bg-[#143d26] text-white text-base font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 min-w-[200px]">
                  <span>Get Started</span>
                  <span className="material-symbols-outlined text-sm font-bold">arrow_forward</span>
                </button>
                <button onClick={() => navigate('/country-select')} className="hidden sm:flex size-14 items-center justify-center rounded-full border border-primary/20 text-primary hover:bg-primary/5 transition-all" aria-label="Continue onboarding">
                  <span className="material-symbols-outlined">play_arrow</span>
                </button>
              </div>
            </div>
          </div>
        </main>

        <div className="px-8 lg:px-16 py-8">
          <p className="text-xs text-slate-400 dark:text-slate-600 text-center lg:text-left">© 2024 AfriGlam Luxury. Serving Poland & Nigeria.</p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
