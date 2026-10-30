create table if not exists public.shop_activity (
  id bigint generated always as identity primary key,
  shop_name text not null,
  slug text not null,
  ip_address text not null,
  order_token text not null unique,
  kind text not null default 'free',
  created_at timestamptz not null default now()
);

create index if not exists shop_activity_ip_idx on public.shop_activity (ip_address);

alter table public.shop_activity disable row level security;

grant select, insert on public.shop_activity to anon, authenticated, service_role;
grant usage, select on sequence public.shop_activity_id_seq to anon, authenticated, service_role;
