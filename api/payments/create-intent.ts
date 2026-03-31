import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import Stripe from 'stripe';
import type { CheckoutAddressInput, CreatePaymentIntentPayload, Currency } from '../../types';
import { badRequest, methodNotAllowed, serverError, serviceUnavailable, unauthorized } from '../_utils/http';
import { attachRequestContext } from '../_utils/request';
import { logger } from '../../lib/logger';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { getUserFromRequest } from '../_utils/auth';
import { getAppOrigin, getRequiredServerEnv } from '../../lib/serverEnv';
import { resolveCatalogPricing, resolveMarketFromCurrency } from '../_utils/payments';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const normalizeAddress = (address: CheckoutAddressInput | undefined, fallbackEmail: string) => {
  const fullName = String(address?.fullName ?? '').trim().slice(0, 200);
  const street = String(address?.address ?? '').trim().slice(0, 500);
  const city = String(address?.city ?? '').trim().slice(0, 100);
  const state = String(address?.state ?? '').trim().slice(0, 100);
  const postalCode = String(address?.postalCode ?? '').trim().slice(0, 50);
  const country = String(address?.country ?? '').trim().slice(0, 100);
  const phone = String(address?.phone ?? '').trim().slice(0, 50);

  if (!fullName || !street || !city || !country) {
    return null;
  }

  return {
    full_name: fullName,
    street,
    city,
    state: state || null,
    postal_code: postalCode || null,
    country,
    phone: phone || fallbackEmail,
  };
};

