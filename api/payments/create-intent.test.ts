import { describe, expect, it } from 'vitest';
import handler from './create-intent';

const createRes = () => {
  const res: any = {};
  res.statusCode = 200;
  res.payload = null;
  res.status = (code: number) => {
    res.statusCode = code;
    return res;
  };
  res.json = (payload: unknown) => {
    res.payload = payload;
    return res;
  };
  return res;
};

describe('create-intent api', () => {
  it('returns 405 for non-POST', async () => {
    const req: any = { method: 'GET', headers: {}, body: {} };
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(405);
  });

  it('returns 503 when checkout database configuration is missing', async () => {
    const req: any = { method: 'POST', headers: {}, body: { currency: 'PLN' } };
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(503);
  });

  it('returns 503 for valid payload when no Supabase', async () => {
    const req: any = {
      method: 'POST',
      headers: {},
      body: {
        currency: 'PLN',
        email: 'test@example.com',
        shippingAddress: {
          fullName: 'Test User',
          address: '123 Main St',
          city: 'Warsaw',
          country: 'Poland',
        },
        items: [{ product_id: 'a1b2c3d4-e5f6-4789-a012-345678901234', quantity: 1 }],
      },
    };
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(503);
  });

  it('returns 503 before attempting cart validation when no Supabase is configured', async () => {
    const req: any = {
      method: 'POST',
      headers: {},
      body: {
        currency: 'PLN',
        email: 'test@example.com',
        shippingAddress: {
          fullName: 'Test User',
          address: '123 Main St',
          city: 'Warsaw',
          country: 'Poland',
        },
        items: [{ product_id: 'a1b2c3d4-e5f6-4789-a012-345678901234', quantity: 1 }],
      },
    };
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(503);
  });
});
