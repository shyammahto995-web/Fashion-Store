import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ArrowRight } from 'lucide-react';

interface WishlistPageProps {
  onNavigate: (path: string) => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({ onNavigate }) => {
  const { wishlist, products } = useStore();

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <div id="wishlist-empty" className="py-24 text-center max-w-md mx-auto px-4 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mb-4 border border-rose-100">
          <Heart className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-serif-luxury text-[#0B132B] mb-2">Your Wishlist is Empty</h2>
        <p className="text-xs sm:text-sm text-stone-500 mb-6">
          Save your favorite dresses, chronographs, and curated accessories for quick access anytime.
        </p>
        <button
          onClick={() => onNavigate('/shop')}
          className="px-6 py-3 bg-[#0B132B] hover:bg-[#1E293B] text-white rounded-md text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
        >
          EXPLORE CATALOG
        </button>
      </div>
    );
  }

  return (
    <div id="wishlist-page" className="py-10 sm:py-14 bg-[#FAF9F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex items-end justify-between mb-8 pb-4 border-b border-stone-200">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] text-[#C59B51] uppercase mb-1 block">
              SAVED PIECES
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-luxury text-[#0B132B] tracking-tight">
              MY WISHLIST ({wishlistProducts.length})
            </h1>
          </div>

          <button
            onClick={() => onNavigate('/shop')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#0B132B] hover:text-[#C59B51] uppercase tracking-wider"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {wishlistProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onNavigate={onNavigate}
            />
          ))}
        </div>

      </div>
    </div>
  );
};
