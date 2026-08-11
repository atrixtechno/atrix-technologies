"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { adminFetchHeaders } from "@/lib/admin-session";
import type {
  BusinessCardLayout,
  CardElement,
  CardFaceLayout,
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
  const stageRef = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const local = window.localStorage.getItem(LOCAL_KEY);
      const res = await fetch("/api/admin/card-layout", {
        credentials: "same-origin",
        headers: adminFetchHeaders(),
      });
      const data = await res.json();
      setSetupNote(data.setupNote ?? null);
      if (data.configured && data.layout) {
        setLayout(data.layout);
      } else if (local) {
        setLayout(JSON.parse(local) as BusinessCardLayout);
      } else {
        setLayout(data.layout);
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
      elements: f.elements.map((el) =>
        el.id === id ? { ...el, ...patch } : el,
      ),
    }));
  }

  function addText() {
    const id = `el-${Date.now().toString(36)}`;
    updateFace((f) => ({
      ...f,
      elements: [
        ...f.elements,
        {
          id,
          text: "Nuevo texto",
          x: 80,
          y: 200,
          fontSize: 22,
          fill: "#f5f5f0",
          fontWeight: "500",
        },
      ],
    }));
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

  async function save() {
    if (!layout) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      window.localStorage.setItem(LOCAL_KEY, JSON.stringify(layout));
      const res = await fetch("/api/admin/card-layout", {
        method: "PUT",
        credentials: "same-origin",
        headers: adminFetchHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ layout }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar");
      setMessage(
        data.localOnly
          ? "Guardado en este navegador (Supabase no disponible)."
          : "Layout guardado en Supabase.",
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  async function exportPng() {
    if (!layout || !stageRef.current) return;
    setError(null);
    try {
      const faceLayout = layout[face];
      const canvas = document.createElement("canvas");
      canvas.width = faceLayout.width;
      canvas.height = faceLayout.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas no disponible");

      const bg = await loadImage(faceLayout.backgroundUrl);
      ctx.drawImage(bg, 0, 0, faceLayout.width, faceLayout.height);

      for (const el of faceLayout.elements) {
        ctx.fillStyle = el.fill;
        ctx.font = `${el.fontWeight || "500"} ${el.fontSize}px system-ui, sans-serif`;
        ctx.textBaseline = "top";
        ctx.fillText(el.text, el.x, el.y);
      }

      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `ATRIX-tarjeta-${face}.png`;
      a.click();
      setMessage(`PNG exportado (${face}).`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al exportar PNG");
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
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);

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

  if (!layout || !current) {
    return (
      <div className="py-20 text-center text-sm text-muted">
        Cargando editor de tarjeta…
      </div>
    );
  }

  const scale = 0.55;

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
          4. Tarjeta presentación
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
          Editor visual
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Arrastra textos sobre el frente y el reverso, cambia tamaño y color.
          Guarda el layout JSON y exporta PNG.
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
          onClick={() => setFace("front")}
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
          onClick={() => setFace("back")}
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
          Añadir texto
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
          onClick={() => void exportPng()}
          className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-fg"
        >
          Exportar PNG
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="overflow-auto border border-line bg-bg-elevated/70 p-4">
          <div
            ref={stageRef}
            className="relative mx-auto origin-top-left touch-none"
            style={{
              width: current.width * scale,
              height: current.height * scale,
            }}
            onClick={() => setSelectedId(null)}
          >
            <div
              className="absolute left-0 top-0"
              style={{
                width: current.width,
                height: current.height,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                backgroundImage: `url(${current.backgroundUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {current.elements.map((el) => (
                <div
                  key={el.id}
                  role="button"
                  tabIndex={0}
                  onPointerDown={(e) => onPointerDown(e, el, scale)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(el.id);
                  }}
                  className={`absolute cursor-move select-none whitespace-pre px-1 ${
                    selectedId === el.id
                      ? "outline outline-2 outline-accent"
                      : ""
                  }`}
                  style={{
                    left: el.x,
                    top: el.y,
                    fontSize: el.fontSize,
                    color: el.fill,
                    fontWeight: el.fontWeight || 500,
                    lineHeight: 1.15,
                  }}
                >
                  {el.text || " "}
                </div>
              ))}
            </div>
          </div>
          <p className="mt-3 text-center text-xs text-muted">
            Arrastra los textos. Escala de vista {Math.round(scale * 100)}%.
          </p>
        </div>

        <div className="space-y-4 border border-line bg-bg-elevated/70 p-4 md:p-5">
          <h2 className="font-display text-lg font-semibold text-fg">
            Propiedades
          </h2>
          {!selected ? (
            <p className="text-sm text-muted">
              Selecciona un elemento en el lienzo o añade texto.
            </p>
          ) : (
            <div className="space-y-3">
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
                <span className="text-xs text-muted uppercase">
                  Tamaño de fuente
                </span>
                <input
                  type="range"
                  min={12}
                  max={72}
                  value={selected.fontSize}
                  onChange={(e) =>
                    updateElement(selected.id, {
                      fontSize: Number(e.target.value),
                    })
                  }
                  className="mt-2 w-full"
                />
                <span className="text-xs text-muted">{selected.fontSize}px</span>
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
              Descargas HD actuales
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href="/brand/tarjeta-atrix-frente-300dpi.png"
                download
                className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-fg"
              >
                Frente HD
              </a>
              <a
                href="/brand/tarjeta-atrix-reverso-300dpi.png"
                download
                className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-fg"
              >
                Reverso HD
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function normalizeColor(c: string) {
  if (/^#[0-9a-fA-F]{6}$/.test(c)) return c;
  return "#f5f5f0";
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
