import React, { useState, useMemo } from 'react';
import { ProductCategory, Product } from '../types';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { ArrowLeft, ArrowUpDown, Filter } from 'lucide-react';

interface CategoryPageProps {
  categorySlug: ProductCategory;
  onNavigate: (path: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ categorySlug, onNavigate }) => {
  const { products, categories } = useStore();

  const currentCategory = categories.find(c => c.slug === categorySlug);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc' | 'popular'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);

  const categoryProducts = useMemo(() => {
    let list = products.filter(p => p.category === categorySlug);
    if (inStockOnly) {
      list = list.filter(p => p.stock > 0);
    }
    switch (sortBy) {
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        list.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }
    return list;
  }, [products, categorySlug, inStockOnly, sortBy]);

  if (!currentCategory) {
    return (
      <div className="py-20 text-center max-w-lg mx-auto px-4">
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Category Not Found</h2>
        <p className="text-stone-500 text-sm mb-6">The category you requested could not be located in our store catalog.</p>
        <button
          onClick={() => onNavigate('/shop')}
          className="px-6 py-2.5 bg-[#0B132B] text-white rounded-md text-xs font-bold uppercase tracking-wider"
        >
          Back to Shop
        </button>
      </div>
    );
  }

  return (
    <div id={`category-page-${categorySlug}`} className="min-h-screen bg-[#FAF9F5] pb-20">
      
      {/* Category Banner with Image Overlay */}
      <div className="relative bg-[#0B132B] text-white py-14 sm:py-20 overflow-hidden">
        <img
          src={currentCategory.image}
          alt={currentCategory.name}
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B132B] via-[#0B132B]/80 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
          <button
            onClick={() => onNavigate('/shop')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E5C384] hover:underline mb-4 uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Categories</span>
          </button>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif-luxury tracking-tight text-white mb-3">
            {currentCategory.name}
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-normal">
            {currentCategory.description}
          </p>
        </div>
      </div>

      {/* Control Bar: Filters & Count */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-white p-4 rounded-xl border border-[#E9E4DC] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
          
          <div className="text-xs text-stone-600 font-medium">
            Showing <strong>{categoryProducts.length}</strong> items in {currentCategory.name}
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="accent-[#0B132B] w-4 h-4 rounded-sm"
              />
              <span>In Stock Only</span>
            </label>

            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 bg-[#FAF8F5] border border-stone-200 rounded-md text-xs font-semibold text-[#0B132B] focus:outline-hidden"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {categoryProducts.map(prod => (
              <ProductCard
                key={prod.id}
                product={prod}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl border border-stone-200 p-8 max-w-md mx-auto">
            <h3 className="text-base font-bold text-stone-800 mb-1">No items currently available</h3>
            <p className="text-xs text-stone-500 mb-4">We are replenishing this collection. Check back soon or explore other collections.</p>
            <button
              onClick={() => onNavigate('/shop')}
              className="px-5 py-2 bg-[#0B132B] text-white rounded-md text-xs font-bold uppercase tracking-wider"
            >
              Browse All Products
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
