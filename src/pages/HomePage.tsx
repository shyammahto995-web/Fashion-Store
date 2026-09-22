import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { CategoryShowcase } from '../components/CategoryShowcase';
import { ProductCard } from '../components/ProductCard';
import { PromotionalBanners } from '../components/PromotionalBanners';
import { CustomerTrustSection } from '../components/CustomerTrustSection';
import { NewsletterSection } from '../components/NewsletterSection';
import { useStore } from '../context/StoreContext';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ProductCategory } from '../types';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { products } = useStore();

  const trendingProducts = products.filter(p => p.isTrending).slice(0, 6);
  const newArrivals = products.filter(p => p.isNewArrival || p.category === 'footwear' || p.category === 'accessories').slice(0, 4);

  // Curated collections
  const womenProducts = products.filter(p => p.category === 'women').slice(0, 4);
  const menProducts = products.filter(p => p.category === 'men').slice(0, 4);
  const kidsProducts = products.filter(p => p.category === 'kids').slice(0, 4);
  const accessoriesProducts = products.filter(p => p.category === 'accessories' || p.category === 'watches' || p.category === 'bags').slice(0, 4);
  const beautyProducts = products.filter(p => p.category === 'beauty' || p.category === 'perfumes').slice(0, 4);

  return (
    <div id="home-page" className="space-y-0">
      
      {/* 3. Hero Section & 4. Trust Benefits */}
      <HeroSection 
        onShopClick={() => onNavigate('/shop')}
        onExploreClick={() => onNavigate('/category/women')}
      />

      {/* 5. Browse By Category */}
      <CategoryShowcase 
        onSelectCategory={(slug) => onNavigate(`/category/${slug}`)}
        onViewAllClick={() => onNavigate('/shop')}
      />

      {/* 6. Trending Products */}
      <section id="trending-products" className="py-14 sm:py-18 bg-[#FAF8F5] border-b border-[#E9E4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-end justify-between mb-8 sm:mb-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-[#C59B51] uppercase mb-1">
                <Sparkles className="w-4 h-4" />
                <span>POPULAR THIS WEEK</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] font-serif-luxury tracking-tight">
                TRENDING PRODUCTS
              </h2>
            </div>
            
            <button
              onClick={() => onNavigate('/shop?sort=popular')}
              className="group flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B132B] hover:text-[#C59B51] transition-colors"
            >
              <span>VIEW ALL PRODUCTS</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-5">
            {trendingProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={onNavigate}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 7. Promotional Cards */}
      <PromotionalBanners 
        onShopClick={() => onNavigate('/shop')}
        onJoinClick={() => onNavigate('/about')}
      />

      {/* 8. New Arrivals */}
      <section id="new-arrivals" className="py-14 sm:py-18 bg-white border-b border-[#E9E4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-end justify-between mb-8 sm:mb-10">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-[#8C7A6B] uppercase block mb-1">
                JUST DROPPED
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] font-serif-luxury tracking-tight">
                NEW ARRIVALS
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/shop?sort=newest')}
              className="group flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B132B] hover:text-[#C59B51] transition-colors"
            >
              <span>EXPLORE ALL</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {newArrivals.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={onNavigate}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 9. Women's Collection Section */}
      <section id="womens-collection" className="py-14 sm:py-18 bg-[#FAF8F5] border-b border-[#E9E4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Collection Spotlight Header Banner */}
          <div className="relative rounded-2xl overflow-hidden mb-8 shadow-sm bg-[#162138] text-white">
            <div className="relative z-10 p-6 sm:p-10 max-w-xl space-y-2">
              <span className="text-xs font-bold tracking-[0.2em] text-[#E5C384] uppercase">CURATED EDIT</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold font-serif-luxury">WOMEN'S COLLECTION</h3>
              <p className="text-xs sm:text-sm text-stone-300">
                From hand-embroidered wraps to structured totes, discover versatile staples crafted with breathable silk, cotton, and linen blends.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => onNavigate('/category/women')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-[#0B132B] hover:bg-[#EBDDC8] rounded-sm text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <span>View Full Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {womenProducts.map(p => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
          </div>

        </div>
      </section>

      {/* 10. Men's Collection Section */}
      <section id="mens-collection" className="py-14 sm:py-18 bg-white border-b border-[#E9E4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-end justify-between mb-8 sm:mb-10">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-[#8C7A6B] uppercase block mb-1">
                TAILORED REFINEMENT
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] font-serif-luxury tracking-tight">
                MEN'S COLLECTION
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/category/men')}
              className="group flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B132B] hover:text-[#C59B51] transition-colors"
            >
              <span>VIEW COLLECTION</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {menProducts.map(p => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
          </div>

        </div>
      </section>

      {/* 11. Kids Collection Section */}
      <section id="kids-collection" className="py-14 sm:py-18 bg-[#FAF8F5] border-b border-[#E9E4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-end justify-between mb-8 sm:mb-10">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-[#8C7A6B] uppercase block mb-1">
                GENTLE FABRICS &amp; JOY
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] font-serif-luxury tracking-tight">
                KIDS COLLECTION
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/category/kids')}
              className="group flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B132B] hover:text-[#C59B51] transition-colors"
            >
              <span>VIEW COLLECTION</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {kidsProducts.map(p => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
          </div>

        </div>
      </section>

      {/* 12. Accessories & Watches */}
      <section id="accessories-collection" className="py-14 sm:py-18 bg-white border-b border-[#E9E4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-end justify-between mb-8 sm:mb-10">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-[#8C7A6B] uppercase block mb-1">
                ELEVATED ACCENTS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] font-serif-luxury tracking-tight">
                ACCESSORIES &amp; BAGS
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/category/accessories')}
              className="group flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B132B] hover:text-[#C59B51] transition-colors"
            >
              <span>VIEW ACCESSORIES</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {accessoriesProducts.map(p => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
          </div>

        </div>
      </section>

      {/* 13. Beauty & Perfume */}
      <section id="beauty-perfume-collection" className="py-14 sm:py-18 bg-[#FAF8F5] border-b border-[#E9E4DC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-end justify-between mb-8 sm:mb-10">
            <div>
              <span className="text-xs font-bold tracking-[0.2em] text-[#8C7A6B] uppercase block mb-1">
                SIGNATURE SCENTS &amp; GLOW
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] font-serif-luxury tracking-tight">
                BEAUTY &amp; PERFUMES
              </h2>
            </div>
            <button
              onClick={() => onNavigate('/category/perfumes')}
              className="group flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0B132B] hover:text-[#C59B51] transition-colors"
            >
              <span>VIEW FRAGRANCES</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {beautyProducts.map(p => (
              <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
            ))}
          </div>

        </div>
      </section>

      {/* 14. Customer Trust / Reviews */}
      <CustomerTrustSection />

      {/* 15. Newsletter Subscription */}
      <NewsletterSection />

    </div>
  );
};
