import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { BrandLogo } from '../../components/BrandLogo';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Settings, 
  ExternalLink, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Database
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: 'dashboard' | 'products' | 'orders' | 'customers' | 'settings' | 'database';
  onTabChange: (tab: 'dashboard' | 'products' | 'orders' | 'customers' | 'settings' | 'database') => void;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onTabChange,
  onNavigate,
  children,
}) => {
  const { adminLogout, orders, products, supabaseStatus } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const lowStockCount = products.filter(p => p.stock <= 10).length;

  const handleLogout = () => {
    adminLogout();
    onNavigate('/');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products & Stock', icon: Package, badge: lowStockCount > 0 ? `${lowStockCount} Low` : undefined },
    { id: 'orders', label: 'Customer Orders', icon: ShoppingBag, badge: pendingOrdersCount > 0 ? `${pendingOrdersCount} New` : undefined },
    { id: 'customers', label: 'Customers', icon: Users },
    { 
      id: 'database', 
      label: 'Supabase Cloud DB', 
      icon: Database, 
      badge: supabaseStatus.ordersTableExists && supabaseStatus.productsTableExists ? 'Synced' : 'Setup' 
    },
    { id: 'settings', label: 'Store Settings', icon: Settings },
  ];

  return (
    <div id="admin-panel-container" className="min-h-screen bg-[#F4F6F8] flex flex-col lg:flex-row">
      
      {/* Mobile Header Bar */}
      <div className="lg:hidden bg-[#0B132B] text-white p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <BrandLogo variant="horizontal" theme="light" size="sm" />
          <span className="text-[10px] font-bold bg-[#E5C384] text-[#0B132B] px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
            Admin
          </span>
        </div>

        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          className="p-1.5 rounded-md hover:bg-white/10"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Admin Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#0B132B] text-white flex flex-col justify-between transition-transform duration-300 lg:static lg:translate-x-0 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div>
          {/* Logo & Portal Tag */}
          <div className="p-6 border-b border-[#1C2640]">
            <BrandLogo variant="horizontal" theme="light" size="md" />
            <div className="mt-2 text-[10px] font-bold tracking-widest text-[#E5C384] uppercase">
              Management Portal
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id as any);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive 
                      ? 'bg-[#C59B51] text-[#0B132B] shadow-md' 
                      : 'text-stone-300 hover:bg-[#18233C] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                      isActive ? 'bg-[#0B132B] text-white' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions: View Storefront & Logout */}
        <div className="p-4 border-t border-[#1C2640] space-y-2">
          <button
            onClick={() => onNavigate('/')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-semibold text-stone-300 hover:text-white hover:bg-[#18233C] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#E5C384]" />
            <span>View Live Store</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-xs font-bold text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Body */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>

    </div>
  );
};
