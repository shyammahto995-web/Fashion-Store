import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';
import { Search, Package, Truck, CheckCircle2, Clock, MapPin, AlertCircle } from 'lucide-react';

interface TrackOrderPageProps {
  initialOrderId?: string;
  onNavigate: (path: string) => void;
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({ 
  initialOrderId = '', 
  onNavigate 
}) => {
  const { orders } = useStore();

  const [orderIdInput, setOrderIdInput] = useState(initialOrderId);
  const [mobileInput, setMobileInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialOrderId) {
      const found = orders.find(o => o.id.toLowerCase() === initialOrderId.toLowerCase());
      if (found) {
        setSearchedOrder(found);
        setHasSearched(true);
      }
    }
  }, [initialOrderId, orders]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setHasSearched(true);

    if (!orderIdInput.trim() && !mobileInput.trim()) {
      setErrorMsg('Please enter either your Order ID or registered Mobile Number.');
      setSearchedOrder(null);
      return;
    }

    const cleanId = orderIdInput.trim().toUpperCase();
    const cleanMobile = mobileInput.replace(/\D/g, '');

    const found = orders.find(o => {
      const matchId = cleanId ? (o.id.toUpperCase() === cleanId || o.orderId.toUpperCase() === cleanId) : false;
      const matchMobile = cleanMobile ? o.mobile.includes(cleanMobile) : false;
      return matchId || matchMobile;
    });

    if (found) {
      setSearchedOrder(found);
    } else {
      setSearchedOrder(null);
      setErrorMsg('No order found matching the provided details. Please verify your Order ID or Mobile Number.');
    }
  };

  const timelineSteps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'Pending', label: 'Order Received', desc: 'Awaiting initial verification' },
    { key: 'Confirmed', label: 'Confirmed', desc: 'Order details verified & scheduled' },
    { key: 'Processing', label: 'In Packing', desc: 'Packed carefully with quality seals' },
    { key: 'Shipped', label: 'Shipped', desc: 'Handed over to courier partner' },
    { key: 'Out for Delivery', label: 'Out for Delivery', desc: 'Courier agent on the way to you' },
    { key: 'Delivered', label: 'Delivered', desc: 'Package received by customer' },
  ];

  const getStepIndex = (status: OrderStatus) => {
    const map: Record<OrderStatus, number> = {
      'Pending': 0,
      'Confirmed': 1,
      'Processing': 2,
      'Shipped': 3,
      'Out for Delivery': 4,
      'Delivered': 5,
      'Cancelled': -1,
    };
    return map[status] ?? 0;
  };

  return (
    <div id="track-order-page" className="py-10 sm:py-16 bg-[#FAF9F5] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold tracking-[0.2em] text-[#C59B51] uppercase mb-1 block">
            LIVE DISPATCH TRACKING
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-serif-luxury text-[#0B132B] tracking-tight">
            TRACK YOUR ORDER
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-stone-600">
            Enter your Order ID (e.g., FS-90123) or your 10-digit mobile number to view real-time shipping milestones.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E9E4DC] shadow-xs mb-10">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Order ID
                </label>
                <input
                  type="text"
                  value={orderIdInput}
                  onChange={(e) => setOrderIdInput(e.target.value)}
                  placeholder="e.g. FS-90123"
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm uppercase focus:outline-hidden focus:border-[#0B132B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobileInput}
                  onChange={(e) => setMobileInput(e.target.value)}
                  placeholder="e.g. 9876543210"
                  className="w-full px-4 py-2.5 rounded-lg border border-stone-300 text-sm focus:outline-hidden focus:border-[#0B132B]"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-[#0B132B] hover:bg-[#1E293B] text-white rounded-md text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Search className="w-4 h-4 text-[#E5C384]" />
              <span>SEARCH ORDER STATUS</span>
            </button>
          </form>
        </div>

        {/* Order Result Timeline */}
        {searchedOrder && (
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#E9E4DC] shadow-md space-y-8 animate-in fade-in">
            
            {/* Top Meta */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
              <div>
                <span className="text-xs text-stone-400 font-semibold uppercase">Tracking ID</span>
                <h2 className="text-xl font-bold font-mono text-[#0B132B]">{searchedOrder.id}</h2>
                <p className="text-xs text-stone-500 mt-0.5">Placed on {searchedOrder.createdAt}</p>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-stone-400 font-semibold uppercase">Current Status</span>
                <div className="text-base font-extrabold text-emerald-700 uppercase tracking-wide">
                  {searchedOrder.status.replace('-', ' ')}
                </div>
                <div className="text-xs text-stone-500 mt-0.5">
                  Courier Partner: BlueDart Express (Air Cargo)
                </div>
              </div>
            </div>

            {/* Visual Milestones Timeline */}
            <div>
              <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-6">
                Shipment Milestones
              </h3>

              <div className="relative pl-6 sm:pl-0 sm:grid sm:grid-cols-6 gap-2">
                {/* Horizontal line for desktop */}
                <div className="hidden sm:block absolute top-4 left-6 right-6 h-0.5 bg-stone-200 -z-0" />

                {timelineSteps.map((step, idx) => {
                  const currentIdx = getStepIndex(searchedOrder.status);
                  const isCompleted = idx <= currentIdx;
                  const isCurrent = idx === currentIdx;

                  return (
                    <div 
                      key={step.key} 
                      className="relative z-10 flex flex-col items-start sm:items-center text-left sm:text-center mb-6 sm:mb-0"
                    >
                      {/* Circle Indicator */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCompleted 
                          ? 'bg-[#0B132B] border-[#0B132B] text-[#E5C384]' 
                          : 'bg-white border-stone-300 text-stone-300'
                      } ${isCurrent ? 'ring-4 ring-[#C59B51]/30' : ''}`}>
                        {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                      </div>

                      {/* Label & Description */}
                      <span className={`text-xs font-bold mt-2 uppercase tracking-tight ${
                        isCompleted ? 'text-stone-900' : 'text-stone-400'
                      }`}>
                        {step.label}
                      </span>
                      <span className="text-[10px] text-stone-400 mt-0.5 max-w-[120px] leading-tight hidden sm:block">
                        {step.desc}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Order Items & Customer Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-stone-200">
              
              {/* Delivery Address */}
              <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200 space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 uppercase tracking-wider">
                  <MapPin className="w-4 h-4 text-[#C59B51]" />
                  <span>Destination Address</span>
                </div>
                <p className="text-xs font-semibold text-stone-900">{searchedOrder.customerName}</p>
                <p className="text-xs text-stone-600">
                  {searchedOrder.address}, {searchedOrder.city}, {searchedOrder.state} - {searchedOrder.pinCode}
                </p>
                <p className="text-xs text-stone-500">Contact: +91 {searchedOrder.mobile}</p>
              </div>

              {/* Items in Parcel */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                  Items in this Parcel ({searchedOrder.items.length})
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {searchedOrder.items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-stone-100 last:border-b-0">
                      <div className="truncate pr-2">
                        <span className="font-semibold text-stone-800">{it.productName}</span>
                        <span className="text-stone-400 ml-1">x{it.quantity}</span>
                      </div>
                      <span className="font-bold text-stone-900 shrink-0">
                        ₹{(it.priceAtPurchase * it.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 flex justify-between text-xs font-extrabold text-[#0B132B]">
                  <span>Total Bill Amount</span>
                  <span>₹{searchedOrder.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};
