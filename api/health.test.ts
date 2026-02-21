import { describe, expect, it } from 'vitest';
import handler from './health';

const createRes = () => {
  const res: { statusCode: number; payload: unknown; headers: Record<string, string>; setHeader: (k: string, v: string) => void; status: (code: number) => typeof res; json: (p: unknown) => unknown } = {
    statusCode: 200,
    payload: null,
    headers: {},
    setHeader(k: string, v: string) {
      this.headers[k] = v;
    },
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

describe('health api', () => {
  it('returns 200 and healthy payload', async () => {
    const res = createRes();
    await handler({} as any, res as any);
    expect(res.statusCode).toBe(200);
    const body = res.payload as { ok?: boolean; status?: string };
    expect(body.ok).toBe(true);
    expect(body.status).toBe('healthy');
  });
});
