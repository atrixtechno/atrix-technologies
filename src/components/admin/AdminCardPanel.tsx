"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { adminFetch } from "@/lib/admin-session";
import {
  CARD_EXPORT_DPI,
  CARD_EXPORT_DPI_HD,
  CARD_FONT_OPTIONS,
  CARD_PHYSICAL_CM,
  cardPixelSize,
  isElementVisible,
  isShapeElement,
  isTextElement,
  normalizeCardLayout,
  type BusinessCardLayout,
  type CardElement,
  type CardFaceLayout,
  type CardShapeElement,
  type CardTextElement,
} from "@/lib/card-layout";

const LOCAL_KEY = "atrix_business_card_layout";

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
  const [uploadingBg, setUploadingBg] = useState(false);
  const [viewScale, setViewScale] = useState(0.72);
  const stageRef = useRef<HTMLDivElement>(null);
  const bgInputRef = useRef<HTMLInputElement>(null);

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
  const selected = current?.elements.find((e) => e.id === selectedId) ?? null;

  function updateFace(mutator: (face: CardFaceLayout) => CardFaceLayout) {
    setLayout((prev) => {
      if (!prev) return prev;
      return { ...prev, [face]: mutator(prev[face]) };
    });
  }

  function updateElement(id: string, patch: Partial<CardElement>) {
    updateFace((f) => ({
      ...f,
      elements: f.elements.map((el) => {
        if (el.id !== id) return el;
        return { ...el, ...patch } as CardElement;
      }),
    }));
  }

  function newId(prefix: string) {
    return `${prefix}-${Date.now().toString(36)}`;
  }

  function addText() {
    const id = newId("txt");
    const el: CardTextElement = {
      id,
      type: "text",
      text: "Nuevo texto",
      x: 80,
      y: 200,
      fontSize: 22,
      fill: "#f5f5f0",
      fontWeight: "500",
      fontFamily: CARD_FONT_OPTIONS[0].value,
      align: "left",
      opacity: 1,
      visible: true,
    };
    updateFace((f) => ({ ...f, elements: [...f.elements, el] }));
    setSelectedId(id);
  }

  function addShape(kind: CardShapeElement["shape"]) {
    const id = newId("shp");
    const base: CardShapeElement = {
      id,
      type: "shape",
      shape: kind,
      x: kind === "corner" ? 0 : 120,
      y: kind === "corner" ? 0 : 160,
      width: kind === "line" ? 220 : kind === "corner" ? 180 : 140,
      height: kind === "line" ? 4 : kind === "corner" ? 180 : 80,
      fill: kind === "line" ? "#005AE7" : "#005AE7",
      stroke: "#001C48",
      strokeWidth: kind === "line" ? 0 : 0,
      corner: "tl",
      opacity: 1,
      visible: true,
    };
    updateFace((f) => ({ ...f, elements: [...f.elements, base] }));
    setSelectedId(id);
  }

  function removeSelected() {
    if (!selectedId) return;
    updateFace((f) => ({
      ...f,
      elements: f.elements.filter((e) => e.id !== selectedId),
    }));
    setSelectedId(null);
  }

  function moveLayer(direction: "front" | "back" | "forward" | "backward") {
    if (!selectedId) return;
    updateFace((f) => {
      const idx = f.elements.findIndex((e) => e.id === selectedId);
      if (idx < 0) return f;
      const next = [...f.elements];
      const [item] = next.splice(idx, 1);
      if (direction === "front") next.push(item);
      else if (direction === "back") next.unshift(item);
      else if (direction === "forward") {
        next.splice(Math.min(idx + 1, next.length), 0, item);
      } else {
        next.splice(Math.max(idx - 1, 0), 0, item);
      }
      return { ...f, elements: next };
    });
  }

  function alignSelected(
    mode: "left" | "center" | "right" | "top" | "middle" | "bottom",
  ) {
    if (!selected || !current) return;
    const bounds = getElementBounds(selected);
    const patch: Partial<CardElement> = {};
    if (mode === "left") patch.x = 24;
    if (mode === "center")
      patch.x = Math.round((current.width - bounds.w) / 2);
    if (mode === "right")
      patch.x = Math.round(current.width - bounds.w - 24);
    if (mode === "top") patch.y = 24;
    if (mode === "middle")
      patch.y = Math.round((current.height - bounds.h) / 2);
    if (mode === "bottom")
      patch.y = Math.round(current.height - bounds.h - 24);
    updateElement(selected.id, patch);
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
          ? "Guardado en este navegador (Supabase no disponible)."
          : "Cambios guardados en Supabase (site_settings).",
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
      const which = opts?.which ?? face;
      const faces: FaceKey[] =
        which === "both" ? ["front", "back"] : [which];
      for (const f of faces) {
        const url = await renderFaceToPng(layout[f], dpi);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ATRIX-tarjeta-${f === "front" ? "frente" : "reverso"}-${dpi}dpi.png`;
        a.click();
      }
      setMessage(
        `PNG exportado a ${dpi} DPI (${CARD_PHYSICAL_CM.width}×${CARD_PHYSICAL_CM.height} cm). Las rutas de Contact no cambian hasta que reemplaces los assets públicos.`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al exportar PNG");
    } finally {
      setExporting(false);
    }
  }

  async function onBackgroundFile(file: File | null) {
    if (!file || !current) return;
    if (!file.type.match(/^image\/(png|jpeg|jpg|webp)$/i)) {
      setError("Usa PNG, JPG o WEBP.");
      return;
    }
    setUploadingBg(true);
    setError(null);
    try {
      let url: string | null = null;
      const form = new FormData();
      form.append("file", file);
      form.append("folder", "card-backgrounds");
      const res = await adminFetch("/api/admin/projects/upload", {
        method: "POST",
        body: form,
      });
      if (res.ok) {
        const data = await res.json();
        url = data.url as string;
      } else {
        url = await readFileAsDataUrl(file);
        setMessage(
          "Fondo cargado localmente (data URL). Subida a Storage no disponible.",
        );
      }
      if (!url) throw new Error("No se pudo leer la imagen");
      updateFace((f) => ({
        ...f,
        backgroundUrl: url!,
        backgroundScale: 1,
        backgroundOffsetX: 0,
        backgroundOffsetY: 0,
      }));
      if (res.ok) setMessage("Fondo actualizado.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al subir fondo");
    } finally {
      setUploadingBg(false);
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
      const dx = (ev.clientX - startX) / scale;
      const dy = (ev.clientY - startY) / scale;
      updateElement(el.id, {
        x: Math.round(origX + dx),
        y: Math.round(origY + dy),
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
    el: CardElement,
    scale: number,
  ) {
    e.preventDefault();
    e.stopPropagation();
    setSelectedId(el.id);
    const startX = e.clientX;
    const startY = e.clientY;
    const bounds = getElementBounds(el);

    function onMove(ev: PointerEvent) {
      const dx = (ev.clientX - startX) / scale;
      const dy = (ev.clientY - startY) / scale;
      if (isTextElement(el)) {
        const nextSize = Math.max(
          10,
          Math.min(120, Math.round(el.fontSize + dy * 0.35)),
        );
        const patch: Partial<CardTextElement> = { fontSize: nextSize };
        if (el.width) {
          patch.width = Math.max(40, Math.round(bounds.w + dx));
        }
        updateElement(el.id, patch);
      } else if (isShapeElement(el)) {
        updateElement(el.id, {
          width: Math.max(4, Math.round(bounds.w + dx)),
          height: Math.max(4, Math.round(bounds.h + dy)),
        });
      }
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
          Editor de diseño
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
          Edita frente y reverso: textos, colores, decoraciones, fondo y
          acomodo. Tamaño físico de impresión{" "}
          <span className="text-fg">
            {CARD_PHYSICAL_CM.width} × {CARD_PHYSICAL_CM.height} cm
          </span>
          . Arrastra elementos, usa el asa inferior derecha para redimensionar
          y guarda el layout JSON. Exportar PNG descarga localmente; Contact
          sigue usando{" "}
          <code className="text-fg">/brand/tarjeta-atrix-*.png</code> hasta que
          reemplaces esos archivos.
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
          onClick={addText}
          className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-fg"
        >
          + Texto
        </button>
        <button
          type="button"
          onClick={() => addShape("rect")}
          className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-fg"
        >
          + Rectángulo
        </button>
        <button
          type="button"
          onClick={() => addShape("ellipse")}
          className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-fg"
        >
          + Óvalo
        </button>
        <button
          type="button"
          onClick={() => addShape("line")}
          className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-fg"
        >
          + Línea
        </button>
        <button
          type="button"
          onClick={() => addShape("corner")}
          className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-fg"
        >
          + Esquina
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
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="overflow-auto border border-line bg-bg-elevated/70 p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted">
              Lienzo {current.width}×{current.height}px · vista{" "}
              {Math.round(scale * 100)}%
            </p>
            <label className="flex items-center gap-2 text-xs text-muted">
              Zoom
              <input
                type="range"
                min={0.35}
                max={1.2}
                step={0.05}
                value={viewScale}
                onChange={(e) => setViewScale(Number(e.target.value))}
              />
            </label>
          </div>
          <div
            ref={stageRef}
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
                backgroundColor: current.backgroundColor || "#000c24",
              }}
            >
              {current.backgroundUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={current.backgroundUrl}
                  alt=""
                  draggable={false}
                  className="pointer-events-none absolute max-w-none select-none"
                  style={{
                    left: current.backgroundOffsetX ?? 0,
                    top: current.backgroundOffsetY ?? 0,
                    width: current.width * (current.backgroundScale ?? 1),
                    height: "auto",
                  }}
                />
              ) : null}

              {current.elements.map((el) => {
                if (!isElementVisible(el)) return null;
                const selectedCls =
                  selectedId === el.id
                    ? "outline outline-2 outline-accent outline-offset-1"
                    : "";
                if (isShapeElement(el)) {
                  return (
                    <div
                      key={el.id}
                      role="button"
                      tabIndex={0}
                      onPointerDown={(e) => onPointerDown(e, el, scale)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedId(el.id);
                      }}
                      className={`absolute cursor-move ${selectedCls}`}
                      style={{
                        left: el.x,
                        top: el.y,
                        width: el.width,
                        height: el.height,
                        opacity: el.opacity ?? 1,
                        ...shapeStyle(el),
                      }}
                    >
                      {selectedId === el.id && (
                        <ResizeHandle
                          onPointerDown={(e) =>
                            onResizePointerDown(e, el, scale)
                          }
                        />
                      )}
                    </div>
                  );
                }

                return (
                  <div
                    key={el.id}
                    role="button"
                    tabIndex={0}
                    onPointerDown={(e) => onPointerDown(e, el, scale)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedId(el.id);
                    }}
                    className={`absolute cursor-move select-none whitespace-pre px-0.5 ${selectedCls}`}
                    style={{
                      left: el.x,
                      top: el.y,
                      width: el.width,
                      fontSize: el.fontSize,
                      color: el.fill,
                      fontWeight: el.fontWeight || 500,
                      fontFamily: el.fontFamily || CARD_FONT_OPTIONS[0].value,
                      textAlign: el.align || "left",
                      letterSpacing: el.letterSpacing
                        ? `${el.letterSpacing}px`
                        : undefined,
                      opacity: el.opacity ?? 1,
                      lineHeight: 1.15,
                      whiteSpace: el.width ? "pre-wrap" : "pre",
                    }}
                  >
                    {el.text || " "}
                    {selectedId === el.id && (
                      <ResizeHandle
                        onPointerDown={(e) =>
                          onResizePointerDown(e, el, scale)
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted">
            Clic para seleccionar · arrastra para mover · asa ↘ para tamaño
          </p>
        </div>

        <div className="space-y-4 border border-line bg-bg-elevated/70 p-4 md:p-5">
          <h2 className="font-display text-lg font-semibold text-fg">
            Propiedades
          </h2>

          <section className="space-y-3 border-b border-line pb-4">
            <h3 className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
              Fondo ({face === "front" ? "frente" : "reverso"})
            </h3>
            <label className="block text-sm">
              <span className="text-xs text-muted uppercase">Color base</span>
              <input
                type="color"
                value={normalizeColor(current.backgroundColor || "#000c24")}
                onChange={(e) =>
                  updateFace((f) => ({
                    ...f,
                    backgroundColor: e.target.value,
                  }))
                }
                className="mt-1 h-10 w-full border border-line bg-bg"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={uploadingBg}
                onClick={() => bgInputRef.current?.click()}
                className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-fg disabled:opacity-50"
              >
                {uploadingBg ? "Subiendo…" : "Reemplazar imagen"}
              </button>
              <button
                type="button"
                onClick={() =>
                  updateFace((f) => ({ ...f, backgroundUrl: "" }))
                }
                className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-fg"
              >
                Solo color
              </button>
              <input
                ref={bgInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={(e) => {
                  void onBackgroundFile(e.target.files?.[0] ?? null);
                  e.target.value = "";
                }}
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <label className="text-sm">
                <span className="text-xs text-muted uppercase">Escala</span>
                <input
                  type="number"
                  step={0.05}
                  min={0.2}
                  max={4}
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
          </section>

          {!selected ? (
            <p className="text-sm text-muted">
              Selecciona un elemento en el lienzo, o añade texto / forma.
            </p>
          ) : (
            <div className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => moveLayer("front")}
                  className="rounded-full border border-line px-3 py-1 text-xs font-semibold"
                >
                  Traer al frente
                </button>
                <button
                  type="button"
                  onClick={() => moveLayer("back")}
                  className="rounded-full border border-line px-3 py-1 text-xs font-semibold"
                >
                  Enviar atrás
                </button>
                <button
                  type="button"
                  onClick={() => moveLayer("forward")}
                  className="rounded-full border border-line px-3 py-1 text-xs font-semibold"
                >
                  Adelante
                </button>
                <button
                  type="button"
                  onClick={() => moveLayer("backward")}
                  className="rounded-full border border-line px-3 py-1 text-xs font-semibold"
                >
                  Atrás
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ["left", "Izq"],
                    ["center", "Centro"],
                    ["right", "Der"],
                    ["top", "Arriba"],
                    ["middle", "Medio"],
                    ["bottom", "Abajo"],
                  ] as const
                ).map(([mode, label]) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => alignSelected(mode)}
                    className="rounded-full border border-line px-2.5 py-1 text-xs font-semibold"
                  >
                    {label}
                  </button>
                ))}
              </div>

              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selected.visible !== false}
                  onChange={(e) =>
                    updateElement(selected.id, {
                      visible: e.target.checked,
                    })
                  }
                />
                Visible
              </label>

              {isTextElement(selected) && (
                <>
                  <label className="block text-sm">
                    <span className="text-xs text-muted uppercase">Texto</span>
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
                      value={
                        selected.fontFamily || CARD_FONT_OPTIONS[0].value
                      }
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
                      Peso
                    </span>
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
                      <option value="600">Semibold</option>
                      <option value="700">Bold</option>
                      <option value="800">Extra bold</option>
                    </select>
                  </label>
                  <label className="block text-sm">
                    <span className="text-xs text-muted uppercase">
                      Alineación
                    </span>
                    <select
                      value={selected.align || "left"}
                      onChange={(e) =>
                        updateElement(selected.id, {
                          align: e.target.value as CardTextElement["align"],
                        })
                      }
                      className="mt-1 w-full border border-line bg-bg px-3 py-2 text-sm"
                    >
                      <option value="left">Izquierda</option>
                      <option value="center">Centro</option>
                      <option value="right">Derecha</option>
                    </select>
                  </label>
                  <label className="block text-sm">
                    <span className="text-xs text-muted uppercase">
                      Tamaño de fuente
                    </span>
                    <input
                      type="range"
                      min={10}
                      max={96}
                      value={selected.fontSize}
                      onChange={(e) =>
                        updateElement(selected.id, {
                          fontSize: Number(e.target.value),
                        })
                      }
                      className="mt-2 w-full"
                    />
                    <span className="text-xs text-muted">
                      {selected.fontSize}px
                    </span>
                  </label>
                  <label className="block text-sm">
                    <span className="text-xs text-muted uppercase">
                      Ancho de caja (opcional)
                    </span>
                    <input
                      type="number"
                      min={0}
                      value={selected.width ?? ""}
                      placeholder="Auto"
                      onChange={(e) =>
                        updateElement(selected.id, {
                          width: e.target.value
                            ? Number(e.target.value)
                            : undefined,
                        })
                      }
                      className="mt-1 w-full border border-line bg-bg px-2 py-1.5 text-sm"
                    />
                  </label>
                </>
              )}

              {isShapeElement(selected) && (
                <>
                  <label className="block text-sm">
                    <span className="text-xs text-muted uppercase">Forma</span>
                    <select
                      value={selected.shape}
                      onChange={(e) =>
                        updateElement(selected.id, {
                          shape: e.target
                            .value as CardShapeElement["shape"],
                        })
                      }
                      className="mt-1 w-full border border-line bg-bg px-3 py-2 text-sm"
                    >
                      <option value="rect">Rectángulo</option>
                      <option value="ellipse">Óvalo</option>
                      <option value="line">Línea</option>
                      <option value="corner">Esquina</option>
                    </select>
                  </label>
                  {selected.shape === "corner" && (
                    <label className="block text-sm">
                      <span className="text-xs text-muted uppercase">
                        Esquina
                      </span>
                      <select
                        value={selected.corner || "tl"}
                        onChange={(e) =>
                          updateElement(selected.id, {
                            corner: e.target
                              .value as CardShapeElement["corner"],
                          })
                        }
                        className="mt-1 w-full border border-line bg-bg px-3 py-2 text-sm"
                      >
                        <option value="tl">Superior izq.</option>
                        <option value="tr">Superior der.</option>
                        <option value="bl">Inferior izq.</option>
                        <option value="br">Inferior der.</option>
                      </select>
                    </label>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <label className="text-sm">
                      <span className="text-xs text-muted uppercase">
                        Ancho
                      </span>
                      <input
                        type="number"
                        value={selected.width}
                        onChange={(e) =>
                          updateElement(selected.id, {
                            width: Number(e.target.value),
                          })
                        }
                        className="mt-1 w-full border border-line bg-bg px-2 py-1.5 text-sm"
                      />
                    </label>
                    <label className="text-sm">
                      <span className="text-xs text-muted uppercase">Alto</span>
                      <input
                        type="number"
                        value={selected.height}
                        onChange={(e) =>
                          updateElement(selected.id, {
                            height: Number(e.target.value),
                          })
                        }
                        className="mt-1 w-full border border-line bg-bg px-2 py-1.5 text-sm"
                      />
                    </label>
                  </div>
                </>
              )}

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

              <label className="block text-sm">
                <span className="text-xs text-muted uppercase">Opacidad</span>
                <input
                  type="range"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={selected.opacity ?? 1}
                  onChange={(e) =>
                    updateElement(selected.id, {
                      opacity: Number(e.target.value),
                    })
                  }
                  className="mt-2 w-full"
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

              <button
                type="button"
                onClick={removeSelected}
                className="rounded-full border border-red-500/40 px-4 py-2 text-sm font-semibold text-red-600 dark:text-red-300"
              >
                Eliminar elemento
              </button>
            </div>
          )}

          <div className="border-t border-line pt-4">
            <h3 className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
              Descargas Contact / HD
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-muted">
              Enlaces públicos actuales (no se modifican al exportar desde el
              editor):
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href="/brand/tarjeta-atrix-frente.png"
                download
                className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-fg"
              >
                Frente público
              </a>
              <a
                href="/brand/tarjeta-atrix-reverso.png"
                download
                className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-fg"
              >
                Reverso público
              </a>
              <a
                href="/brand/tarjeta-atrix-frente-300dpi.png"
                download
                className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-fg"
              >
                Frente 300 DPI
              </a>
              <a
                href="/brand/tarjeta-atrix-reverso-300dpi.png"
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
              Exportar a 300 DPI (ambos)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResizeHandle({
  onPointerDown,
}: {
  onPointerDown: (e: ReactPointerEvent<HTMLDivElement>) => void;
}) {
  return (
    <div
      onPointerDown={onPointerDown}
      className="absolute -right-1.5 -bottom-1.5 h-3.5 w-3.5 cursor-se-resize border-2 border-accent bg-bg"
      title="Redimensionar"
    />
  );
}

function shapeStyle(el: CardShapeElement): CSSProperties {
  const opacity = el.opacity ?? 1;
  if (el.shape === "ellipse") {
    return {
      backgroundColor: el.fill,
      borderRadius: "50%",
      opacity,
    };
  }
  if (el.shape === "line") {
    return {
      backgroundColor: el.fill,
      height: Math.max(1, el.height),
      opacity,
    };
  }
  if (el.shape === "corner") {
    const c = el.corner || "tl";
    const poly =
      c === "tl"
        ? "polygon(0 0, 100% 0, 0 100%)"
        : c === "tr"
          ? "polygon(0 0, 100% 0, 100% 100%)"
          : c === "bl"
            ? "polygon(0 0, 0 100%, 100% 100%)"
            : "polygon(100% 0, 100% 100%, 0 100%)";
    return {
      backgroundColor: el.fill,
      clipPath: poly,
      opacity,
    };
  }
  return {
    backgroundColor: el.fill,
    opacity,
  };
}

function getElementBounds(el: CardElement): { w: number; h: number } {
  if (isShapeElement(el)) {
    return { w: el.width, h: el.height };
  }
  const lines = (el.text || " ").split("\n").length;
  const w = el.width || Math.round((el.text || " ").length * el.fontSize * 0.55);
  const h = Math.round(el.fontSize * 1.15 * lines);
  return { w, h };
}

function normalizeColor(c: string) {
  if (/^#[0-9a-fA-F]{6}$/.test(c)) return c;
  if (/^#[0-9a-fA-F]{3}$/.test(c)) {
    const [r, g, b] = c.slice(1);
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return "#f5f5f0";
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("No se pudo leer el archivo"));
    reader.readAsDataURL(file);
  });
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

  ctx.fillStyle = face.backgroundColor || "#000c24";
  ctx.fillRect(0, 0, out.width, out.height);

  if (face.backgroundUrl) {
    try {
      const bg = await loadImage(face.backgroundUrl);
      const scale = face.backgroundScale ?? 1;
      const dw = face.width * scale * sx;
      const dh = (bg.height / bg.width) * dw;
      ctx.drawImage(
        bg,
        (face.backgroundOffsetX ?? 0) * sx,
        (face.backgroundOffsetY ?? 0) * sy,
        dw,
        dh,
      );
    } catch {
      // Keep solid color if image fails (e.g. tainted / missing)
    }
  }

  for (const el of face.elements) {
    if (!isElementVisible(el)) continue;
    ctx.save();
    ctx.globalAlpha = el.opacity ?? 1;

    if (isShapeElement(el)) {
      ctx.fillStyle = el.fill;
      const x = el.x * sx;
      const y = el.y * sy;
      const w = el.width * sx;
      const h = el.height * sy;
      if (el.shape === "ellipse") {
        ctx.beginPath();
        ctx.ellipse(x + w / 2, y + h / 2, w / 2, h / 2, 0, 0, Math.PI * 2);
        ctx.fill();
      } else if (el.shape === "line") {
        ctx.fillRect(x, y, w, Math.max(1, h));
      } else if (el.shape === "corner") {
        ctx.beginPath();
        const c = el.corner || "tl";
        if (c === "tl") {
          ctx.moveTo(x, y);
          ctx.lineTo(x + w, y);
          ctx.lineTo(x, y + h);
        } else if (c === "tr") {
          ctx.moveTo(x, y);
          ctx.lineTo(x + w, y);
          ctx.lineTo(x + w, y + h);
        } else if (c === "bl") {
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + h);
          ctx.lineTo(x + w, y + h);
        } else {
          ctx.moveTo(x + w, y);
          ctx.lineTo(x + w, y + h);
          ctx.lineTo(x, y + h);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillRect(x, y, w, h);
      }
    } else {
      const fontSize = el.fontSize * sy;
      const family = el.fontFamily || CARD_FONT_OPTIONS[0].value;
      ctx.fillStyle = el.fill;
      ctx.font = `${el.fontWeight || "500"} ${fontSize}px ${family}`;
      ctx.textBaseline = "top";
      ctx.textAlign = el.align || "left";
      const lines = (el.text || "").split("\n");
      let textX = el.x * sx;
      if (el.align === "center" && el.width) textX = el.x * sx + (el.width * sx) / 2;
      if (el.align === "right" && el.width) textX = el.x * sx + el.width * sx;
      lines.forEach((line, i) => {
        ctx.fillText(line, textX, el.y * sy + i * fontSize * 1.15);
      });
    }
    ctx.restore();
  }

  return canvas.toDataURL("image/png");
}
