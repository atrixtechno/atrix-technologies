"use client";

import {
  useCallback,
  useEffect,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { adminFetch } from "@/lib/admin-session";
import {
  CARD_ASSET,
  CARD_EXPORT_DPI,
  CARD_EXPORT_DPI_HD,
  CARD_FONT_OPTIONS,
  CARD_PHYSICAL_CM,
  cardPixelSize,
  isElementVisible,
  normalizeCardLayout,
  type BusinessCardLayout,
  type CardElement,
  type CardFaceLayout,
  type CardTextElement,
} from "@/lib/card-layout";

const LOCAL_KEY = "atrix_business_card_layout_v2";

type FaceKey = "front" | "back";

export function AdminCardPanel() {
  const [layout, setLayout] = useState<BusinessCardLayout | null>(null);
  const [face, setFace] = useState<FaceKey>("front");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [setupNote, setSetupNote] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [viewScale, setViewScale] = useState(0.78);
  const [showCovers, setShowCovers] = useState(true);

  const load = useCallback(async () => {
    try {
      const local = window.localStorage.getItem(LOCAL_KEY);
      const res = await adminFetch("/api/admin/card-layout", {
        credentials: "same-origin",
      });
      const data = await res.json();
      setSetupNote(data.setupNote ?? null);
      if (data.configured && data.layout) {
        setLayout(normalizeCardLayout(data.layout));
      } else if (local) {
        setLayout(normalizeCardLayout(JSON.parse(local) as BusinessCardLayout));
      } else {
        setLayout(normalizeCardLayout(data.layout));
      }
    } catch {
      setError("No se pudo cargar el layout de la tarjeta.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const current = layout?.[face];
  const selected =
    (current?.elements.find((e) => e.id === selectedId) as
      | CardTextElement
      | undefined) ?? null;

  function updateFace(mutator: (face: CardFaceLayout) => CardFaceLayout) {
    setLayout((prev) => {
      if (!prev) return prev;
      return { ...prev, [face]: mutator(prev[face]) };
    });
  }

  function updateElement(id: string, patch: Partial<CardTextElement>) {
    updateFace((f) => ({
      ...f,
      elements: f.elements.map((el) =>
        el.id === id ? { ...el, ...patch } : el,
      ),
    }));
  }

  function resetFaceOverlays() {
    setLayout((prev) => {
      if (!prev) return prev;
      const fresh = normalizeCardLayout(null);
      return { ...prev, [face]: fresh[face] };
    });
    setSelectedId(null);
    setMessage(
      face === "front"
        ? "Textos del frente restaurados al diseño original."
        : "Textos del reverso restaurados al diseño original.",
    );
  }

  async function save() {
    if (!layout) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      window.localStorage.setItem(LOCAL_KEY, JSON.stringify(layout));
      const res = await adminFetch("/api/admin/card-layout", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ layout }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar");
      setMessage(
        data.localOnly
          ? "Cambios guardados en este navegador."
          : "Cambios guardados (overlays JSON en Supabase).",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function exportPng(opts?: {
    which?: FaceKey | "both";
    dpi?: number;
  }) {
    if (!layout) return;
    setExporting(true);
    setError(null);
    try {
      const dpi = opts?.dpi ?? CARD_EXPORT_DPI_HD;
      const faces: FaceKey[] =
        opts?.which === "both" ? ["front", "back"] : [opts?.which ?? face];
      for (const f of faces) {
        const url = await renderFaceToPng(layout[f], dpi);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ATRIX-tarjeta-${f === "front" ? "frente" : "reverso"}-${dpi}dpi.png`;
        a.click();
      }
      setMessage(
        `PNG exportado (${dpi} DPI, ${CARD_PHYSICAL_CM.width}×${CARD_PHYSICAL_CM.height} cm). Contact sigue usando ${CARD_ASSET.front} / ${CARD_ASSET.back} hasta que reemplaces esos archivos.`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al exportar PNG");
    } finally {
      setExporting(false);
    }
  }

  function onPointerDown(
    e: ReactPointerEvent,
    el: CardElement,
    scale: number,
  ) {
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(el.id);
    const startX = e.clientX;
    const startY = e.clientY;
    const origX = el.x;
    const origY = el.y;

    function onMove(ev: PointerEvent) {
      updateElement(el.id, {
        x: Math.round(origX + (ev.clientX - startX) / scale),
        y: Math.round(origY + (ev.clientY - startY) / scale),
      });
    }
    function onUp() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  function onResizePointerDown(
    e: ReactPointerEvent,
    el: CardTextElement,
    scale: number,
  ) {
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(el.id);
    const startY = e.clientY;
    const startSize = el.fontSize;

    function onMove(ev: PointerEvent) {
      const dy = (ev.clientY - startY) / scale;
      updateElement(el.id, {
        fontSize: Math.max(8, Math.min(72, Math.round(startSize + dy * 0.35))),
      });
    }
    function onUp() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  if (!layout || !current) {
    return (
      <div className="py-20 text-center text-sm text-muted">
        Cargando editor de tarjeta…
      </div>
    );
  }

  const scale = viewScale;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
          Tarjeta presentación
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
          Editar diseño existente
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
          El fondo es el diseño ya terminado (frente / reverso). Selecciona un
          texto de la tarjeta para cambiar contenido, color, tamaño o posición.
          No se agregan formas nuevas: solo se ajusta lo que ya está en el
          diseño. Tamaño de impresión:{" "}
          <span className="text-fg">
            {CARD_PHYSICAL_CM.width} × {CARD_PHYSICAL_CM.height} cm
          </span>
          .
        </p>
      </header>

      {setupNote && (
        <div className="border border-accent/30 bg-accent/10 px-4 py-3 text-sm">
          {setupNote}
        </div>
      )}
      {error && (
        <div className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm">
          {error}
        </div>
      )}
      {message && (
        <div className="border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm">
          {message}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setFace("front");
            setSelectedId(null);
          }}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            face === "front"
              ? "bg-accent text-accent-ink"
              : "border border-line text-fg"
          }`}
        >
          Frente
        </button>
        <button
          type="button"
          onClick={() => {
            setFace("back");
            setSelectedId(null);
          }}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            face === "back"
              ? "bg-accent text-accent-ink"
              : "border border-line text-fg"
          }`}
        >
          Reverso
        </button>
        <button
          type="button"
          onClick={() => void save()}
          disabled={saving}
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-ink disabled:opacity-50"
        >
          {saving ? "Guardando…" : "Guardar cambios"}
        </button>
        <button
          type="button"
          disabled={exporting}
          onClick={() => void exportPng({ dpi: CARD_EXPORT_DPI_HD })}
          className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-fg disabled:opacity-50"
        >
          {exporting ? "Exportando…" : "Exportar PNG (cara)"}
        </button>
        <button
          type="button"
          disabled={exporting}
          onClick={() =>
            void exportPng({ which: "both", dpi: CARD_EXPORT_DPI_HD })
          }
          className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-fg disabled:opacity-50"
        >
          Exportar frente + reverso
        </button>
        <button
          type="button"
          onClick={resetFaceOverlays}
          className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-fg"
        >
          Restaurar textos
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="overflow-auto border border-line bg-bg-elevated/70 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-muted">
              Diseño base bloqueado · overlays editables · vista{" "}
              {Math.round(scale * 100)}%
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showCovers}
                  onChange={(e) => setShowCovers(e.target.checked)}
                />
                Cubrir texto original al editar
              </label>
              <label className="flex items-center gap-2">
                Zoom
                <input
                  type="range"
                  min={0.4}
                  max={1.15}
                  step={0.05}
                  value={viewScale}
                  onChange={(e) => setViewScale(Number(e.target.value))}
                />
              </label>
            </div>
          </div>

          <div
            className="relative mx-auto touch-none"
            style={{
              width: current.width * scale,
              height: current.height * scale,
            }}
            onClick={() => setSelectedId(null)}
          >
            <div
              className="absolute left-0 top-0 overflow-hidden"
              style={{
                width: current.width,
                height: current.height,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                backgroundColor: current.backgroundColor || "#fff",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.backgroundUrl}
                alt=""
                draggable={false}
                className="pointer-events-none absolute max-w-none select-none"
                style={{
                  left: current.backgroundOffsetX ?? 0,
                  top: current.backgroundOffsetY ?? 0,
                  width: current.width * (current.backgroundScale ?? 1),
                  height: current.height * (current.backgroundScale ?? 1),
                  objectFit: "fill",
                }}
              />

              {current.elements.map((el) => {
                if (!isElementVisible(el)) return null;
                const box = elementBox(el);
                const isSel = selectedId === el.id;
                return (
                  <div
                    key={el.id}
                    role="button"
                    tabIndex={0}
                    title={el.label}
                    onPointerDown={(e) => onPointerDown(e, el, scale)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(el.id);
                    }}
                    className={`absolute cursor-move select-none ${
                      isSel
                        ? "outline outline-2 outline-accent outline-offset-1"
                        : "hover:outline hover:outline-1 hover:outline-accent/50"
                    }`}
                    style={{
                      left: box.left,
                      top: el.y,
                      width: box.width,
                      fontSize: el.fontSize,
                      color: el.fill,
                      fontWeight: el.fontWeight || 500,
                      fontFamily: el.fontFamily || CARD_FONT_OPTIONS[0].value,
                      textAlign: el.align || "left",
                      opacity: el.opacity ?? 1,
                      lineHeight: 1.2,
                      whiteSpace: "pre-wrap",
                      backgroundColor:
                        showCovers && el.coverFill
                          ? el.coverFill
                          : "transparent",
                      padding: el.coverPad ?? 0,
                      boxSizing: "content-box",
                    }}
                  >
                    {el.text || " "}
                    {isSel && (
                      <div
                        onPointerDown={(e) =>
                          onResizePointerDown(e, el, scale)
                        }
                        className="absolute -right-1.5 -bottom-1.5 h-3.5 w-3.5 cursor-se-resize border-2 border-accent bg-bg"
                        title="Tamaño de fuente"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted">
            Clic en un texto · arrastra para mover · asa ↘ = tamaño de fuente
          </p>
        </div>

        <div className="space-y-4 border border-line bg-bg-elevated/70 p-4 md:p-5">
          <h2 className="font-display text-lg font-semibold text-fg">
            Textos del {face === "front" ? "frente" : "reverso"}
          </h2>

          <ul className="max-h-48 space-y-1 overflow-y-auto border border-line bg-bg/40 p-2">
            {current.elements.map((el) => (
              <li key={el.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(el.id)}
                  className={`w-full truncate px-2 py-1.5 text-left text-xs ${
                    selectedId === el.id
                      ? "bg-accent/15 font-semibold text-fg"
                      : "text-muted hover:bg-bg hover:text-fg"
                  }`}
                >
                  {el.label}
                </button>
              </li>
            ))}
          </ul>

          {!selected ? (
            <p className="text-sm text-muted">
              Selecciona un texto de la lista o del lienzo para editarlo.
            </p>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-semibold tracking-[0.14em] text-accent uppercase">
                {selected.label}
              </p>
              <label className="block text-sm">
                <span className="text-xs text-muted uppercase">Contenido</span>
                <textarea
                  value={selected.text}
                  rows={3}
                  onChange={(e) =>
                    updateElement(selected.id, { text: e.target.value })
                  }
                  className="mt-1 w-full border border-line bg-bg px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </label>
              <label className="block text-sm">
                <span className="text-xs text-muted uppercase">Fuente</span>
                <select
                  value={selected.fontFamily || CARD_FONT_OPTIONS[0].value}
                  onChange={(e) =>
                    updateElement(selected.id, {
                      fontFamily: e.target.value,
                    })
                  }
                  className="mt-1 w-full border border-line bg-bg px-3 py-2 text-sm"
                >
                  {CARD_FONT_OPTIONS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block text-sm">
                <span className="text-xs text-muted uppercase">
                  Tamaño ({selected.fontSize}px)
                </span>
                <input
                  type="range"
                  min={8}
                  max={64}
                  value={selected.fontSize}
                  onChange={(e) =>
                    updateElement(selected.id, {
                      fontSize: Number(e.target.value),
                    })
                  }
                  className="mt-2 w-full"
                />
              </label>
              <label className="block text-sm">
                <span className="text-xs text-muted uppercase">Color</span>
                <input
                  type="color"
                  value={normalizeColor(selected.fill)}
                  onChange={(e) =>
                    updateElement(selected.id, { fill: e.target.value })
                  }
                  className="mt-1 h-10 w-full border border-line bg-bg"
                />
              </label>
              <div className="grid grid-cols-2 gap-2">
                <label className="text-sm">
                  <span className="text-xs text-muted uppercase">X</span>
                  <input
                    type="number"
                    value={selected.x}
                    onChange={(e) =>
                      updateElement(selected.id, {
                        x: Number(e.target.value),
                      })
                    }
                    className="mt-1 w-full border border-line bg-bg px-2 py-1.5 text-sm"
                  />
                </label>
                <label className="text-sm">
                  <span className="text-xs text-muted uppercase">Y</span>
                  <input
                    type="number"
                    value={selected.y}
                    onChange={(e) =>
                      updateElement(selected.id, {
                        y: Number(e.target.value),
                      })
                    }
                    className="mt-1 w-full border border-line bg-bg px-2 py-1.5 text-sm"
                  />
                </label>
              </div>
              <label className="block text-sm">
                <span className="text-xs text-muted uppercase">Peso</span>
                <select
                  value={selected.fontWeight || "500"}
                  onChange={(e) =>
                    updateElement(selected.id, {
                      fontWeight: e.target.value,
                    })
                  }
                  className="mt-1 w-full border border-line bg-bg px-3 py-2 text-sm"
                >
                  <option value="400">Regular</option>
                  <option value="500">Medium</option>
                  <option value="700">Bold</option>
                  <option value="800">Extra bold</option>
                </select>
              </label>
            </div>
          )}

          <div className="border-t border-line pt-4">
            <h3 className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
              Fondo (diseño bloqueado)
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              El arte (logo, esquinas, iconos, chevron) viene del PNG
              original. Solo se ajusta escala/posición si hace falta alinear.
            </p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <label className="text-sm">
                <span className="text-xs text-muted uppercase">Escala</span>
                <input
                  type="number"
                  step={0.01}
                  min={0.9}
                  max={1.15}
                  value={current.backgroundScale ?? 1}
                  onChange={(e) =>
                    updateFace((f) => ({
                      ...f,
                      backgroundScale: Number(e.target.value) || 1,
                    }))
                  }
                  className="mt-1 w-full border border-line bg-bg px-2 py-1.5 text-sm"
                />
              </label>
              <label className="text-sm">
                <span className="text-xs text-muted uppercase">Offset X</span>
                <input
                  type="number"
                  value={current.backgroundOffsetX ?? 0}
                  onChange={(e) =>
                    updateFace((f) => ({
                      ...f,
                      backgroundOffsetX: Number(e.target.value) || 0,
                    }))
                  }
                  className="mt-1 w-full border border-line bg-bg px-2 py-1.5 text-sm"
                />
              </label>
              <label className="text-sm">
                <span className="text-xs text-muted uppercase">Offset Y</span>
                <input
                  type="number"
                  value={current.backgroundOffsetY ?? 0}
                  onChange={(e) =>
                    updateFace((f) => ({
                      ...f,
                      backgroundOffsetY: Number(e.target.value) || 0,
                    }))
                  }
                  className="mt-1 w-full border border-line bg-bg px-2 py-1.5 text-sm"
                />
              </label>
            </div>
          </div>

          <div className="border-t border-line pt-4">
            <h3 className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
              Descargas Contact (sin cambios)
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={CARD_ASSET.front}
                download
                className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-fg"
              >
                Frente público
              </a>
              <a
                href={CARD_ASSET.back}
                download
                className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-fg"
              >
                Reverso público
              </a>
              <a
                href={CARD_ASSET.front300}
                download
                className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-fg"
              >
                Frente 300 DPI
              </a>
              <a
                href={CARD_ASSET.back300}
                download
                className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-fg"
              >
                Reverso 300 DPI
              </a>
            </div>
            <button
              type="button"
              disabled={exporting}
              onClick={() =>
                void exportPng({ which: "both", dpi: CARD_EXPORT_DPI })
              }
              className="mt-3 rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-fg disabled:opacity-50"
            >
              Exportar edición a 300 DPI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function elementBox(el: CardTextElement) {
  const width = el.width ?? Math.max(80, el.text.length * el.fontSize * 0.55);
  if (el.align === "center") {
    return { left: el.x - width / 2, width };
  }
  if (el.align === "right") {
    return { left: el.x - width, width };
  }
  return { left: el.x, width };
}

function normalizeColor(c: string) {
  if (/^#[0-9a-fA-F]{6}$/.test(c)) return c;
  if (/^#[0-9a-fA-F]{3}$/.test(c)) {
    const [r, g, b] = c.slice(1);
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return "#0c1018";
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
    img.src = src;
  });
}

async function renderFaceToPng(
  face: CardFaceLayout,
  dpi: number,
): Promise<string> {
  const out = cardPixelSize(dpi);
  const sx = out.width / face.width;
  const sy = out.height / face.height;
  const canvas = document.createElement("canvas");
  canvas.width = out.width;
  canvas.height = out.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas no disponible");

  ctx.fillStyle = face.backgroundColor || "#ffffff";
  ctx.fillRect(0, 0, out.width, out.height);

  const bg = await loadImage(face.backgroundUrl);
  const scale = face.backgroundScale ?? 1;
  const dw = face.width * scale * sx;
  const dh = face.height * scale * sy;
  ctx.drawImage(
    bg,
    (face.backgroundOffsetX ?? 0) * sx,
    (face.backgroundOffsetY ?? 0) * sy,
    dw,
    dh,
  );

  for (const el of face.elements) {
    if (!isElementVisible(el)) continue;
    const box = elementBox(el);
    const pad = el.coverPad ?? 4;
    const left = box.left * sx;
    const top = el.y * sy;
    const width = box.width * sx;
    const lines = (el.text || "").split("\n");
    const fontSize = el.fontSize * sy;
    const lineH = fontSize * 1.2;
    const blockH = lineH * Math.max(1, lines.length);

    if (el.coverFill) {
      ctx.fillStyle = el.coverFill;
      ctx.fillRect(
        left - pad * sx,
        top - pad * sy,
        width + pad * 2 * sx,
        blockH + pad * 2 * sy,
      );
    }

    ctx.save();
    ctx.globalAlpha = el.opacity ?? 1;
    ctx.fillStyle = el.fill;
    ctx.font = `${el.fontWeight || "500"} ${fontSize}px ${
      el.fontFamily || CARD_FONT_OPTIONS[0].value
    }`;
    ctx.textBaseline = "top";
    ctx.textAlign = el.align || "left";
    let textX = left;
    if (el.align === "center") textX = left + width / 2;
    if (el.align === "right") textX = left + width;
    lines.forEach((line, i) => {
      ctx.fillText(line, textX, top + i * lineH);
    });
    ctx.restore();
  }

  return canvas.toDataURL("image/png");
}
