import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus } from '../../types';
import { 
  IndianRupee, 
  ShoppingBag, 
  Package, 
  Users, 
  AlertTriangle, 
  TrendingUp, 
  ArrowUpRight,
  Calendar as CalendarIcon,
  CalendarDays,
  Clock,
  Filter,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { 
  TimeRangePreset, 
  DateFilterOptions, 
  filterOrdersByDate, 
  getTimeframeLabel 
} from '../../utils/dateFilter';

interface AdminDashboardTabProps {
  onNavigateTab: (tab: 'products' | 'orders' | 'customers' | 'settings') => void;
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({ onNavigateTab }) => {
  const { products, orders, customers, updateOrderStatus, updateProduct } = useStore();

  // Calendar Date Filter State
  const [dateOptions, setDateOptions] = useState<DateFilterOptions>({
    preset: 'monthly', // default to monthly as standard analytics view
    customDate: '',
    startDate: '',
    endDate: '',
  });

  // Calculate filtered orders based on calendar selection
  const periodOrders = useMemo(() => {
    return filterOrdersByDate(orders, dateOptions);
  }, [orders, dateOptions]);

  // Period-specific sales and metrics
  const periodRevenue = useMemo(() => {
    return periodOrders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.total : sum, 0);
  }, [periodOrders]);

  const periodDelivered = periodOrders.filter(o => o.status === 'Delivered').length;
  const periodPending = periodOrders.filter(o => o.status === 'Pending' || o.status === 'Confirmed' || o.status === 'Processing').length;
  const periodAOV = periodOrders.length > 0 ? Math.round(periodRevenue / periodOrders.length) : 0;

  // All-time totals for reference
  const allTimeRevenue = orders.reduce((sum, o) => o.status !== 'Cancelled' ? sum + o.total : sum, 0);
  const lowStockProducts = products.filter(p => p.stock <= 10);
  const recentPeriodOrders = [...periodOrders].slice(0, 6);

  const handleQuickRestock = (productId: string, currentStock: number) => {
    updateProduct(productId, { stock: currentStock + 20 });
  };

  const setPreset = (preset: TimeRangePreset) => {
    setDateOptions({
      preset,
      customDate: '',
      startDate: '',
      endDate: '',
    });
  };

  const handleCustomDateChange = (dateVal: string) => {
    setDateOptions({
      preset: 'daily',
      customDate: dateVal,
      startDate: '',
      endDate: '',
    });
  };

  const handleStartDateChange = (start: string) => {
    setDateOptions(prev => ({
      ...prev,
      preset: 'custom',
      startDate: start,
    }));
  };

  const handleEndDateChange = (end: string) => {
    setDateOptions(prev => ({
      ...prev,
      preset: 'custom',
      endDate: end,
    }));
  };

  const resetFilter = () => {
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
    <div className="space-y-8">
      
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif-luxury text-[#0B132B]">
            Store Executive Overview
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Real-time sales, live customer orders, inventory levels, and customer records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Storefront Active
          </span>
        </div>
      </div>

      {/* CALENDAR & PERIOD SYSTEM (Requested by User) */}
      <div className="bg-white p-5 rounded-xl border-2 border-[#C59B51]/30 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#FAF5EB] text-[#C59B51] flex items-center justify-center">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#0B132B] uppercase tracking-wider flex items-center gap-2">
                <span>Sales &amp; Orders Calendar Filter</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-sm bg-[#0B132B] text-white">
                  {getTimeframeLabel(dateOptions)}
                </span>
              </h2>
              <p className="text-[11px] text-stone-500">
                Filter total sales revenue and customer orders by Daily, Weekly, Monthly, or Yearly ranges.
              </p>
            </div>
          </div>

          {/* Reset button if not all time */}
          {dateOptions.preset !== 'all' && (
            <button
              onClick={resetFilter}
              className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 font-semibold px-2.5 py-1 rounded-md border border-stone-200 hover:bg-stone-50 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to All Time</span>
            </button>
          )}
        </div>

        {/* Timeframe Presets & Date Inputs */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-1">
          {/* Preset Buttons */}
          <div className="inline-flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 rounded-lg">
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
            <button
              onClick={() => setPreset('yearly')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                dateOptions.preset === 'yearly'
                  ? 'bg-[#0B132B] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              Yearly (2026)
            </button>
            <button
              onClick={() => setPreset('all')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                dateOptions.preset === 'all'
                  ? 'bg-[#0B132B] text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
              }`}
            >
              All Time
            </button>
          </div>

          {/* Specific Date & Range Pickers */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-stone-600">
              <CalendarDays className="w-3.5 h-3.5 text-stone-400" />
              <span className="font-semibold">Pick Specific Date:</span>
              <input
                type="date"
                value={dateOptions.customDate || ''}
                onChange={(e) => handleCustomDateChange(e.target.value)}
                className="px-2.5 py-1 text-xs border border-stone-300 rounded-md bg-white focus:outline-hidden focus:border-[#0B132B]"
              />
            </div>

            <div className="flex items-center gap-1.5 text-xs text-stone-600">
              <span className="font-semibold">Range:</span>
              <input
                type="date"
                value={dateOptions.startDate || ''}
                onChange={(e) => handleStartDateChange(e.target.value)}
                placeholder="From"
                className="px-2 py-1 text-xs border border-stone-300 rounded-md bg-white focus:outline-hidden"
              />
              <span className="text-stone-400">to</span>
              <input
                type="date"
                value={dateOptions.endDate || ''}
                onChange={(e) => handleEndDateChange(e.target.value)}
                placeholder="To"
                className="px-2 py-1 text-xs border border-stone-300 rounded-md bg-white focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Dynamic Period Metrics Banner */}
        <div className="mt-2 pt-3 border-t border-stone-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E9E4DC]">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
              Period Sales ({dateOptions.preset.toUpperCase()})
            </span>
            <div className="text-xl font-extrabold text-[#0B132B] mt-0.5">
              ₹{periodRevenue.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-stone-500 block">
              All time: ₹{allTimeRevenue.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E9E4DC]">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
              Period Orders
            </span>
            <div className="text-xl font-extrabold text-[#0B132B] mt-0.5">
              {periodOrders.length}
            </div>
            <span className="text-[10px] text-stone-500 block">
              Total lifetime: {orders.length} orders
            </span>
          </div>

          <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E9E4DC]">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
              Avg. Order Value
            </span>
            <div className="text-xl font-extrabold text-[#0B132B] mt-0.5">
              ₹{periodAOV.toLocaleString('en-IN')}
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold block">
              100% Cash on Delivery
            </span>
          </div>

          <div className="p-3 bg-[#FAF8F5] rounded-lg border border-[#E9E4DC]">
            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
              Milestones in Period
            </span>
            <div className="text-xs font-bold text-stone-800 mt-1 flex flex-col gap-0.5">
              <span className="text-emerald-700">✓ {periodDelivered} Delivered</span>
              <span className="text-amber-700">⏳ {periodPending} In Pipeline</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Primary KPI Metric Cards (Reflects Filtered Period & Overall Store) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              {dateOptions.preset === 'all' ? 'Total Sales' : 'Filtered Sales'}
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#FAF5EB] text-[#C59B51] flex items-center justify-center">
              <IndianRupee className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0B132B]">
            ₹{periodRevenue.toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{periodOrders.length} orders in {dateOptions.preset} view</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
              {dateOptions.preset === 'all' ? 'Total Orders' : 'Filtered Orders'}
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0B132B]">
            {periodOrders.length}
          </div>
          <div className="text-[11px] text-stone-500">
            {periodPending} pending dispatch
          </div>
        </div>

        {/* Total Products */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Products</span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0B132B]">
            {products.length}
          </div>
          <div className="text-[11px] text-amber-700 font-semibold">
            {lowStockProducts.length} low stock warnings
          </div>
        </div>

        {/* Registered Customers */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Customers</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-[#0B132B]">
            {customers.length}
          </div>
          <div className="text-[11px] text-stone-500">
            Active Indian customer accounts
          </div>
        </div>

      </div>

      {/* Grid: Low Stock Alert + Period Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Recent Period Orders Table (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#0B132B] uppercase tracking-wider">
                Orders in {getTimeframeLabel(dateOptions)} ({periodOrders.length})
              </h2>
              <span className="text-xs text-stone-400">Live order queue for selected calendar period</span>
            </div>
            <button
              onClick={() => onNavigateTab('orders')}
              className="text-xs font-bold text-[#0B132B] hover:text-[#C59B51] flex items-center gap-1"
            >
              <span>View All in Orders Tab</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-stone-500 uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4 font-bold">Order ID</th>
                  <th className="py-3 px-4 font-bold">Customer</th>
                  <th className="py-3 px-4 font-bold">Total</th>
                  <th className="py-3 px-4 font-bold">Status</th>
                  <th className="py-3 px-4 font-bold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentPeriodOrders.length > 0 ? (
                  recentPeriodOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-stone-900">
                        {order.id}
                        <span className="block text-[10px] font-normal text-stone-400 font-sans">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-stone-900">{order.customerName}</div>
                        <div className="text-[11px] text-stone-500">{order.city}</div>
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900">
                        ₹{order.total.toLocaleString('en-IN')}
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
                      <td className="py-3 px-4">
                        <button
                          onClick={() => onNavigateTab('orders')}
                          className="text-xs font-semibold text-[#0B132B] hover:text-[#C59B51] underline"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-xs text-stone-400">
                      No orders found for this selected calendar timeframe. Try switching to Weekly, Monthly, or All Time.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-stone-200 shadow-2xs p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="w-4 h-4" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-stone-900">
                Low Inventory ({lowStockProducts.length})
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs font-semibold text-[#0B132B] hover:underline"
            >
              Catalog
            </button>
          </div>

          {lowStockProducts.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-stone-50 border border-stone-100">
                  <img src={p.images[0]} alt={p.name} className="w-10 h-12 object-cover rounded-md shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-stone-900 truncate">{p.name}</h4>
                    <span className="text-[11px] font-semibold text-rose-600 block">
                      {p.stock === 0 ? 'Out of stock' : `${p.stock} units left`}
                    </span>
                  </div>
                  <button
                    onClick={() => handleQuickRestock(p.id, p.stock)}
                    className="px-2.5 py-1 bg-[#0B132B] text-white rounded-md text-[10px] font-bold uppercase tracking-wider hover:bg-stone-800 shrink-0"
                    title="Add 20 units"
                  >
                    +20 Units
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-stone-500 py-4 text-center">
              All inventory levels are currently healthy!
            </p>
          )}
        </div>

      </div>

    </div>
  );
};
