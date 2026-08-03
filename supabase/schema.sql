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
