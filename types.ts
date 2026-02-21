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
  market: 'Poland' | 'Nigeria';
  total_ngn: number;
  total_pln: number;
  status: 'Confirmed' | 'Processing' | 'In Transit' | 'Completed' | 'Cancelled';
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
  status: 'Confirmed' | 'Pending' | 'Completed';
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