-- =====================================================================
-- Anaya Abaya Store — Supabase schema
-- Run this whole file once in: Supabase Dashboard → SQL Editor → New query
-- Safe to re-run (uses IF NOT EXISTS / OR REPLACE / DROP POLICY IF EXISTS).
-- =====================================================================

-- ---------- Tables ----------------------------------------------------

create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text not null default '',
  image_url   text,
  sort_order  int  not null default 0,
  created_at  timestamptz not null default now()
);

create table if not exists public.products (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique,
  name             text not null,
  tagline          text not null default '',
  description      text not null default '',
  price            numeric(10,2) not null check (price >= 0),
  compare_at_price numeric(10,2) check (compare_at_price is null or compare_at_price >= 0),
  category_id      uuid references public.categories(id) on delete set null,
  images           text[] not null default '{}',
  sizes            text[] not null default '{}',
  colors           jsonb  not null default '[]',   -- [{"name":"Black","hex":"#111111"}]
  material         text not null default '',
  care             text not null default '',
  stock            int  not null default 0 check (stock >= 0),
  is_active        boolean not null default true,
  is_featured      boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index if not exists products_category_idx on public.products(category_id);
create index if not exists products_active_idx   on public.products(is_active, created_at desc);

create sequence if not exists public.order_number_seq start 1001;

create table if not exists public.orders (
  id             uuid primary key default gen_random_uuid(),
  order_number   text not null unique
                 default ('AN-' || nextval('public.order_number_seq')::text),
  status         text not null default 'pending'
                 check (status in ('pending','confirmed','processing','shipped','delivered','cancelled')),
  customer_name  text not null,
  phone          text not null,
  email          text,
  address        text not null,
  city           text not null,
  notes          text,
  payment_method text not null default 'cod',
  subtotal       numeric(10,2) not null,
  shipping       numeric(10,2) not null default 0,
  total          numeric(10,2) not null,
  admin_notes    text,
  public_token   uuid not null default gen_random_uuid(),  -- lets the buyer open their confirmation page
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists orders_created_idx on public.orders(created_at desc);
create index if not exists orders_status_idx  on public.orders(status);

create table if not exists public.order_items (
  id         uuid primary key default gen_random_uuid(),
  order_id   uuid not null references public.orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  name       text not null,
  price      numeric(10,2) not null,
  quantity   int not null check (quantity > 0),
  size       text,
  color      text,
  image      text
);
create index if not exists order_items_order_idx on public.order_items(order_id);

-- Simple key/value store for editable store settings (WhatsApp number, shipping, banner…)
create table if not exists public.site_settings (
  key   text primary key,
  value text not null default ''
);

-- ---------- Helper: is the current user an admin? ---------------------

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

-- keep updated_at fresh
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

drop trigger if exists products_touch on public.products;
create trigger products_touch before update on public.products
  for each row execute function public.touch_updated_at();
drop trigger if exists orders_touch on public.orders;
create trigger orders_touch before update on public.orders
  for each row execute function public.touch_updated_at();


-- ---------- Atomic order placement ------------------------------------
-- Called ONLY by the Next.js server (service-role key). It re-prices every
-- line from the products table, checks stock under a row lock, decrements
-- stock and writes the order — so a tampered cart can never change a price.

create or replace function public.place_order(p_customer jsonb, p_items jsonb)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare
  it         jsonb;
  prod       public.products%rowtype;
  qty        int;
  v_size     text;
  v_subtotal numeric(10,2) := 0;
  v_fee      numeric(10,2) := coalesce((select value from public.site_settings where key = 'shipping_fee')::numeric, 0);
  v_free     numeric(10,2) := coalesce((select value from public.site_settings where key = 'free_shipping_over')::numeric, 0);
  v_ship     numeric(10,2);
  v_order    public.orders%rowtype;
begin
  if jsonb_array_length(p_items) = 0 then raise exception 'EMPTY_CART'; end if;

  -- pass 1: validate + total (rows locked until commit)
  for it in select * from jsonb_array_elements(p_items) loop
    qty := (it->>'quantity')::int;
    if qty is null or qty < 1 or qty > 10 then raise exception 'BAD_QUANTITY'; end if;
    select * into prod from public.products where id = (it->>'product_id')::uuid for update;
    if not found or not prod.is_active then raise exception 'UNAVAILABLE:%', coalesce(it->>'name','item'); end if;
    v_size := nullif(it->>'size','');
    if array_length(prod.sizes,1) > 0 and (v_size is null or not v_size = any(prod.sizes)) then
      raise exception 'BAD_SIZE:%', prod.name;
    end if;
    if prod.stock < qty then raise exception 'OUT_OF_STOCK:%', prod.name; end if;
    v_subtotal := v_subtotal + prod.price * qty;
  end loop;

  v_ship := case when v_subtotal >= v_free then 0 else v_fee end;

  insert into public.orders (customer_name, phone, email, address, city, notes, payment_method, subtotal, shipping, total)
  values (p_customer->>'name', p_customer->>'phone', nullif(p_customer->>'email',''),
          p_customer->>'address', p_customer->>'city', nullif(p_customer->>'notes',''),
          coalesce(p_customer->>'payment_method','cod'), v_subtotal, v_ship, v_subtotal + v_ship)
  returning * into v_order;

  -- pass 2: write lines + decrement stock
  for it in select * from jsonb_array_elements(p_items) loop
    select * into prod from public.products where id = (it->>'product_id')::uuid;
    qty := (it->>'quantity')::int;
    insert into public.order_items (order_id, product_id, name, price, quantity, size, color, image)
    values (v_order.id, prod.id, prod.name, prod.price, qty, nullif(it->>'size',''), nullif(it->>'color',''), prod.images[1]);
    update public.products set stock = stock - qty where id = prod.id;
  end loop;

  return jsonb_build_object('order_number', v_order.order_number, 'public_token', v_order.public_token, 'total', v_order.total);
end $$;

revoke all on function public.place_order(jsonb, jsonb) from public, anon, authenticated;
grant execute on function public.place_order(jsonb, jsonb) to service_role;

-- ---------- Row Level Security ---------------------------------------
-- Customers never touch orders directly: the Next.js server creates orders
-- with the service-role key (after re-pricing the cart server-side).

alter table public.admins        enable row level security;
alter table public.categories    enable row level security;
alter table public.products      enable row level security;
alter table public.orders        enable row level security;
alter table public.order_items   enable row level security;
alter table public.site_settings enable row level security;

-- admins: a user may see only their own row (used to check admin status)
drop policy if exists "admins read self" on public.admins;
create policy "admins read self" on public.admins for select using (user_id = auth.uid());

-- categories: public read, admin write
drop policy if exists "categories public read" on public.categories;
create policy "categories public read" on public.categories for select using (true);
drop policy if exists "categories admin write" on public.categories;
create policy "categories admin write" on public.categories for all
  using (public.is_admin()) with check (public.is_admin());

-- products: public sees active only, admin sees/writes all
drop policy if exists "products public read" on public.products;
create policy "products public read" on public.products for select
  using (is_active or public.is_admin());
drop policy if exists "products admin write" on public.products;
create policy "products admin write" on public.products for all
  using (public.is_admin()) with check (public.is_admin());

-- orders + items: admin only
drop policy if exists "orders admin all" on public.orders;
create policy "orders admin all" on public.orders for all
  using (public.is_admin()) with check (public.is_admin());
drop policy if exists "order_items admin all" on public.order_items;
create policy "order_items admin all" on public.order_items for all
  using (public.is_admin()) with check (public.is_admin());

-- settings: public read, admin write
drop policy if exists "settings public read" on public.site_settings;
create policy "settings public read" on public.site_settings for select using (true);
drop policy if exists "settings admin write" on public.site_settings;
create policy "settings admin write" on public.site_settings for all
  using (public.is_admin()) with check (public.is_admin());

-- ---------- Storage bucket for product images -------------------------

insert into storage.buckets (id, name, public)
values ('products', 'products', true)
on conflict (id) do update set public = true;

drop policy if exists "product images public read" on storage.objects;
create policy "product images public read" on storage.objects for select
  using (bucket_id = 'products');
drop policy if exists "product images admin insert" on storage.objects;
create policy "product images admin insert" on storage.objects for insert
  with check (bucket_id = 'products' and public.is_admin());
drop policy if exists "product images admin update" on storage.objects;
create policy "product images admin update" on storage.objects for update
  using (bucket_id = 'products' and public.is_admin());
drop policy if exists "product images admin delete" on storage.objects;
create policy "product images admin delete" on storage.objects for delete
  using (bucket_id = 'products' and public.is_admin());

-- ---------- Default settings -----------------------------------------

insert into public.site_settings (key, value) values
  ('store_name',            'Anaya Abayas'),
  ('whatsapp_number',       '923000000000'),
  ('shipping_fee',          '250'),
  ('free_shipping_over',    '15000'),
  ('announcement',          'Complimentary shipping on orders over PKR 15,000 · Cash on delivery available'),
  ('contact_email',         'hello@anaya.store'),
  ('instagram',             'anaya.abayas')
on conflict (key) do nothing;

-- ---------- Starter catalogue (optional — delete if you prefer to start empty)

insert into public.categories (name, slug, description, sort_order) values
  ('Everyday',   'everyday',   'Effortless daily abayas in breathable crepe and nida.', 1),
  ('Occasion',   'occasion',   'Statement pieces for Eid, weddings and evenings.',      2),
  ('Embroidered','embroidered','Hand-finished detailing, thread by thread.',            3),
  ('Open Front', 'open-front', 'Layered, flowing kimono-style silhouettes.',            4)
on conflict (slug) do nothing;

-- After running this file:
--   1) Create your admin user in Authentication → Users (email + password)
--   2) Run:  insert into public.admins (user_id)
--            select id from auth.users where email = 'YOUR-ADMIN-EMAIL';
