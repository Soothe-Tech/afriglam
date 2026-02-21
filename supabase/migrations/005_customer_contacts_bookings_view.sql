-- Admin-added customers (view is read-only)
create table if not exists public.customer_contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

alter table public.bookings
  add column if not exists customer_name text,
  alter column customer_id drop not null;

-- Allow ordering by created_at; view stays read-only
create or replace view public.customers as
select
  p.id::text as id,
  coalesce(p.full_name, split_part(p.email, '@', 1)) as name,
  p.email as email,
  count(o.id)::int as "totalOrders",
  coalesce(sum(o.total_pln), 0)::numeric as "totalSpent_pln",
  coalesce(to_char(max(o.updated_at), 'Mon DD, YYYY'), 'N/A') as "lastActive",
  ''::text as avatar,
  p.created_at as created_at
from public.profiles p
left join public.orders o on o.user_id = p.id
where p.role = 'CUSTOMER'
group by p.id, p.full_name, p.email, p.created_at;

-- RLS for customer_contacts: admin only
alter table public.customer_contacts enable row level security;
create policy "customer_contacts_admin_all"
on public.customer_contacts for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- Allow admin to insert bookings without customer_id (guest appointments)
drop policy if exists "bookings_owner_insert" on public.bookings;
create policy "bookings_owner_or_admin_insert"
on public.bookings for insert
with check (
  customer_id = auth.uid()
  or (customer_id is null and public.is_admin(auth.uid()))
);
