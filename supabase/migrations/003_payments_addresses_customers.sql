alter table public.orders
  add column if not exists payment_intent_id text,
  add column if not exists shipping_address_id uuid,
  add column if not exists billing_address_id uuid;

create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  address_type text not null check (address_type in ('shipping', 'billing')),
  full_name text not null,
  street text not null,
  city text not null,
  state text,
  postal_code text,
  country text not null,
  phone text,
  is_default boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  payment_intent_id text unique not null,
  order_id uuid references public.orders(id) on delete set null,
  provider text not null default 'mockpay',
  provider_reference text,
  status text not null default 'pending' check (status in ('pending', 'succeeded', 'failed', 'refunded')),
  amount numeric(12,2) not null,
  currency text not null check (currency in ('NGN', 'PLN')),
  customer_email text not null,
  customer_name text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.webhook_events (
  id uuid primary key default gen_random_uuid(),
  event_id text unique not null,
  payment_intent_id text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace view public.customers as
select
  p.id::text as id,
  coalesce(p.full_name, split_part(p.email, '@', 1)) as name,
  p.email as email,
  count(o.id)::int as "totalOrders",
  coalesce(sum(o.total_pln), 0)::numeric as "totalSpent_pln",
  coalesce(to_char(max(o.updated_at), 'Mon DD, YYYY'), 'N/A') as "lastActive",
  ''::text as avatar
from public.profiles p
left join public.orders o on o.user_id = p.id
where p.role = 'CUSTOMER'
group by p.id, p.full_name, p.email;

create index if not exists idx_orders_status on public.orders(status);
create index if not exists idx_orders_market on public.orders(market);
create index if not exists idx_payments_status on public.payments(status);
create index if not exists idx_payments_order_id on public.payments(order_id);
create index if not exists idx_addresses_user_id on public.addresses(user_id);
