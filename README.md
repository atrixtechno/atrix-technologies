# ATRIX Technologies

Sitio web de **ATRIX Technologies** — Nuevo Laredo, Tamaulipas.  
Dominio: [atrixnld.com](https://atrixnld.com)

## Desarrollo

```bash
cp .env.example .env.local
# Completa URL y anon key de Supabase
npm install
npm run dev
```

## Supabase

En el SQL Editor del proyecto, ejecuta [`supabase/schema.sql`](supabase/schema.sql) (o las migraciones en `supabase/migrations/`) para crear:

- `leads` — formulario de contacto
- `page_views` — analítica first-party del Dashboard admin
- `admin_projects` — vault de proyectos (credenciales cifradas)
- `admin_invoices` — borradores de comprobantes
- `site_settings` — layout de tarjeta de presentación
- `admin_credentials` / `admin_login_attempts` — login admin con rate-limit

Variables de servidor (`.env.local` / Vercel; nunca públicas):

- `SUPABASE_SERVICE_ROLE_KEY` — lecturas/escrituras admin
- `PROJECT_SECRETS_KEY` — cifrado AES-GCM del vault (opcional; si falta se deriva del service role)
- `ADMIN_SESSION_SECRET` — firma HMAC de la cookie de sesión admin (8h; opcional si hay PROJECT_SECRETS_KEY)

Panel: `/admin` · Proyectos `/admin/proyectos` · Facturas `/admin/facturas` · Tarjeta `/admin/tarjeta`.

Bucket Storage recomendado (público): `project-assets` para logos de proyecto.

## Contacto del sitio

WhatsApp: +52 867 179 3155
