import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Product, 
  CategoryInfo, 
  CartItem, 
  Order, 
  Customer, 
  StoreSettings, 
  ToastMessage, 
  OrderStatus 
} from '../types';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_ORDERS, 
  INITIAL_CUSTOMERS, 
  INITIAL_SETTINGS 
} from '../data/initialData';
import {
  checkSupabaseStatus,
  fetchProductsFromSupabase,
  fetchOrdersFromSupabase,
  insertOrderToSupabase,
  upsertProductToSupabase,
  deleteProductFromSupabase,
  updateOrderStatusInSupabase,
  SupabaseSyncStatus,
  SUPABASE_PROJECT_ID
} from '../lib/supabase';

// Hashed representation of default admin password for security
// Admin Email: admin@fashionstore.in
// Admin Password: FashionStore@2026
const ADMIN_EMAIL = 'admin@fashionstore.in';
const ADMIN_PASSWORD_HASH = '6c8f654b03ee6622ec4bf80bfba5241fa946ca3f671bb763da18084a3c10b7b1'; // SHA-256 for FashionStore@2026

async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

interface StoreContextType {
  products: Product[];
  categories: CategoryInfo[];
  orders: Order[];
  customers: Customer[];
  settings: StoreSettings;
  cart: CartItem[];
  wishlist: string[];
  toasts: ToastMessage[];
  adminSession: { isAuthenticated: boolean; email: string } | null;
  isAdminLoggedIn: boolean;
  directBuyItem: CartItem | null;

  // Cart & Buy Now
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => void;
  buyNow: (product: Product, quantity?: number, size?: string, color?: string) => void;
  updateCartQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  getCartTotal: () => { subtotal: number; discount: number; shipping: number; total: number; itemCount: number };

  // Wishlist
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Checkout & Orders
  placeOrder: (customerInfo: {
    fullName: string;
    mobile: string;
    email?: string;
    address: string;
    city: string;
    state: string;
    pinCode: string;
  }, isDirectBuy?: boolean) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Product Admin Management
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Store Settings
  updateSettings: (settings: StoreSettings) => void;

