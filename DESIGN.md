# ATRIX · Sistema de diseño "Pro cinematográfico"

Página de producto "Pro": negro profundo, luz de estudio azul, titulares enormes y el 3D como
protagonista. El impacto viene de escenas guiadas por el scroll y de una escena WebGL real,
no de decoración.

## Mundo

- **Tema por defecto oscuro** (`--bg #050506`, paneles `#101217`, tinta `#f2f4f8`); el modo
  claro sigue disponible con el selector, con los mismos roles.
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
- **Plataformas 3D** (`Showcase3D.tsx` + `DeviceScene3D.tsx`): sección fijada de 340vh con escena
  WebGL (Three.js / React Three Fiber). Laptop con tapa articulada, teclado generado en canvas,
  logo iluminado en la tapa y pantallas con capturas reales; dos celulares que entran orbitando.
  El scroll abre la laptop, la gira y cambia el sitio en pantalla; el mouse inclina la escena.
  Carga diferida (se monta al acercarse), `frameloop` en pausa fuera de vista, `dpr` reducido en
  móvil o equipos de pocos núcleos, cámara que se ajusta a pantallas verticales y respaldo con
  render estático si no hay WebGL.
- **Portafolio:** galería de tarjetas con los casos.
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
