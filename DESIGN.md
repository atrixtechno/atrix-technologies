# ATRIX · Sistema de diseño "Producto premium"

Página de producto de ingeniería: fondo luminoso con mucho aire, titulares enormes y los
renders 3D de los equipos como protagonistas sobre **escenarios** oscuros. El impacto viene de
escenas guiadas por el scroll, no de decoración.

## Mundo

- **Tema por defecto claro** (`--bg #f5f6f8`, tarjetas `#ffffff`, tinta `#0b0d12`); existe modo
  oscuro con los mismos roles.
- **Escenario** (`.stage`, `--stage #070a10`): el mismo azul marino del fondo de los renders, para
  que los equipos floten sin bordes. `.stage-light` añade luz de estudio (cobalto + ámbar suave).
  `.render-feather` funde el borde del render con una máscara radial.
- **Color:** `--accent #1a63e6` (azul ATRIX) para acción y énfasis; verde WhatsApp solo en
  contacto; `--ok` para estados "en línea".
- **Prohibido:** texto con degradado, etiquetas sobre los títulos, emoji como iconos, glows sin
  desplazamiento, monoespaciada como disfraz.

## Tipografía

Geist en todo (titulares 700 con tracking −0.045 a −0.055 em) y Geist Mono solo para datos.
Clases: `.hero-title`, `.section-title`, `.page-hero-title`, `.display`, `.section-lead`.

## Componentes

- **Hero:** titular centrado + escenario que se acerca con el scroll (`.zoom-stage`,
  `.zoom-product`, `--sp` desde `useScrollProgress("enter")`).
- **Película de servicios** (`Services.tsx`): sección alta con escenario fijado; cada servicio
  entra/sale según el avance (`.film-layer`, `.film-render`, variables `--o`/`--s`), con índice
  clicable. En móvil y tablet: escenarios apilados sin fijar.
- **Bento** (`Bento.tsx`): mosaico de tarjetas de distinto tamaño (`.tile`, `.tile-media`) con
  IT empresarial, WhatsApp, hogar, empresa, por qué ATRIX y cobertura (mapa con nodos animados).
- **Portafolio:** escaparate 3D dentro de un escenario + galería de tarjetas.
- **Botones:** píldora (`.btn` + `.btn-primary | .btn-outline | .btn-ghost-light | .btn-whatsapp`),
  `:active` escala 0.97.
- **`useScrollProgress(mode, onProgress)`:** un listener pasivo + rAF, pausado fuera de vista.

## Movimiento

- Una gramática: el producto se acerca (hero), las escenas se suceden (servicios), las tarjetas
  revelan con un desplazamiento corto y las fotos hacen zoom suave al pasar el cursor.
- Curvas: `--ease-out cubic-bezier(0.23, 1, 0.32, 1)`; hover solo con puntero fino.
- `prefers-reduced-motion`: sin desplazamientos; la película sigue cambiando de escena por
  opacidad y el contenido nunca queda oculto.

## Imágenes

- Renders 3D con IA (Canva) en `public/images/renders/*.webp` (1456×1088). Diseño fuente en
  Canva: "ATRIX · renders web".
- Fotos reales en IT empresarial, hogar, empresa, cobertura y contacto (pendientes de render
  cuando haya créditos de IA).
