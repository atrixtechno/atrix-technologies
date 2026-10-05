"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { Component, useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import type { SceneInput } from "@/components/DeviceScene3D";
import { ArrowIcon } from "@/components/ui";
import { useScrollProgress } from "@/components/useScrollProgress";

function StaticFallback() {
  // Contenedor con la proporción del render: así la máscara funde su borde real.
  return (
    <div className="absolute inset-x-0 top-[22%] bottom-[12%] flex items-center justify-center px-4">
      <div className="render-feather relative aspect-[4/3] h-full max-w-full">
        <Image
          src="/images/renders/software.webp"
          alt="Laptop y celular con plataformas de ATRIX"
          fill
          sizes="(max-width: 768px) 100vw, 900px"
          className="object-cover"
        />
      </div>
    </div>
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
    // Three.js actual solo funciona con WebGL2.
    return Boolean(c.getContext("webgl2"));
  } catch {
    return false;
  }
}

/** Si la escena 3D lanza un error, se queda el render estático en lugar de romper la página. */
class SceneBoundary extends Component<{ onError: (reason: string) => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: unknown) {
    this.props.onError(error instanceof Error ? error.message : String(error));
  }
  render() {
    return this.state.failed ? null : this.props.children;
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
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<string | null>(null);
  const onReady = useCallback(() => setReady(true), []);
  const onError = useCallback((reason: string) => {
    setError(reason);
    setReady(false);
  }, []);
  const show3D = mounted && webgl && !error;
  const n = phases.length;

  const onProgress = useCallback(
    (p: number) => {
      input.current.p = p;
      const pos = p * n;
      captionRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = pos - (i + 0.5);
        // Sale de 0.3 a 0.5 y la siguiente entra de 0.5 a 0.3: siempre hay un titular visible.
        let o = clamp(1 - (Math.abs(d) - 0.3) / 0.2);
        if ((i === 0 && d < 0) || (i === n - 1 && d > 0)) o = 1;
        el.style.opacity = o.toFixed(3);
        el.style.transform = `translate3d(0, ${(d * -24).toFixed(1)}px, 0)`;
        el.style.visibility = o < 0.01 ? "hidden" : "visible";
      });
    },
    [n],
  );

  const sectionRef = useScrollProgress<HTMLElement>("sticky", onProgress);

  // Diagnóstico en el propio teléfono: atrixnld.com/?debug3d=1
  useEffect(() => {
    if (!new URLSearchParams(window.location.search).has("debug3d")) return;
    const id = window.setInterval(() => {
      const i = input.current;
      setDebug(
        [
          `webgl2=${supportsWebGL()}`,
          `p=${i.p.toFixed(2)}`,
          `reduced=${i.reduced}`,
          `cores=${navigator.hardwareConcurrency ?? "?"}`,
          `dpr=${window.devicePixelRatio}`,
        ].join(" · "),
      );
    }, 300);
    return () => window.clearInterval(id);
  }, []);

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
      // Precarga con margen amplio: llega lista cuando el visitante alcanza la sección.
      { rootMargin: "250% 0px" },
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
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#070a10]">
        {/* Luz de estudio */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_60%,rgba(47,123,255,0.22),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#070a10] to-transparent" />

        <div className="absolute inset-0">
          {/* El render estático se ve hasta que la escena 3D está lista. */}
          <div
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: ready && show3D ? 0 : 1 }}
            aria-hidden={ready && show3D}
          >
            <StaticFallback />
          </div>
          {show3D && (
            <div className="absolute inset-0 transition-opacity duration-700" style={{ opacity: ready ? 1 : 0 }}>
              <SceneBoundary onError={onError}>
                <DeviceScene3D input={input} active={active} lowPower={lowPower} onReady={onReady} onError={onError} />
              </SceneBoundary>
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

        {debug && (
          <p className="absolute top-20 left-2 z-20 max-w-[90%] rounded bg-black/80 px-2 py-1 font-mono text-[10px] text-[#7aa9ff]">
            {debug} · mounted={String(mounted)} · active={String(active)} · ready={String(ready)} · low={String(lowPower)}
            {error ? ` · error=${error}` : ""}
          </p>
        )}

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
