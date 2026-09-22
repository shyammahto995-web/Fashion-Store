import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { ProductCategory, Product } from '../types';
import { Filter, SlidersHorizontal, ArrowUpDown, X, RotateCcw } from 'lucide-react';

interface ShopPageProps {
  onNavigate: (path: string) => void;
  initialSearch?: string;
  initialCategory?: ProductCategory | 'all';
}

export const ShopPage: React.FC<ShopPageProps> = ({ 
  onNavigate,
  initialSearch = '',
  initialCategory = 'all'
}) => {
  const { products, categories } = useStore();

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'price-asc' | 'price-desc' | 'popular' | 'rating'>('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Reset Filters
  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setSortBy('featured');
    setInStockOnly(false);
    setMinRating(0);
    setMaxPrice(10000);
  };

  // Filtered & Sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Search
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    // Stock
    if (inStockOnly) {
      result = result.filter(p => p.stock > 0);
    }

    // Rating
    if (minRating > 0) {
      result = result.filter(p => p.rating >= minRating);
    }

    // Price
    result = result.filter(p => p.price <= maxPrice);

    // Sorting
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        result.sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return result;
  }, [products, selectedCategory, searchQuery, sortBy, inStockOnly, minRating, maxPrice]);

  return (
    <div id="shop-page" className="py-10 sm:py-14 bg-[#FAF9F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Title & Description */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold tracking-[0.2em] text-[#C59B51] uppercase mb-1 block">
            OUR COMPLETE CATALOG
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B132B] font-serif-luxury tracking-tight">
            SHOP ALL
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            Discover our latest fashion, accessories and lifestyle collection crafted with uncompromised quality.
          </p>
        </div>

        {/* Top Control Bar: Search, Mobile Filter Toggle, Sort Selector */}
        <div className="bg-white p-4 rounded-xl border border-[#E9E4DC] shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Search bar inside catalog */}
          <div className="w-full md:w-80">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by keyword, product name..."
              className="w-full px-3.5 py-2 text-xs sm:text-sm rounded-lg bg-[#FAF8F5] border border-stone-200 focus:outline-hidden focus:border-[#0B132B]"
            />
          </div>

          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 bg-stone-100 text-[#0B132B] rounded-lg text-xs font-bold uppercase tracking-wider"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            {/* Results Count */}
            <span className="text-xs text-stone-500 font-medium">
              Showing <strong>{filteredProducts.length}</strong> items
            </span>

            {/* Sort Selector */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-stone-400 hidden sm:inline" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-[#FAF8F5] border border-stone-200 rounded-lg text-xs font-semibold text-[#0B132B] focus:outline-hidden"
              >
                <option value="featured">Sort: Featured</option>
                <option value="newest">Sort: Newest</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Best Rated</option>
              </select>
            </div>
          </div>

        </div>

        {/* Main Layout: Sidebar Filters + 4-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block bg-white p-6 rounded-xl border border-[#E9E4DC] shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#C59B51]" />
                <h3 className="text-sm font-bold text-[#0B132B] uppercase tracking-wider">FILTERS</h3>
              </div>
              <button 
                onClick={handleResetFilters}
                className="text-[11px] font-semibold text-stone-400 hover:text-[#C59B51] flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2.5">Category</h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center justify-between ${
                    selectedCategory === 'all' 
                      ? 'bg-[#0B132B] text-white font-bold' 
                      : 'text-stone-700 hover:bg-[#FAF8F5]'
                  }`}
                >
                  <span>All Categories</span>
                  <span>{products.length}</span>
                </button>
                {categories.map((c) => {
                  const count = products.filter(p => p.category === c.slug).length;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setSelectedCategory(c.slug)}
                      className={`w-full text-left px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center justify-between ${
                        selectedCategory === c.slug 
                          ? 'bg-[#0B132B] text-white font-bold' 
                          : 'text-stone-700 hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <span>{c.name}</span>
                      <span className="text-[10px] opacity-75">{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Max Price Filter */}
            <div className="pt-4 border-t border-stone-200">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Max Price</h4>
                <span className="text-xs font-bold text-[#0B132B]">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#0B132B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>₹500</span>
                <span>₹10,000</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="pt-4 border-t border-stone-200">
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">Customer Rating</h4>
              <div className="space-y-1.5">
                {[
                  { label: 'All Ratings', value: 0 },
                  { label: '4.5 ★ & Above', value: 4.5 },
                  { label: '4.0 ★ & Above', value: 4.0 },
                  { label: '3.5 ★ & Above', value: 3.5 },
                ].map(r => (
                  <label key={r.value} className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
                    <input
                      type="radio"
                      name="rating-filter"
                      checked={minRating === r.value}
                      onChange={() => setMinRating(r.value)}
                      className="accent-[#0B132B]"
                    />
                    <span>{r.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="pt-4 border-t border-stone-200">
              <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-stone-800">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#0B132B] w-4 h-4 rounded-sm"
                />
                <span>In Stock Only</span>
              </label>
            </div>

          </aside>

          {/* Product Grid (Desktop 3 or 4 cols, Tablet 3 cols, Mobile 2 cols) */}
          <div className="lg:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-5">
                {filteredProducts.map(p => (
                  <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-[#FAF8F5] text-[#C59B51] mx-auto flex items-center justify-center mb-4">
                  <Filter className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-stone-900 mb-1">No products match your filters</h3>
                <p className="text-xs text-stone-500 mb-6">
                  Try adjusting the price range, clear your search keyword, or switch categories.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-[#0B132B] text-white rounded-md text-xs font-bold uppercase tracking-wider"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in">
          <div className="w-80 max-w-full bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="text-base font-bold text-[#0B132B]">FILTERS</h3>
              <button onClick={() => setIsMobileFilterOpen(false)} className="p-1 text-stone-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Mobile Categories */}
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-2">Category</h4>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-3 py-2 rounded-md text-xs ${
                    selectedCategory === 'all' ? 'bg-[#0B132B] text-white font-bold' : 'text-stone-700'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`w-full text-left px-3 py-2 rounded-md text-xs ${
                      selectedCategory === c.slug ? 'bg-[#0B132B] text-white font-bold' : 'text-stone-700'
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Max Price */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Max Price:</span>
                <span>₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#0B132B]"
              />
            </div>

            {/* In stock only */}
            <div>
              <label className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="accent-[#0B132B] w-4 h-4"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            <div className="pt-4 border-t border-stone-200 flex gap-2">
              <button
                onClick={handleResetFilters}
                className="flex-1 py-2.5 border border-stone-300 text-stone-700 text-xs font-bold rounded-md"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-[#0B132B] text-white text-xs font-bold rounded-md uppercase"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