async function insertAddress(
  userId: string,
  type: 'shipping' | 'billing',
  address: ReturnType<typeof normalizeAddress>
) {
  if (!supabaseAdmin || !address) return null;

  const { data, error } = await supabaseAdmin
    .from('addresses')
    .insert({
      user_id: userId,
      address_type: type,
      ...address,
      is_default: false,
    })
    .select('id')
    .single();

  if (error) {
    throw new Error(`Failed to save ${type} address`);
  }

  return data.id as string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const request = attachRequestContext(req, res);

  if (req.method !== 'POST') {
    return methodNotAllowed(res);
  }

  if (!supabaseAdmin) {
    return serviceUnavailable(res, 'Checkout requires server database configuration');
  }

  const user = await getUserFromRequest(req);
  if (!user) {
    return unauthorized(res, 'Authenticated user is required for checkout');
  }

  const payload = (req.body ?? {}) as Partial<CreatePaymentIntentPayload>;
  const currency = String(payload.currency ?? '') as Currency;
  const email = String(payload.email ?? '').trim().slice(0, 254);
  const shippingAddress = normalizeAddress(payload.shippingAddress, email);
  const billingAddress = normalizeAddress(payload.billingAddress ?? payload.shippingAddress, email);
  const requestedItems = Array.isArray(payload.items) ? payload.items : [];

  if (!['NGN', 'PLN'].includes(currency)) {
    return badRequest(res, 'Unsupported checkout currency');
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return badRequest(res, 'Invalid email address');
  }
  if (!shippingAddress || !billingAddress) {
    return badRequest(res, 'Missing required address fields');
  }

  const validItems = requestedItems
    .filter((item) => UUID_REGEX.test(String(item?.product_id ?? '')))
    .map((item) => ({
      product_id: String(item.product_id),
      quantity: Number(item.quantity),
    }));

  if (validItems.length === 0) {
    return badRequest(res, 'Checkout cart is empty');
  }

  const pricedCart = await resolveCatalogPricing(validItems, currency);
  if (!pricedCart.ok) {
    return badRequest(res, pricedCart.message);
  }

  const amount = pricedCart.total;
  const market = resolveMarketFromCurrency(currency);
  const intentId = `intent_${crypto.randomUUID()}`;
  const paystackKey = getRequiredServerEnv('PAYSTACK_SECRET_KEY');
  const stripeKey = getRequiredServerEnv('STRIPE_SECRET_KEY');
  const provider =
    currency === 'NGN' && paystackKey
      ? 'paystack'
      : currency === 'PLN' && stripeKey
        ? 'stripe'
        : 'mockpay';

  try {
    const [shippingAddressId, billingAddressId] = await Promise.all([
      insertAddress(user.id, 'shipping', shippingAddress),
      insertAddress(user.id, 'billing', billingAddress),
    ]);

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert({
        user_id: user.id,
        status: 'Processing',
        market,
        total_ngn: currency === 'NGN' ? amount : 0,
        total_pln: currency === 'PLN' ? amount : 0,
        payment_intent_id: intentId,
        shipping_address_id: shippingAddressId,
        billing_address_id: billingAddressId,
      })
      .select('id')
      .single();

    if (orderError || !order?.id) {
      request.log('warn', 'order_create_failed', { orderError: orderError?.message });
      return serverError(res, 'Failed to create order');
    }

    const orderId = order.id as string;
    const orderItemsPayload = pricedCart.items.map((item) => ({
      order_id: orderId,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price_ngn: item.unit_price_ngn,
      unit_price_pln: item.unit_price_pln,
    }));

    const { error: itemsError } = await supabaseAdmin.from('order_items').insert(orderItemsPayload);
    if (itemsError) {
      request.log('warn', 'order_items_create_failed', { error: itemsError.message, orderId });
      return serverError(res, 'Failed to create order items');
    }

    const { error: paymentError } = await supabaseAdmin.from('payments').insert({
      payment_intent_id: intentId,
      order_id: orderId,
      provider,
      status: 'pending',
      amount,
      currency,
      customer_email: email,
      customer_name: shippingAddress.full_name,
      metadata: {
        market,
        shippingAddress,
        billingAddress,
        lineItems: pricedCart.items.map((item) => ({
          productId: item.product_id,
          productName: item.product_name,
          quantity: item.quantity,
        })),
      },
    });

    if (paymentError) {
      request.log('warn', 'payment_create_failed', { error: paymentError.message, orderId });
      return serverError(res, 'Failed to create payment intent');
    }

    let checkoutUrl = `${getAppOrigin()}/checkout/confirm?intentId=${encodeURIComponent(intentId)}&orderId=${encodeURIComponent(orderId)}`;

    if (provider === 'paystack' && paystackKey) {
      const initRes = await fetch('https://api.paystack.co/transaction/initialize', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${paystackKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: Math.round(amount * 100),
          reference: intentId,
          callback_url: checkoutUrl,
          metadata: { intentId, orderId },
        }),
      });
      const data = await initRes.json();
      if (!data.status || !data.data?.authorization_url) {
        logger.warn('paystack_initialize_failed', { requestId: request.requestId, status: data.status, message: data.message ?? 'No URL' });
        return serverError(res, 'Paystack initialization failed');
      }
      checkoutUrl = data.data.authorization_url;
    }

    if (provider === 'stripe' && stripeKey) {
      const stripe = new Stripe(stripeKey);
      const amountMinor = Math.round(amount * 100);
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        payment_method_types: ['card', 'blik'],
        line_items: [
          {
            price_data: {
              currency: 'pln',
              unit_amount: amountMinor,
              product_data: { name: 'AfriGlam order', description: `Order ${orderId}` },
            },
            quantity: 1,
          },
        ],
        success_url: checkoutUrl,
        cancel_url: checkoutUrl,
        customer_email: email,
        metadata: { intentId, orderId },
      });
      if (session.url) {
        checkoutUrl = session.url;
      }
    }

    return res.status(200).json({
      ok: true,
      intentId,
      orderId,
      amount,
      currency,
      checkoutUrl,
    });
  } catch (error) {
    request.log('error', 'create_intent_failed', { error: String(error) });
    return serverError(res, 'Failed to create payment intent');
  }
}
