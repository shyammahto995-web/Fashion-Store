export type ProductCategory = 
  | 'women' 
  | 'men' 
  | 'kids' 
  | 'accessories' 
  | 'bags' 
  | 'watches' 
  | 'beauty' 
  | 'perfumes' 
  | 'footwear' 
  | 'more';

export interface CategoryInfo {
  id: string;
  name: string;
  slug: ProductCategory;
  image: string;
  description: string;
  itemCount: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  discount?: number;
  stock: number;
  images: string[];
  videoUrl?: string;
  sizes?: string[];
  colors?: string[];
  brand?: string;
  material?: string;
  tags?: string[];
  rating: number;
  reviewCount: number;
  isTrending?: boolean;
  isNewArrival?: boolean;
  isFeatured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string; // generated compound id
  productId: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  priceAtPurchase: number;
  selectedSize?: string;
  selectedColor?: string;
  subtotal: number;
}

export type OrderStatus = 
  | 'Pending' 
  | 'Confirmed' 
  | 'Processing' 
  | 'Shipped' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Cancelled';

export interface Order {
  id: string;
  orderId: string;
  customerName: string;
  mobile: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSettings {
  storeName: string;
  storeEmail: string;
  supportPhone: string;
  storeAddress: string;
  currency: string; // '₹'
  liveSiteUrl?: string; // e.g. 'https://myfashionstore.netlify.app' or custom domain
}

export interface ToastMessage {
  id: string;
  title: string;
  type: 'success' | 'error' | 'info';
}
