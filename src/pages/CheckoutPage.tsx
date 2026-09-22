import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ShieldCheck, Truck, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { cart, directBuyItem, placeOrder, clearDirectBuy } = useStore();

  const isDirect = Boolean(directBuyItem);
  const itemsToCheckout = isDirect && directBuyItem ? [directBuyItem] : cart;

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [building, setBuilding] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('Maharashtra');
  const [pinCode, setPinCode] = useState('');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'upi' | 'card'>('cod');

  // Validation Errors & Loading
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute pricing
  let subtotal = 0;
  itemsToCheckout.forEach(item => {
    subtotal += item.product.price * item.quantity;
  });
  const discount = 0;
  const shipping = 0; // FREE
  const finalTotal = subtotal - discount + shipping;

  if (itemsToCheckout.length === 0) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4 min-h-[50vh]">
        <h2 className="text-2xl font-bold font-serif-luxury text-[#0B132B] mb-2">No Items to Checkout</h2>
        <p className="text-xs sm:text-sm text-stone-500 mb-6">
          Your cart is currently empty or your session has expired.
        </p>
        <button
          onClick={() => onNavigate('/shop')}
          className="px-6 py-2.5 bg-[#0B132B] text-white rounded-md text-xs font-bold uppercase tracking-wider"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  // Strict Validation Rules as requested in requirements 21 & 22
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Please enter your full name.';
    }

    // Indian 10-digit mobile number: starts with 6-9, exactly 10 digits
    const cleanMobile = mobile.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length !== 10 || !/^[6-9]\d{9}$/.test(cleanMobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number.';
    }

    // 6 digit Indian PIN code
    const cleanPin = pinCode.replace(/\D/g, '');
    if (!cleanPin || cleanPin.length !== 6 || !/^\d{6}$/.test(cleanPin)) {
      newErrors.pinCode = 'Please enter a valid 6-digit PIN code.';
    }

    if (!building.trim()) {
      newErrors.building = 'Please enter House / Flat / Building details.';
    }

    if (!street.trim()) {
      newErrors.street = 'Please enter Street / Area / Landmark.';
    }

    if (!city.trim()) {
      newErrors.city = 'Please enter your city.';
    }

    if (!stateName.trim()) {
      newErrors.state = 'Please enter your state.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const completeAddress = `${building.trim()}, ${street.trim()}`;
      const newOrder = await placeOrder({
        fullName: fullName.trim(),
        mobile: mobile.replace(/\D/g, ''),
        email: email.trim(),
        address: completeAddress,
        city: city.trim(),
        state: stateName.trim(),
        pinCode: pinCode.replace(/\D/g, ''),
      }, isDirect);

      // Redirect immediately to Order Confirmation
      onNavigate(`/order-confirmation/${newOrder.id}`);
    } catch (err: any) {
      alert(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const indianStates = [
    'Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 
    'Gujarat', 'Uttar Pradesh', 'West Bengal', 'Rajasthan', 'Haryana', 
    'Kerala', 'Madhya Pradesh', 'Punjab', 'Bihar', 'Goa', 'Andhra Pradesh',
    'Odisha', 'Assam', 'Uttarakhand', 'Jharkhand'
  ];

  return (
    <div id="checkout-page" className="py-8 sm:py-12 bg-[#FAF9F5] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => {
              if (isDirect) clearDirectBuy();
              onNavigate(isDirect ? '/shop' : '/cart');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#0B132B]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isDirect ? 'Continue Shopping' : 'Back to Cart'}</span>
          </button>
          
          <div className="flex items-center gap-1 text-xs text-stone-500">
            <ShieldCheck className="w-4 h-4 text-[#C59B51]" />
            <span>Secure 256-bit Checkout</span>
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif-luxury text-[#0B132B] tracking-tight mb-8">
          CHECKOUT &amp; DELIVERY
        </h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT: Customer Details & Shipping Address Form */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Step 1: Customer Contact Information */}
              <div className="bg-white p-6 rounded-xl border border-[#E9E4DC] shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                  <span className="w-6 h-6 rounded-full bg-[#0B132B] text-white text-xs font-bold flex items-center justify-center">1</span>
                  <h2 className="text-base font-bold text-[#0B132B]">CUSTOMER INFORMATION</h2>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="checkout-full-name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#0B132B] focus:outline-hidden ${
                        errors.fullName ? 'border-rose-500 bg-rose-50/30' : 'border-stone-300 focus:border-[#0B132B]'
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Mobile Number * (10 Digits)
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-xs font-bold text-stone-400">+91</span>
                        <input
                          type="tel"
                          id="checkout-mobile"
                          maxLength={10}
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                          placeholder="9876543210"
                          className={`w-full pl-11 pr-3 py-2.5 rounded-md border text-sm text-[#0B132B] focus:outline-hidden ${
                            errors.mobile ? 'border-rose-500 bg-rose-50/30' : 'border-stone-300 focus:border-[#0B132B]'
                          }`}
                        />
                      </div>
                      {errors.mobile && (
                        <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.mobile}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        id="checkout-email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="priya@example.com"
                        className="w-full px-3.5 py-2.5 rounded-md border border-stone-300 text-sm text-[#0B132B] focus:outline-hidden focus:border-[#0B132B]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 2: Delivery Address */}
              <div className="bg-white p-6 rounded-xl border border-[#E9E4DC] shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                  <span className="w-6 h-6 rounded-full bg-[#0B132B] text-white text-xs font-bold flex items-center justify-center">2</span>
                  <h2 className="text-base font-bold text-[#0B132B]">DELIVERY ADDRESS</h2>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      House / Flat / Building *
                    </label>
                    <input
                      type="text"
                      id="checkout-building"
                      value={building}
                      onChange={(e) => setBuilding(e.target.value)}
                      placeholder="e.g. Flat 402, Royale Palms"
                      className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#0B132B] focus:outline-hidden ${
                        errors.building ? 'border-rose-500 bg-rose-50/30' : 'border-stone-300 focus:border-[#0B132B]'
                      }`}
                    />
                    {errors.building && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.building}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                      Street / Area / Landmark *
                    </label>
                    <input
                      type="text"
                      id="checkout-street"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="e.g. Hill Road, Bandra West, Near St. Andrew's Church"
                      className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#0B132B] focus:outline-hidden ${
                        errors.street ? 'border-rose-500 bg-rose-50/30' : 'border-stone-300 focus:border-[#0B132B]'
                      }`}
                    />
                    {errors.street && (
                      <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle className="w-3.5 h-3.5" /> {errors.street}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        id="checkout-city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Mumbai"
                        className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#0B132B] focus:outline-hidden ${
                          errors.city ? 'border-rose-500 bg-rose-50/30' : 'border-stone-300 focus:border-[#0B132B]'
                        }`}
                      />
                      {errors.city && (
                        <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        State *
                      </label>
                      <select
                        id="checkout-state"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-md border border-stone-300 text-sm text-[#0B132B] bg-white focus:outline-hidden focus:border-[#0B132B]"
                      >
                        {indianStates.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                        PIN Code * (6 Digits)
                      </label>
                      <input
                        type="text"
                        id="checkout-pincode"
                        maxLength={6}
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="400050"
                        className={`w-full px-3.5 py-2.5 rounded-md border text-sm text-[#0B132B] focus:outline-hidden ${
                          errors.pinCode ? 'border-rose-500 bg-rose-50/30' : 'border-stone-300 focus:border-[#0B132B]'
                        }`}
                      />
                      {errors.pinCode && (
                        <p className="text-xs text-rose-600 mt-1 flex items-center gap-1 font-medium">
                          <AlertCircle className="w-3.5 h-3.5" /> {errors.pinCode}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method Preference */}
              <div className="bg-white p-6 rounded-xl border border-[#E9E4DC] shadow-xs space-y-4">
                <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
                  <span className="w-6 h-6 rounded-full bg-[#0B132B] text-white text-xs font-bold flex items-center justify-center">3</span>
                  <h2 className="text-base font-bold text-[#0B132B]">PAYMENT METHOD</h2>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl border-2 border-[#0B132B] bg-[#FAF8F5] relative">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="paymentMethod"
                          checked={true}
                          readOnly
                          className="accent-[#0B132B] w-4 h-4 mt-0.5"
                        />
                        <div>
                          <div className="text-sm font-bold text-stone-900 flex items-center gap-2">
                            <span>Cash on Delivery (COD)</span>
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-sm">
                              ONLY PAYMENT MODE AVAILABLE
                            </span>
                          </div>
                          <p className="text-xs text-stone-600 mt-1">
                            Pay in cash or UPI scan at your doorstep upon receiving your package. Zero extra COD fees!
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-[11px] text-stone-500">
                            <span className="flex items-center gap-1 font-semibold text-emerald-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Doorstep Inspection Supported
                            </span>
                            <span className="flex items-center gap-1 font-semibold text-stone-700">
                              <ShieldCheck className="w-3.5 h-3.5 text-[#C59B51]" /> 100% Safe &amp; Risk-Free
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-500 italic px-1">
                    * All orders are currently fulfilled exclusively through verified Cash on Delivery for maximum buyer safety.
                  </p>
                </div>
              </div>

            </div>

            {/* RIGHT: Order Summary & Review */}
            <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-[#E9E4DC] shadow-xs space-y-6">
              <h2 className="text-base font-bold text-[#0B132B] uppercase tracking-wider pb-3 border-b border-stone-200">
                ORDER DETAILS ({itemsToCheckout.reduce((s, i) => s + i.quantity, 0)} ITEMS)
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {itemsToCheckout.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-stone-100 last:border-b-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-14 h-16 object-cover rounded-md border border-stone-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 truncate">{item.product.name}</h4>
                      <p className="text-[11px] text-stone-500">
                        Qty: {item.quantity} {item.selectedSize && `• Size: ${item.selectedSize}`} {item.selectedColor && `• Color: ${item.selectedColor}`}
                      </p>
                      <p className="text-xs font-bold text-[#0B132B] mt-0.5">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation (Strictly INR ₹) */}
              <div className="pt-3 border-t border-stone-200 space-y-2.5 text-xs sm:text-sm text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Charge</span>
                  <span className="font-bold text-emerald-700 uppercase">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes &amp; Fees</span>
                  <span className="font-semibold text-stone-900">₹0 (Included)</span>
                </div>
                
                <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline text-base sm:text-lg font-extrabold text-[#0B132B]">
                  <span>FINAL TOTAL</span>
                  <span className="text-2xl text-[#0B132B] tracking-tight">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                id="place-order-submit-btn"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#0B132B] hover:bg-[#1E293B] active:bg-black text-white rounded-md text-xs sm:text-sm font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>CONFIRMING ORDER...</span>
                ) : (
                  <>
                    <span>PLACE ORDER (₹{finalTotal.toLocaleString('en-IN')})</span>
                    <CheckCircle2 className="w-4 h-4 text-[#E5C384]" />
                  </>
                )}
              </button>

              <div className="space-y-2 pt-2 text-[11px] text-stone-400 text-center">
                <p>By placing this order, you agree to Fashion Store's Terms of Sale &amp; Privacy Policy.</p>
                <div className="flex items-center justify-center gap-1.5 text-stone-500 font-semibold">
                  <Truck className="w-3.5 h-3.5 text-[#C59B51]" />
                  <span>Estimated delivery within 2-4 business days.</span>
                </div>
              </div>

            </div>

          </div>
        </form>

      </div>
    </div>
  );
};
