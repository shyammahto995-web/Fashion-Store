import React from 'react';
import { ArrowRight, Package, Percent, Crown } from 'lucide-react';

interface PromotionalBannersProps {
  onShopClick: () => void;
  onJoinClick?: () => void;
}

export const PromotionalBanners: React.FC<PromotionalBannersProps> = ({ 
  onShopClick,
  onJoinClick 
}) => {
  return (
    <section id="promotional-banners" className="py-10 bg-[#FAF9F5] border-b border-[#E9E4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* CARD 1: FREE SHIPPING (Dark Navy) */}
          <div className="relative overflow-hidden rounded-xl bg-[#0B132B] text-white p-6 sm:p-7 shadow-md flex items-center justify-between group cursor-pointer hover:shadow-xl transition-all">
            <div className="space-y-1.5 z-10">
              <div className="flex items-center gap-2 text-[#E5C384] text-xs font-bold tracking-widest uppercase">
                <Package className="w-4 h-4" />
                <span>ALL INDIA</span>
              </div>
              <h3 className="text-xl font-bold font-serif-luxury tracking-tight text-white">
                FREE SHIPPING
              </h3>
              <p className="text-xs text-stone-300">
                On all orders over ₹999
              </p>
              <button 
                onClick={onShopClick}
                className="pt-2 text-xs font-bold text-[#E5C384] group-hover:text-white flex items-center gap-1.5 uppercase tracking-wider"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            {/* Background Decorative Icon Watermark */}
            <Package className="w-28 h-28 text-white/5 absolute -right-4 -bottom-4 pointer-events-none transform -rotate-12" />
          </div>

          {/* CARD 2: SPECIAL OFFER (Warm Beige/Gold) */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#D9C4A5] via-[#C9B08F] to-[#B39670] text-[#0B132B] p-6 sm:p-7 shadow-md flex items-center justify-between group cursor-pointer hover:shadow-xl transition-all">
            <div className="space-y-1.5 z-10">
              <div className="flex items-center gap-2 text-[#0B132B] text-xs font-bold tracking-widest uppercase">
                <Percent className="w-4 h-4" />
                <span>LIMITED TIME</span>
              </div>
              <h3 className="text-xl font-bold font-serif-luxury tracking-tight text-[#0B132B]">
                SPECIAL OFFER
              </h3>
              <p className="text-xs text-stone-800">
                Save up to 50% on select lines
              </p>
              <button 
                onClick={onShopClick}
                className="pt-2 text-xs font-extrabold text-[#0B132B] group-hover:text-black flex items-center gap-1.5 uppercase tracking-wider"
              >
                <span>Grab The Deal</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            {/* Background Decorative Icon Watermark */}
            <Percent className="w-28 h-28 text-white/15 absolute -right-4 -bottom-4 pointer-events-none transform rotate-12" />
          </div>

          {/* CARD 3: MEMBER BENEFITS (Warm Cream / Soft Gold Accent) */}
          <div className="relative overflow-hidden rounded-xl bg-white border border-[#E3DACB] text-[#0B132B] p-6 sm:p-7 shadow-md flex items-center justify-between group cursor-pointer hover:shadow-xl transition-all">
            <div className="space-y-1.5 z-10">
              <div className="flex items-center gap-2 text-[#C59B51] text-xs font-bold tracking-widest uppercase">
                <Crown className="w-4 h-4" />
                <span>VIP CLUB</span>
              </div>
              <h3 className="text-xl font-bold font-serif-luxury tracking-tight text-[#0B132B]">
                MEMBER BENEFITS
              </h3>
              <p className="text-xs text-stone-600">
                Join now &amp; get early access
              </p>
              <button 
                onClick={onJoinClick || onShopClick}
                className="pt-2 text-xs font-bold text-[#0B132B] group-hover:text-[#C59B51] flex items-center gap-1.5 uppercase tracking-wider"
              >
                <span>Join Free</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            {/* Background Decorative Icon Watermark */}
            <Crown className="w-28 h-28 text-[#C59B51]/10 absolute -right-4 -bottom-4 pointer-events-none transform -rotate-6" />
          </div>

        </div>
      </div>
    </section>
  );
};
