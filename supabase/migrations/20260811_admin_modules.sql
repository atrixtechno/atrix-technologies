-- Admin vault: projects, invoices, business card layout
-- Reads/writes only via service role (API routes). No anon policies.

-- ---------------------------------------------------------------------------
-- admin_projects — vault de credenciales y metadatos por proyecto
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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists admin_projects_slug_idx
  on public.admin_projects (slug);

create index if not exists admin_projects_renews_at_idx
  on public.admin_projects (domain_renews_at);

alter table public.admin_projects enable row level security;
-- Sin policies para anon: solo service role.

-- ---------------------------------------------------------------------------
-- admin_invoices — borradores de comprobantes / facturas de servicio
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- site_settings — layout de tarjeta y URLs públicas de assets
-- ---------------------------------------------------------------------------
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

-- Bucket sugerido (crear en Dashboard → Storage si se usan uploads):
-- name: project-assets
-- public: true (solo logos/assets de proyecto; secretos van cifrados en DB)
--
-- Contratos PDF (migración 20260812_admin_project_contract.sql):
-- name: project-contracts
-- public: false — descarga vía URL firmada en /api/admin/projects/[id]/contract
