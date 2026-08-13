-- Ubicación aproximada de visitas (Vercel geo headers). Sin IP.
alter table public.page_views
  add column if not exists country text,
  add column if not exists region text,
  add column if not exists city text;

create index if not exists page_views_country_idx
  on public.page_views (country);

create index if not exists page_views_city_idx
  on public.page_views (city);
