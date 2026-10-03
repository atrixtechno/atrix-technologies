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
- `site_settings` — ajustes de sitio (clave/valor)
- `admin_credentials` / `admin_login_attempts` — login admin con rate-limit

Variables de servidor (`.env.local` / Vercel; nunca públicas):

- `SUPABASE_SERVICE_ROLE_KEY` — lecturas/escrituras admin
- `PROJECT_SECRETS_KEY` — cifrado AES-GCM del vault (opcional; si falta se deriva del service role)
- `ADMIN_SESSION_SECRET` — firma HMAC de la cookie de sesión admin (8h; opcional si hay PROJECT_SECRETS_KEY)

Panel: `/admin` · Proyectos `/admin/proyectos` · Facturas `/admin/facturas`.

### Login admin

- Usuario: escribe solo `admin` (la UI muestra el sufijo `@atrix.com`).
- Contraseñas guardadas con **scrypt + sal**; los hashes SHA-256 antiguos se migran solos al iniciar sesión.
- La sesión es una cookie httpOnly firmada (8 h) que se invalida al cambiar la contraseña.
- Bloqueo de 15 min tras 5 intentos fallidos por IP, o 20 en total para el usuario.
- En producción es obligatorio un secreto de sesión (`ADMIN_SESSION_SECRET`, o en su defecto `PROJECT_SECRETS_KEY` / `SUPABASE_SERVICE_ROLE_KEY`) y un almacén de credenciales (Supabase o `ADMIN_PASSWORD_HASH`).

Restablecer el acceso (service role, desde la raíz del repo):

```bash
node --env-file=.env.local scripts/reset-admin-password.mjs
```

Genera una contraseña temporal aleatoria (se imprime una sola vez), pone `password_changed=false` y limpia los bloqueos. El panel obliga a cambiarla en el primer login (mínimo 10 caracteres).

Bucket Storage recomendado (público): `project-assets` para logos de proyecto.

## Contacto del sitio

WhatsApp: +52 867 729 0445
