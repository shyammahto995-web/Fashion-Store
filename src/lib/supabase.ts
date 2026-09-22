import { createClient } from '@supabase/supabase-js';
import { Order, Product, OrderStatus, ProductCategory } from '../types';

// Supabase project credentials provided by user
export const SUPABASE_PROJECT_ID = 'vlsbwfpyrnzndteslyum';
export const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL || 'https://vlsbwfpyrnzndteslyum.supabase.co').replace(/\/rest\/v1\/?$/, '');
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_PaP8Lyo308PtBco06I--DQ_BLo84ql6';

// Initialize Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface SupabaseSyncStatus {
  isConnected: boolean;
  ordersTableExists: boolean;
  productsTableExists: boolean;
  lastChecked: string;
  errorMessage?: string;
}

/**
 * Checks connection to Supabase and verifies if tables exist
 */
export async function checkSupabaseStatus(): Promise<SupabaseSyncStatus> {
  const status: SupabaseSyncStatus = {
    isConnected: false,
    ordersTableExists: false,
    productsTableExists: false,
    lastChecked: new Date().toLocaleTimeString(),
  };

  try {
    // Check orders table
    const { error: ordersError } = await supabase.from('orders').select('id').limit(1);
    if (!ordersError) {
      status.ordersTableExists = true;
      status.isConnected = true;
    } else if (ordersError.code === 'PGRST205') {
      // Table doesn't exist yet, but server answered!
      status.isConnected = true;
      status.ordersTableExists = false;
      status.errorMessage = "Table 'orders' does not exist in Supabase yet.";
    } else {
      status.errorMessage = ordersError.message;
    }

    // Check products table
    const { error: productsError } = await supabase.from('products').select('id').limit(1);
    if (!productsError) {
      status.productsTableExists = true;
      status.isConnected = true;
    } else if (productsError.code === 'PGRST205') {
      status.isConnected = true;
      status.productsTableExists = false;
      if (!status.errorMessage) {
        status.errorMessage = "Table 'products' does not exist in Supabase yet.";
      }
    }
  } catch (err: unknown) {
    status.isConnected = false;
    status.errorMessage = err instanceof Error ? err.message : 'Failed to connect to Supabase';
  }

  return status;
}

// -------------------------------------------------------------
// ORDERS SYNC
// -------------------------------------------------------------

export function mapOrderToDb(order: Order) {
  const nameParts = (order.customerName || '').trim().split(/\s+/);
  const firstName = nameParts[0] || 'Customer';
  const lastName = nameParts.slice(1).join(' ') || '';
  const productNames = (order.items || [])
    .map(i => `${i.productName} (x${i.quantity})`)
    .join(', ') || 'Fashion Product';

  return {
    id: order.id,
    order_id: order.orderId,
    // Exact requested columns:
    first_name: firstName,
    last_name: lastName,
    email: order.email || '',
    street_address: order.address,
    city: order.city,
    zip_code: order.pinCode,
    product_name: productNames,
    total_amount: order.total,
    date_time: order.createdAt || new Date().toISOString(),
    // Additional companion fields for full store management:
    customer_name: order.customerName,
    mobile: order.mobile,
    state: order.state,
    pin_code: order.pinCode,
    address: order.address,
    items: order.items,
    subtotal: order.subtotal,
    discount: order.discount,
    shipping: order.shipping,
    total: order.total,
    status: order.status,
    payment_method: 'COD',
    created_at: order.createdAt || new Date().toISOString(),
    updated_at: order.updatedAt || new Date().toISOString(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapDbToOrder(row: any): Order {
  const customerName = row.customer_name 
    || (row.first_name ? `${row.first_name} ${row.last_name || ''}`.trim() : 'Customer');
  const address = row.street_address || row.address || '';
  const pinCode = row.zip_code || row.pin_code || row.pinCode || '';
  const total = Number(row.total_amount ?? row.total) || 0;
  const createdAt = row.date_time || row.created_at || new Date().toISOString();

  return {
    id: row.id ? String(row.id) : `ord-${Date.now()}`,
    orderId: row.order_id || row.orderId || (row.id ? `FS-${row.id}` : `FS-${Math.floor(10000 + Math.random() * 90000)}`),
    customerName,
    mobile: row.mobile || '',
    email: row.email || '',
    address,
    city: row.city || '',
    state: row.state || '',
    pinCode,
    items: Array.isArray(row.items) && row.items.length > 0 
      ? row.items 
      : [{
          productId: 'prod-item',
          productName: row.product_name || 'Ordered Product',
          productImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
          quantity: 1,
          priceAtPurchase: total,
          subtotal: total,
        }],
    subtotal: Number(row.subtotal) || total,
    discount: Number(row.discount) || 0,
    shipping: Number(row.shipping) || 0,
    total,
    status: (row.status as OrderStatus) || 'Confirmed',
    createdAt,
    updatedAt: row.updated_at || createdAt,
  };
}

export async function insertOrderToSupabase(order: Order): Promise<{ success: boolean; error?: string }> {
  try {
    const fullPayload = mapOrderToDb(order);
    
    // First try full payload upsert
    const { error: fullError } = await supabase.from('orders').upsert(fullPayload, { onConflict: 'id' });
    if (!fullError) {
      return { success: true };
    }

    console.warn('Supabase full insert failed, attempting exact schema fallback:', fullError.message);

    // If table was created with only the exact 9 columns requested by the user:
    const exactPayload = {
      first_name: fullPayload.first_name,
      last_name: fullPayload.last_name,
      email: fullPayload.email,
      street_address: fullPayload.street_address,
      city: fullPayload.city,
      zip_code: fullPayload.zip_code,
      product_name: fullPayload.product_name,
      total_amount: fullPayload.total_amount,
      date_time: fullPayload.date_time,
    };

    const { error: fallbackError } = await supabase.from('orders').insert([exactPayload]);
    if (!fallbackError) {
      return { success: true };
    }

    return { success: false, error: fallbackError.message };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown Supabase error';
    console.warn('Supabase insertOrder exception:', err);
    return { success: false, error: msg };
  }
}

export async function fetchOrdersFromSupabase(): Promise<{ data: Order[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { data: [], error: error.message };
    }
    const orders = (data || []).map(mapDbToOrder);
    return { data: orders };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { data: [], error: msg };
  }
}

export async function updateOrderStatusInSupabase(
  orderIdOrId: string, 
  status: OrderStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .or(`id.eq.${orderIdOrId},order_id.eq.${orderIdOrId}`);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: msg };
  }
}

