create table if not exists public.shop_profiles (
  slug text primary key,
  shop_name text not null,
  logo_data text,
  updated_at timestamptz not null default now()
);

alter table public.shop_profiles disable row level security;

grant select, insert, update on public.shop_profiles to anon, authenticated, service_role;
