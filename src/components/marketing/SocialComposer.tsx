"use client";

import { useActionState, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { FieldLabel, inputClass, buttonClass, primaryButtonClass } from "@/components/marketing/ui";
import { createSocialPostAction, suggestCaptionAction, suggestWordsAction } from "@/lib/marketing/social-actions";
import { MARKETING_STYLES, nextStyle, type DesignStyle } from "@/lib/marketing/styles";

// "Nueva publicación" (Admin → Marketing en redes): elige una plantilla de marca (o sube tu imagen),
// su estilo, ajusta las palabras, pide el texto a la IA y elige fecha y destinos. La vista previa
// de la derecha es la imagen real que recibirá Meta.

export type ThemeOption = { id: string; label: string; headline: string; subline: string; chips: string[] };

export function SocialComposer({ themes, defaultWhen, defaultDestinations }: { themes: ThemeOption[]; defaultWhen: string; defaultDestinations: string[] }) {
  const [state, action, saving] = useActionState(createSocialPostAction, null);
  const [theme, setTheme] = useState(themes[0]?.id ?? "servicio");
  const [style, setStyle] = useState<DesignStyle>("azul");
  const [frame, setFrame] = useState(true);
  const [headline, setHeadline] = useState("");
  const [subline, setSubline] = useState("");
  const [chips, setChips] = useState("");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<"feed" | "historia">("feed");
  const [busy, startBusy] = useTransition();
  const [framedSrc, setFramedSrc] = useState("");
  const blob = useRef<string | null>(null);
  const current = themes.find((row) => row.id === theme);
  const own = theme === "propia";
  const framed = own && frame;

  // Vista previa de plantilla: la URL cambia un momento después de dejar de escribir.
  const query = useMemo(() => new URLSearchParams({ theme, headline, subline, chips, formato: format, estilo: style }).toString(), [theme, headline, subline, chips, format, style]);
  const [debounced, setDebounced] = useState(query);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(query), 600);
    return () => window.clearTimeout(timer);
  }, [query]);

  // Foto propia con marco: la dibuja el servidor desde el archivo elegido.
  useEffect(() => {
    if (!framed || !file) return;
    const timer = window.setTimeout(async () => {
      const body = new FormData();
      body.set("image", file);
      body.set("headline", headline);
      body.set("subline", subline);
      body.set("formato", format);
      const response = await fetch("/admin/redes/vista-previa", { method: "POST", body }).catch(() => null);
      if (!response?.ok) return;
      if (blob.current) URL.revokeObjectURL(blob.current);
      blob.current = URL.createObjectURL(await response.blob());
      setFramedSrc(blob.current);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [framed, file, headline, subline, format]);
  useEffect(() => () => {
    if (blob.current) URL.revokeObjectURL(blob.current);
  }, []);

  const ownPreview = useMemo(() => (own && !framed && file ? URL.createObjectURL(file) : ""), [own, framed, file]);
  useEffect(() => () => {
    if (ownPreview) URL.revokeObjectURL(ownPreview);
  }, [ownPreview]);

  function suggestCaption() {
    startBusy(async () => {
      const result = await suggestCaptionAction(theme, headline || current?.headline || "", subline || current?.subline || "");
      setCaption(result.caption);
    });
  }

  function redesign() {
    startBusy(async () => {
      const words = await suggestWordsAction(theme, headline || current?.headline || "", subline || current?.subline || "");
      setHeadline(words.headline);
      setSubline(words.subline);
      if (!own) setStyle((s) => nextStyle(s));
      else setFrame(true);
    });
  }

  const previewSrc = own ? (framed ? framedSrc : ownPreview) : `/admin/redes/vista-previa?${debounced}`;

  return (
    <form action={action} className="grid gap-6 p-4 md:p-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,380px)]">
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <FieldLabel>Tipo de publicación</FieldLabel>
            <select name="theme" className={inputClass} value={theme} onChange={(event) => setTheme(event.target.value)}>
              {themes.map((row) => (
                <option key={row.id} value={row.id}>
                  {row.label}
                </option>
              ))}
              <option value="propia">Mi propia imagen</option>
            </select>
          </label>
          {own ? (
            <label className="block text-sm">
              <FieldLabel>Imagen (JPG, PNG o WebP, hasta 8 MB)</FieldLabel>
              <input name="image" type="file" accept="image/jpeg,image/png,image/webp" className={inputClass} onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
            </label>
          ) : (
            <label className="block text-sm">
              <FieldLabel>Estilo del diseño</FieldLabel>
              <select className={inputClass} value={style} onChange={(event) => setStyle(event.target.value as DesignStyle)}>
                {MARKETING_STYLES.map((row) => (
                  <option key={row.id} value={row.id}>
                    {row.label}
                  </option>
                ))}
              </select>
            </label>
          )}
        </div>
        <input type="hidden" name="style" value={style} />
        {own ? (
          <label className="flex items-center gap-2 text-sm text-fg">
            <input type="checkbox" name="frame" checked={frame} onChange={(event) => setFrame(event.target.checked)} />
            Ponerle el diseño de ATRIX (logo, título y botón sobre tu foto)
          </label>
        ) : null}

        {!own || framed ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm">
              <FieldLabel>Título de la imagen</FieldLabel>
              <input name="headline" className={inputClass} maxLength={120} placeholder={own ? "Tecnología que opera y vende por tu negocio" : current?.headline} value={headline} onChange={(event) => setHeadline(event.target.value)} />
            </label>
            <label className="block text-sm">
              <FieldLabel>Texto corto</FieldLabel>
              <input name="subline" className={inputClass} maxLength={200} placeholder={own ? "Soporte, CCTV, redes y plataformas digitales." : current?.subline} value={subline} onChange={(event) => setSubline(event.target.value)} />
            </label>
          </div>
        ) : null}
        {!own ? (
          <label className="block text-sm">
            <FieldLabel>Etiquetas (hasta 3, separadas por coma)</FieldLabel>
            <input name="chips" className={inputClass} maxLength={120} placeholder={current?.chips.join(", ")} value={chips} onChange={(event) => setChips(event.target.value)} />
          </label>
        ) : null}

        <div className="flex flex-wrap gap-2">
          <button type="button" className={buttonClass} onClick={redesign} disabled={busy}>
            {busy ? "Pensando…" : own ? "Rediseñar con mi foto" : "Rediseñar (estilo y textos nuevos)"}
          </button>
        </div>

        <label className="block text-sm">
          <FieldLabel>Texto de la publicación</FieldLabel>
          <textarea name="caption" className={inputClass} rows={7} maxLength={2200} placeholder="Si lo dejas vacío, lo escribimos con IA (o con la plantilla)." value={caption} onChange={(event) => setCaption(event.target.value)} />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={buttonClass} onClick={suggestCaption} disabled={busy}>
            {busy ? "Escribiendo…" : "Sugerir texto con IA"}
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm">
            <FieldLabel>Día y hora (Ciudad de México)</FieldLabel>
            <input name="when" type="datetime-local" className={inputClass} defaultValue={defaultWhen} required />
          </label>
          <fieldset className="text-sm">
            <FieldLabel>Dónde se publica</FieldLabel>
            <div className="mt-2 space-y-1.5">
              {[
                { id: "ig_feed", label: "Instagram" },
                { id: "ig_story", label: "Historia de Instagram" },
                { id: "fb", label: "Página de Facebook" },
              ].map((row) => (
                <label key={row.id} className="flex items-center gap-2 text-fg">
                  <input type="checkbox" name="destinations" value={row.id} defaultChecked={defaultDestinations.includes(row.id)} /> {row.label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
        <label className="flex items-center gap-2 text-sm text-fg">
          <input type="checkbox" name="approve" /> Aprobarla ya (sale sola a su hora)
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" className={primaryButtonClass} disabled={saving}>
            {saving ? "Guardando…" : "Guardar publicación"}
          </button>
          {state && "ok" in state ? <span className="text-xs text-ok">{state.ok}</span> : null}
          {state && "error" in state ? <span className="text-xs text-alert">{state.error}</span> : null}
        </div>
      </div>

      <div>
        <div className="mb-2 flex gap-1" role="tablist" aria-label="Formato de la vista previa">
          {(["feed", "historia"] as const).map((value) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={format === value}
              onClick={() => setFormat(value)}
              className={`border px-3 py-1.5 text-xs font-semibold transition ${format === value ? "border-accent bg-accent/15 text-accent" : "border-line text-muted hover:text-fg"}`}
            >
              {value === "feed" ? "Feed" : "Historia"}
            </button>
          ))}
        </div>
        <div className={`relative overflow-hidden border border-line bg-stage ${format === "feed" ? "aspect-[4/5]" : "aspect-[9/16]"}`}>
          {previewSrc ? (
            // eslint-disable-next-line @next/next/no-img-element -- vista previa generada por el servidor
            <img key={previewSrc} src={previewSrc} alt="Vista previa de la publicación" className="h-full w-full object-cover" />
          ) : (
            <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-stage-muted">Elige una imagen para verla aquí.</p>
          )}
        </div>
        <p className="mt-2 text-xs text-muted">Es la imagen real que descarga Meta al publicar.</p>
      </div>
    </form>
  );
}
