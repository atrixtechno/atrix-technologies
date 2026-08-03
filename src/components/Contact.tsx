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
    <section id="contacto" className="scroll-mt-8 border-t border-line py-24 md:py-32">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 md:grid-cols-2 md:gap-20 md:px-8">
        <div>
          <p className="text-sm tracking-[0.2em] text-muted uppercase">Contacto</p>
          <h2 className="font-display mt-3 text-3xl font-bold tracking-tight md:text-5xl">
            Cuéntame qué necesitas
          </h2>
          <p className="mt-4 max-w-md text-muted leading-relaxed">
            Escríbeme por WhatsApp o deja tus datos. Te respondo para agendar una plática
            sin compromiso.
          </p>
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex rounded-sm bg-accent px-6 py-3 font-semibold text-accent-ink transition-transform hover:scale-[1.02]"
          >
            Abrir WhatsApp
          </a>
          <p className="mt-4 text-sm text-muted">+52 867 179 3155</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <label className="block">
            <span className="text-sm text-muted">Nombre</span>
            <input
              name="name"
              required
              className="mt-2 w-full border border-line bg-bg-elevated px-4 py-3 text-fg outline-none transition-colors focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="text-sm text-muted">Teléfono / WhatsApp</span>
            <input
              name="phone"
              type="tel"
              className="mt-2 w-full border border-line bg-bg-elevated px-4 py-3 text-fg outline-none transition-colors focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="text-sm text-muted">Negocio</span>
            <input
              name="business"
              className="mt-2 w-full border border-line bg-bg-elevated px-4 py-3 text-fg outline-none transition-colors focus:border-accent"
            />
          </label>
          <label className="block">
            <span className="text-sm text-muted">Mensaje</span>
            <textarea
              name="message"
              required
              rows={4}
              className="mt-2 w-full resize-y border border-line bg-bg-elevated px-4 py-3 text-fg outline-none transition-colors focus:border-accent"
            />
          </label>
          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full rounded-sm border border-accent bg-transparent px-6 py-3 font-medium text-accent transition-colors hover:bg-accent hover:text-accent-ink disabled:opacity-60 md:w-auto"
          >
            {status === "loading" ? "Enviando…" : "Enviar mensaje"}
          </button>
          {status === "ok" && (
            <p className="text-sm text-accent">Listo. Te contacto pronto.</p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-400">
              No se pudo enviar. Escríbeme por WhatsApp, por favor.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
