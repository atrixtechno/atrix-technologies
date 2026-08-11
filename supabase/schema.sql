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
  created_at timestamptz not null default now()
);

create index if not exists page_views_created_at_idx
  on public.page_views (created_at desc);

create index if not exists page_views_path_idx
  on public.page_views (path);

alter table public.page_views enable row level security;

drop policy if exists "Permitir insertar page views desde el sitio" on public.page_views;
create policy "Permitir insertar page views desde el sitio"
  on public.page_views
  for insert
  to anon, authenticated
  with check (true);

-- Lectura solo con service role (API /api/analytics/stats).
