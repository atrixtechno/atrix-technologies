// Estilos de la imagen de marca (Admin → Marketing). Separados de las plantillas para que el
// navegador también los use ("Rediseñar" en el compositor). Los colores viven en card.tsx y salen
// de DESIGN.md: azul ATRIX #1a63e6, escenario #070a10, negro #050506.

export type DesignStyle = "azul" | "cobalto" | "claro" | "noche";

export const MARKETING_STYLES: { id: DesignStyle; label: string }[] = [
  { id: "azul", label: "Escenario azul" },
  { id: "cobalto", label: "Cobalto" },
  { id: "claro", label: "Claro" },
  { id: "noche", label: "Noche" },
];

export function isDesignStyle(value: unknown): value is DesignStyle {
  return MARKETING_STYLES.some((row) => row.id === value);
}

/** "Rediseñar": el siguiente estilo de la rotación. */
export function nextStyle(current?: string | null): DesignStyle {
  const index = MARKETING_STYLES.findIndex((row) => row.id === current);
  return MARKETING_STYLES[(index + 1) % MARKETING_STYLES.length].id;
}
