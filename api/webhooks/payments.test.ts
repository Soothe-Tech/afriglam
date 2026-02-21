import { describe, expect, it, beforeEach } from 'vitest';
import handler from './payments';

const createRes = () => {
  const res: { statusCode: number; payload: unknown; status: (code: number) => typeof res; json: (p: unknown) => unknown } = {
    statusCode: 200,
    payload: null,
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(p: unknown) {
      this.payload = p;
      return this;
    },
  };
  return res;
};

describe('webhooks/payments', () => {
  beforeEach(() => {
    delete (process.env as Record<string, string>).PAYMENT_WEBHOOK_SECRET;
  });

  it('returns 405 for non-POST', async () => {
    const req = { method: 'GET', headers: {}, body: {} };
    const res = createRes();
    await handler(req as any, res as any);
    expect(res.statusCode).toBe(405);
  });

  it('returns 401 when webhook secret is not configured', async () => {
    const req = { method: 'POST', headers: {}, body: { eventId: 'ev_1', intentId: 'intent_1', status: 'succeeded' } };
    const res = createRes();
    await handler(req as any, res as any);
    expect(res.statusCode).toBe(401);
  });

  it('returns 401 for invalid signature', async () => {
    process.env.PAYMENT_WEBHOOK_SECRET = 'test-secret';
    const req = {
      method: 'POST',
      headers: { 'x-webhook-signature': 'wrong' },
      body: { eventId: 'ev_1', intentId: 'intent_1', status: 'succeeded' },
    };
    const res = createRes();
    await handler(req as any, res as any);
    expect(res.statusCode).toBe(401);
  });

  it('returns 400 for invalid payload (missing eventId)', async () => {
    const secret = 'test-secret';
    process.env.PAYMENT_WEBHOOK_SECRET = secret;
    const body = { intentId: 'intent_1', status: 'succeeded' };
    const crypto = await import('crypto');
    const sig = crypto.createHmac('sha256', secret).update(JSON.stringify(body)).digest('hex');
    const req = { method: 'POST', headers: { 'x-webhook-signature': sig }, body };
    const res = createRes();
    await handler(req as any, res as any);
    expect(res.statusCode).toBe(400);
  });
});
