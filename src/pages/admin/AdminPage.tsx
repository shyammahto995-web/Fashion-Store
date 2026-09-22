import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminLayout } from './AdminLayout';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminDashboardTab } from './AdminDashboardTab';
import { AdminProductsTab } from './AdminProductsTab';
import { AdminOrdersTab } from './AdminOrdersTab';
import { AdminCustomersTab } from './AdminCustomersTab';
import { AdminSettingsTab } from './AdminSettingsTab';
import { AdminDatabaseTab } from './AdminDatabaseTab';

interface AdminPageProps {
  initialTab?: 'dashboard' | 'products' | 'orders' | 'customers' | 'settings' | 'database';
  onNavigate: (path: string) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ 
  initialTab = 'dashboard', 
  onNavigate 
}) => {
  const { isAdminLoggedIn } = useStore();
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'products' | 'orders' | 'customers' | 'settings' | 'database'>(initialTab);

  if (!isAdminLoggedIn) {
    return <AdminLoginPage onNavigate={onNavigate} />;
  }

  return (
    <AdminLayout
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      onNavigate={onNavigate}
    >
      {currentTab === 'dashboard' && (
        <AdminDashboardTab onNavigateTab={setCurrentTab} />
      )}
      {currentTab === 'products' && (
        <AdminProductsTab />
      )}
      {currentTab === 'orders' && (
        <AdminOrdersTab />
      )}
      {currentTab === 'customers' && (
        <AdminCustomersTab />
      )}
      {currentTab === 'database' && (
        <AdminDatabaseTab />
      )}
      {currentTab === 'settings' && (
        <AdminSettingsTab />
      )}
    </AdminLayout>
  );
};
