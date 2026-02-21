alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.bookings enable row level security;
alter table public.admin_audit_logs enable row level security;

create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles p
    where p.id = uid and p.role = 'ADMIN'
  );
$$;

-- Profiles
create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id or public.is_admin(auth.uid()));

create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id or public.is_admin(auth.uid()));

-- Products
create policy "products_public_read_published"
on public.products for select
using (is_published = true or public.is_admin(auth.uid()));

create policy "products_admin_write"
on public.products for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- Carts and cart items
create policy "carts_owner_only"
on public.carts for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "cart_items_owner_only"
on public.cart_items for all
using (
  exists (
    select 1 from public.carts c
    where c.id = cart_id and c.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1 from public.carts c
    where c.id = cart_id and c.user_id = auth.uid()
  )
);

-- Orders and items
create policy "orders_owner_or_admin"
on public.orders for select
using (auth.uid() = user_id or public.is_admin(auth.uid()));

create policy "orders_owner_insert"
on public.orders for insert
with check (auth.uid() = user_id);

create policy "orders_admin_update"
on public.orders for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "order_items_owner_or_admin"
on public.order_items for select
using (
  exists (
    select 1 from public.orders o
    where o.id = order_id and (o.user_id = auth.uid() or public.is_admin(auth.uid()))
  )
);

create policy "order_items_owner_insert"
on public.order_items for insert
with check (
  exists (
    select 1 from public.orders o
    where o.id = order_id and o.user_id = auth.uid()
  )
);

-- Bookings
create policy "bookings_owner_or_admin_read"
on public.bookings for select
using (customer_id = auth.uid() or public.is_admin(auth.uid()));

create policy "bookings_owner_insert"
on public.bookings for insert
with check (customer_id = auth.uid());

create policy "bookings_admin_update"
on public.bookings for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

-- Audit logs admin-only
create policy "audit_logs_admin_only"
on public.admin_audit_logs for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));
