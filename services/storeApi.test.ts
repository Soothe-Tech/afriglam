import { describe, expect, it } from 'vitest';
import { storeApi } from './storeApi';

describe('storeApi', () => {
  it('returns demo catalog products when no Supabase is configured', async () => {
    const result = await storeApi.getProducts('all');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });

  it('filters demo catalog products by category when no Supabase', async () => {
    const result = await storeApi.getProducts('Braids');
    expect(Array.isArray(result)).toBe(true);
    expect(result.every((product) => product.category.toLowerCase().includes('braids'))).toBe(true);
  });

  it('returns a demo product by id when no Supabase', async () => {
    const products = await storeApi.getProducts('all');
    const result = await storeApi.getProductById(products[0].id);
    expect(result?.id).toBe(products[0].id);
  });

  it('createCustomer fallback returns customer shape', async () => {
    const { ok, customer } = await storeApi.createCustomer({ name: 'Test User', email: 'test@example.com' });
    expect(ok).toBe(true);
    expect(customer).toBeDefined();
    expect(customer?.name).toBe('Test User');
    expect(customer?.email).toBe('test@example.com');
    expect(customer?.totalOrders).toBe(0);
  });

  it('createBooking fallback returns booking shape', async () => {
    const { ok, booking } = await storeApi.createBooking({
      customerName: 'Jane',
      service: 'Makeup',
      stylist: 'Amara',
      date: '2024-12-01',
      time: '14:00',
    });
    expect(ok).toBe(true);
    expect(booking).toBeDefined();
    expect(booking?.customerName).toBe('Jane');
    expect(booking?.service).toBe('Makeup');
    expect(booking?.status).toBe('Pending');
  });

  it('updateOrderStatus does not throw in fallback', async () => {
    const { ok } = await storeApi.updateOrderStatus('ord_1', 'Confirmed');
    expect(ok).toBe(true);
  });
});
