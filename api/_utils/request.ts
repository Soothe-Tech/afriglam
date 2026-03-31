import crypto from 'crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { logger } from '../../lib/logger';

export const attachRequestContext = (req: VercelRequest, res: VercelResponse) => {
  const requestId = String(req.headers?.['x-request-id'] ?? crypto.randomUUID());
  if (typeof res.setHeader === 'function') {
    res.setHeader('x-request-id', requestId);
  }
  logger.info('request_started', {
    requestId,
    method: req.method,
    path: req.url,
  });
  return {
    requestId,
    log: (level: 'info' | 'warn' | 'error', message: string, meta?: Record<string, unknown>) => {
      logger[level](message, { requestId, ...meta });
    },
  };
};
