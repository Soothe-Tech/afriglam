import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import type { PaymentStatus } from '../../types';
import { badRequest, methodNotAllowed, unauthorized } from '../_utils/http';
import { attachRequestContext } from '../_utils/request';
import { getRequiredServerEnv } from '../../lib/serverEnv';
import { applyPaymentUpdate } from '../_utils/payments';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const request = attachRequestContext(req, res);

  if (req.method !== 'POST') {
    return methodNotAllowed(res);
  }

  const signature = String(req.headers['x-webhook-signature'] ?? '');
  const secret = getRequiredServerEnv('PAYMENT_WEBHOOK_SECRET');
  if (!secret) {
    return unauthorized(res, 'Webhook secret is not configured');
  }

  const bodyString = JSON.stringify(req.body ?? {});
  const computedSignature = crypto.createHmac('sha256', secret).update(bodyString).digest('hex');
  const sigBuf = Buffer.from(signature, 'utf8');
  const compBuf = Buffer.from(computedSignature, 'utf8');
  if (!signature || sigBuf.length !== compBuf.length || !crypto.timingSafeEqual(sigBuf, compBuf)) {
    return unauthorized(res, 'Invalid webhook signature');
  }

  const eventId = String(req.body?.eventId ?? '');
  const intentId = String(req.body?.intentId ?? '');
  const status = String(req.body?.status ?? '') as PaymentStatus;
  if (!eventId || !intentId || !intentId.startsWith('intent_') || !['succeeded', 'failed'].includes(status)) {
    return badRequest(res, 'Invalid webhook payload');
  }

  try {
    const result = await applyPaymentUpdate({
      eventId,
      intentId,
      status,
      source: 'webhooks/payments',
      rawPayload: req.body ?? {},
      orderId: String(req.body?.orderId ?? '') || null,
      providerReference: String(req.body?.providerReference ?? '') || null,
    });

    if (result.ok && result.deduplicated) {
      return res.status(200).json({ ok: true, message: 'Event already processed' });
    }

    return res.status(200).json({ ok: true, message: 'Webhook accepted' });
  } catch (error) {
    request.log('error', 'payment_webhook_failed', { error: String(error), eventId, intentId });
    return res.status(500).json({ ok: false, message: 'Webhook processing failed' });
  }
}
