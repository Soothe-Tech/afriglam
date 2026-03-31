import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdminUser } from '../_utils/auth';
import { badRequest, forbidden, methodNotAllowed, unauthorized, serviceUnavailable } from '../_utils/http';
import { attachRequestContext } from '../_utils/request';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

const allowedTypes = new Set(['full', 'orders']);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const request = attachRequestContext(req, res);

  if (req.method !== 'POST') {
    return methodNotAllowed(res);
  }

  const exportType = String(req.body?.exportType ?? 'full');
  if (!allowedTypes.has(exportType)) {
    return badRequest(res, 'Invalid export type');
  }

  if (!supabaseAdmin) {
    return serviceUnavailable(res, 'Analytics export requires database configuration');
  }

  const { user, isAdmin } = await requireAdminUser(req);
  if (!user) return unauthorized(res);
  if (!isAdmin) {
    return forbidden(res, 'Admin access required');
  }

  await supabaseAdmin.from('admin_audit_logs').insert({
    admin_id: user.id,
    action: 'analytics.export.requested',
    entity: 'analytics_export',
    metadata: { exportType, requestId: request.requestId },
  });

  request.log('info', 'analytics_export_requested', { adminId: user.id, exportType });

  return res.status(200).json({
    ok: true,
    message: exportType === 'orders' ? 'Orders export queued.' : 'Full analytics export queued.',
    fileUrl: null,
  });
}
