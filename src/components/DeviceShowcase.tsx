"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { AndroidLogo, AppleLogo } from "@/components/DeviceFrames";
import "@/app/devices-3d.css";

const CANVAS_W = 1100;
const CANVAS_H = 720;

const laptopScreens = [
  { src: "/projects/devices/laptop-web.jpg", url: "moes.market" },
  { src: "/projects/dentalmate-preview.jpg", url: "dentalmate.mx" },
  { src: "/projects/grupo-gi-preview.jpg", url: "grupo-gi.com" },
  { src: "/projects/jonal-parfum-preview.jpg", url: "jonalparfum.com" },
  { src: "/projects/dojangspace-preview.jpg", url: "dojangspace.com" },
] as const;

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="5" y="11" width="14" height="9" rx="2" stroke="currentColor" strokeWidth="2.4" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  );
}

/** Capas apiladas que dan grosor real al cuerpo del teléfono. */
function PhoneBody({ layers = 4 }: { layers?: number }) {
  return (
    <>
      {Array.from({ length: layers }, (_, i) => (
        <div
          key={i}
          className="ds-phone-layer"
          style={{ transform: `translateZ(${-(i * 3) - 0.5}px)` }}
        />
      ))}
    </>
  );
}

export function DeviceShowcase() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);
  const [inView, setInView] = useState(false);

  // Escala el lienzo fijo al ancho disponible.
  useEffect(() => {
    const viewport = viewportRef.current;
    const canvas = canvasRef.current;
    if (!viewport || !canvas) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry.contentRect.width;
      // En móvil se recorta un poco el margen lateral para que la laptop se vea más grande.
      const scale = Math.min(1, w / (w < 640 ? CANVAS_W * 0.9 : CANVAS_W));
      canvas.style.transform = `translateX(-50%) scale(${scale})`;
      viewport.style.height = `${CANVAS_H * scale}px`;
    });
    ro.observe(viewport);
    return () => ro.disconnect();
  }, []);

  // Sin bucle continuo: el balanceo es una animación CSS (corre en el compositor)
  // y la inclinación con el mouse solo se calcula cuando el puntero se mueve.
  useEffect(() => {
    const viewport = viewportRef.current;
    const tilt = tiltRef.current;
    if (!viewport || !tilt) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) viewport.classList.add("is-open");
      },
      { threshold: 0.15 },
    );
    io.observe(viewport);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reduced || !finePointer) return () => io.disconnect();

    let raf = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      raf = 0;
      tilt.style.transform = `rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg)`;
    };
    const onMove = (e: PointerEvent) => {
      const r = viewport.getBoundingClientRect();
      x = ((e.clientX - r.left) / r.width) * 2 - 1;
      y = ((e.clientY - r.top) / r.height) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      x = 0;
      y = 0;
      if (!raf) raf = requestAnimationFrame(apply);
    };
    viewport.addEventListener("pointermove", onMove);
    viewport.addEventListener("pointerleave", onLeave);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      viewport.removeEventListener("pointermove", onMove);
      viewport.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // Pantallas rotativas, solo mientras la escena está a la vista.
  useEffect(() => {
    if (!inView) return;
    const id = window.setInterval(() => {
      setSlide((s) => (s + 1) % laptopScreens.length);
    }, 4200);
    return () => window.clearInterval(id);
  }, [inView]);

  return (
    <div>
      <div
        ref={viewportRef}
        className={`ds-viewport ${inView ? "in-view" : ""}`}
        style={{ height: CANVAS_H }}
        role="img"
        aria-label="Plataformas ATRIX en laptop, iPhone y Android"
      >
        <div ref={canvasRef} className="ds-canvas" style={{ transform: "translateX(-50%)" }}>
          <div ref={tiltRef} className="ds-tilt">
          <div className="ds-scene">
            <div className="ds-floor-glow" aria-hidden />

            {/* Laptop */}
            <div className="ds-abs ds-laptop">
              <div className="ds-lid">
                <div className="ds-lid-front">
                  <span className="ds-notch" />
                  <div className="ds-screen">
                    <div className="ds-browser-bar">
                      <i />
                      <i />
                      <i />
                      <span className="ds-url">
                        <LockIcon />
                        {laptopScreens[slide].url}
                      </span>
                    </div>
                    {laptopScreens.map((screen, i) => (
                      <div key={screen.src} className={`ds-slide ${i === slide ? "is-active" : ""}`}>
                        <Image
                          src={screen.src}
                          alt=""
                          fill
                          quality={90}
                          sizes="620px"
                          priority={i === 0}
                        />
                      </div>
                    ))}
                    <div className="ds-glare" />
                  </div>
                </div>
                <div className="ds-lid-back">
                  <Image src="/brand/atrix-mark-on-dark-v5.png" alt="" width={76} height={76} unoptimized />
                </div>
                <div className="ds-lid-edge" />
              </div>

              <div className="ds-base">
                <div className="ds-base-shadow" />
                <div className="ds-hinge" />
                <div className="ds-keyboard" />
                <div className="ds-trackpad" />
                <div className="ds-base-front" />
              </div>
            </div>

            {/* iPhone */}
            <div
              className="ds-abs"
              style={{ left: 10, top: 20, transform: "translateZ(110px) rotateY(24deg)" }}
            >
              <div className="ds-float">
                <div
                  className="ds-phone"
                  style={
                    {
                      "--frame": "#8f939b",
                      "--rim": "#c9ccd2",
                      "--back": "linear-gradient(160deg, #b9bcc3, #8a8e96 55%, #6f737b)",
                    } as CSSProperties
                  }
                >
                  <PhoneBody />
                  <span className="ds-btn" style={{ left: -4, top: 96, height: 28 }} />
                  <span className="ds-btn" style={{ left: -4, top: 136, height: 48 }} />
                  <span className="ds-btn" style={{ right: -4, top: 120, height: 64 }} />
                  <div className="ds-phone-back">
                    <div className="ds-camera">
                      <i />
                      <i />
                      <i />
                    </div>
                  </div>
                  <div className="ds-phone-front">
                    <div className="ds-phone-screen">
                      <span className="ds-island" />
                      <Image src="/projects/devices/phone-ios.jpg" alt="" fill quality={90} sizes="200px" />
                      <div className="ds-toast is-late" style={{ "--toast": "#1a6bff" } as CSSProperties}>
                        <span className="ds-toast-icon">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                            <rect x="4" y="5" width="16" height="15" rx="2" />
                            <path d="M8 3v4M16 3v4M4 10h16" />
                          </svg>
                        </span>
                        <span>
                          <b>Cita confirmada</b>
                          <span>DentalMate · hoy 4:30 pm</span>
                        </span>
                      </div>
                      <div className="ds-glare" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Android */}
            <div
              className="ds-abs"
              style={{ left: 875, top: 30, transform: "translateZ(130px) rotateY(-26deg)" }}
            >
              <div className="ds-float is-late">
                <div
                  className="ds-phone"
                  style={
                    {
                      "--frame": "#1c2230",
                      "--rim": "#3c4555",
                      "--back": "linear-gradient(160deg, #23324d, #121a2a 60%, #0b111c)",
                    } as CSSProperties
                  }
                >
                  <PhoneBody />
                  <span className="ds-btn" style={{ right: -4, top: 110, height: 56 }} />
                  <span className="ds-btn" style={{ right: -4, top: 182, height: 30 }} />
                  <div className="ds-phone-back">
                    <div className="ds-camera !h-[60px] !w-[150px] !rounded-[18px]">
                      <i style={{ top: 13, left: 12 }} />
                      <i style={{ top: 13, left: 58 }} />
                      <i style={{ top: 13, left: 104 }} />
                    </div>
                  </div>
                  <div className="ds-phone-front">
                    <div className="ds-phone-screen">
                      <span className="ds-punch" />
                      <Image src="/projects/devices/phone-android.jpg" alt="" fill quality={90} sizes="200px" />
                      <div className="ds-toast" style={{ "--toast": "#16a34a" } as CSSProperties}>
                        <span className="ds-toast-icon">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
                            <path d="M5 12.5l4.2 4.2L19 7" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        <span>
                          <b>Orden #0259 cobrada</b>
                          <span>MOE&apos;S POS · $234.32</span>
                        </span>
                      </div>
                      <div className="ds-glare" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjetas flotantes en profundidad */}
            <div className="ds-abs ds-hide-sm" style={{ left: 620, top: 40, transform: "translateZ(90px)" }}>
              <div className="ds-float is-late">
                <div className="ds-card">
                  <div className="ds-bars" aria-hidden>
                    <i style={{ height: "40%" }} />
                    <i style={{ height: "65%" }} />
                    <i style={{ height: "50%" }} />
                    <i style={{ height: "85%" }} />
                    <i style={{ height: "100%" }} />
                  </div>
                  <div>
                    <b>Lighthouse 98</b>
                    <span>Uptime 99.9% · SEO local</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="ds-abs ds-hide-sm" style={{ left: 130, top: 430, transform: "translateZ(500px)" }}>
              <div className="ds-float">
                <div className="ds-card">
                  <span className="ds-card-icon bg-[#1a6bff]/20 text-[#7fb0ff]">
                    <AppleLogo className="h-4 w-4" />
                  </span>
                  <div>
                    <b>App iOS publicada</b>
                    <span>App Store · DentalMate</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="ds-abs ds-hide-sm" style={{ left: 740, top: 450, transform: "translateZ(500px)" }}>
              <div className="ds-float">
                <div className="ds-card">
                  <span className="ds-card-icon bg-[#3ddc84]/15 text-[#3ddc84]">
                    <AndroidLogo className="h-[18px] w-[18px]" />
                  </span>
                  <div>
                    <b>APK en producción</b>
                    <span>Android · MOE&apos;S POS</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      <div className="ds-legend mt-6">
        <span className="chip">
          <span className="live-dot" aria-hidden />
          En vivo: {laptopScreens[slide].url}
        </span>
        <span className="chip">
          <AppleLogo className="h-3.5 w-3.5" />
          iOS
        </span>
        <span className="chip">
          <AndroidLogo className="h-3.5 w-3.5 text-[#3ddc84]" />
          Android
        </span>
      </div>
    </div>
  );
}
