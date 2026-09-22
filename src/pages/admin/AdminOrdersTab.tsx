import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus } from '../../types';
import { 
  Search, 
  ShoppingBag, 
  Eye, 
  X, 
  Phone, 
  MapPin, 
  Package, 
  CheckCircle2, 
  Clock,
  Calendar as CalendarIcon,
  CalendarDays,
  RotateCcw
} from 'lucide-react';
import { 
  TimeRangePreset, 
  DateFilterOptions, 
  filterOrdersByDate, 
  getTimeframeLabel 
} from '../../utils/dateFilter';

export const AdminOrdersTab: React.FC = () => {
  const { orders, updateOrderStatus, supabaseStatus, refreshSupabaseData, isSupabaseSyncing } = useStore();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Calendar Date Filter State
  const [dateOptions, setDateOptions] = useState<DateFilterOptions>({
    preset: 'all',
    customDate: '',
    startDate: '',
    endDate: '',
  });

  // Apply both Date Filter and Search / Status filters
  const filteredOrders = useMemo(() => {
    // 1. Date filter
    const dateFiltered = filterOrdersByDate(orders, dateOptions);

    // 2. Status & Search filter
    return dateFiltered.filter(order => {
      const matchStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
      const q = search.toLowerCase();
      const matchSearch = 
        order.id.toLowerCase().includes(q) ||
        order.orderId.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.mobile.includes(q) ||
        order.city.toLowerCase().includes(q);

      return matchStatus && matchSearch;
    });
  }, [orders, dateOptions, statusFilter, search]);

  const filteredTotalValue = useMemo(() => {
    return filteredOrders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.total : sum, 0);
  }, [filteredOrders]);

  const setPreset = (preset: TimeRangePreset) => {
    setDateOptions({
      preset,
      customDate: '',
      startDate: '',
      endDate: '',
    });
  };

  const handleCustomDate = (dateVal: string) => {
    setDateOptions({
      preset: 'daily',
      customDate: dateVal,
      startDate: '',
      endDate: '',
    });
  };

  const resetCalendarFilter = () => {
    setDateOptions({
      preset: 'all',
      customDate: '',
      startDate: '',
      endDate: '',
    });
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-800';
      case 'Shipped':
      case 'Out for Delivery':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-purple-100 text-purple-800';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800';
      case 'Confirmed':
        return 'bg-indigo-100 text-indigo-800';
      case 'Pending':
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold font-serif-luxury text-[#0B132B]">
              Customer Order Fulfillment
            </h1>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              supabaseStatus.ordersTableExists ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${supabaseStatus.ordersTableExists ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
              <span>{supabaseStatus.ordersTableExists ? 'Supabase Orders Synced' : 'Supabase (Needs SQL)'}</span>
            </span>
          </div>
          <p className="text-xs text-stone-500">
            Track customer orders placed through the website, update dispatch milestones, and inspect delivery addresses.
          </p>
        </div>

        <button
          onClick={() => refreshSupabaseData()}
          disabled={isSupabaseSyncing}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-bold rounded-lg shadow-2xs transition-colors self-start sm:self-auto disabled:opacity-50"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isSupabaseSyncing ? 'animate-spin' : ''}`} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* CALENDAR FILTER SYSTEM (Requested by User) */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-2xs space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#FAF5EB] text-[#C59B51] flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#0B132B] uppercase tracking-wider flex items-center gap-2">
                <span>Filter Orders by Calendar Timeframe</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-[#0B132B] text-white">
                  {getTimeframeLabel(dateOptions)}
                </span>
              </h3>
              <p className="text-[11px] text-stone-500">
                View orders placed Daily (Today), Weekly (Last 7 Days), Monthly (This Month), or a custom date range.
              </p>
            </div>
          </div>

          {dateOptions.preset !== 'all' && (
            <button
              onClick={resetCalendarFilter}
              className="inline-flex items-center gap-1 text-xs text-stone-600 hover:text-stone-900 font-semibold px-2.5 py-1 rounded-md border border-stone-200 hover:bg-stone-50 transition-colors shrink-0"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Show All Orders</span>
            </button>
          )}
        </div>

        {/* Buttons and Date Controls */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1 border-t border-stone-100">
          {/* Quick Preset Buttons */}
          <div className="inline-flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 rounded-lg">
            <button
              onClick={() => setPreset('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                dateOptions.preset === 'all'
                  ? 'bg-[#0B132B] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              All Orders
            </button>
            <button
              onClick={() => setPreset('daily')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                dateOptions.preset === 'daily'
                  ? 'bg-[#0B132B] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              Daily (Today)
            </button>
            <button
              onClick={() => setPreset('weekly')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                dateOptions.preset === 'weekly'
                  ? 'bg-[#0B132B] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              Weekly (7 Days)
            </button>
            <button
              onClick={() => setPreset('monthly')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                dateOptions.preset === 'monthly'
                  ? 'bg-[#0B132B] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              Monthly (This Month)
            </button>
          </div>

          {/* Date Picker Input */}
          <div className="flex items-center gap-2">
            <CalendarDays className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <span className="text-xs font-semibold text-stone-600 shrink-0">Specific Date:</span>
            <input
              type="date"
              value={dateOptions.customDate || ''}
              onChange={(e) => handleCustomDate(e.target.value)}
              className="px-2.5 py-1 text-xs border border-stone-300 rounded-md bg-white focus:outline-hidden focus:border-[#0B132B]"
            />
          </div>
        </div>

        {/* Quick Summary Pill for Active Period */}
        <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between text-xs text-stone-600">
          <div>
            Showing <strong>{filteredOrders.length}</strong> orders matching calendar &amp; search criteria
          </div>
          <div className="font-bold text-[#0B132B]">
            Filtered Volume: ₹{filteredTotalValue.toLocaleString('en-IN')} (100% COD)
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Status Filter */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, customer, phone..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 text-xs focus:outline-hidden focus:border-[#0B132B]"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border border-stone-200 text-xs font-semibold text-[#0B132B] focus:outline-hidden bg-white"
          >
            <option value="all">All Order Statuses ({orders.length})</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="out-for-delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-stone-500 uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">Order ID</th>
                <th className="py-3.5 px-4 font-bold">Customer Name</th>
                <th className="py-3.5 px-4 font-bold">City &amp; PIN</th>
                <th className="py-3.5 px-4 font-bold">Items</th>
                <th className="py-3.5 px-4 font-bold">Total Amount</th>
                <th className="py-3.5 px-4 font-bold">Payment</th>
                <th className="py-3.5 px-4 font-bold">Status Milestone</th>
                <th className="py-3.5 px-4 font-bold text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-stone-900">
                    {order.id}
                    <span className="block text-[10px] font-sans font-normal text-stone-400">
                      {order.createdAt}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="font-semibold text-stone-900">{order.customerName}</div>
                    <div className="text-[11px] text-stone-500">+91 {order.mobile}</div>
                  </td>

                  <td className="py-3 px-4 text-stone-700">
                    <div>{order.city}</div>
                    <span className="text-[10px] text-stone-400">{order.pinCode}</span>
                  </td>

                  <td className="py-3 px-4 text-stone-600">
                    <span className="font-bold">{order.items.reduce((s, i) => s + i.quantity, 0)}</span> items
                  </td>

                  <td className="py-3 px-4 font-bold text-[#0B132B]">
                    ₹{order.total.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3 px-4 uppercase text-[10px] font-bold text-stone-600">
                    Prepaid / COD
                  </td>

                  <td className="py-3 px-4">
                    <select
                      value={order.status}
                      onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                      className={`text-[11px] font-bold uppercase rounded-md px-2 py-1 border-0 focus:outline-hidden cursor-pointer ${getStatusBadge(order.status)}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Out for Delivery">Out for Delivery</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-1.5 text-stone-600 hover:text-[#0B132B] hover:bg-stone-100 rounded-md"
                      title="Inspect Order Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <span className="text-[10px] font-bold text-[#C59B51] uppercase tracking-wider">
                  Order Invoice &amp; Dispatch Details
                </span>
                <h2 className="text-lg font-bold font-mono text-[#0B132B]">
                  {selectedOrder.id}
                </h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer Details */}
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200 text-xs space-y-2">
              <div className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                Customer Shipping Destination
              </div>
              <p className="font-semibold text-stone-900">{selectedOrder.customerName}</p>
              <p className="text-stone-600">
                <MapPin className="w-3.5 h-3.5 inline text-[#C59B51] mr-1" />
                {selectedOrder.address}, {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pinCode}
              </p>
              <p className="text-stone-600">
                <Phone className="w-3.5 h-3.5 inline text-stone-400 mr-1" />
                +91 {selectedOrder.mobile} {selectedOrder.email && `• ${selectedOrder.email}`}
              </p>
            </div>

            {/* Items List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                Purchased Line Items
              </h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-3 text-xs py-1.5 border-b border-stone-100 last:border-b-0">
                    <div className="flex items-center gap-2.5">
                      <img src={item.productImage} alt={item.productName} className="w-10 h-12 object-cover rounded-md border border-stone-200" />
                      <div>
                        <div className="font-bold text-stone-900">{item.productName}</div>
                        <div className="text-[10px] text-stone-500">
                          Qty: {item.quantity} {item.selectedSize && `• ${item.selectedSize}`} {item.selectedColor && `• ${item.selectedColor}`}
                        </div>
                      </div>
                    </div>
                    <div className="font-bold text-stone-900">
                      ₹{(item.priceAtPurchase * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals & Status */}
            <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-stone-400 uppercase font-semibold">Payment Method</span>
                <div className="text-xs font-bold text-stone-800 uppercase">Prepaid / Cash on Delivery</div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-stone-400 uppercase font-semibold">Total Paid</span>
                <div className="text-xl font-extrabold text-[#0B132B]">
                  ₹{selectedOrder.total.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-[#0B132B] text-white rounded-md text-xs font-bold uppercase tracking-wider"
              >
                Close View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
