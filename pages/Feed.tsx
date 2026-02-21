import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Product } from '../types';
import { storeApi } from '../services/storeApi';

const Feed: React.FC = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [products, setProducts] = React.useState<Product[]>([]);
  const categories = ['All', 'Skincare', 'Makeup', 'Hair', 'Fragrance', 'Sets & Gifts'];
  React.useEffect(() => {
    storeApi.getProducts('all').then((result) => setProducts(result));
  }, []);
  const filteredProducts =
    activeCategory === 'All'
      ? products
      : products.filter((product) => product.category.toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-8 space-y-12 animate-fadeIn">
      {/* Welcome */}
      <section className="flex flex-col gap-1">
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary dark:text-white">Good morning, Titilope <span className="inline-block animate-pulse">👋</span></h2>
        <p className="text-gray-500 dark:text-gray-400">Discover today's curated luxury essentials.</p>
      </section>

      {/* Hero Carousel */}
      <section className="relative w-full rounded-2xl overflow-hidden shadow-2xl group cursor-pointer h-[500px] md:h-[600px]">
        <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBnVeIRivWviO5jwaDAaXyLuNMS66EYO3Bt--4V9ggGp-OU__aIhEpSHita6gWZOVhdw5Mfy6nYi9tlYhLuQWDpdzqWsssaoTd7u7vMKSupJZ5XS8cSuiY13eRwDtLpVjnV9MrbA5bURhic09I1MboDq8aUwiufN76zOYSSOdxW2cXFkCpw1sq6HraG-o__tZm3CBFGqGElUXf82luHlBZ1Dedddc--Rzmbse5oss2y4oCUt2DVkNVQB0MdnfO3U2EP_Vzy5JqDCxE')" }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3 lg:w-1/2 flex flex-col items-start gap-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-mono tracking-wider uppercase">
            <span className="material-symbols-outlined text-sm">local_shipping</span> Free Delivery
          </div>
          <h2 className="font-serif text-5xl md:text-6xl text-white leading-[1.1] drop-shadow-lg">The New Ankara Collection</h2>
          <p className="text-white/90 text-lg md:text-xl font-light max-w-md">Vibrant patterns meeting luxury skincare. Experience the fusion of tradition and modern beauty.</p>
          <Link to="/products/braids" className="mt-4 px-8 py-4 bg-white text-primary rounded-full font-bold text-sm tracking-widest uppercase hover:bg-gray-100 transition-colors shadow-lg">Shop The Collection</Link>
        </div>
      </section>

      {/* Categories */}
      <section className="w-full overflow-x-auto hide-scrollbar pb-2">
        <div className="flex gap-4 min-w-max px-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full text-sm transition-transform hover:scale-105 shadow-md ${activeCategory === cat ? 'bg-primary text-white shadow-primary/20' : 'bg-white dark:bg-gray-800 text-slate-700 dark:text-slate-200 border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:text-primary dark:hover:text-white'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Trending Grid */}
      <section>
        <div className="flex items-end justify-between border-b border-gray-200 dark:border-gray-800 pb-4 mb-8">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Trending Now</h2>
          <Link to="/products/all" className="text-primary dark:text-admin-primary font-medium hover:underline flex items-center gap-1">
            View All <span className="material-symbols-outlined text-lg">arrow_forward</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
          {filteredProducts.map((product) => (
            <div key={product.id} className="group flex flex-col gap-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                {product.isNew && <span className="absolute top-3 left-3 z-10 bg-primary text-white text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-sm">New</span>}
                {product.isSale && <span className="absolute top-3 left-3 z-10 bg-red-600 text-white text-[10px] font-mono uppercase tracking-widest px-2 py-1 rounded-sm">Sale</span>}
                <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Link to={`/product/${product.id}`} className="block w-full py-3 bg-white text-primary text-center rounded-lg font-bold text-sm hover:bg-gray-50 shadow-lg">View Details</Link>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-lg font-medium text-slate-900 dark:text-white leading-tight">{product.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{product.category}</p>
                <div className="pt-2 font-mono text-primary dark:text-admin-primary font-bold">₦{product.price_ngn.toLocaleString()} <span className="text-gray-400 font-normal text-xs mx-1">/</span> {product.price_pln} PLN</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Book a Stylist Teaser */}
      <section className="rounded-3xl bg-primary dark:bg-background-dark border border-white/10 overflow-hidden relative isolate">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }}></div>
        <div className="p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6 text-center lg:text-left z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-mono tracking-wider uppercase">
              <span className="material-symbols-outlined text-sm">stars</span> Premium Service
            </div>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-white leading-tight">Expert Styling,<br/>At Your Doorstep</h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto lg:mx-0">Book a professional stylist for your next event or personal makeover. Available in Lagos and Warsaw.</p>
            <button onClick={() => navigate('/book-stylist')} className="inline-flex items-center gap-3 bg-white text-primary px-8 py-4 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-xl">
              <span>Book a Stylist</span>
              <span className="material-symbols-outlined">calendar_month</span>
            </button>
          </div>
          {/* Stylist Avatars (Visual only) */}
          <div className="flex-1 flex justify-center lg:justify-end gap-6">
             <div className="bg-white p-4 rounded-2xl shadow-xl -rotate-6 transform hover:rotate-0 transition-transform duration-300">
               <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDiy99Sud2fJYCPaY-5FF0zchRDQLA6Nt-QZvJ5mP5WPTo6gQ4PAblEfQr3oJZzTsGA7xER0GOC908t9DIM9-wtHWXNCYpStsY-qFEV9j5OleBa_lMg-T9w5v8_AdaEb9YekvqarGcvEU2FB5NrignTNtb1owEaNXO58v8n1IU479lxkmtMg-ka0kHEn3yrjhkPmi9fZSmmEohHtkGX8YgJQCoaUn2G1zEdMj_kMCcrrcw6ZMabRlNT-ZaRAMy59MLGczWX9GXWoNw" className="w-48 h-64 object-cover rounded-xl" alt="Stylist" />
               <p className="mt-2 font-bold text-slate-900">Amara O.</p>
               <p className="text-xs text-gray-500">Makeup Artist</p>
             </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Feed;
