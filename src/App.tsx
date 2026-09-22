/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StoreProvider } from './context/StoreContext';
import { TopAnnouncementBar } from './components/TopAnnouncementBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ToastContainer } from './components/ToastContainer';

// Pages
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { WishlistPage } from './pages/WishlistPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminPage } from './pages/admin/AdminPage';
import { ProductCategory } from './types';

export function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [currentSearchQuery, setCurrentSearchQuery] = useState<string>(() => {
    return window.location.search || '';
  });

  const navigate = (pathWithSearch: string) => {
    const [path, search] = pathWithSearch.split('?');
    window.history.pushState({}, '', pathWithSearch);
    setCurrentPath(path || '/');
    setCurrentSearchQuery(search ? `?${search}` : '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setCurrentSearchQuery(window.location.search || '');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Parse query parameters
  const queryParams = new URLSearchParams(currentSearchQuery);

  // Router matching
  const renderRoute = () => {
    // Admin routes
    if (currentPath === '/admin/login') {
      return <AdminLoginPage onNavigate={navigate} />;
    }
    if (currentPath.startsWith('/admin')) {
      let initialTab: 'dashboard' | 'products' | 'orders' | 'customers' | 'settings' = 'dashboard';
      if (currentPath.includes('/products')) initialTab = 'products';
      else if (currentPath.includes('/orders')) initialTab = 'orders';
      else if (currentPath.includes('/customers')) initialTab = 'customers';
      else if (currentPath.includes('/settings')) initialTab = 'settings';

      return <AdminPage initialTab={initialTab} onNavigate={navigate} />;
    }

    // Customer routes
    if (currentPath === '/' || currentPath === '') {
      return <HomePage onNavigate={navigate} />;
    }

    if (currentPath === '/shop') {
      const search = queryParams.get('search') || '';
      const cat = (queryParams.get('category') as ProductCategory) || 'all';
      return (
        <ShopPage 
          onNavigate={navigate} 
          initialSearch={search}
          initialCategory={cat}
        />
      );
    }

    if (currentPath.startsWith('/category/')) {
      const slug = currentPath.replace('/category/', '') as ProductCategory;
      return <CategoryPage categorySlug={slug} onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/product/')) {
      const slug = currentPath.replace('/product/', '');
      return <ProductDetailPage productSlug={slug} onNavigate={navigate} />;
    }

    if (currentPath === '/cart') {
      return <CartPage onNavigate={navigate} />;
    }

    if (currentPath === '/checkout') {
      return <CheckoutPage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/order-confirmation/')) {
      const orderId = currentPath.replace('/order-confirmation/', '');
      return <OrderConfirmationPage orderId={orderId} onNavigate={navigate} />;
    }

    if (currentPath === '/track-order') {
      const orderId = queryParams.get('orderId') || '';
      return <TrackOrderPage initialOrderId={orderId} onNavigate={navigate} />;
    }

    if (currentPath === '/wishlist') {
      return <WishlistPage onNavigate={navigate} />;
    }

    if (currentPath === '/about') {
      return <AboutPage onNavigate={navigate} />;
    }

    if (currentPath === '/contact') {
      return <ContactPage onNavigate={navigate} />;
    }

    // Default Fallback
    return <HomePage onNavigate={navigate} />;
  };

  const isAdminRoute = currentPath.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-stone-900 font-sans selection:bg-[#C59B51] selection:text-white pb-16 md:pb-0">
      <ToastContainer />

      {!isAdminRoute && (
        <>
          <TopAnnouncementBar />
          <Header onNavigate={navigate} />
        </>
      )}

      {/* Main View Area */}
      <main className="flex-1">
        {renderRoute()}
      </main>

      {!isAdminRoute && (
        <>
          <Footer onNavigate={navigate} />
          <MobileBottomNav 
            currentPath={currentPath} 
            navigate={navigate}
            onOpenSearch={() => navigate('/shop')}
          />
        </>
      )}
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
