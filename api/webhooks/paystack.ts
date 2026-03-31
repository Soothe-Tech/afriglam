import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import getRawBody from 'raw-body';
import { methodNotAllowed, unauthorized, badRequest } from '../_utils/http';
import { attachRequestContext } from '../_utils/request';
import { getRequiredServerEnv } from '../../lib/serverEnv';
import { applyPaymentUpdate } from '../_utils/payments';

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const request = attachRequestContext(req, res);

  if (req.method !== 'POST') {
    return methodNotAllowed(res);
  }

  const secret = getRequiredServerEnv('PAYSTACK_WEBHOOK_SECRET') ?? getRequiredServerEnv('PAYSTACK_SECRET_KEY');
  if (!secret) {
    return unauthorized(res, 'Paystack secret is not configured');
  }

  let rawBody: Buffer;
  const preParsed = (req as unknown as { rawBody?: Buffer }).rawBody;
  if (preParsed && Buffer.isBuffer(preParsed)) {
    rawBody = preParsed;
  } else {
    try {
      rawBody = await getRawBody(req, { limit: '1mb' });
    } catch (e) {
      request.log('warn', 'paystack_webhook_raw_body_failed', { error: String(e) });
      return badRequest(res, 'Invalid body');
    }
  }

  const signature = String(req.headers['x-paystack-signature'] ?? '');
  const computed = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
  if (!signature || signature.length !== computed.length || !crypto.timingSafeEqual(Buffer.from(signature, 'utf8'), Buffer.from(computed, 'utf8'))) {
    return unauthorized(res, 'Invalid Paystack signature');
  }

  let payload: { event?: string; data?: { reference?: string; id?: string } };
  try {
    payload = JSON.parse(rawBody.toString('utf8'));
  } catch {
    return badRequest(res, 'Invalid JSON');
  }

  const event = payload?.event;
  const reference = payload?.data?.reference;
  const eventId = payload?.data?.id ?? payload?.event ?? '';

  if (!reference || typeof reference !== 'string' || !reference.startsWith('intent_')) {
    return badRequest(res, 'Missing or invalid reference');
  }

  if (event !== 'charge.success') {
    return res.status(200).json({ ok: true, message: 'Event ignored' });
  }

  try {
    const result = await applyPaymentUpdate({
      eventId: `paystack_${eventId || reference}`,
      intentId: reference,
      status: 'succeeded',
      providerReference: reference,
      source: 'webhooks/paystack',
      rawPayload: payload as unknown as Record<string, unknown>,
    });

    if (result.ok && result.deduplicated) {
      return res.status(200).json({ ok: true, message: 'Event already processed' });
    }

    return res.status(200).json({ ok: true, message: 'Webhook accepted' });
  } catch (error) {
    request.log('error', 'paystack_webhook_failed', { error: String(error), reference });
    return res.status(500).json({ ok: false, message: 'Webhook processing failed' });
  }
}
