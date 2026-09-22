import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { ShareModal } from '../components/ShareModal';
import { 
  Star, 
  Heart, 
  Share2, 
  Truck, 
  RotateCcw, 
  ShieldCheck, 
  Minus, 
  Plus, 
  ShoppingBag, 
  Zap, 
  Check, 
  Play,
  ArrowLeft
} from 'lucide-react';

interface ProductDetailPageProps {
  productSlug: string;
  onNavigate: (path: string) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ 
  productSlug, 
  onNavigate 
}) => {
  const { products, addToCart, buyNow, isInWishlist, toggleWishlist } = useStore();

  const product = products.find(p => p.slug === productSlug);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'shipping' | 'reviews'>('desc');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Initialize size and color when product loads
  React.useEffect(() => {
    if (product) {
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      setSelectedImageIndex(0);
      setQuantity(1);
      window.scrollTo(0, 0);
    }
  }, [productSlug, product]);

  if (!product) {
    return (
      <div className="py-24 text-center max-w-lg mx-auto px-4 min-h-[50vh]">
        <h2 className="text-2xl font-bold text-stone-900 mb-2">Product Not Found</h2>
        <p className="text-stone-500 text-sm mb-6">
          The requested fashion piece might be sold out or no longer available.
        </p>
        <button
          onClick={() => onNavigate('/shop')}
          className="px-6 py-2.5 bg-[#0B132B] text-white rounded-md text-xs font-bold uppercase tracking-wider"
        >
          Explore All Products
        </button>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;
  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleBuyNow = () => {
    buyNow(product, quantity, selectedSize, selectedColor);
    onNavigate('/checkout');
  };

  return (
    <div id="product-detail-page" className="py-8 sm:py-12 bg-[#FAF9F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Back button */}
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-6">
          <button 
            onClick={() => onNavigate('/shop')} 
            className="hover:text-[#0B132B] flex items-center gap-1 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Shop</span>
          </button>
          <span>/</span>
          <button 
            onClick={() => onNavigate(`/category/${product.category}`)} 
            className="hover:text-[#0B132B] capitalize"
          >
            {product.category}
          </button>
          <span>/</span>
          <span className="text-[#0B132B] font-semibold truncate max-w-[200px] sm:max-w-md">
            {product.name}
          </span>
        </div>

        {/* Main Grid: Gallery on Left, Details on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white p-5 sm:p-8 rounded-2xl border border-[#E9E4DC] shadow-xs">
          
          {/* LEFT: Product Media Gallery */}
          <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Thumbnails Column */}
            <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto sm:max-h-[550px] no-scrollbar shrink-0">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx 
                      ? 'border-[#0B132B] ring-2 ring-[#C59B51]/30' 
                      : 'border-stone-200 hover:border-stone-400 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}

              {/* Video Thumbnail if present */}
              {product.videoUrl && (
                <button
                  onClick={() => setShowVideoModal(true)}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-stone-300 hover:border-[#0B132B] bg-stone-900 text-white flex flex-col items-center justify-center gap-1 shrink-0"
                >
                  <Play className="w-5 h-5 fill-current text-[#E5C384]" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Video</span>
                </button>
              )}
            </div>

            {/* Main Stage Image */}
            <div className="relative flex-1 aspect-4/5 sm:aspect-square lg:aspect-4/5 bg-[#F7F4EE] rounded-xl overflow-hidden border border-stone-200">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />

              {/* Discount Tag */}
              {product.discount && product.discount > 0 && (
                <div className="absolute top-4 left-4 bg-[#0B132B] text-white text-xs font-bold px-3 py-1 rounded-sm shadow-md">
                  {product.discount}% OFF
                </div>
              )}

              {/* Wishlist & Share buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button
                  onClick={() => toggleWishlist(product.id)}
                  aria-label="Wishlist"
                  className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md shadow-md transition-all ${
                    inWishlist 
                      ? 'bg-rose-50 text-rose-600' 
                      : 'bg-white/90 text-stone-700 hover:text-rose-600'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-600' : ''}`} />
                </button>

                <button
                  onClick={() => setShowShareModal(true)}
                  aria-label="Share"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/90 text-stone-700 hover:text-[#C59B51] backdrop-blur-md shadow-md transition-all"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>

              {/* Video Play Button on image if video exists */}
              {product.videoUrl && (
                <button
                  onClick={() => setShowVideoModal(true)}
                  className="absolute bottom-4 right-4 bg-[#0B132B]/90 hover:bg-[#0B132B] text-white text-xs font-bold px-3.5 py-2 rounded-full flex items-center gap-1.5 shadow-lg backdrop-blur-xs transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-[#E5C384]" />
                  <span>Watch Video</span>
                </button>
              )}
            </div>

          </div>

          {/* RIGHT: Product Information & Purchase Actions */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category, Brand, SKU */}
              <div className="flex items-center justify-between text-xs text-stone-500 uppercase tracking-wider font-semibold">
                <span>{product.category} {product.brand && `• ${product.brand}`}</span>
                <span>SKU: {product.sku}</span>
              </div>

              {/* Product Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B132B] font-serif-luxury tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'opacity-30'}`} 
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-stone-800">{product.rating.toFixed(1)}</span>
                <span className="text-xs text-stone-400">({product.reviewCount} customer reviews)</span>
              </div>

              {/* Pricing in INR ₹ (Transparent pricing, no hidden costs) */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#ECE5D9] flex items-baseline gap-3 flex-wrap">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#0B132B] tracking-tight">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <>
                    <span className="text-base sm:text-lg text-stone-400 line-through">
                      ₹{product.originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-sm">
                      {product.discount}% OFF
                    </span>
                  </>
                )}
                <div className="w-full text-xs text-stone-500 mt-1 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#C59B51]" />
                  <span>Free all-India shipping on this item. Inclusive of all taxes.</span>
                </div>
              </div>

              {/* Short Description */}
              <p className="text-stone-600 text-sm leading-relaxed">
                {product.description}
              </p>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                      Select Size: <span className="text-[#C59B51]">{selectedSize}</span>
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-3.5 py-2 rounded-md text-xs font-bold border transition-all ${
                          selectedSize === s
                            ? 'bg-[#0B132B] text-white border-[#0B132B] shadow-xs'
                            : 'bg-white text-stone-700 border-stone-300 hover:border-stone-500'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Select Color: <span className="text-[#C59B51]">{selectedColor}</span>
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 ${
                          selectedColor === c
                            ? 'bg-[#0B132B] text-white border-[#0B132B] shadow-xs'
                            : 'bg-white text-stone-700 border-stone-300 hover:border-stone-500'
                        }`}
                      >
                        {selectedColor === c && <Check className="w-3 h-3 text-[#E5C384]" />}
                        <span>{c}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="pt-2 flex items-center gap-4">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider">Quantity:</span>
                <div className="flex items-center border border-stone-300 rounded-md bg-stone-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="p-2 text-stone-600 hover:text-black disabled:opacity-30"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-stone-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="p-2 text-stone-600 hover:text-black disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Stock Indicator */}
                {isOutOfStock ? (
                  <span className="text-xs font-bold text-rose-600 uppercase">Out of Stock</span>
                ) : isLowStock ? (
                  <span className="text-xs font-bold text-amber-600">Only {product.stock} left in stock!</span>
                ) : (
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} available)
                  </span>
                )}
              </div>
            </div>

            {/* ACTION BUTTONS: BUY NOW & ADD TO CART */}
            <div className="space-y-3 pt-4 border-t border-stone-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-stone-100 hover:bg-stone-200 active:bg-stone-300 text-[#0B132B] font-bold text-xs sm:text-sm uppercase tracking-wider rounded-md border border-stone-300 transition-colors disabled:opacity-40"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>ADD TO CART</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-[#0B132B] hover:bg-[#1E293B] active:bg-black text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-md shadow-md hover:shadow-xl transition-all disabled:opacity-40"
                >
                  <Zap className="w-4 h-4 text-[#E5C384]" />
                  <span>BUY NOW</span>
                </button>
              </div>

              {/* Share product button */}
              <button
                onClick={() => setShowShareModal(true)}
                className="w-full py-2.5 text-center text-xs font-bold text-stone-600 hover:text-[#0B132B] flex items-center justify-center gap-1.5 uppercase tracking-wider"
              >
                <Share2 className="w-3.5 h-3.5 text-[#C59B51]" />
                <span>SHARE THIS PRODUCT</span>
              </button>
            </div>

            {/* Trust Badges under buttons */}
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-stone-100 text-center">
              <div className="flex flex-col items-center gap-1 p-2">
                <Truck className="w-4 h-4 text-[#C59B51]" />
                <span className="text-[10px] font-semibold text-stone-700">Free Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2">
                <RotateCcw className="w-4 h-4 text-[#C59B51]" />
                <span className="text-[10px] font-semibold text-stone-700">30 Days Return</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-2">
                <ShieldCheck className="w-4 h-4 text-[#C59B51]" />
                <span className="text-[10px] font-semibold text-stone-700">Authentic 100%</span>
              </div>
            </div>

          </div>

        </div>

        {/* Detailed Tabs: Description, Specs, Shipping, Reviews */}
        <div className="mt-12 bg-white rounded-2xl border border-[#E9E4DC] p-6 sm:p-8 shadow-xs">
          
          <div className="flex border-b border-stone-200 gap-4 sm:gap-8 overflow-x-auto no-scrollbar">
            {[
              { id: 'desc', label: 'DESCRIPTION' },
              { id: 'specs', label: 'SPECIFICATIONS' },
              { id: 'shipping', label: 'SHIPPING & RETURNS' },
              { id: 'reviews', label: `REVIEWS (${product.reviewCount})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 text-xs sm:text-sm font-bold tracking-wider uppercase border-b-2 transition-colors shrink-0 ${
                  activeTab === tab.id
                    ? 'border-[#0B132B] text-[#0B132B]'
                    : 'border-transparent text-stone-400 hover:text-stone-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="py-6 text-sm text-stone-700 leading-relaxed">
            {activeTab === 'desc' && (
              <div className="space-y-4 max-w-3xl">
                <p>{product.description}</p>
                <p>
                  Every piece in the Fashion Store collection undergoes careful fabric grading, tensile testing, and seam inspections to guarantee endurance and luxurious comfort.
                </p>
                {product.tags && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {product.tags.map(t => (
                      <span key={t} className="px-2.5 py-1 bg-stone-100 rounded-md text-[11px] font-semibold text-stone-600">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="max-w-xl space-y-3">
                <div className="grid grid-cols-2 py-2 border-b border-stone-100">
                  <span className="font-semibold text-stone-500 text-xs">Category</span>
                  <span className="text-stone-900 capitalize text-xs font-bold">{product.category}</span>
                </div>
                <div className="grid grid-cols-2 py-2 border-b border-stone-100">
                  <span className="font-semibold text-stone-500 text-xs">Brand</span>
                  <span className="text-stone-900 text-xs font-bold">{product.brand || 'Fashion Store Luxe'}</span>
                </div>
                <div className="grid grid-cols-2 py-2 border-b border-stone-100">
                  <span className="font-semibold text-stone-500 text-xs">Material / Composition</span>
                  <span className="text-stone-900 text-xs">{product.material || 'Premium Fabric & Hardware'}</span>
                </div>
                <div className="grid grid-cols-2 py-2 border-b border-stone-100">
                  <span className="font-semibold text-stone-500 text-xs">SKU Code</span>
                  <span className="text-stone-900 text-xs font-mono">{product.sku}</span>
                </div>
                <div className="grid grid-cols-2 py-2 border-b border-stone-100">
                  <span className="font-semibold text-stone-500 text-xs">Origin</span>
                  <span className="text-stone-900 text-xs">Crafted for Fashion Store India</span>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="max-w-2xl space-y-4">
                <h4 className="font-bold text-stone-900 text-sm">Transparent Delivery Promise</h4>
                <p>
                  We offer <strong>Free Standard Shipping</strong> across all PIN codes in India. No hidden platform charges or convenience fees are added at checkout.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-xs text-stone-600">
                  <li><strong>Metro Cities:</strong> Delivered within 2-4 business days.</li>
                  <li><strong>Rest of India:</strong> Delivered within 4-7 business days.</li>
                  <li><strong>Hassle-Free 30-Day Returns:</strong> If you are not completely satisfied with the fit or quality, request a complimentary doorstep reverse pickup.</li>
                </ul>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6 max-w-2xl">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-[#FAF8F5] border border-stone-200">
                  <div className="text-center pr-4 border-r border-stone-200">
                    <div className="text-3xl font-extrabold text-[#0B132B]">{product.rating.toFixed(1)}</div>
                    <div className="flex text-[#D4AF37] justify-center mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-stone-600">
                    Based on <strong>{product.reviewCount}</strong> verified customer purchases. 98% of customers recommend this item.
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 bg-white rounded-lg border border-stone-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-stone-900">Verified Buyer</span>
                      <span className="text-[10px] text-stone-400">2 days ago</span>
                    </div>
                    <div className="flex text-[#D4AF37] mb-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-2.5 h-2.5 fill-current" />
                      ))}
                    </div>
                    <p className="text-xs text-stone-600">
                      Exceptional finish and packaging. Looks even more impressive in person!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Related Products from same category */}
        {relatedProducts.length > 0 && (
          <div className="mt-14">
            <h3 className="text-xl sm:text-2xl font-bold font-serif-luxury text-[#0B132B] mb-6">
              YOU MAY ALSO LIKE
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Share Modal */}
      {showShareModal && (
        <ShareModal product={product} onClose={() => setShowShareModal(false)} />
      )}

      {/* Video Modal */}
      {showVideoModal && product.videoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-2xl bg-black rounded-2xl overflow-hidden shadow-2xl">
            <video 
              src={product.videoUrl} 
              controls 
              autoPlay 
              className="w-full aspect-video object-cover" 
            />
            <button
              onClick={() => setShowVideoModal(false)}
              className="absolute top-3 right-3 px-3 py-1 bg-white/20 hover:bg-white/40 text-white rounded-full text-xs font-bold"
            >
              Close ✕
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
