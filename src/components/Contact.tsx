"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { SectionMedia } from "@/components/SectionMedia";
import { ArrowIcon, SectionHeading, WhatsAppIcon } from "@/components/ui";
import { site, whatsappUrl } from "@/content/site";

type Phase = "idle" | "loading" | "success" | "error";

/** Ciclo de carga visible antes del mensaje de éxito (~2 s). */
const LOAD_MS = 2000;

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14C17.174 2.097 15.943 2 14.643 2 11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5Z" />
    </svg>
  );
}

function GmailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22 6.5v11a1.5 1.5 0 0 1-1.5 1.5H16V11.1l-4 3-4-3V19H3.5A1.5 1.5 0 0 1 2 17.5v-11l10 7.5L22 6.5Z" />
      <path fill="#EA4335" d="M22 6.5 12 14 2 6.5V5.2A1.2 1.2 0 0 1 3.2 4h17.6A1.2 1.2 0 0 1 22 5.2v1.3Z" />
      <path fill="#34A853" d="M2 6.5V17.5A1.5 1.5 0 0 0 3.5 19H8V11.1L2 6.5Z" />
      <path fill="#FBBC04" d="M22 6.5V17.5A1.5 1.5 0 0 1 20.5 19H16V11.1L22 6.5Z" />
    </svg>
  );
}

