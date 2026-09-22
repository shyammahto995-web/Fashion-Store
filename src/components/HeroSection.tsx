import React from 'react';
import { ArrowRight, Truck, RotateCcw, ShieldCheck, Award, Star, Banknote, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onShopClick: () => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onShopClick, onExploreClick }) => {
  return (
    <div id="hero-section" className="relative bg-[#FAF7F2] overflow-hidden border-b border-[#E7DFD3]">
      {/* Background ambient radial gradients & luxury tone shapes */}
      <div className="absolute top-0 right-0 w-[60vw] h-full bg-gradient-to-l from-[#F0E9DA] via-[#F6F1E6] to-transparent pointer-events-none rounded-bl-[160px] opacity-80" />
      <div className="absolute -top-32 -left-32 w-[32rem] h-[32rem] rounded-full bg-[#EFE7D7]/70 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-[#E5D7C0]/40 blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-16 lg:pt-20 lg:pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* LEFT SIDE: Brand Editorial & Bigger Typography */}
          <div className="lg:col-span-6 space-y-7 text-left">
            {/* Small Eyebrow Badge */}
            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/90 border border-[#D8CEBE] shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#C59B51] animate-pulse"></span>
              <span className="text-[11px] sm:text-xs font-bold tracking-[0.22em] text-[#0B132B] uppercase">
                SPRING / SUMMER 2026 EDIT
              </span>
              <span className="text-[10px] font-bold text-[#C59B51] border-l border-stone-200 pl-2">
                NEW IN
              </span>
            </div>

            {/* Main Grand Headline */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#0B132B] tracking-tight leading-[1.04] font-serif-luxury">
                EVERYTHING.<br />
                <span className="text-[#0B132B] relative inline-block">
                  FOR EVERY STYLE.
                  <span className="absolute bottom-1 left-0 w-full h-[6px] bg-[#C59B51]/25 -z-10 rounded-full"></span>
                </span>
              </h1>
              {/* Supporting Script Tagline */}
              <div className="flex items-center gap-3 pt-2">
                <p className="font-script text-3xl sm:text-4xl text-[#C59B51] select-none">
                  Style • Quality • You
                </p>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#FAF0DC] text-[#9A7328] text-[11px] font-bold">
                  <Sparkles className="w-3 h-3" />
                  Premium Edition
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="text-stone-600 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              Step into an elevated world of refined women's gowns, structured men's blazers, Italian-crafted leather handbags, precision timepieces, and signature parfums curated for effortless elegance.
            </p>

            {/* Cash on Delivery Notice Pill */}
            <div className="flex items-center gap-2.5 text-xs text-stone-700 bg-white/80 border border-stone-200/80 px-3.5 py-2 rounded-lg max-w-fit shadow-2xs">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <Banknote className="w-3.5 h-3.5" />
              </div>
              <span className="font-semibold text-stone-800">
                Cash on Delivery (COD) Available on 100% of Orders
              </span>
            </div>

            {/* Primary & Secondary CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                id="hero-shop-now-btn"
                onClick={onShopClick}
                className="group inline-flex items-center justify-center gap-3 bg-[#0B132B] hover:bg-[#1E293B] text-white px-8 py-4 rounded-md font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-xl hover:-translate-y-0.5"
              >
                <span>SHOP THE COLLECTION</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform text-[#E5C384]" />
              </button>

              <button
                id="hero-explore-collections-btn"
                onClick={onExploreClick}
                className="inline-flex items-center justify-center px-7 py-4 rounded-md font-bold text-xs sm:text-sm uppercase tracking-wider text-[#0B132B] border-2 border-[#0B132B]/80 hover:border-[#0B132B] bg-white/80 hover:bg-white transition-all shadow-xs"
              >
                EXPLORE CATEGORIES
              </button>
            </div>

            {/* Customer Trust Rating Strip */}
            <div className="flex items-center gap-4 pt-3 border-t border-stone-200/60">
              <div className="flex -space-x-2">
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="Customer" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Customer" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Customer" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Customer" />
              </div>
              <div className="text-xs">
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span className="font-extrabold text-[#0B132B] ml-1">4.9/5</span>
                </div>
                <span className="text-stone-500 text-[11px]">Over 12,000+ satisfied customers across India</span>
              </div>
            </div>

          </div>

          {/* RIGHT SIDE: Bigger Multi-layer Lifestyle Composition */}
          <div className="lg:col-span-6 relative flex justify-center items-center">
            
            {/* Main Lifestyle Showcase Canvas */}
            <div className="relative w-full max-w-lg lg:max-w-none aspect-4/3 sm:aspect-16/11 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/90 group">
              <img
                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1400&auto=format&fit=crop&q=85"
                alt="Fashion Store Curated Collection"
                className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

              {/* Bottom Inset Showcase Overlay */}
              <div className="absolute bottom-5 left-5 right-5 sm:right-auto bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-white/80 flex items-center gap-3.5 max-w-sm">
                <img
                  src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=240&auto=format&fit=crop&q=80"
                  alt="Leather Bag"
                  className="w-14 h-14 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-[10px] font-bold text-[#C59B51] uppercase tracking-wider">
                    FEATURED LUXURY EDIT
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-[#0B132B] truncate">
                    Artisanal Handcrafted Leather
                  </div>
                  <div className="text-xs font-semibold text-stone-600 mt-0.5 flex items-center gap-1.5">
                    <span className="text-[#0B132B] font-bold">From ₹2,499</span>
                    <span className="text-emerald-700 text-[11px] font-bold">• Pay with COD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Circular Promotional Badge: "UP TO 50% OFF" */}
            <div 
              id="hero-discount-badge"
              className="absolute -top-4 -right-3 sm:-top-6 sm:-right-4 w-22 h-22 sm:w-28 sm:h-28 rounded-full bg-[#0B132B] text-white flex flex-col items-center justify-center text-center p-2.5 shadow-2xl border-2 border-[#D4AF37] rotate-6 hover:rotate-0 transition-transform duration-300"
            >
              <span className="text-[9px] sm:text-[11px] font-bold tracking-widest text-[#E5C384] uppercase">UP TO</span>
              <span className="text-xl sm:text-3xl font-black leading-none text-white font-serif">50%</span>
              <span className="text-[9px] sm:text-[11px] font-bold tracking-wider text-[#E5C384]">OFF</span>
            </div>

            {/* Secondary Floating Floating Pill Top-Left */}
            <div className="absolute top-6 left-4 sm:-left-4 bg-[#0B132B]/90 backdrop-blur-md text-white px-3.5 py-2 rounded-xl shadow-lg border border-white/20 hidden sm:flex items-center gap-2">
              <Award className="w-4 h-4 text-[#E5C384]" />
              <span className="text-[11px] font-bold uppercase tracking-wider">100% Authentic Quality</span>
            </div>

          </div>

        </div>

        {/* HERO BENEFITS / TRUST INDICATORS (Bigger & Highlighted COD) */}
        <div className="mt-14 lg:mt-20 pt-10 border-t border-[#E0D7C7] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/80 border border-[#E9E4DC] shadow-xs hover:border-[#C59B51]/40 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-[#FAF5EB] text-[#C59B51] flex items-center justify-center shrink-0 border border-[#E7DECD]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0B132B] uppercase tracking-wide">FREE FAST SHIPPING</h4>
              <p className="text-[11px] sm:text-xs text-stone-500">Fast delivery across all pin codes in India</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/80 border border-[#E9E4DC] shadow-xs hover:border-[#C59B51]/40 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0B132B] uppercase tracking-wide">CASH ON DELIVERY</h4>
              <p className="text-[11px] sm:text-xs text-stone-500">Pay cash comfortably at your doorstep</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/80 border border-[#E9E4DC] shadow-xs hover:border-[#C59B51]/40 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-[#FAF5EB] text-[#C59B51] flex items-center justify-center shrink-0 border border-[#E7DECD]">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0B132B] uppercase tracking-wide">7-DAY EASY RETURNS</h4>
              <p className="text-[11px] sm:text-xs text-stone-500">Hassle-free replacement or return</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/80 border border-[#E9E4DC] shadow-xs hover:border-[#C59B51]/40 transition-colors">
            <div className="w-11 h-11 rounded-xl bg-[#FAF5EB] text-[#C59B51] flex items-center justify-center shrink-0 border border-[#E7DECD]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-[#0B132B] uppercase tracking-wide">GENUINE PRODUCTS</h4>
              <p className="text-[11px] sm:text-xs text-stone-500">Verified authentic luxury items</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
