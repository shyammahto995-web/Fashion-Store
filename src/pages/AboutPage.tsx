import React from 'react';
import { BrandLogo } from '../components/BrandLogo';
import { ShieldCheck, Truck, Sparkles, HeartHandshake, Award } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div id="about-page" className="py-12 sm:py-16 bg-[#FAF9F5] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <BrandLogo variant="emblem" theme="dark" size="lg" />
          </div>
          <p className="font-script text-3xl sm:text-4xl text-[#C59B51] select-none pt-2">
            Style • Quality • You
          </p>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-luxury text-[#0B132B] tracking-tight">
            EVERYTHING. FOR EVERY STYLE.
          </h1>
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto leading-relaxed">
            Fashion Store is an Indian lifestyle &amp; fashion house founded on a single conviction: authentic modern style, world-class fabrics, and honest pricing should be accessible to everyone across India.
          </p>
        </div>

        {/* Brand Story */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#E9E4DC] shadow-xs space-y-6 text-stone-700 leading-relaxed text-sm sm:text-base">
          <h2 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#0B132B]">
            Our Heritage &amp; Vision
          </h2>
          <p>
            From handcrafted cottons and mulberry silks to precision-engineered stainless chronographs and cruelty-free vegan leather carryalls, our catalog represents an unwavering pursuit of aesthetic balance.
          </p>
          <p>
            We eliminate intermediate markups and opaque convenience surcharges. What you see is what you pay—with free doorstep delivery to every PIN code in India.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-stone-200">
            <div className="space-y-1">
              <span className="text-2xl font-extrabold text-[#0B132B] font-serif">100%</span>
              <h4 className="text-xs font-bold text-stone-900 uppercase">Inspected Quality</h4>
              <p className="text-xs text-stone-500">Every seam and zipper tested before dispatch.</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-extrabold text-[#0B132B] font-serif">28,000+</span>
              <h4 className="text-xs font-bold text-stone-900 uppercase">PIN Codes Covered</h4>
              <p className="text-xs text-stone-500">Free delivery across all corners of India.</p>
            </div>
            <div className="space-y-1">
              <span className="text-2xl font-extrabold text-[#0B132B] font-serif">30 Days</span>
              <h4 className="text-xs font-bold text-stone-900 uppercase">Hassle-Free Returns</h4>
              <p className="text-xs text-stone-500">Doorstep reverse pickups, no questions asked.</p>
            </div>
          </div>
        </div>

        {/* 3 Core Values */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white border border-[#E9E4DC] shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#FAF5EB] text-[#C59B51] flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#0B132B] text-base">Uncompromising Style</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Timeless silhouettes paired with contemporary cuts tailored for Indian climates and lifestyles.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[#E9E4DC] shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#FAF5EB] text-[#C59B51] flex items-center justify-center mb-3">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#0B132B] text-base">Ethical Craftsmanship</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Sustainably sourced fibers, non-toxic dyes, and fair wage artisan partnerships.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white border border-[#E9E4DC] shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#FAF5EB] text-[#C59B51] flex items-center justify-center mb-3">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-[#0B132B] text-base">Customer First</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Transparent ₹ pricing, responsive support, and instant resolution on all queries.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-6">
          <button
            onClick={() => onNavigate('/shop')}
            className="px-8 py-3.5 bg-[#0B132B] hover:bg-[#1E293B] text-white rounded-md text-xs font-bold uppercase tracking-wider shadow-md transition-all"
          >
            EXPLORE THE STORE
          </button>
        </div>

      </div>
    </div>
  );
};
