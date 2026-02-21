-- AfriGlam canonical seed data. Run after migrations.
-- Products only (profiles/orders/carts depend on auth.users).

insert into public.products (name, description, category, sku, image, price_ngn, price_pln, status, is_published)
values
  ('Lagos Luxe Braids', 'Premium braid bundle for elegant styling.', 'Braids', 'AFG-001', null, 30000, 150, 'In Stock', true),
  ('Royal Silk Press Wig', 'Silk-finish wig for everyday luxury wear.', 'Wigs', 'AFG-002', null, 45000, 450, 'In Stock', true),
  ('Afro Kinky Bulk', 'Natural texture bulk extension pack.', 'Extensions', 'AFG-003', null, 24000, 120, 'In Stock', true)
on conflict (sku) do update set
  name = excluded.name,
  description = excluded.description,
  category = excluded.category,
  image = excluded.image,
  price_ngn = excluded.price_ngn,
  price_pln = excluded.price_pln,
  status = excluded.status,
  is_published = excluded.is_published,
  updated_at = now();

-- Remove any leftover rows that look like demo data (e.g. old example.com images)
update public.products set image = null where image is not null and (image like '%example.com%' or image = '');