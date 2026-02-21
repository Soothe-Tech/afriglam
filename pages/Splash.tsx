import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Splash: React.FC = () => {
  const navigate = useNavigate();
  const [loadingStatus, setLoadingStatus] = useState('Initializing...');

  useEffect(() => {
    const loadResources = async () => {
      // 1. Critical Images to Preload (Onboarding & Country Select backgrounds)
      const imagesToPreload = [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD2CQkVa9DPaVJclGCyLwSnhT5h18U2pm7Bd630-MCpZGxLDB2fR4Edy_CxfXpb6Aa7Ax__4R2NWg-QWdorwKw1WSaOpn5ftvZ3sVOL9YKzMyLRwuEjdeh-T21yh3ikGPMEG8TsJSufq4eB7Cz_QTo3CW1d8IGQVEs5EE4-CYS3Xlahzy2fsHtjEzZt7hRCjgsdQNAOCAuZ8KAmOW4E3NSdYl7gB-Fe5B5nCmAe8hjs54CB6w4aFukSjuz6wk3mwPcoQ6jrOHYysbg', // Onboarding Desktop
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAfyk47ta1M50hrMyUqVfsJ9ukXaHl5M8lWbYz6xyAx8PR8Hj6TrgV-qIS1SA0OQqFDhm5L2zlBkKAJA8_YysLhxWveZV_XXIrukYhAJ3yXFKxag5x6SQZlH0on8j-AyKUkn_mNwJSflvNuS8FDwbdIJj5l_6rmTq0CAlpTrOPmxxjxOrgd-rBYeUf_0i4t8iQb_RFBjtbOLTCIBpYqqvKsU8gyOERkkHZppUE5CWLPNW4t0BZzpKETkYslRv91GZlA8r63YONZ5TU', // Onboarding Mobile
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAZUn_mf_UgWa7aQyFeL0dpxhuuRMPXWqh70TcxMq5EX4lbQLhwvTyzgvylKPa_VA1MIsZDKE-08yd-iA7cxRZL-wDKk2j0BaRxOvFwxfM9vc8X7yU-vcbm1zJ_kfrfvbYX6xlo4E6jcT6kRsQM7jQM0iQgcT0jetH67vXjyx87pqj_j_XrRQO3xnyNuqxifiyD_10ZyEFWx2_xD6QaoCv1gSVmOMnbA_qh2NbXgvoOkyyWLCL7HXAyWavxb3KLIoHhX4zwRQLKxyE'  // Country Select BG
      ];

      const imagePromises = imagesToPreload.map((src) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve(true);
          img.onerror = () => resolve(false); // Don't block app if one image fails
        });
      });

      // 2. Wait for Fonts (Material Symbols & Custom Fonts)
      const fontPromise = document.fonts.ready;

      // 3. Minimum Display Time (so logo animation isn't cut off too abruptly)
      const minTimePromise = new Promise((resolve) => setTimeout(resolve, 2500));

      try {
        setLoadingStatus('Loading Collections...');
        // Wait for everything to complete
        await Promise.all([...imagePromises, fontPromise, minTimePromise]);
      } catch (e) {
        console.error("Resource loading error:", e);
      } finally {
        navigate('/onboarding');
      }
    };

    loadResources();
  }, [navigate]);

  return (
    <div className="relative flex h-screen w-full flex-col items-center justify-center bg-primary overflow-hidden font-display">
      {/* 
         Hidden elements to force browser to download fonts immediately 
         instead of waiting for them to appear in the DOM on the next page 
      */}
      <div className="absolute opacity-0 pointer-events-none" aria-hidden="true">
        <span className="material-symbols-outlined">diamond</span>
        <span className="font-serif">FontLoad</span>
      </div>

      {/* Noise Texture Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.05\'/%3E%3C/svg%3E')] pointer-events-none mix-blend-overlay"></div>
      
      <div className="relative z-10 flex flex-col items-center justify-center p-8 text-center max-w-2xl w-full">
        {/* Logo Animation */}
        <div className="mb-12 opacity-0 animate-[fadeIn_1s_ease-out_forwards]">
          <div className="text-accent-cream w-32 h-32 md:w-48 md:h-48 mx-auto relative text-white">
             {/* Abstract Logo */}
             <svg className="w-full h-full drop-shadow-lg" fill="none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 20C100 20 70 40 70 80C70 120 100 150 100 150" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"></path>
                <path d="M100 20C100 20 130 40 130 80C130 120 100 150 100 150" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5"></path>
                <path d="M100 150V180" stroke="currentColor" strokeWidth="1.5"></path>
                <path d="M100 80C100 80 80 60 60 70C40 80 50 100 70 110" stroke="currentColor" strokeDasharray="2 2" strokeWidth="1"></path>
                <path d="M100 80C100 80 120 60 140 70C160 80 150 100 130 110" stroke="currentColor" strokeDasharray="2 2" strokeWidth="1"></path>
                <path d="M100 50C100 50 90 30 100 20C110 30 100 50 100 50" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="1"></path>
             </svg>
          </div>
        </div>

        {/* Shimmer Line */}
        <div className="w-48 h-[2px] bg-white/20 rounded-full overflow-hidden relative mb-8">
          <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-accent-gold to-transparent animate-shimmer"></div>
        </div>

        {/* Tagline */}
        <h1 className="text-white font-serif italic text-3xl md:text-4xl tracking-wide font-light leading-relaxed mb-16 opacity-90 drop-shadow-md">
            Inspired by Africa, <br className="hidden md:block"/>Made for Everyone
        </h1>

        {/* Loading Dots */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-accent-pink animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-accent-pink animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-accent-pink animate-bounce"></div>
          </div>
          <p className="text-white/40 text-xs tracking-widest uppercase font-mono animate-pulse">{loadingStatus}</p>
        </div>
      </div>
    </div>
  );
};

export default Splash;