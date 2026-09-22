import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, ArrowRight, Package, Truck, Phone, MapPin } from 'lucide-react';

interface OrderConfirmationPageProps {
  orderId: string;
  onNavigate: (path: string) => void;
}

export const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({ 
  orderId, 
  onNavigate 
}) => {
  const { orders } = useStore();

  const order = orders.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4 min-h-[50vh]">
        <h2 className="text-2xl font-bold font-serif-luxury text-[#0B132B] mb-2">Order Not Located</h2>
        <p className="text-xs sm:text-sm text-stone-500 mb-6">
          We could not locate this order id in our records.
        </p>
        <button
          onClick={() => onNavigate('/')}
          className="px-6 py-2.5 bg-[#0B132B] text-white rounded-md text-xs font-bold uppercase tracking-wider"
        >
          Return Home
        </button>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'shipped':
      case 'out-for-delivery':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'processing':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'confirmed':
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  return (
    <div id="order-confirmation-page" className="py-10 sm:py-16 bg-[#FAF9F5] min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Header */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-[#E9E4DC] shadow-sm text-center space-y-4 mb-8">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center border-2 border-emerald-200">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-widest block mb-1">
              CONGRATULATIONS
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-serif-luxury text-[#0B132B] tracking-tight">
              ORDER PLACED SUCCESSFULLY!
            </h1>
            <p className="mt-2 text-stone-600 text-xs sm:text-sm">
              Thank you for shopping with <strong>Fashion Store</strong>. Your order is being processed by our fulfillment team.
            </p>
          </div>

          <div className="inline-flex items-center gap-3 p-3 bg-[#FAF8F5] rounded-xl border border-stone-200 text-xs">
            <span className="text-stone-500 font-semibold">Order Reference:</span>
            <strong className="font-mono text-[#0B132B] text-sm">{order.id}</strong>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getStatusBadge(order.status)}`}>
              {order.status.replace('-', ' ')}
            </span>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate('/')}
              className="px-6 py-3 bg-[#0B132B] hover:bg-[#1E293B] text-white rounded-md text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
            >
              CONTINUE SHOPPING
            </button>

            <button
              onClick={() => onNavigate(`/track-order?orderId=${order.id}`)}
              className="px-6 py-3 bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 rounded-md text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
            >
              <Truck className="w-4 h-4 text-[#C59B51]" />
              <span>TRACK ORDER</span>
            </button>
          </div>
        </div>

        {/* Order Details Breakdown Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E9E4DC] shadow-xs space-y-6">
          
          <h2 className="text-base font-bold text-[#0B132B] uppercase tracking-wider pb-3 border-b border-stone-200 flex items-center gap-2">
            <Package className="w-4 h-4 text-[#C59B51]" />
            <span>ORDER SUMMARY</span>
          </h2>

          {/* Customer & Address Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#FAF8F5] border border-stone-200 text-xs text-stone-700">
            <div className="space-y-1">
              <span className="font-bold text-stone-900 block text-xs uppercase tracking-wider">Customer Details</span>
              <p className="font-semibold text-stone-900">{order.customerName}</p>
              <p className="flex items-center gap-1.5 text-stone-600">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span>+91 {order.mobile}</span>
              </p>
              {order.email && (
                <p className="text-stone-500 truncate">{order.email}</p>
              )}
            </div>

            <div className="space-y-1">
              <span className="font-bold text-stone-900 block text-xs uppercase tracking-wider">Shipping Address</span>
              <p className="flex items-start gap-1.5 text-stone-600">
                <MapPin className="w-3.5 h-3.5 text-[#C59B51] shrink-0 mt-0.5" />
                <span>
                  {order.address}, {order.city}, {order.state} - <strong>{order.pinCode}</strong>
                </span>
              </p>
              <p className="text-stone-500 pt-1">
                Payment: <strong className="uppercase">Prepaid / Cash on Delivery</strong>
              </p>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider">Items in this shipment</h3>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between gap-4 py-2 border-b border-stone-100 last:border-b-0">
                <div className="flex items-center gap-3">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-14 h-16 object-cover rounded-md border border-stone-200"
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900">{item.productName}</h4>
                    <p className="text-[11px] text-stone-500">
                      Qty: {item.quantity} {item.selectedSize && `• Size: ${item.selectedSize}`} {item.selectedColor && `• Color: ${item.selectedColor}`}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs sm:text-sm font-bold text-[#0B132B]">
                    ₹{(item.priceAtPurchase * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="pt-4 border-t border-stone-200 space-y-2 text-xs sm:text-sm text-stone-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-stone-900">₹{order.subtotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-bold text-emerald-700 uppercase">FREE</span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-stone-200 text-base font-extrabold text-[#0B132B]">
              <span>TOTAL PAID</span>
              <span className="text-xl">₹{order.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