// -------------------------------------------------------------
// PRODUCTS SYNC
// -------------------------------------------------------------

export function mapProductToDb(product: Product) {
  const mainImage = product.images && product.images.length > 0 ? product.images[0] : '';
  const now = product.createdAt || new Date().toISOString();

  return {
    id: product.id,
    // Exact requested product columns:
    product_name: product.name,
    price: product.price,
    discount: product.discount ?? 0,
    category: product.category,
    product_image: mainImage,
    description: product.description || '',
    stock: product.stock,
    date_time: now,

    // Additional companion fields for full store management:
    name: product.name,
    slug: product.slug,
    sku: product.sku || '',
    original_price: product.originalPrice ?? null,
    images: product.images,
    video_url: product.videoUrl ?? null,
    sizes: product.sizes ?? [],
    colors: product.colors ?? [],
    brand: product.brand ?? 'Fashion Store',
    material: product.material ?? null,
    tags: product.tags ?? [],
    rating: product.rating ?? 4.8,
    review_count: product.reviewCount ?? 0,
    is_trending: Boolean(product.isTrending),
    is_new_arrival: Boolean(product.isNewArrival),
    is_featured: Boolean(product.isFeatured),
    created_at: now,
    updated_at: product.updatedAt || new Date().toISOString(),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapDbToProduct(row: any): Product {
  const name = row.product_name || row.name || 'Fashion Product';
  const price = Number(row.price) || 0;
  const discount = row.discount != null ? Number(row.discount) : 0;
  const description = row.description || '';
  const stock = Number(row.stock) || 0;
  const category = (row.category as ProductCategory) || 'women';
  const imageList: string[] = Array.isArray(row.images) && row.images.length > 0 
    ? row.images 
    : (row.product_image ? [row.product_image] : ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80']);
  const createdAt = row.date_time || row.created_at || new Date().toISOString();

  return {
    id: row.id ? String(row.id) : `prod-${Date.now()}`,
    name,
    slug: row.slug || row.id || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    sku: row.sku || '',
    description,
    category,
    price,
    originalPrice: row.original_price != null ? Number(row.original_price) : undefined,
    discount,
    stock,
    images: imageList,
    videoUrl: row.video_url || undefined,
    sizes: Array.isArray(row.sizes) ? row.sizes : ['S', 'M', 'L', 'XL'],
    colors: Array.isArray(row.colors) ? row.colors : [],
    brand: row.brand || 'Fashion Store',
    material: row.material || undefined,
    tags: Array.isArray(row.tags) ? row.tags : [],
    rating: Number(row.rating) || 4.8,
    reviewCount: Number(row.review_count) || 0,
    isTrending: Boolean(row.is_trending),
    isNewArrival: Boolean(row.is_new_arrival),
    isFeatured: Boolean(row.is_featured),
    createdAt,
    updatedAt: row.updated_at || createdAt,
  };
}

export async function upsertProductToSupabase(product: Product): Promise<{ success: boolean; error?: string }> {
  try {
    const payload = mapProductToDb(product);
    const { error: fullError } = await supabase.from('products').upsert(payload, { onConflict: 'id' });
    if (!fullError) {
      return { success: true };
    }

    console.warn('Supabase full product upsert failed, attempting exact schema fallback:', fullError.message);

    // Fallback if table contains only the exact columns requested by user:
    const exactPayload = {
      product_name: payload.product_name,
      price: payload.price,
      discount: payload.discount,
      category: payload.category,
      product_image: payload.product_image,
      description: payload.description,
      stock: payload.stock,
      date_time: payload.date_time,
    };

    const { error: fallbackError } = await supabase.from('products').insert([exactPayload]);
    if (!fallbackError) {
      return { success: true };
    }

    return { success: false, error: fallbackError.message };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.warn('Supabase upsertProduct exception:', err);
    return { success: false, error: msg };
  }
}

export async function deleteProductFromSupabase(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: msg };
  }
}

export async function fetchProductsFromSupabase(): Promise<{ data: Product[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { data: [], error: error.message };
    }
    const products = (data || []).map(mapDbToProduct);
    return { data: products };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return { data: [], error: msg };
  }
}

