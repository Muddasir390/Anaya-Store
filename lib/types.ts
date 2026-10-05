export type ColorOption = { name: string; hex: string };

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
  sort_order: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  compare_at_price: number | null;
  category_id: string | null;
  images: string[];
  sizes: string[];
  colors: ColorOption[];
  material: string;
  care: string;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
};

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string | null;
  name: string;
  price: number;
  quantity: number;
  size: string | null;
  color: string | null;
  image: string | null;
};

export type Order = {
  id: string;
  order_number: string;
  status: OrderStatus;
  customer_name: string;
  phone: string;
  email: string | null;
  address: string;
  city: string;
  notes: string | null;
  payment_method: string;
  subtotal: number;
  shipping: number;
  total: number;
  admin_notes: string | null;
  created_at: string;
  order_items?: OrderItem[];
};

export type SiteSettings = {
  store_name: string;
  whatsapp_number: string;
  shipping_fee: number;
  free_shipping_over: number;
  announcement: string;
  contact_email: string;
  instagram: string;
};

export type CartItem = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string | null;
  size: string | null;
  color: ColorOption | null;
  quantity: number;
};
