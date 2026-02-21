import type { VercelResponse } from '@vercel/node';

export const json = (res: VercelResponse, status: number, payload: unknown) => {
  return res.status(status).json(payload);
};

export const methodNotAllowed = (res: VercelResponse) => {
  return json(res, 405, { ok: false, message: 'Method not allowed' });
};

export const badRequest = (res: VercelResponse, message: string) => {
  return json(res, 400, { ok: false, message });
};

export const unauthorized = (res: VercelResponse, message = 'Unauthorized') => {
  return json(res, 401, { ok: false, message });
};

export const serverError = (res: VercelResponse, message = 'Internal server error') => {
  return json(res, 500, { ok: false, message });
};

export const serviceUnavailable = (res: VercelResponse, message = 'Service unavailable') => {
  return json(res, 503, { ok: false, message });
};
