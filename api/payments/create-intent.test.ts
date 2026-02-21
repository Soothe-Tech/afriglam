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
    const req: any = { method: 'GET', body: {} };
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(405);
  });

  it('returns 400 for missing customer fields or empty cart', async () => {
    const req: any = { method: 'POST', body: { currency: 'PLN', amount: 100 } };
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
  });

  it('returns 200 for valid payload when no Supabase', async () => {
    const req: any = {
      method: 'POST',
      body: {
        currency: 'PLN',
        amount: 100,
        email: 'test@example.com',
        fullName: 'Test User',
        address: '123 Main St',
        city: 'Warsaw',
        items: [{ product_id: 'a1b2c3d4-e5f6-4789-a012-345678901234', quantity: 1, unit_price_ngn: 0, unit_price_pln: 100 }],
      },
    };
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(200);
    expect((res.payload as { ok?: boolean; intentId?: string }).ok).toBe(true);
    expect((res.payload as { intentId?: string }).intentId).toMatch(/^intent_/);
  });

  it('returns 400 when amount does not match cart total', async () => {
    const req: any = {
      method: 'POST',
      body: {
        currency: 'PLN',
        amount: 50,
        email: 'test@example.com',
        fullName: 'Test User',
        address: '123 Main St',
        city: 'Warsaw',
        items: [{ product_id: 'a1b2c3d4-e5f6-4789-a012-345678901234', quantity: 1, unit_price_ngn: 0, unit_price_pln: 100 }],
      },
    };
    const res = createRes();
    await handler(req, res);
    expect(res.statusCode).toBe(400);
  });
});
