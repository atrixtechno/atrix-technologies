"use client";

import { FormEvent, useState } from "react";
import { whatsappUrl } from "@/content/site";

type Status = "idle" | "loading" | "ok" | "error";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("fail");
      setStatus("ok");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contacto" className="scroll-mt-8 border-t border-line py-24 md:py-28">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:gap-16 md:px-8">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-accent-deep uppercase">
            Contacto
          </p>
          <h2 className="font-display mt-3 text-3xl font-semibold tracking-tight md:text-5xl">
            Cuéntame qué necesitas
          </h2>
          <p className="mt-4 max-w-md leading-relaxed text-muted">
            Escríbeme por WhatsApp o deja tus datos. Te respondo para agendar una plática
            sin compromiso.
          </p>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex rounded-full bg-[#25D366] px-6 py-3.5 font-semibold text-white shadow-[0_14px_32px_rgba(37,211,102,0.28)] transition hover:bg-[#1ebe57]"
          >
            Abrir WhatsApp
          </a>
          <p className="mt-4 text-sm text-muted">+52 867 179 3155</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-5 rounded-[1.75rem] border border-line bg-white p-6 shadow-[0_18px_50px_rgba(11,40,45,0.06)] sm:p-8"
        >
          <label className="block">
            <span className="text-sm text-muted">Nombre</span>
            <input
              name="name"
              required
              className="mt-2 w-full rounded-2xl border border-line bg-bg px-4 py-3 text-fg outline-none transition-colors focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="text-sm text-muted">Teléfono / WhatsApp</span>
            <input
              name="phone"
              type="tel"
              className="mt-2 w-full rounded-2xl border border-line bg-bg px-4 py-3 text-fg outline-none transition-colors focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="text-sm text-muted">Negocio</span>
            <input
              name="business"
              className="mt-2 w-full rounded-2xl border border-line bg-bg px-4 py-3 text-fg outline-none transition-colors focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="text-sm text-muted">Mensaje</span>
            <textarea
              name="message"
              required
              rows={4}
              className="mt-2 w-full resize-y rounded-2xl border border-line bg-bg px-4 py-3 text-fg outline-none transition-colors focus:border-accent"
            />
          </label>
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-full bg-bg-ink px-6 py-3.5 font-semibold text-white transition hover:bg-accent-deep disabled:opacity-60 md:w-auto"
          >
            {status === "loading" ? "Enviando…" : "Enviar mensaje"}
          </button>
          {status === "ok" && (
            <p className="text-sm font-medium text-accent-deep">Listo. Te contacto pronto.</p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-600">
              No se pudo enviar. Escríbeme por WhatsApp, por favor.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
