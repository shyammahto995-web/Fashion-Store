import React from 'react';
import { SAMPLE_REVIEWS } from '../data/initialData';
import { Star, ShieldCheck, HeartHandshake, Sparkles, CheckCircle2 } from 'lucide-react';

export const CustomerTrustSection: React.FC = () => {
  return (
    <section id="customer-trust" className="py-14 sm:py-18 bg-white border-b border-[#E9E4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#C59B51] uppercase mb-2">
            <Sparkles className="w-4 h-4" />
            <span>REAL EXPERIENCES</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B132B] font-serif-luxury tracking-tight">
            TRUSTED BY OUR CUSTOMERS
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Rated 4.8 / 5 across 2,500+ satisfied shoppers across India.
          </p>
        </div>

        {/* 4 Pillars of Trust */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-12">
          <div className="p-4 sm:p-5 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8] text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-white text-[#C59B51] flex items-center justify-center shadow-xs mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-[#0B132B]">Quality Products</h4>
            <p className="text-xs text-stone-500 mt-1">Rigorous inspection on fabrics &amp; hardware</p>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8] text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-white text-[#C59B51] flex items-center justify-center shadow-xs mb-3">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-[#0B132B]">Easy Shopping</h4>
            <p className="text-xs text-stone-500 mt-1">Instant Buy Now, no forced cart hoops</p>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8] text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-white text-[#C59B51] flex items-center justify-center shadow-xs mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-[#0B132B]">Secure Checkout</h4>
            <p className="text-xs text-stone-500 mt-1">Encrypted personal details &amp; order data</p>
          </div>

          <div className="p-4 sm:p-5 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8] text-center flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-white text-[#C59B51] flex items-center justify-center shadow-xs mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-[#0B132B]">Customer Support</h4>
            <p className="text-xs text-stone-500 mt-1">Dedicated phone &amp; email assistance</p>
          </div>
        </div>

        {/* Customer Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {SAMPLE_REVIEWS.map((review) => (
            <div 
              key={review.id}
              className="p-5 rounded-xl bg-[#FAF8F5] border border-[#EBE4D8] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex text-[#D4AF37]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[10px] text-stone-400">{review.date}</span>
                </div>
                <p className="text-xs sm:text-[13px] text-stone-700 leading-relaxed italic mb-4">
                  "{review.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-stone-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900">{review.author}</span>
                  <span className="text-[11px] text-stone-500">{review.city}</span>
                </div>
                <div className="text-[10px] font-semibold text-[#8C7A6B] mt-0.5 truncate">
                  Purchased: {review.product}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Note on sample reviews during development as requested in prompt */}
        <p className="text-center text-[11px] text-stone-400 mt-6 italic">
          (Sample customer testimonials shown for preview and layout illustration)
        </p>

      </div>
    </section>
  );
};