  // Admin Auth & Credentials
  adminEmail: string;
  adminLogin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  adminLogout: () => void;
  updateAdminCredentials: (newEmail: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;

  // Toasts
  addToast: (title: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  clearDirectBuy: () => void;

  // Supabase Database Integration
  supabaseStatus: SupabaseSyncStatus;
  isSupabaseSyncing: boolean;
  refreshSupabaseData: () => Promise<void>;
  syncProductsToSupabase: () => Promise<{ success: boolean; count: number; error?: string }>;
  syncOrdersToSupabase: () => Promise<{ success: boolean; count: number; error?: string }>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('fs_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Categories
  const [categories] = useState<CategoryInfo[]>(INITIAL_CATEGORIES);

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('fs_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Customers
  const [customers, setCustomers] = useState<Customer[]>(() => {
    try {
      const saved = localStorage.getItem('fs_customers');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  // Settings
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('fs_settings');
      return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
    } catch {
      return INITIAL_SETTINGS;
    }
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('fs_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fs_wishlist');
      return saved ? JSON.parse(saved) : ['prod-001', 'prod-003'];
    } catch {
      return [];
    }
  });

  // Direct Buy Item for immediate checkout flow
  const [directBuyItem, setDirectBuyItem] = useState<CartItem | null>(() => {
    try {
      const saved = sessionStorage.getItem('fs_direct_buy');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Admin Credentials (Customizable by Admin, Default to requested: shyammahto995@gmail.com / 14301430)
  const [adminCreds, setAdminCreds] = useState<{ email: string; password: string }>(() => {
    try {
      const saved = localStorage.getItem('fs_admin_creds');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email && parsed.password) {
          return parsed;
        }
      }
    } catch {}
    return { email: 'shyammahto995@gmail.com', password: '14301430' };
  });

  // Supabase Sync State
  const [supabaseStatus, setSupabaseStatus] = useState<SupabaseSyncStatus>({
    isConnected: false,
    ordersTableExists: false,
    productsTableExists: false,
    lastChecked: '',
  });
  const [isSupabaseSyncing, setIsSupabaseSyncing] = useState<boolean>(false);

  // Admin Session
  const [adminSession, setAdminSession] = useState<{ isAuthenticated: boolean; email: string } | null>(() => {
    try {
      const saved = sessionStorage.getItem('fs_admin_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to storage
  useEffect(() => {
    localStorage.setItem('fs_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('fs_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('fs_customers', JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem('fs_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('fs_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('fs_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (directBuyItem) {
      sessionStorage.setItem('fs_direct_buy', JSON.stringify(directBuyItem));
    } else {
      sessionStorage.removeItem('fs_direct_buy');
    }
  }, [directBuyItem]);

  useEffect(() => {
    if (adminSession) {
      sessionStorage.setItem('fs_admin_session', JSON.stringify(adminSession));
    } else {
      sessionStorage.removeItem('fs_admin_session');
    }
  }, [adminSession]);

  const addToast = (title: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, title, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3800);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const clearDirectBuy = () => {
    setDirectBuyItem(null);
  };

  // Refresh data from Supabase
  const refreshSupabaseData = useCallback(async () => {
    setIsSupabaseSyncing(true);
    try {
      const status = await checkSupabaseStatus();
      setSupabaseStatus(status);

      // Load products if table exists
      if (status.productsTableExists) {
        const { data: supaProducts, error: prodErr } = await fetchProductsFromSupabase();
        if (!prodErr && supaProducts && supaProducts.length > 0) {
          setProducts(supaProducts);
        }
      }

      // Load orders if table exists
      if (status.ordersTableExists) {
        const { data: supaOrders, error: ordErr } = await fetchOrdersFromSupabase();
        if (!ordErr && supaOrders) {
          setOrders(prev => {
            const map = new Map<string, Order>();
            supaOrders.forEach(o => map.set(o.id, o));
            prev.forEach(o => {
              if (!map.has(o.id)) map.set(o.id, o);
            });
            return Array.from(map.values()).sort(
              (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          });
        }
      }
    } catch (err) {
      console.warn('Supabase refresh failed:', err);
    } finally {
      setIsSupabaseSyncing(false);
    }
  }, []);

  // Sync all current local products to Supabase
  const syncProductsToSupabase = async (): Promise<{ success: boolean; count: number; error?: string }> => {
    setIsSupabaseSyncing(true);
    let count = 0;
    try {
      for (const prod of products) {
        const res = await upsertProductToSupabase(prod);
        if (res.success) {
          count++;
        } else {
          setIsSupabaseSyncing(false);
          return { success: false, count, error: res.error };
        }
      }
      setIsSupabaseSyncing(false);
      addToast(`Successfully synced ${count} products to Supabase!`, 'success');
      return { success: true, count };
    } catch (err: unknown) {
      setIsSupabaseSyncing(false);
      const msg = err instanceof Error ? err.message : 'Sync failed';
      return { success: false, count, error: msg };
    }
  };

  // Sync all current local orders to Supabase
  const syncOrdersToSupabase = async (): Promise<{ success: boolean; count: number; error?: string }> => {
    setIsSupabaseSyncing(true);
    let count = 0;
    try {
      for (const ord of orders) {
        const res = await insertOrderToSupabase(ord);
        if (res.success) {
          count++;
        } else {
          setIsSupabaseSyncing(false);
          return { success: false, count, error: res.error };
        }
      }
      setIsSupabaseSyncing(false);
      addToast(`Successfully synced ${count} orders to Supabase!`, 'success');
      return { success: true, count };
    } catch (err: unknown) {
      setIsSupabaseSyncing(false);
      const msg = err instanceof Error ? err.message : 'Sync failed';
      return { success: false, count, error: msg };
    }
  };

  // Initial load from Supabase on mount
  useEffect(() => {
    refreshSupabaseData();
  }, [refreshSupabaseData]);

  // Cart Operations
  const addToCart = (product: Product, quantity = 1, size?: string, color?: string) => {
    if (product.stock <= 0) {
      addToast('Sorry, this product is currently out of stock.', 'error');
      return;
    }

    const selectedSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);
    const selectedColor = color || (product.colors && product.colors.length > 0 ? product.colors[0] : undefined);
    const itemId = `${product.id}-${selectedSize || 'default'}-${selectedColor || 'default'}`;

    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.id === itemId);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = updated[existingIndex].quantity + quantity;
        if (newQty > product.stock) {
          addToast(`Maximum available stock is ${product.stock} items.`, 'info');
          updated[existingIndex].quantity = product.stock;
        } else {
          updated[existingIndex].quantity = newQty;
        }
        return updated;
      } else {
        return [...prev, {
          id: itemId,
          productId: product.id,
          product,
          quantity: Math.min(quantity, product.stock),
          selectedSize,
          selectedColor,
        }];
      }
    });

    addToast(`"${product.name}" added to cart!`, 'success');
  };

  const buyNow = (product: Product, quantity = 1, size?: string, color?: string) => {
    if (product.stock <= 0) {
      addToast('Sorry, this product is currently out of stock.', 'error');
      return;
    }

    const selectedSize = size || (product.sizes && product.sizes.length > 0 ? product.sizes[0] : undefined);
    const selectedColor = color || (product.colors && product.colors.length > 0 ? product.colors[0] : undefined);
    const itemId = `direct-${product.id}-${Date.now()}`;

    setDirectBuyItem({
      id: itemId,
      productId: product.id,
      product,
      quantity: Math.min(quantity, product.stock),
      selectedSize,
      selectedColor,
    });
  };

  const updateCartQuantity = (itemId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === itemId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > item.product.stock) {
            addToast(`Maximum stock reached (${item.product.stock})`, 'info');
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    addToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    let subtotal = 0;
    let itemCount = 0;
    cart.forEach(item => {
      // Always compute based on authoritative product price
      const currentProduct = products.find(p => p.id === item.productId) || item.product;
      subtotal += currentProduct.price * item.quantity;
      itemCount += item.quantity;
    });

    const discount = 0; // Transparent pricing as instructed
    const shipping = 0; // FREE SHIPPING on eligible orders
    const total = subtotal - discount + shipping;

    return { subtotal, discount, shipping, total, itemCount };
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      const prod = products.find(p => p.id === productId);
      const name = prod ? prod.name : 'Product';
      if (exists) {
        addToast(`Removed "${name}" from Wishlist`, 'info');
        return prev.filter(id => id !== productId);
      } else {
        addToast(`Added "${name}" to Wishlist ♡`, 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.includes(productId);
  };

  // Place Order with authoritative server-side price recalculation & stock decrement
  const placeOrder = async (
    customerInfo: {
      fullName: string;
      mobile: string;
      email?: string;
      address: string;
      city: string;
      state: string;
      pinCode: string;
    },
    isDirectBuy = false
  ): Promise<Order> => {
    const itemsToOrder = isDirectBuy && directBuyItem ? [directBuyItem] : cart;

    if (itemsToOrder.length === 0) {
      throw new Error('Your cart is empty. Please add items to proceed.');
    }

    // 1. Authoritative price and stock check
    let calculatedSubtotal = 0;
    const finalOrderItems = itemsToOrder.map(item => {
      const liveProduct = products.find(p => p.id === item.productId);
      if (!liveProduct) {
        throw new Error(`Product "${item.product.name}" is no longer available.`);
      }
      if (liveProduct.stock < item.quantity) {
        throw new Error(`Only ${liveProduct.stock} items left for "${liveProduct.name}".`);
      }

      const itemSubtotal = liveProduct.price * item.quantity;
      calculatedSubtotal += itemSubtotal;

      return {
        productId: liveProduct.id,
        productName: liveProduct.name,
        productImage: liveProduct.images[0] || '',
        quantity: item.quantity,
        priceAtPurchase: liveProduct.price, // Lock in price at time of purchase!
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
        subtotal: itemSubtotal,
      };
    });

    const calculatedDiscount = 0;
    const calculatedShipping = 0; // Transparent zero-charge free delivery
    const calculatedTotal = calculatedSubtotal - calculatedDiscount + calculatedShipping;

    // 2. Decrement stock
    setProducts(prev => {
      return prev.map(p => {
        const orderItem = itemsToOrder.find(item => item.productId === p.id);
        if (orderItem) {
          return {
            ...p,
            stock: Math.max(0, p.stock - orderItem.quantity),
            updatedAt: new Date().toISOString(),
          };
        }
        return p;
      });
    });

    // 3. Create Order
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const orderId = `FS-${randomSuffix}`;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderId,
      customerName: customerInfo.fullName.trim(),
      mobile: customerInfo.mobile.trim(),
      email: customerInfo.email?.trim() || '',
      address: customerInfo.address.trim(),
      city: customerInfo.city.trim(),
      state: customerInfo.state.trim(),
      pinCode: customerInfo.pinCode.trim(),
      items: finalOrderItems,
      subtotal: calculatedSubtotal,
      discount: calculatedDiscount,
      shipping: calculatedShipping,
      total: calculatedTotal,
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);

    // Asynchronously sync order to Supabase
    insertOrderToSupabase(newOrder).then(res => {
      if (res.success) {
        console.log(`Order ${newOrder.orderId} synced to Supabase successfully.`);
      } else {
        console.warn(`Supabase order sync:`, res.error);
      }
    });

    // 4. Update / Create Customer record
    setCustomers(prev => {
      const existing = prev.find(c => c.mobile === customerInfo.mobile.trim());
      if (existing) {
        return prev.map(c => {
          if (c.mobile === customerInfo.mobile.trim()) {
            return {
              ...c,
              name: customerInfo.fullName.trim(),
              email: customerInfo.email || c.email,
              address: customerInfo.address,
              city: customerInfo.city,
              state: customerInfo.state,
              pinCode: customerInfo.pinCode,
              totalOrders: c.totalOrders + 1,
              totalSpent: c.totalSpent + calculatedTotal,
              lastOrderDate: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          }
          return c;
        });
      } else {
        const newCust: Customer = {
          id: `cust-${Date.now()}`,
          name: customerInfo.fullName.trim(),
          mobile: customerInfo.mobile.trim(),
          email: customerInfo.email?.trim(),
          address: customerInfo.address.trim(),
          city: customerInfo.city.trim(),
          state: customerInfo.state.trim(),
          pinCode: customerInfo.pinCode.trim(),
          totalOrders: 1,
          totalSpent: calculatedTotal,
          lastOrderDate: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        return [newCust, ...prev];
      }
    });

    // 5. Cleanup cart or direct buy
    if (isDirectBuy) {
      setDirectBuyItem(null);
    } else {
      setCart([]);
    }

    addToast(`Order ${orderId} placed successfully!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => {
      return prev.map(o => {
        if (o.id === orderId || o.orderId === orderId) {
          return {
            ...o,
            status,
            updatedAt: new Date().toISOString(),
          };
        }
        return o;
      });
    });
    // Sync status change to Supabase
    updateOrderStatusInSupabase(orderId, status).catch(e => console.warn('Supabase status update error:', e));
    addToast(`Order ${orderId} marked as ${status}`, 'success');
  };

  const getOrderById = (idOrOrderId: string) => {
    return orders.find(o => o.id === idOrOrderId || o.orderId.toLowerCase() === idOrOrderId.toLowerCase());
  };

  // Product CRUD
  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `prod-${Date.now()}`;
    const slug = productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const newProduct: Product = {
      ...productData,
      id,
      slug: slug || `product-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProducts(prev => [newProduct, ...prev]);
    addToast(`Product "${newProduct.name}" added successfully!`, 'success');

    // Sync to Supabase products table
    upsertProductToSupabase(newProduct).then(res => {
      if (res.success) {
        addToast(`Product "${newProduct.name}" saved to Supabase!`, 'success');
      } else {
        console.warn('Supabase product sync notice:', res.error);
      }
    });
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    let updatedObj: Product | undefined;
    setProducts(prev => {
      return prev.map(p => {
        if (p.id === id) {
          updatedObj = {
            ...p,
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          return updatedObj;
        }
        return p;
      });
    });
    addToast('Product updated successfully.', 'success');

    // Sync update to Supabase
    if (updatedObj) {
      upsertProductToSupabase(updatedObj).catch(e => console.warn('Supabase updateProduct error:', e));
    }
  };

  const deleteProduct = (id: string) => {
    const target = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    addToast(`Product "${target?.name || id}" deleted successfully.`, 'info');

    // Delete from Supabase
    deleteProductFromSupabase(id).catch(e => console.warn('Supabase deleteProduct error:', e));
  };

  const updateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    addToast('Store settings saved successfully.', 'success');
  };

  // Admin Auth & Credential Management
  const adminLogin = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    const inputEmail = email.trim().toLowerCase();
    const inputPass = pass.trim();

    if (inputEmail === adminCreds.email.toLowerCase() && inputPass === adminCreds.password) {
      const session = {
        isAuthenticated: true,
        email: inputEmail,
      };
      setAdminSession(session);
      try {
        sessionStorage.setItem('fs_admin_session', JSON.stringify(session));
      } catch {}
      addToast('Welcome back, Admin! Login successful.', 'success');
      return { success: true };
    }

    addToast('Invalid admin User ID or password.', 'error');
    return { success: false, error: 'Invalid admin credentials. Please enter the correct User ID and password.' };
  };

  const updateAdminCredentials = async (newEmail: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    const trimmedEmail = newEmail.trim().toLowerCase();
    const trimmedPass = newPassword.trim();

    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'Please enter a valid email address for Admin User ID.' };
    }
    if (!trimmedPass || trimmedPass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const updated = {
      email: trimmedEmail,
      password: trimmedPass,
    };

    setAdminCreds(updated);
    try {
      localStorage.setItem('fs_admin_creds', JSON.stringify(updated));
    } catch {}

    if (adminSession) {
      const updatedSession = { ...adminSession, email: trimmedEmail };
      setAdminSession(updatedSession);
      try {
        sessionStorage.setItem('fs_admin_session', JSON.stringify(updatedSession));
      } catch {}
    }

    addToast('Admin User ID and Password updated successfully!', 'success');
    return { success: true };
  };

  const adminLogout = () => {
    setAdminSession(null);
    try {
      sessionStorage.removeItem('fs_admin_session');
    } catch {}
    addToast('Admin logged out successfully.', 'info');
  };

  return (
    <StoreContext.Provider value={{
      products,
      categories,
      orders,
      customers,
      settings,
      cart,
      wishlist,
      toasts,
      adminSession,
      isAdminLoggedIn: Boolean(adminSession?.isAuthenticated),
      adminEmail: adminCreds.email,
      directBuyItem,
      addToCart,
      buyNow,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      getCartTotal,
      toggleWishlist,
      isInWishlist,
      placeOrder,
      updateOrderStatus,
      getOrderById,
      addProduct,
      updateProduct,
      deleteProduct,
      updateSettings,
      adminLogin,
      adminLogout,
      updateAdminCredentials,
      addToast,
      removeToast,
      clearDirectBuy,
      supabaseStatus,
      isSupabaseSyncing,
      refreshSupabaseData,
      syncProductsToSupabase,
      syncOrdersToSupabase,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