export function Contact() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [progress, setProgress] = useState(0);
  const [phone, setPhone] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const apiDone = useRef(false);
  const timerDone = useRef(false);

  useEffect(() => {
    if (phase !== "loading") return;
    const start = Date.now();
    const id = window.setInterval(() => {
      const p = Math.min(100, ((Date.now() - start) / LOAD_MS) * 100);
      setProgress(p);
      if (p >= 100) {
        window.clearInterval(id);
        timerDone.current = true;
        if (apiDone.current) setPhase("success");
      }
    }, 40);
    return () => window.clearInterval(id);
  }, [phase]);

  function sanitizePhone(value: string) {
    return value.replace(/\s+/g, "");
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    data.phone = sanitizePhone(String(data.phone ?? ""));

    apiDone.current = false;
    timerDone.current = false;
    setProgress(0);
    setPhase("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("fail");
      apiDone.current = true;
      form.reset();
      setPhone("");
      if (timerDone.current) setPhase("success");
    } catch {
      setPhase("error");
    }
  }

  function closeModal() {
    setPhase("idle");
    setProgress(0);
  }

  return (
    <section
      id="contacto"
      className="relative scroll-mt-24 overflow-hidden border-t border-line py-24 md:py-32"
    >
      <div className="grid-tech pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute top-0 right-0 h-[30rem] w-[30rem] rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--accent)_16%,transparent),transparent)]" aria-hidden />

      <div className="relative mx-auto grid max-w-[1240px] gap-14 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <SectionHeading
            index="08"
            eyebrow="Contacto"
            title={
              <>
                ¿Listo para <span className="text-gradient">cotizar?</span>
              </>
            }
            lead="Soporte técnico, CCTV, redes, impresoras, software o IT empresarial. Cuéntanos qué necesitas y un ingeniero te responde sin compromiso."
          />

          <a
            href={whatsappUrl("Hola ATRIX, quiero cotizar un servicio.")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-whatsapp mt-9"
          >
            <WhatsAppIcon />
            WhatsApp · {site.phoneDisplay}
          </a>

          <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <li>
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="card group flex items-center gap-3 p-4 transition hover:border-[#1877F2]/40"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-bg text-[#1877F2]">
                  <FacebookIcon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="field-label block">Facebook</span>
                  <span className="mt-0.5 block truncate text-sm text-fg transition group-hover:text-accent">
                    facebook.com/atrixnld
                  </span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="card group flex items-center gap-3 p-4 transition hover:border-accent/40"
              >
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-bg">
                  <GmailIcon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="field-label block">Correo</span>
                  <span className="mt-0.5 block truncate text-sm text-fg transition group-hover:text-accent">
                    {site.email}
                  </span>
                </span>
              </a>
            </li>
          </ul>

          <div className="mt-10 hidden lg:block">
            <SectionMedia
              src="/images/home/contacto-escritorio.jpg"
              alt="Escritorio profesional ATRIX listo para atender tu cotización"
              aspect="aspect-[16/9]"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
          </div>
        </div>

        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="relative self-start overflow-hidden rounded-[1.25rem] border border-line bg-bg-elevated shadow-[var(--shadow-soft)]"
        >
          <div className="console-bar !border-line">
            <i />
            <i />
            <i />
            <span className="mono ml-2 text-[11px] text-muted">nueva-solicitud</span>
            <span className="ml-auto inline-flex items-center gap-2 text-[11px] text-muted">
              <span className="live-dot" aria-hidden />
              <span className="mono hidden sm:inline">Respuesta el mismo día</span>
            </span>
          </div>
          <div className="space-y-5 p-6 sm:p-8">
            {/* Honeypot anti-spam: oculto para personas, los bots lo llenan. */}
            <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
              <label>
                Sitio web
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="field-label">Nombre</span>
                <input
                  name="name"
                  required
                  maxLength={120}
                  autoComplete="name"
                  className="field mt-2"
                />
              </label>
              <label className="block">
                <span className="field-label">Teléfono / WhatsApp</span>
                <input
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  maxLength={30}
                  value={phone}
                  onChange={(e) => setPhone(sanitizePhone(e.target.value))}
                  onKeyDown={(e) => {
                    if (e.key === " " || e.code === "Space") e.preventDefault();
                  }}
                  onPaste={(e) => {
                    e.preventDefault();
                    const text = e.clipboardData.getData("text");
                    setPhone((prev) => sanitizePhone(prev + text));
                  }}
                  className="field mt-2"
                />
              </label>
            </div>
            <label className="block">
              <span className="field-label">Servicio de interés</span>
              <input
                name="business"
                maxLength={160}
                placeholder="Ej. CCTV, redes, soporte, sitio web…"
                className="field mt-2"
              />
            </label>
            <label className="block">
              <span className="field-label">Mensaje</span>
              <textarea
                name="message"
                required
                rows={5}
                maxLength={2000}
                placeholder="Cuéntanos brevemente qué necesitas"
                className="field mt-2 resize-y"
              />
            </label>
            <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-subtle">
                Tus datos solo se usan para responder tu solicitud.
              </p>
              <button
                type="submit"
                disabled={phase === "loading"}
                className="btn btn-primary disabled:opacity-60"
              >
                Enviar solicitud
                <ArrowIcon />
              </button>
            </div>
            {phase === "error" && (
              <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                No se pudo enviar. Escríbenos por WhatsApp, por favor.
              </p>
            )}
          </div>
        </form>
      </div>

      {(phase === "loading" || phase === "success") && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-bg/75 px-5 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
        >
          <div className="animate-fade-scale relative w-full max-w-md overflow-hidden rounded-[1.5rem] border border-line bg-bg-elevated p-8 shadow-[var(--shadow-soft)]">
            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-accent/15 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-10 -left-6 h-24 w-24 rounded-full bg-signal/15 blur-2xl" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-line">
              <div
                className="h-full bg-gradient-to-r from-accent to-signal transition-[width] duration-75"
                style={{ width: phase === "success" ? "100%" : `${progress}%` }}
              />
            </div>

            {phase === "loading" ? (
              <div className="relative text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center">
                  <span className="contact-spinner inline-block h-12 w-12 rounded-full border-2 border-line border-t-accent" />
                </div>
                <p
                  id="contact-modal-title"
                  className="font-display mt-6 text-xl font-semibold tracking-tight"
                >
                  Enviando mensaje…
                </p>
                <p className="mt-2 text-sm text-muted">
                  Procesando tu solicitud de forma segura.
                </p>
                <p className="mt-4 font-mono text-xs tracking-[0.2em] text-signal uppercase">
                  {Math.round(progress)}%
                </p>
              </div>
            ) : (
              <div className="relative text-center">
                <div className="animate-rise mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/15 text-accent">
                  <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden>
                    <path
                      d="M5 13l4 4L19 7"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <p
                  id="contact-modal-title"
                  className="font-display mt-6 text-2xl font-semibold tracking-tight"
                >
                  Mensaje enviado
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Recibimos tu mensaje y te contactaremos por WhatsApp o llamada lo
                  antes posible.
                </p>
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn btn-primary mt-8"
                >
                  Entendido
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
