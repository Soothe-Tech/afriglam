import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, useCart } from './CartContext';
import type { Product } from '../types';

const product: Product = {
  id: 'p1',
  name: 'Test Product',
  price_ngn: 1000,
  price_pln: 10,
  category: 'Wigs',
  image: 'x',
  status: 'In Stock',
  sku: 'SKU-1',
};

const Demo = () => {
  const { addToCart, itemCount, subtotalPln } = useCart();
  return (
    <div>
      <button onClick={() => addToCart(product)}>add</button>
      <span data-testid="count">{itemCount}</span>
      <span data-testid="subtotal">{subtotalPln}</span>
    </div>
  );
};

describe('CartContext', () => {
  it('adds item and updates totals', () => {
    render(
      <CartProvider>
        <Demo />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('add'));

    expect(screen.getByTestId('count')).toHaveTextContent('1');
    expect(screen.getByTestId('subtotal')).toHaveTextContent('10');
  });
});
