"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { SceneInput } from "@/components/DeviceScene3D";
import { ArrowIcon } from "@/components/ui";
import { useScrollProgress } from "@/components/useScrollProgress";

function StaticFallback() {
  return (
    <Image
      src="/images/renders/software.webp"
      alt="Laptop y celular con plataformas de ATRIX"
      fill
      sizes="100vw"
      className="render-feather object-contain px-6 pt-40 pb-24"
    />
  );
}

const DeviceScene3D = dynamic(() => import("@/components/DeviceScene3D"), { ssr: false });

const phases = [
  {
    title: "Plataformas en producción.",
    copy: "Sitios, apps y sistemas que hoy venden y administran negocios reales en la frontera.",
  },
  {
    title: "Sitios web que venden.",
    copy: "Diseño, velocidad y SEO local para que te encuentren y te escriban por WhatsApp.",
  },
  {
    title: "Apps para iOS y Android.",
    copy: "Citas, pedidos y cobros desde el celular de tus clientes y de tu equipo.",
  },
  {
    title: "Paneles y sistemas a la medida.",
    copy: "Punto de venta, portales e intranets que ordenan tu operación de punta a punta.",
  },
] as const;

function clamp(v: number) {
  return Math.max(0, Math.min(1, v));
}

function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Showcase3D() {
  const input = useRef<SceneInput>({ p: 0, mx: 0, my: 0, reduced: false });
  const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [webgl, setWebgl] = useState(true);
  const [lowPower, setLowPower] = useState(false);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  const n = phases.length;

  const onProgress = useCallback(
    (p: number) => {
      input.current.p = p;
      const pos = p * n;
      captionRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = pos - (i + 0.5);
        let o = clamp(1 - (Math.abs(d) - 0.25) / 0.2);
        if ((i === 0 && d < 0) || (i === n - 1 && d > 0)) o = 1;
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translate3d(0, ${(d * -24).toFixed(1)}px, 0)`;
        el.style.visibility = o < 0.01 ? "hidden" : "visible";
      });
    },
    [n],
  );

  const sectionRef = useScrollProgress<HTMLElement>("sticky", onProgress);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    input.current.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ok = supportsWebGL();
    const narrow = window.matchMedia("(max-width: 767px)").matches;
    const cores = navigator.hardwareConcurrency ?? 8;

    // Carga diferida: monta el 3D al acercarse y lo pausa fuera de vista.
    const near = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setWebgl(ok);
          setLowPower(narrow || cores <= 4);
          setMounted(true);
          near.disconnect();
        }
      },
      { rootMargin: "100% 0px" },
    );
    const visible = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting));
    near.observe(el);
    visible.observe(el);

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      input.current.mx = (e.clientX / window.innerWidth) * 2 - 1;
      input.current.my = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      near.disconnect();
      visible.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [sectionRef]);

  return (
    <section
      ref={sectionRef}
      id="plataformas"
      aria-label="Plataformas digitales de ATRIX"
      className="relative"
      style={{ height: "340vh" }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#030406]">
        {/* Luz de estudio */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_60%,rgba(47,123,255,0.22),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#030406] to-transparent" />

        <div className="absolute inset-0">
          {/* El render estático se ve hasta que la escena 3D está lista. */}
          <div
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: ready && webgl ? 0 : 1 }}
            aria-hidden={ready && webgl}
          >
            <StaticFallback />
          </div>
          {mounted && webgl && (
            <div className="absolute inset-0 transition-opacity duration-700" style={{ opacity: ready ? 1 : 0 }}>
              <DeviceScene3D input={input} active={active} lowPower={lowPower} onReady={onReady} />
            </div>
          )}
        </div>

        {/* Titulares por fase */}
        <div className="pointer-events-none absolute inset-x-0 top-0 px-5 pt-24 text-center sm:pt-28">
          <div className="relative mx-auto h-40 max-w-3xl sm:h-44">
            {phases.map((ph, i) => (
              <div
                key={ph.title}
                ref={(el) => {
                  captionRefs.current[i] = el;
                }}
                className="absolute inset-x-0 top-0 will-change-transform"
                style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? "visible" : "hidden" }}
              >
                <h2 className="section-title text-white">{ph.title}</h2>
                <p className="mx-auto mt-4 max-w-xl text-lg text-[#9aa6bd]">{ph.copy}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-10 flex justify-center px-5">
          <Link href="/proyectos" className="btn btn-primary">
            Ver el portafolio completo
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </section>
  );
}
