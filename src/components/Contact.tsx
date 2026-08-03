"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
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
    <section id="contacto" className="relative scroll-mt-10 border-t border-line py-24 md:py-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -right-10 top-20 h-40 w-40 rounded-full border border-accent/20" />
        <div className="absolute -right-4 top-28 h-28 w-28 rounded-full border border-signal/20" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-14 px-5 md:grid-cols-2 md:gap-20 md:px-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.16em] text-accent uppercase">
            Contacto
          </p>
          <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight md:text-5xl">
            ¿Listo para cotizar?
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-muted">
            Soporte técnico, CCTV, redes, impresoras, software o IT empresarial.
            Escríbenos y te orientamos sin compromiso.
          </p>
          <a
            href={whatsappUrl("Hola ATRIX, quiero cotizar un servicio.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex rounded-full bg-accent px-6 py-3.5 font-semibold text-accent-ink shadow-[0_12px_32px_rgba(13,159,150,0.25)] transition hover:brightness-110"
          >
            WhatsApp
          </a>

          <ul className="mt-6 space-y-3">
            <li>
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 text-sm text-muted transition hover:text-fg"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center border border-line bg-bg-elevated text-[#1877F2] transition group-hover:border-[#1877F2]/40">
                  <FacebookIcon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-[11px] font-semibold tracking-[0.16em] uppercase">
                    Facebook
                  </span>
                  <span className="mt-0.5 block text-fg transition group-hover:text-accent">
                    facebook.com/atrixnld
                  </span>
                </span>
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="group inline-flex items-center gap-3 text-sm text-muted transition hover:text-fg"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center border border-line bg-bg-elevated transition group-hover:border-accent/40">
                  <GmailIcon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-[11px] font-semibold tracking-[0.16em] uppercase">
                    Gmail
                  </span>
                  <span className="mt-0.5 block text-fg transition group-hover:text-accent">
                    {site.email}
                  </span>
                </span>
              </a>
            </li>
          </ul>
        </div>

        <form ref={formRef} onSubmit={onSubmit} className="relative space-y-5">
          <div className="pointer-events-none absolute -inset-px rounded-sm bg-gradient-to-br from-accent/20 via-transparent to-signal/20 opacity-60" />
          <div className="relative space-y-5 border border-line bg-bg-elevated/80 p-5 backdrop-blur md:p-6">
            <label className="block">
              <span className="text-xs tracking-[0.16em] text-muted uppercase">Nombre</span>
              <input
                name="name"
                required
                className="mt-2 w-full border border-line bg-bg px-4 py-3.5 text-fg outline-none transition focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="text-xs tracking-[0.16em] text-muted uppercase">
                Teléfono / WhatsApp
              </span>
              <input
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
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
                className="mt-2 w-full border border-line bg-bg px-4 py-3.5 text-fg outline-none transition focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="text-xs tracking-[0.16em] text-muted uppercase">
                Servicio de interés
              </span>
              <input
                name="business"
                placeholder="Ej. CCTV, redes, soporte, sitio web…"
                className="mt-2 w-full border border-line bg-bg px-4 py-3.5 text-fg outline-none transition focus:border-accent"
              />
            </label>
            <label className="block">
              <span className="text-xs tracking-[0.16em] text-muted uppercase">Mensaje</span>
              <textarea
                name="message"
                required
                rows={4}
                className="mt-2 w-full resize-y border border-line bg-bg px-4 py-3.5 text-fg outline-none transition focus:border-accent"
              />
            </label>
            <button
              type="submit"
              disabled={phase === "loading"}
              className="w-full border border-accent bg-transparent px-6 py-3.5 font-semibold text-accent transition hover:bg-accent hover:text-accent-ink disabled:opacity-60 md:w-auto"
            >
              Enviar mensaje
            </button>
            {phase === "error" && (
              <p className="text-sm text-red-500">
                No se pudo enviar. Escríbenos por WhatsApp, por favor.
              </p>
            )}
          </div>
        </form>
      </div>

      {(phase === "loading" || phase === "success") && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-bg/70 px-5 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="contact-modal-title"
        >
          <div className="animate-fade-scale relative w-full max-w-md overflow-hidden border border-line bg-bg-elevated p-8 shadow-[0_30px_80px_rgba(11,26,36,0.18)]">
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
                  Nos pondremos en contacto contigo de inmediato.
                </p>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-8 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-accent-ink transition hover:brightness-110"
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
