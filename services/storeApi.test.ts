import { describe, expect, it } from 'vitest';
import { storeApi } from './storeApi';

describe('storeApi', () => {
  it('returns products from fallback source', async () => {
    const result = await storeApi.getProducts('all');
    expect(result.length).toBeGreaterThan(0);
  });

  it('filters products by category in fallback mode', async () => {
    const result = await storeApi.getProducts('Braids');
    expect(result.every((item) => item.category.toLowerCase() === 'braids')).toBe(true);
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
