-- Marketing en redes + Campañas pagadas (Meta).
-- RLS activado y SIN políticas públicas: todo se lee y escribe con la service role
-- desde el servidor (panel admin, cron y rutas públicas de imagen).

-- ---------------------------------------------------------------------------
-- social_posts — publicaciones propias en Instagram / Facebook
-- ---------------------------------------------------------------------------
create table if not exists public.social_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  created_by text not null,
  source text not null default 'manual',          -- 'plan' | 'manual'
  theme text not null,                             -- tema o 'propia'
  headline text not null default '',
  subline text not null default '',
  chips jsonb not null default '[]'::jsonb,
  image_key text,                                  -- foto propia en Storage (bucket marketing-uploads)
  style text not null default 'azul',
  frame boolean not null default false,
  design_version int not null default 0,
  caption text not null default '',
  destinations jsonb not null default '["ig_feed","fb"]'::jsonb,
  scheduled_at timestamptz not null,
  status text not null default 'borrador',         -- borrador | aprobada | publicando | publicada | error
  approved_by text,
  approved_at timestamptz,
  published_at timestamptz,
  results jsonb not null default '[]'::jsonb       -- [{destination, at, ok, id, error}] (id FB = "<page>_<post>")
);

create index if not exists social_posts_status_scheduled_idx
  on public.social_posts (status, scheduled_at);

-- ---------------------------------------------------------------------------
-- ad_campaigns — anuncios de Meta creados en pausa desde el panel
-- ---------------------------------------------------------------------------
create table if not exists public.ad_campaigns (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  created_by text not null,
  goal text not null default 'clics',
  audience text not null,                          -- servicio (cctv, soporte, redes, software, empresas)
  location text not null,
  headline text not null,
  subline text not null default '',
  message text not null default '',
  style text not null default 'azul',
  design_version int not null default 0,
  post_id text,                                    -- objetivo "promocionar publicación"
  post_title text,
  post_image text,
  budget_mxn int not null,
  days int not null,
  status text not null default 'borrador',         -- borrador | pausada | activa | terminada | error
  meta jsonb,                                      -- {campaignId, adSetId, creativeId, adId, imageHash}
  error text,
  activated_at timestamptz,
  activated_by text,
  start_at timestamptz,
  end_at timestamptz,
  stats jsonb,                                     -- {spend, reach, impressions, clicks, actions, updatedAt}
  followers jsonb                                  -- {fbStart, igStart, fb, ig, at}
);

create index if not exists ad_campaigns_created_at_idx
  on public.ad_campaigns (created_at desc);

-- ---------------------------------------------------------------------------
-- ad_funds — recargas que el dueño anotó (la API de Meta no las informa)
-- ---------------------------------------------------------------------------
create table if not exists public.ad_funds (
  id uuid primary key default gen_random_uuid(),
  at timestamptz not null default now(),
  amount_mxn numeric not null,
  by text not null
);

alter table public.social_posts enable row level security;
alter table public.ad_campaigns enable row level security;
alter table public.ad_funds enable row level security;
-- Sin policies: solo service role.

-- ---------------------------------------------------------------------------
-- Atribución: de qué anuncio llegó cada cotización y cada visita.
-- ---------------------------------------------------------------------------
alter table public.leads
  add column if not exists ad_campaign_id uuid references public.ad_campaigns(id) on delete set null;
alter table public.leads add column if not exists service text;

alter table public.page_views add column if not exists session_id text;
alter table public.page_views add column if not exists source text;     -- anuncios | facebook | instagram | google | whatsapp | directo | otro
alter table public.page_views add column if not exists campaign uuid;   -- utm_campaign

-- Clics a WhatsApp (embudo de campañas). Solo se guardan con permiso de cookies, vía service role.
create table if not exists public.whatsapp_clicks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  path text,
  session_id text,
  campaign uuid
);
alter table public.whatsapp_clicks enable row level security;
create index if not exists whatsapp_clicks_campaign_idx on public.whatsapp_clicks (campaign);

create index if not exists page_views_campaign_idx on public.page_views (campaign);
create index if not exists leads_ad_campaign_idx on public.leads (ad_campaign_id);

-- Ajustes: site_settings key = 'social' (plan semanal, hora, destinos, aprobación, franja de WhatsApp)
-- y key = 'ads' (claves de ciudades de Meta). Se crean solas al guardar desde el panel.

-- Storage: bucket privado "marketing-uploads" para las fotos propias de las publicaciones.
-- El servidor lo crea solo la primera vez (service role). Si prefieres crearlo a mano:
-- Dashboard → Storage → New bucket → name: marketing-uploads, public: false.
