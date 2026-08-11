-- Admin auth: credentials + login rate-limit / lockout
-- Reads/writes only via service role (API routes). No anon policies.

-- ---------------------------------------------------------------------------
-- admin_credentials — single-row password store (id = 1)
-- ---------------------------------------------------------------------------
create table if not exists public.admin_credentials (
  id int primary key check (id = 1),
  password_hash text not null,
  password_changed boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table public.admin_credentials enable row level security;
-- Sin policies para anon: solo service role.

-- Seed default SHA-256 of "12345678" until first password change.
insert into public.admin_credentials (id, password_hash, password_changed)
values (
  1,
  'ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f',
  false
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- admin_login_attempts — per-IP (and optional username) lockout state
-- ---------------------------------------------------------------------------
create table if not exists public.admin_login_attempts (
  id uuid primary key default gen_random_uuid(),
  ip text not null,
  username text not null default '',
  fail_count int not null default 0,
  locked_until timestamptz,
  updated_at timestamptz not null default now(),
  unique (ip, username)
);

create index if not exists admin_login_attempts_locked_until_idx
  on public.admin_login_attempts (locked_until);

alter table public.admin_login_attempts enable row level security;
