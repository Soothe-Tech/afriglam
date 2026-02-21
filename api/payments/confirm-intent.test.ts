import { describe, expect, it } from 'vitest';
import handler from './confirm-intent';

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

describe('confirm-intent api', () => {
  it('returns 405 for non-POST', async () => {
    const req = { method: 'GET' };
    const res = createRes();
    await handler(req as any, res as any);
    expect(res.statusCode).toBe(405);
  });

  it('returns 400 for invalid intent id', async () => {
    const req = { method: 'POST', body: { intentId: 'bad' } };
    const res = createRes();
    await handler(req as any, res as any);
    expect(res.statusCode).toBe(400);
  });

  it('returns 200 for valid intent id', async () => {
    const req = { method: 'POST', body: { intentId: 'intent_123', orderId: '' } };
    const res = createRes();
    await handler(req as any, res as any);
    expect(res.statusCode).toBe(200);
    expect((res.payload as { ok?: boolean }).ok).toBe(true);
  });
});
