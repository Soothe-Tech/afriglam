import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { badRequest, methodNotAllowed, unauthorized } from '../_utils/http';
import { logger } from '../../lib/logger';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res);
  }

  const signature = String(req.headers['x-webhook-signature'] ?? '');
  const secret = process.env.PAYMENT_WEBHOOK_SECRET;
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
  const status = String(req.body?.status ?? '');
  if (!eventId || !intentId || !intentId.startsWith('intent_') || !['succeeded', 'failed'].includes(status)) {
    return badRequest(res, 'Invalid webhook payload');
  }

  try {
    if (supabaseAdmin) {
      const { data: existingEvent } = await supabaseAdmin
        .from('webhook_events')
        .select('id')
        .eq('event_id', eventId)
        .maybeSingle();

      if (existingEvent?.id) {
        return res.status(200).json({ ok: true, message: 'Event already processed' });
      }

      await supabaseAdmin.from('webhook_events').insert({
        event_id: eventId,
        payment_intent_id: intentId,
        payload: req.body,
      });

      await supabaseAdmin
        .from('payments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('payment_intent_id', intentId);

      if (status === 'succeeded') {
        const { data: payment } = await supabaseAdmin
          .from('payments')
          .select('order_id')
          .eq('payment_intent_id', intentId)
          .maybeSingle();
        if (payment?.order_id) {
          await supabaseAdmin
            .from('orders')
            .update({ status: 'Confirmed', updated_at: new Date().toISOString() })
            .eq('id', payment.order_id);
        }
      }
    }

    return res.status(200).json({ ok: true, message: 'Webhook accepted' });
  } catch (error) {
    logger.error('payment_webhook_failed', { error: String(error), eventId, intentId });
    return res.status(500).json({ ok: false, message: 'Webhook processing failed' });
  }
}
