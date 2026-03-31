import type { VercelRequest, VercelResponse } from '@vercel/node';
import { badRequest, methodNotAllowed, serverError, unauthorized } from '../_utils/http';
import { attachRequestContext } from '../_utils/request';
import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { getUserFromRequest, getProfileRole } from '../_utils/auth';
import { applyPaymentUpdate, orderStatusFromPaymentStatus } from '../_utils/payments';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const request = attachRequestContext(req, res);

  if (req.method !== 'POST') {
    return methodNotAllowed(res);
  }

  const intentId = String(req.body?.intentId ?? '');
  const orderId = String(req.body?.orderId ?? '');
  if (!intentId.startsWith('intent_')) {
    return badRequest(res, 'Invalid intent id');
  }

  try {
    if (!supabaseAdmin) {
      return res.status(200).json({
        ok: true,
        orderStatus: 'Confirmed',
        intentId,
        orderId: orderId || null,
        message: 'Payment confirmed in demo mode',
      });
    }

    const user = await getUserFromRequest(req);
    if (!user) {
      return unauthorized(res, 'Authentication required to confirm payment');
    }

    const { data: paymentRow } = await supabaseAdmin
      .from('payments')
      .select('status, provider, order_id')
      .eq('payment_intent_id', intentId)
      .maybeSingle();

    const resolvedOrderId = orderId || paymentRow?.order_id || null;
    if (resolvedOrderId) {
      const { data: order } = await supabaseAdmin.from('orders').select('user_id').eq('id', resolvedOrderId).single();
      if (order && order.user_id !== user.id) {
        const role = await getProfileRole(user.id);
        if (role !== 'ADMIN') {
          return unauthorized(res, 'Not authorized to confirm this order');
        }
      }
    }

    const provider = paymentRow?.provider ?? 'mockpay';
    const paymentStatus = (paymentRow?.status ?? 'pending') as 'pending' | 'succeeded' | 'failed' | 'refunded';

    if (provider !== 'mockpay') {
      return res.status(200).json({
        ok: true,
        orderStatus: orderStatusFromPaymentStatus(paymentStatus),
        intentId,
        orderId: resolvedOrderId,
        message: 'Payment status is updated by the payment provider. Refresh to see the latest state.',
      });
    }

    await applyPaymentUpdate({
      eventId: `confirm_${intentId}`,
      intentId,
      status: 'succeeded',
      providerReference: `mockpay_${Date.now()}`,
      source: 'confirm-intent',
      rawPayload: { intentId, orderId: resolvedOrderId, requestId: request.requestId },
      orderId: resolvedOrderId,
    });

    return res.status(200).json({
      ok: true,
      orderStatus: orderStatusFromPaymentStatus('succeeded'),
      intentId,
      orderId: resolvedOrderId,
      message: 'Payment confirmed and order finalized',
    });
  } catch (error) {
    request.log('error', 'confirm_intent_failed', { error: String(error), intentId, orderId });
    return serverError(res, 'Failed to confirm payment');
  }
}
