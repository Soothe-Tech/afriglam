-- Role and profile hardening
alter table public.profiles
  add column if not exists two_factor_enabled boolean not null default false;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data ->> 'role', 'CUSTOMER')
  )
  on conflict (id) do update
    set email = excluded.email,
        full_name = excluded.full_name;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at before update on public.orders
for each row execute function public.set_updated_at();

drop trigger if exists set_payments_updated_at on public.payments;
create trigger set_payments_updated_at before update on public.payments
for each row execute function public.set_updated_at();

drop trigger if exists set_addresses_updated_at on public.addresses;
create trigger set_addresses_updated_at before update on public.addresses
for each row execute function public.set_updated_at();

-- Missing policies
create policy "profiles_insert_self"
on public.profiles for insert
with check (auth.uid() = id or public.is_admin(auth.uid()));

alter table public.addresses enable row level security;
create policy "addresses_owner_or_admin_read"
on public.addresses for select
using (user_id = auth.uid() or public.is_admin(auth.uid()));
create policy "addresses_owner_write"
on public.addresses for all
using (user_id = auth.uid() or public.is_admin(auth.uid()))
with check (user_id = auth.uid() or public.is_admin(auth.uid()));

alter table public.payments enable row level security;
create policy "payments_owner_or_admin_read"
on public.payments for select
using (
  public.is_admin(auth.uid())
  or exists (
    select 1 from public.orders o
    where o.id = order_id and o.user_id = auth.uid()
  )
);
create policy "payments_admin_write"
on public.payments for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "order_items_admin_update"
on public.order_items for update
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

create policy "order_items_admin_delete"
on public.order_items for delete
using (public.is_admin(auth.uid()));

alter table public.webhook_events enable row level security;
create policy "webhook_events_admin_only"
on public.webhook_events for all
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));
