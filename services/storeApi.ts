import { PRODUCTS, RECENT_ORDERS, BOOKINGS, CUSTOMERS } from '../constants';
import type { Booking, Customer, Order, Product } from '../types';
import { supabase } from '../lib/supabase';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const storeApi = {
  async getProducts(category?: string): Promise<Product[]> {
    if (supabase) {
      const query = supabase.from('products').select('*').order('created_at', { ascending: false });
      const { data, error } = category && category !== 'all' ? await query.eq('category', category) : await query;
      if (!error && data) {
        return data as unknown as Product[];
      }
    }

    await delay(150);
    if (!category || category === 'all') return PRODUCTS;
    return PRODUCTS.filter((product) => product.category.toLowerCase() === category.toLowerCase());
  },

  async getProductById(id: string): Promise<Product | null> {
    if (supabase) {
      const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
      if (!error && data) return data as unknown as Product;
    }
    return PRODUCTS.find((product) => product.id === id) ?? null;
  },

  async getOrders(): Promise<Order[]> {
    if (supabase) {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (ordersError || !ordersData?.length) return (ordersData ?? []) as unknown as Order[];
      const userIds = [...new Set((ordersData as { user_id: string }[]).map((o) => o.user_id))];
      const { data: profilesData } = await supabase.from('profiles').select('id, full_name, email').in('id', userIds);
      const profileMap = new Map(
        (profilesData ?? []).map((p: { id: string; full_name: string | null; email: string }) => [p.id, p])
      );
      return ordersData.map((o: { id: string; user_id: string; status: string; market: string; total_ngn: number; total_pln: number; created_at: string }) => {
        const profile = profileMap.get(o.user_id);
        const name = profile?.full_name ?? profile?.email ?? 'Customer';
        const email = profile?.email ?? '';
        return {
          id: o.id,
          customer: { name, email, avatar: '' },
          items: '',
          date: o.created_at,
          market: o.market as Order['market'],
          total_ngn: Number(o.total_ngn),
          total_pln: Number(o.total_pln),
          status: o.status as Order['status'],
        };
      });
    }
    return RECENT_ORDERS;
  },

  async getBookings(): Promise<Booking[]> {
    if (supabase) {
      const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        return (data as { id: string; customer_name?: string; service: string; stylist: string; booking_date: string; booking_time: string; status: string; avatar?: string }[]).map((row) => ({
          id: row.id,
          customerName: row.customer_name ?? '',
          service: row.service,
          stylist: row.stylist,
          date: row.booking_date,
          time: row.booking_time,
          status: row.status as Booking['status'],
          avatar: row.avatar ?? '',
        }));
      }
    }
    return BOOKINGS;
  },

  async getCustomers(): Promise<Customer[]> {
    if (supabase) {
      const [viewRes, contactsRes] = await Promise.all([
        supabase.from('customers').select('*').order('created_at', { ascending: false }),
        supabase.from('customer_contacts').select('*').order('created_at', { ascending: false }),
      ]);
      const fromView = (viewRes.data ?? []) as (Customer & { created_at?: string })[];
      const fromContacts = ((contactsRes.data ?? []) as { id: string; name: string; email: string; created_at?: string }[]).map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        totalOrders: 0,
        totalSpent_pln: 0,
        lastActive: 'N/A',
        avatar: '',
        created_at: c.created_at,
      }));
      const merged = [...fromView, ...fromContacts];
      merged.sort((a, b) => {
        const ta = (a as { created_at?: string }).created_at ?? '';
        const tb = (b as { created_at?: string }).created_at ?? '';
        return tb.localeCompare(ta);
      });
      return merged.map(({ created_at: _, ...c }) => c as Customer);
    }
    return CUSTOMERS;
  },

  async createProduct(product: Partial<Product>): Promise<{ ok: boolean; error?: string }> {
    if (supabase) {
      const { error } = await supabase.from('products').insert(product);
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    }
    await delay(200);
    return { ok: true };
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<{ ok: boolean; error?: string }> {
    if (supabase) {
      const { error } = await supabase.from('products').update(updates).eq('id', id);
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    }
    await delay(120);
    return { ok: true };
  },

  async deleteProduct(id: string): Promise<{ ok: boolean; error?: string }> {
    if (supabase) {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    }
    await delay(120);
    return { ok: true };
  },

  async updateOrderStatus(orderId: string, status: Order['status']): Promise<{ ok: boolean; error?: string }> {
    if (supabase) {
      const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    }
    await delay(80);
    return { ok: true };
  },

  async createCustomer(payload: { name: string; email: string }): Promise<{ ok: boolean; customer?: Customer; error?: string }> {
    if (supabase) {
      const { data, error } = await supabase.from('customer_contacts').insert(payload).select('*').maybeSingle();
      if (error) return { ok: false, error: error.message };
      const row = data as { id: string; name: string; email: string } | null;
      if (!row) return { ok: true };
      return {
        ok: true,
        customer: {
          id: row.id,
          name: row.name,
          email: row.email,
          totalOrders: 0,
          totalSpent_pln: 0,
          lastActive: 'Just now',
          avatar: '',
        },
      };
    }
    await delay(80);
    return {
      ok: true,
      customer: {
        id: `CUS-${Date.now()}`,
        name: payload.name,
        email: payload.email,
        totalOrders: 0,
        totalSpent_pln: 0,
        lastActive: 'Just now',
        avatar: '',
      },
    };
  },

  async createBooking(payload: Pick<Booking, 'customerName' | 'service' | 'stylist' | 'date' | 'time'>): Promise<{ ok: boolean; booking?: Booking; error?: string }> {
    if (supabase) {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          customer_id: null,
          customer_name: payload.customerName,
          service: payload.service,
          stylist: payload.stylist,
          booking_date: payload.date,
          booking_time: payload.time,
          status: 'Pending',
        })
        .select('*')
        .maybeSingle();
      if (error) return { ok: false, error: error.message };
      const row = data as { id: string; customer_name?: string; service: string; stylist: string; booking_date: string; booking_time: string; status: string } | null;
      if (!row) return { ok: true };
      return {
        ok: true,
        booking: {
          id: row.id,
          customerName: row.customer_name ?? payload.customerName,
          service: row.service,
          stylist: row.stylist,
          date: row.booking_date,
          time: row.booking_time,
          status: row.status as Booking['status'],
          avatar: '',
        },
      };
    }
    await delay(80);
    return {
      ok: true,
      booking: {
        id: `BK-${Date.now()}`,
        status: 'Pending',
        avatar: '',
        ...payload,
      },
    };
  },

  async updateBooking(id: string, updates: Partial<Booking>): Promise<{ ok: boolean; error?: string }> {
    if (supabase) {
      const dbUpdates: Record<string, unknown> = {};
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.customerName !== undefined) dbUpdates.customer_name = updates.customerName;
      if (updates.service !== undefined) dbUpdates.service = updates.service;
      if (updates.stylist !== undefined) dbUpdates.stylist = updates.stylist;
      if (updates.date !== undefined) dbUpdates.booking_date = updates.date;
      if (updates.time !== undefined) dbUpdates.booking_time = updates.time;
      const { error } = await supabase.from('bookings').update(dbUpdates).eq('id', id);
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    }
    await delay(80);
    return { ok: true };
  },

  async uploadProductImage(file: File): Promise<{ ok: boolean; url?: string; error?: string }> {
    if (supabase) {
      const extension = file.name.split('.').pop() || 'jpg';
      const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`;
      const { error } = await supabase.storage.from('product-images').upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });
      if (error) return { ok: false, error: error.message };
      const { data } = supabase.storage.from('product-images').getPublicUrl(path);
      return { ok: true, url: data.publicUrl };
    }

    // Fallback for local dev without Supabase storage
    const url = URL.createObjectURL(file);
    return { ok: true, url };
  },

  async updateAdminSettings(payload: {
    firstName: string;
    lastName: string;
    email: string;
    twoFactorEnabled: boolean;
    newPassword?: string;
  }): Promise<{ ok: boolean; error?: string }> {
    if (supabase) {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: `${payload.firstName} ${payload.lastName}`.trim(),
          email: payload.email,
          two_factor_enabled: payload.twoFactorEnabled,
        } as Record<string, unknown>)
        .eq('id', (await supabase.auth.getUser()).data.user?.id ?? '');

      if (error) return { ok: false, error: error.message };
      return { ok: true };
    }

    localStorage.setItem('admin_settings', JSON.stringify(payload));
    await delay(100);
    return { ok: true };
  },
};
