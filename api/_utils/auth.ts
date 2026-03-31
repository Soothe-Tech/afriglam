import type { VercelRequest } from '@vercel/node';
import { supabaseAdmin } from '../../lib/supabaseAdmin';

export const getBearerToken = (req: VercelRequest): string | null => {
  const header = req.headers.authorization;
  if (!header) return null;
  if (!header.startsWith('Bearer ')) return null;
  return header.replace('Bearer ', '').trim();
};

export const getUserFromRequest = async (req: VercelRequest) => {
  const token = getBearerToken(req);
  if (!token || !supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
};

export const getProfileRole = async (userId: string) => {
  if (!supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .maybeSingle();
  if (error) return null;
  return (data?.role as string | undefined) ?? null;
};

export const requireAdminUser = async (req: VercelRequest) => {
  const user = await getUserFromRequest(req);
  if (!user) {
    return { user: null, isAdmin: false };
  }

  const role = await getProfileRole(user.id);
  return {
    user,
    isAdmin: role === 'ADMIN',
  };
};
