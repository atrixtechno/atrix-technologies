-- Admin projects: PDF contract per project + private storage bucket
-- Run in Supabase SQL Editor if migrations are not auto-applied.
-- API uses SUPABASE_SERVICE_ROLE_KEY (bypasses Storage RLS).

-- ---------------------------------------------------------------------------
-- Columns on admin_projects
-- ---------------------------------------------------------------------------
alter table public.admin_projects
  add column if not exists contract_url text,
  add column if not exists contract_filename text,
  add column if not exists contract_uploaded_at timestamptz;

comment on column public.admin_projects.contract_url is
  'Storage object path in bucket project-contracts (e.g. contracts/{id}/file.pdf). Not a public URL.';

-- ---------------------------------------------------------------------------
-- Private bucket for contracts (prefer signed URLs via admin API)
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-contracts',
  'project-contracts',
  false,
  10485760, -- 10 MB
  array['application/pdf']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- No anon/authenticated policies: only service role uploads/downloads via API.
-- If the insert into storage.buckets fails (permissions), create manually:
--   Dashboard → Storage → New bucket → name: project-contracts → Private
--   Optional: file size limit 10MB, allowed MIME application/pdf
