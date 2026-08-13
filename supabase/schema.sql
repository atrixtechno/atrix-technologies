-- Contacto / leads del sitio ATRIX Technologies
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  business text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.leads enable row level security;

-- Cualquiera puede enviar un lead desde el sitio (anon)
create policy "Permitir insertar leads desde el sitio"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

-- Lectura solo con service role (desde dashboard / backend)
-- No hay policy de SELECT para anon a propósito.

-- ---------------------------------------------------------------------------
-- First-party analytics (page views)
-- ---------------------------------------------------------------------------
create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  path text not null,
  hash text,
  referrer text,
  user_agent text,
  country text,
  region text,
  city text,
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_at_idx
  on public.page_views (created_at desc);

create index if not exists page_views_path_idx
  on public.page_views (path);

create index if not exists page_views_country_idx
  on public.page_views (country);

create index if not exists page_views_city_idx
  on public.page_views (city);

alter table public.page_views enable row level security;

drop policy if exists "Permitir insertar page views desde el sitio" on public.page_views;
create policy "Permitir insertar page views desde el sitio"
  on public.page_views
  for insert
  to anon, authenticated
  with check (true);

-- Lectura solo con service role (API /api/analytics/stats).

-- ---------------------------------------------------------------------------
-- Admin modules: projects vault, invoices, business card layout
-- ---------------------------------------------------------------------------
create table if not exists public.admin_projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  short_description text,
  public_url text,
  logo_url text,
  email_address text,
  email_password_enc text,
  domain_platform text,
  domain_email text,
  domain_password_enc text,
  db_platform text,
  db_email text,
  db_password_enc text,
  deploy_platform text,
  deploy_email text,
  deploy_password_enc text,
  domain_registered_at date,
  domain_renews_at date,
  contract_url text,
  contract_filename text,
  contract_uploaded_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_projects_slug_idx
  on public.admin_projects (slug);

create index if not exists admin_projects_renews_at_idx
  on public.admin_projects (domain_renews_at);

alter table public.admin_projects enable row level security;

create table if not exists public.admin_invoices (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  project_name text not null,
  start_date date,
  end_date date,
  engineers jsonb not null default '[]'::jsonb,
  payment_method text,
  terms text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_invoices_created_at_idx
  on public.admin_invoices (created_at desc);

alter table public.admin_invoices enable row level security;

create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;
