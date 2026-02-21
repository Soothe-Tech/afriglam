import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import getRawBody from 'raw-body';
import { methodNotAllowed, unauthorized, badRequest } from '../_utils/http';
import { logger } from '../../lib/logger';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res);
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return unauthorized(res, 'Stripe webhook secret is not configured');
  }

  let rawBody: Buffer;
  const preParsed = (req as unknown as { rawBody?: Buffer }).rawBody;
  if (preParsed && Buffer.isBuffer(preParsed)) {
    rawBody = preParsed;
  } else {
    try {
      rawBody = await getRawBody(req, { limit: '1mb' });
    } catch (e) {
      logger.warn('stripe_webhook_raw_body_failed', { error: String(e) });
      return badRequest(res, 'Invalid body');
    }
  }

  const signature = String(req.headers['stripe-signature'] ?? '');
  let event: Stripe.Event;
  try {
    event = Stripe.webhooks.constructEvent(rawBody, signature, webhookSecret) as Stripe.Event;
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.warn('stripe_webhook_signature_invalid', { error: message });
    return unauthorized(res, 'Invalid Stripe signature');
  }

  const intentId = (event.data?.object as { metadata?: { intentId?: string }; id?: string })?.metadata?.intentId;
  const orderId = (event.data?.object as { metadata?: { orderId?: string } })?.metadata?.orderId;

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata as { intentId?: string; orderId?: string } | null;
    const id = meta?.intentId ?? intentId;
    const oid = meta?.orderId ?? orderId;
    if (!id || !id.startsWith('intent_')) {
      logger.warn('stripe_webhook_missing_metadata', { eventId: event.id });
      return res.status(200).json({ ok: true, message: 'No intentId in metadata' });
    }
    const ref =
      typeof session.payment_intent === 'string'
        ? session.payment_intent
        : session.payment_intent?.id ?? null;
    await applySuccess(id, oid, event.id, ref);
    return res.status(200).json({ ok: true, message: 'Webhook accepted' });
  }

  if (event.type === 'payment_intent.succeeded') {
    const pi = event.data.object as Stripe.PaymentIntent;
    const id = (pi.metadata as { intentId?: string })?.intentId ?? intentId;
    const oid = (pi.metadata as { orderId?: string })?.orderId ?? orderId;
    if (!id || !id.startsWith('intent_')) {
      logger.warn('stripe_webhook_missing_metadata', { eventId: event.id });
      return res.status(200).json({ ok: true, message: 'No intentId in metadata' });
    }
    await applySuccess(id, oid, event.id, pi.id);
    return res.status(200).json({ ok: true, message: 'Webhook accepted' });
  }

  return res.status(200).json({ ok: true, message: 'Event ignored' });
}

async function applySuccess(
  intentId: string,
  orderId: string | null | undefined,
  stripeEventId: string,
  providerRef: string | null
) {
  if (!supabaseAdmin) return;

  const eventIdForIdempotency = `stripe_${stripeEventId}`;
  const { data: existingEvent } = await supabaseAdmin
    .from('webhook_events')
    .select('id')
    .eq('event_id', eventIdForIdempotency)
    .maybeSingle();

  if (existingEvent?.id) return;

  await supabaseAdmin.from('webhook_events').insert({
    event_id: eventIdForIdempotency,
    payment_intent_id: intentId,
    payload: { stripeEventId, providerRef, orderId },
  });

  await supabaseAdmin
    .from('payments')
    .update({
      status: 'succeeded',
      ...(providerRef ? { provider_reference: providerRef } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq('payment_intent_id', intentId);

  if (orderId) {
    await supabaseAdmin
      .from('orders')
      .update({ status: 'Confirmed', updated_at: new Date().toISOString() })
      .eq('id', orderId);
  }
}
