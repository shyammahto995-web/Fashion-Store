import React, { useState } from 'react';
import { Product } from '../types';
import { Heart, Share2, Star, ShoppingBag, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ShareModal } from './ShareModal';

interface ProductCardProps {
  product: Product;
  onNavigate: (path: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { isInWishlist, toggleWishlist, addToCart, buyNow } = useStore();
  const [showShareModal, setShowShareModal] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  const handleCardClick = () => {
    onNavigate(`/product/${product.slug}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    buyNow(product, 1);
    onNavigate('/checkout');
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowShareModal(true);
  };

  return (
    <>
      <div 
        id={`product-card-${product.id}`}
        className="group relative bg-white rounded-xl border border-[#E9E4DC] hover:border-[#D0C2AE] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Media Container */}
        <div 
          onClick={handleCardClick}
          className="relative aspect-4/5 w-full bg-[#F5F2EB] overflow-hidden cursor-pointer"
        >
          <img
            src={product.images[0]}
            alt={product.name}
            className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
            loading="lazy"
          />

          {/* Discount Badge */}
          {product.discount && product.discount > 0 && (
            <div className="absolute top-2.5 left-2.5 bg-[#0B132B] text-white text-[11px] font-bold px-2.5 py-1 rounded-sm tracking-wider shadow-sm">
              -{product.discount}%
            </div>
          )}

          {/* Low Stock Badge */}
          {isLowStock && (
            <div className="absolute bottom-2.5 left-2.5 bg-amber-600/95 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-sm">
              Only {product.stock} Left
            </div>
          )}

          {/* Out of Stock Overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3">
              <span className="bg-white/95 text-[#0B132B] text-xs font-extrabold uppercase px-3 py-1.5 rounded-sm tracking-widest shadow-lg">
                Out of Stock
              </span>
            </div>
          )}

          {/* Action Buttons: Wishlist & Share */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 z-10">
            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              aria-label="Add to wishlist"
              className={`w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all shadow-xs ${
                inWishlist 
                  ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                  : 'bg-white/90 text-stone-700 hover:text-rose-600 hover:bg-white'
              }`}
            >
              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-600' : ''}`} />
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              aria-label="Share product"
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/90 text-stone-700 hover:text-[#C59B51] hover:bg-white backdrop-blur-md transition-all shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-3.5 sm:p-4 flex-1 flex flex-col justify-between">
          <div onClick={handleCardClick} className="cursor-pointer">
            {/* Category & Brand info */}
            <div className="text-[11px] font-semibold text-[#8C7A6B] uppercase tracking-wider mb-1 truncate">
              {product.category} {product.brand && `• ${product.brand}`}
            </div>

            {/* Product Title */}
            <h3 className="font-semibold text-sm sm:text-[15px] text-[#0B132B] line-clamp-1 group-hover:text-[#C59B51] transition-colors">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mt-1.5">
              <div className="flex items-center text-[#D4AF37]">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'opacity-30'}`} 
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-stone-700">{product.rating.toFixed(1)}</span>
              <span className="text-[11px] text-stone-400">({product.reviewCount})</span>
            </div>

            {/* Pricing Section (Strictly in INR ₹) */}
            <div className="mt-2.5 flex items-baseline gap-2 flex-wrap">
              <span className="text-base sm:text-lg font-bold text-[#0B132B] tracking-tight">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-xs text-stone-400 line-through">
                    ₹{product.originalPrice.toLocaleString('en-IN')}
                  </span>
                  {product.discount && (
                    <span className="text-[11px] font-bold text-emerald-700">
                      {product.discount}% OFF
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Action Buttons: ADD TO CART & BUY NOW */}
          <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              id={`add-to-cart-btn-${product.id}`}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-2 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 disabled:opacity-40 disabled:pointer-events-none text-[#0B132B] rounded-md font-bold text-xs uppercase tracking-wider transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              id={`buy-now-btn-${product.id}`}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-2 bg-[#0B132B] hover:bg-[#1E293B] active:bg-[#050A17] disabled:opacity-40 disabled:pointer-events-none text-white rounded-md font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
            >
              <Zap className="w-3.5 h-3.5 text-[#E5C384]" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>

      {showShareModal && (
        <ShareModal 
          product={product} 
          onClose={() => setShowShareModal(false)} 
        />
      )}
    </>
  );
};
