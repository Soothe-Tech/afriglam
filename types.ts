export type Market = 'Poland' | 'Nigeria';
export type Currency = 'PLN' | 'NGN';
export type OrderStatus = 'Confirmed' | 'Processing' | 'In Transit' | 'Completed' | 'Cancelled';
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';
export type BookingStatus = 'Confirmed' | 'Pending' | 'Completed';

export interface Product {
  id: string;
  name: string;
  description?: string;
  price_ngn: number;
  price_pln: number;
  category: string;
  image: string;
  isNew?: boolean;
  isSale?: boolean;
  rating?: number;
  reviews?: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock';
  sku: string;
}

export interface Order {
  id: string;
  customer: {
    name: string;
    email: string;
    avatar: string;
  };
  items: string;
  date: string;
  market: Market;
  total_ngn: number;
  total_pln: number;
  status: OrderStatus;
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
}

export interface Booking {
  id: string;
  customerName: string;
  service: string;
  stylist: string;
  date: string;
  time: string;
  status: BookingStatus;
  avatar: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  totalOrders: number;
  totalSpent_pln: number;
  lastActive: string;
  avatar: string;
}

export interface CheckoutItemInput {
  product_id: string;
  quantity: number;
}

export interface CheckoutAddressInput {
  fullName: string;
  address: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
  phone?: string;
}

export interface CreatePaymentIntentPayload {
  currency: Currency;
  email: string;
  shippingAddress: CheckoutAddressInput;
  billingAddress?: CheckoutAddressInput;
  items: CheckoutItemInput[];
}
