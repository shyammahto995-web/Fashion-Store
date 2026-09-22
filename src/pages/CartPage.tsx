import React from 'react';
import { useStore } from '../context/StoreContext';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

interface CartPageProps {
  onNavigate: (path: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { cart, updateCartQuantity, removeFromCart, getCartTotal } = useStore();
  const { subtotal, discount, shipping, total, itemCount } = getCartTotal();

  if (cart.length === 0) {
    return (
      <div id="cart-page-empty" className="py-20 sm:py-28 text-center max-w-lg mx-auto px-4 min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-[#FAF7F2] text-[#C59B51] flex items-center justify-center mb-5 border border-[#E9E4DC]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold font-serif-luxury text-[#0B132B] mb-2">Your Shopping Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-stone-500 mb-8 max-w-sm">
          Explore our signature dresses, formal menswear, handpicked bags, and chronographs to fill your bag with style.
        </p>
        <button
          onClick={() => onNavigate('/shop')}
          className="px-8 py-3.5 bg-[#0B132B] hover:bg-[#1E293B] text-white rounded-md text-xs font-bold uppercase tracking-wider shadow-md transition-all"
        >
          START SHOPPING
        </button>
      </div>
    );
  }

  return (
    <div id="cart-page" className="py-10 sm:py-14 bg-[#FAF9F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-luxury text-[#0B132B] tracking-tight mb-8">
          SHOPPING CART ({itemCount} {itemCount === 1 ? 'ITEM' : 'ITEMS'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cart.map((item) => (
              <div 
                key={item.id}
                className="bg-white p-4 sm:p-5 rounded-xl border border-[#E9E4DC] shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Product Info & Thumbnail */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-lg border border-stone-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    <span className="text-[10px] font-bold text-[#8C7A6B] uppercase tracking-wider">
                      {item.product.category}
                    </span>
                    <h3 
                      onClick={() => onNavigate(`/product/${item.product.slug}`)}
                      className="text-sm sm:text-base font-bold text-stone-900 truncate hover:text-[#C59B51] cursor-pointer transition-colors"
                    >
                      {item.product.name}
                    </h3>
                    
                    <div className="flex items-center gap-3 text-xs text-stone-500">
                      {item.selectedSize && <span>Size: <strong>{item.selectedSize}</strong></span>}
                      {item.selectedColor && <span>Color: <strong>{item.selectedColor}</strong></span>}
                    </div>

                    <div className="text-sm font-bold text-[#0B132B] pt-1">
                      ₹{item.product.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>

                {/* Quantity & Item Subtotal */}
                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-5 pt-2 sm:pt-0 border-t sm:border-t-0 border-stone-100">
                  <div className="flex items-center border border-stone-300 rounded-md bg-stone-50">
                    <button
                      onClick={() => updateCartQuantity(item.id, -1)}
                      className="p-1.5 text-stone-600 hover:text-black"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-stone-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQuantity(item.id, 1)}
                      className="p-1.5 text-stone-600 hover:text-black"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <div className="text-sm font-bold text-[#0B132B]">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    aria-label="Remove item"
                    className="p-2 text-stone-400 hover:text-rose-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-[#E9E4DC] shadow-xs space-y-5">
            <h3 className="text-base font-bold text-[#0B132B] uppercase tracking-wider pb-3 border-b border-stone-200">
              ORDER SUMMARY
            </h3>

            <div className="space-y-3 text-xs sm:text-sm text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal ({itemCount} items)</span>
                <span className="font-semibold text-stone-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Special Discount</span>
                  <span className="font-semibold">-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>Shipping</span>
                <span className="font-bold text-emerald-700 uppercase text-xs">FREE</span>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline text-base sm:text-lg font-extrabold text-[#0B132B]">
                <span>TOTAL</span>
                <span className="tracking-tight text-xl">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <p className="text-[11px] text-stone-400 leading-tight">
              Transparent Pricing Guarantee: No surprise handling, convenience, or payment gateway fees are added.
            </p>

            <button
              id="proceed-to-checkout-btn"
              onClick={() => onNavigate('/checkout')}
              className="w-full py-3.5 bg-[#0B132B] hover:bg-[#1E293B] text-white rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-xl transition-all"
            >
              <span>PROCEED TO CHECKOUT</span>
              <ArrowRight className="w-4 h-4 text-[#E5C384]" />
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-stone-500 pt-2">
              <ShieldCheck className="w-4 h-4 text-[#C59B51]" />
              <span>100% Safe &amp; Secure Checkout</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
