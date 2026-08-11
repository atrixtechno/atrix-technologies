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

En el SQL Editor del proyecto, ejecuta [`supabase/schema.sql`](supabase/schema.sql) (o la migración en `supabase/migrations/`) para crear:

- `leads` — formulario de contacto
- `page_views` — analítica first-party del Dashboard admin

Para leer estadísticas en `/admin`, añade también `SUPABASE_SERVICE_ROLE_KEY` en `.env.local` y en Vercel (solo servidor; no es pública).

## Contacto del sitio

WhatsApp: +52 867 179 3155
