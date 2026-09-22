import React from 'react';
import { useStore } from '../context/StoreContext';
import { ArrowRight } from 'lucide-react';

interface CategoryShowcaseProps {
  onSelectCategory: (slug: string) => void;
  onViewAllClick: () => void;
}

export const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ 
  onSelectCategory,
  onViewAllClick 
}) => {
  const { categories } = useStore();

  return (
    <section id="browse-by-category" className="py-12 sm:py-16 bg-white border-b border-[#E9E4DC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <span className="text-[11px] sm:text-xs font-bold tracking-[0.2em] text-[#8C7A6B] uppercase block mb-1">
              CURATED SELECTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] tracking-tight font-serif-luxury">
              BROWSE BY CATEGORY
            </h2>
          </div>
          <button
            onClick={onViewAllClick}
            className="group flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B132B] hover:text-[#C59B51] transition-colors"
          >
            <span>VIEW ALL</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Categories Grid / Mobile Scroll */}
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 pt-1 no-scrollbar lg:grid lg:grid-cols-5 xl:grid-cols-9 lg:overflow-visible">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.slug)}
              id={`cat-card-${cat.slug}`}
              className="group flex flex-col items-center shrink-0 w-24 sm:w-28 lg:w-auto cursor-pointer text-center"
            >
              {/* Circular / Rounded Soft Card */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full sm:rounded-2xl p-1 bg-gradient-to-tr from-[#E9DFCF] via-white to-[#DFD3C0] group-hover:from-[#D4AF37] group-hover:to-[#0B132B] shadow-xs group-hover:shadow-lg transition-all duration-300">
                <div className="w-full h-full rounded-full sm:rounded-xl overflow-hidden bg-white">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Title */}
              <span className="mt-3 text-xs sm:text-[13px] font-bold text-stone-800 group-hover:text-[#C59B51] transition-colors tracking-tight line-clamp-1">
                {cat.name}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
