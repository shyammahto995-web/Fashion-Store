import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Search, Mail, Phone, MapPin, IndianRupee } from 'lucide-react';

export const AdminCustomersTab: React.FC = () => {
  const { customers, orders } = useStore();
  const [search, setSearch] = useState('');

  // Enrich customer records with live orders stats
  const customerList = customers.map(cust => {
    const custOrders = orders.filter(o => 
      o.mobile === cust.mobile || 
      (cust.email && o.email === cust.email)
    );
    const totalSpent = custOrders.reduce((sum, o) => sum + o.total, 0);
    return {
      ...cust,
      totalOrders: Math.max(cust.totalOrders, custOrders.length),
      totalSpent: Math.max(cust.totalSpent, totalSpent)
    };
  });

  const filtered = customerList.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.mobile.includes(search) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-2xl font-bold font-serif-luxury text-[#0B132B]">
          Customer Directory
        </h1>
        <p className="text-xs text-stone-500">
          Client profiles, order history, lifetime value, and delivery geography.
        </p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs flex items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, city, phone..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-stone-200 text-xs focus:outline-hidden focus:border-[#0B132B]"
          />
        </div>
        <span className="text-xs text-stone-500 font-medium">
          {filtered.length} customers registered
        </span>
      </div>

      <div className="bg-white rounded-xl border border-stone-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-stone-500 uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">Customer Name</th>
                <th className="py-3.5 px-4 font-bold">Contact Details</th>
                <th className="py-3.5 px-4 font-bold">Location</th>
                <th className="py-3.5 px-4 font-bold">Total Orders</th>
                <th className="py-3.5 px-4 font-bold">Lifetime Spent</th>
                <th className="py-3.5 px-4 font-bold">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map(cust => (
                <tr key={cust.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-stone-900">{cust.name}</div>
                    <div className="text-[10px] text-stone-400">ID: {cust.id}</div>
                  </td>

                  <td className="py-3.5 px-4 text-stone-600">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-stone-400" />
                      <span>+91 {cust.mobile}</span>
                    </div>
                    {cust.email && (
                      <div className="flex items-center gap-1.5 text-stone-400 mt-0.5">
                        <Mail className="w-3 h-3 text-stone-400" />
                        <span className="truncate max-w-[160px]">{cust.email}</span>
                      </div>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-stone-800">{cust.city}, {cust.state}</div>
                    <div className="text-[10px] text-stone-400">{cust.pinCode}</div>
                  </td>

                  <td className="py-3.5 px-4 font-bold text-stone-900">
                    {cust.totalOrders} orders
                  </td>

                  <td className="py-3.5 px-4 font-bold text-[#0B132B]">
                    ₹{cust.totalSpent.toLocaleString('en-IN')}
                  </td>

                  <td className="py-3.5 px-4 text-stone-400">
                    {cust.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
