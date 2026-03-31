import React, { createContext, useContext, useMemo, useState } from 'react';
import type { Product, CartItem } from '../types';

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotalPln: number;
  subtotalNgn: number;
  addToCart: (product: Product, quantity?: number, selectedColor?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const raw = localStorage.getItem('afriglam_cart');
    if (!raw) return [];
    try {
      return JSON.parse(raw) as CartItem[];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    localStorage.setItem('afriglam_cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity = 1, selectedColor?: string) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity, ...(selectedColor != null && { selectedColor }) } : item
        );
      }
      return [...prev, { ...product, quantity, ...(selectedColor != null && { selectedColor }) }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((prev) =>
      prev
        .map((item) => (item.id === productId ? { ...item, quantity } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalPln = items.reduce((sum, item) => sum + item.price_pln * item.quantity, 0);
  const subtotalNgn = items.reduce((sum, item) => sum + item.price_ngn * item.quantity, 0);

  const value = useMemo(
    () => ({ items, itemCount, subtotalPln, subtotalNgn, addToCart, removeFromCart, updateQuantity, clearCart }),
    [itemCount, items, subtotalNgn, subtotalPln]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