/**
 * SQL script for creating tables and RLS policies in Supabase SQL editor.
 */
export const SUPABASE_SETUP_SQL = `-- Fashion Store Database Schema for Supabase
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/vlsbwfpyrnzndteslyum/sql)

-- 1. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY DEFAULT ('ord-' || floor(random() * 1000000000)::text),
    order_id TEXT DEFAULT ('FS-' || floor(10000 + random() * 90000)::text),
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    street_address TEXT,
    city TEXT,
    zip_code TEXT,
    product_name TEXT,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    date_time TIMESTAMPTZ DEFAULT NOW(),
    customer_name TEXT,
    mobile TEXT,
    address TEXT,
    state TEXT,
    pin_code TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC DEFAULT 0,
    discount NUMERIC DEFAULT 0,
    shipping NUMERIC DEFAULT 0,
    total NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'Confirmed',
    payment_method TEXT DEFAULT 'COD',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public (anon + authenticated) to insert orders on checkout
DROP POLICY IF EXISTS "Allow public insert to orders" ON public.orders;
CREATE POLICY "Allow public insert to orders" ON public.orders
    FOR INSERT WITH CHECK (true);

-- Allow public to view orders (order tracking & admin)
DROP POLICY IF EXISTS "Allow public select from orders" ON public.orders;
CREATE POLICY "Allow public select from orders" ON public.orders
    FOR SELECT USING (true);

-- Allow public to update orders (status updates from admin)
DROP POLICY IF EXISTS "Allow public update to orders" ON public.orders;
CREATE POLICY "Allow public update to orders" ON public.orders
    FOR UPDATE USING (true);


-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY DEFAULT ('prod-' || floor(random() * 1000000000)::text),
    
    -- Requested Product Details Fields:
    product_name TEXT NOT NULL,
    price NUMERIC NOT NULL DEFAULT 0,
    discount NUMERIC DEFAULT 0,
    category TEXT NOT NULL DEFAULT 'women',
    product_image TEXT,
    description TEXT,
    stock INTEGER NOT NULL DEFAULT 0,
    date_time TIMESTAMPTZ DEFAULT NOW(),

    -- Additional supporting fields for multi-image gallery & storefront features:
    name TEXT,
    slug TEXT,
    sku TEXT,
    original_price NUMERIC,
    images JSONB DEFAULT '[]'::jsonb,
    video_url TEXT,
    sizes JSONB DEFAULT '[]'::jsonb,
    colors JSONB DEFAULT '[]'::jsonb,
    brand TEXT DEFAULT 'Fashion Store',
    material TEXT,
    tags JSONB DEFAULT '[]'::jsonb,
    rating NUMERIC DEFAULT 4.8,
    review_count INTEGER DEFAULT 0,
    is_trending BOOLEAN DEFAULT false,
    is_new_arrival BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for Products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow public to read products (storefront)
DROP POLICY IF EXISTS "Allow public select from products" ON public.products;
CREATE POLICY "Allow public select from products" ON public.products
    FOR SELECT USING (true);

-- Allow public to insert new products (admin panel)
DROP POLICY IF EXISTS "Allow public insert to products" ON public.products;
CREATE POLICY "Allow public insert to products" ON public.products
    FOR INSERT WITH CHECK (true);

-- Allow public to update products (admin panel)
DROP POLICY IF EXISTS "Allow public update to products" ON public.products;
CREATE POLICY "Allow public update to products" ON public.products
    FOR UPDATE USING (true);

-- Allow public to delete products (admin panel)
DROP POLICY IF EXISTS "Allow public delete from products" ON public.products;
CREATE POLICY "Allow public delete from products" ON public.products
    FOR DELETE USING (true);
`;
