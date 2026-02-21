import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import Stripe from 'stripe';
import { badRequest, methodNotAllowed, serverError } from '../_utils/http';
import { logger } from '../../lib/logger';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { getUserFromRequest } from '../_utils/auth';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const MAX_AMOUNT = 50_000_000;
const MAX_QUANTITY_PER_ITEM = 99;

function getAppOrigin(): string {
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return process.env.APP_ORIGIN ?? 'http://localhost:5173';
}

type CheckoutItem = {
  product_id: string;
  quantity: number;
  unit_price_ngn: number;
  unit_price_pln: number;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res);
  }

  const currency = String(req.body?.currency ?? '');
  const amount = Number(req.body?.amount ?? 0);
  const market = currency === 'PLN' ? 'Poland' : currency === 'NGN' ? 'Nigeria' : '';
  const items = (Array.isArray(req.body?.items) ? req.body.items : []) as CheckoutItem[];
  const email = String(req.body?.email ?? '').trim().slice(0, 254);
  const fullName = String(req.body?.fullName ?? '').trim().slice(0, 200);
  const address = String(req.body?.address ?? '').trim().slice(0, 500);
  const city = String(req.body?.city ?? '').trim().slice(0, 100);

  if (!['NGN', 'PLN'].includes(currency) || !Number.isFinite(amount) || amount <= 0 || amount > MAX_AMOUNT) {
    return badRequest(res, 'Invalid payment payload');
  }
  if (!fullName || !email || !address || !city) {
    return badRequest(res, 'Missing customer checkout fields');
  }
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!validEmail) {
    return badRequest(res, 'Invalid email address');
  }
  const validatedItems = items
    .filter((item) => UUID_REGEX.test(String(item.product_id)))
    .map((item) => {
      const q = Math.min(Math.max(0, Math.floor(Number(item.quantity))), MAX_QUANTITY_PER_ITEM);
      const unit_price_ngn = Number.isFinite(Number(item.unit_price_ngn)) && item.unit_price_ngn >= 0 ? Number(item.unit_price_ngn) : 0;
      const unit_price_pln = Number.isFinite(Number(item.unit_price_pln)) && item.unit_price_pln >= 0 ? Number(item.unit_price_pln) : 0;
      return { product_id: String(item.product_id), quantity: q, unit_price_ngn, unit_price_pln };
    })
    .filter((item) => item.quantity > 0);
  if (validatedItems.length === 0) {
    return badRequest(res, 'Checkout cart is empty');
  }
  const computedTotal = validatedItems.reduce(
    (sum, item) => sum + (currency === 'NGN' ? item.quantity * item.unit_price_ngn : item.quantity * item.unit_price_pln),
    0
  );
  if (Math.abs(computedTotal - amount) > 0.01) {
    return badRequest(res, 'Amount does not match cart total');
  }

  const intentId = `intent_${crypto.randomUUID()}`;
  const paystackKey = process.env.PAYSTACK_SECRET_KEY;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const provider =
    currency === 'NGN' && paystackKey
      ? 'paystack'
      : currency === 'PLN' && stripeKey
        ? 'stripe'
        : 'mockpay';

  let orderId: string | null = null;
  if (supabaseAdmin) {
    try {
      const user = await getUserFromRequest(req);
      if (!user) {
        return badRequest(res, 'Authenticated user is required for checkout');
      }

      const { data: order, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
          user_id: user.id,
          status: 'Processing',
          market,
          total_ngn: currency === 'NGN' ? amount : 0,
          total_pln: currency === 'PLN' ? amount : 0,
          payment_intent_id: intentId,
        })
        .select('id')
        .single();

      if (orderError) {
        logger.warn('order_create_failed', { orderError: orderError.message });
        return serverError(res, 'Failed to create order');
      }
      if (!order?.id) {
        return serverError(res, 'Failed to create order');
      }
      orderId = order.id as string;
      const orderItemsPayload = validatedItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        unit_price_ngn: item.unit_price_ngn,
        unit_price_pln: item.unit_price_pln,
      }));
      const { error: itemsError } = await supabaseAdmin.from('order_items').insert(orderItemsPayload);
      if (itemsError) {
        logger.warn('order_items_create_failed', { error: itemsError.message });
        return serverError(res, 'Failed to create order items');
      }

      await supabaseAdmin.from('payments').insert({
        payment_intent_id: intentId,
        order_id: orderId,
        provider,
        status: 'pending',
        amount,
        currency,
        customer_email: email,
        customer_name: fullName,
        metadata: {
          address,
          city,
          source: 'checkout',
        },
      });
    } catch (error) {
      logger.error('create_intent_supabase_error', { error: String(error) });
      return serverError(res, 'Failed to create payment intent');
    }
  }

  let checkoutUrl = `${getAppOrigin()}/checkout/confirm?intentId=${encodeURIComponent(intentId)}${orderId ? `&orderId=${encodeURIComponent(orderId)}` : ''}`;

  if (provider === 'paystack' && paystackKey) {
    try {
      const amountKobo = Math.round(amount * 100);
      const callbackUrl = `${getAppOrigin()}/checkout/confirm?intentId=${encodeURIComponent(intentId)}${orderId ? `&orderId=${encodeURIComponent(orderId)}` : ''}`;
      const initRes = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${paystackKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: amountKobo,
          reference: intentId,
          callback_url: callbackUrl,
          metadata: { intentId, orderId: orderId ?? undefined },
        }),
      });
      const data = await initRes.json();
      if (!data.status || !data.data?.authorization_url) {
        logger.warn('paystack_initialize_failed', { status: data.status, message: data.message ?? 'No URL' });
        return serverError(res, 'Paystack initialization failed');
      }
      checkoutUrl = data.data.authorization_url;
    } catch (error) {
      logger.error('paystack_initialize_error', { error: String(error) });
      return serverError(res, 'Paystack initialization failed');
    }
  }

  if (provider === 'stripe' && stripeKey && orderId) {
    try {
      const stripe = new Stripe(stripeKey);
      const amountGrosze = Math.round(amount * 100);
      const successUrl = `${getAppOrigin()}/checkout/confirm?intentId=${encodeURIComponent(intentId)}&orderId=${encodeURIComponent(orderId)}`;
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card', 'blik'],
        line_items: [
          {
            price_data: {
              currency: 'pln',
              unit_amount: amountGrosze,
              product_data: { name: 'AfriGlam order', description: `Order ${orderId}` },
            },
            quantity: 1,
          },
        ],
        success_url: successUrl,
        cancel_url: successUrl,
        customer_email: email,
        metadata: { intentId, orderId },
      });
      if (session.url) checkoutUrl = session.url;
    } catch (error) {
      logger.error('stripe_checkout_error', { error: String(error) });
      return serverError(res, 'Stripe checkout failed');
    }
  }

  return res.status(200).json({
    ok: true,
    intentId,
    orderId,
    checkoutUrl,
  });
}
