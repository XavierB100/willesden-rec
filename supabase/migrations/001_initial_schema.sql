create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  legacy_id text,
  title text not null,
  slug text not null unique,
  category text not null check (category in ('Fireplaces', 'Doors', 'Lighting', 'Garden', 'Furniture')),
  description text not null default '',
  price numeric(10, 2),
  dimensions text,
  status text not null default 'available' check (status in ('available', 'sold')),
  image_urls text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id boolean primary key default true check (id),
  business_name text not null default 'Willesden Reclamation',
  phone text not null default '07907 020 909',
  whatsapp_number text not null default '447907020909',
  email text not null default 'info@willesdenreclamation.co.uk',
  address_lines text[] not null default array['71 High Road', 'London', 'NW10 2SU'],
  map_embed_url text not null default 'https://www.google.com/maps?q=71%20High%20Road%2C%20London%20NW10%202SU&output=embed',
  opening_hours jsonb not null default '[{"label":"Monday - Friday","value":"8:00 AM - 5:00 PM"},{"label":"Saturday","value":"10:00 AM - 4:00 PM"},{"label":"Sunday","value":"Closed"}]'::jsonb,
  updated_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_touch_updated_at on public.products;
create trigger products_touch_updated_at
before update on public.products
for each row execute function public.touch_updated_at();

drop trigger if exists site_settings_touch_updated_at on public.site_settings;
create trigger site_settings_touch_updated_at
before update on public.site_settings
for each row execute function public.touch_updated_at();

alter table public.products enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Public products are readable" on public.products;
create policy "Public products are readable"
on public.products for select
to anon, authenticated
using (true);

drop policy if exists "Public settings are readable" on public.site_settings;
create policy "Public settings are readable"
on public.site_settings for select
to anon, authenticated
using (true);

insert into public.site_settings (id)
values (true)
on conflict (id) do nothing;

insert into public.products
  (legacy_id, title, slug, category, description, price, dimensions, status, image_urls)
values
  ('1', 'Victorian Cast Iron Combination Fireplace', 'victorian-cast-iron-combination-fireplace', 'Fireplaces', 'A stunning original Victorian cast iron combination fireplace with intricate fruit and floral detailing. Fully restored and burnished.', 850, 'H: 102cm x W: 76cm', 'available', '{}'),
  ('2', 'Reclaimed Victorian 4-Panel Pine Door', 'reclaimed-victorian-4-panel-pine-door', 'Doors', 'Original 19th-century stripped pine door. Classic 4-panel design, ready for waxing or painting.', 180, 'H: 198cm x W: 76cm', 'available', '{}'),
  ('3', 'Edwardian Tiled Insert', 'edwardian-tiled-insert', 'Fireplaces', 'Beautiful original Edwardian tiled insert with original tube-lined tiles in art nouveau style.', 1200, 'H: 96cm x W: 96cm', 'available', '{}'),
  ('4', 'Stone Garden Trough', 'stone-garden-trough', 'Garden', 'Hand-carved sandstone trough, perfect for a garden planter. Weathered beautifully over time.', 450, 'L: 120cm x D: 40cm', 'available', '{}'),
  ('5', 'Ornate Cast Iron Radiator', 'ornate-cast-iron-radiator', 'Furniture', 'Original distinct ornate cast iron radiator. Pressure tested and ready to plumb in.', 550, 'W: 80cm x H: 75cm', 'sold', '{}'),
  ('6', 'Stained Glass Panel', 'stained-glass-panel', 'Doors', 'Geometric Art Deco stained glass panel reclaimed from details of a 1930s front door.', 295, 'H: 60cm x W: 40cm', 'available', '{}'),
  ('7', 'Georgian Brass Fender', 'georgian-brass-fender', 'Fireplaces', 'A heavy polished brass fender from the Georgian period. Pierced fretwork design with lion paw feet.', 325, 'W: 135cm', 'available', '{}'),
  ('8', 'Reclaimed Oak Beams', 'reclaimed-oak-beams', 'Garden', 'Solid oak structural beams reclaimed from a French barn. Full of character and age.', 120, 'L: 2.2m x W: 20cm', 'available', '{}')
on conflict (slug) do nothing;

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do update set public = true;

drop policy if exists "Product images are public" on storage.objects;
create policy "Product images are public"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'product-images');
