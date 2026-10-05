import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { ArrowIcon, CheckIcon, WhatsAppIcon } from "@/components/ui";
import { businessGuide, homeGuide } from "@/content/guides";
import { benefits } from "@/content/services";
import { site, whatsappUrl } from "@/content/site";

const nodes = [
  { name: "Nuevo Laredo", x: "34%", y: "62%" },
  { name: "Laredo, TX", x: "68%", y: "36%" },
] as const;

function PhotoTile({
  src,
  alt,
  className = "",
  children,
  sizes = "(max-width: 1024px) 100vw, 50vw",
}: {
  src: string;
  alt: string;
  className?: string;
  children: React.ReactNode;
  sizes?: string;
}) {
  return (
    <div className={`tile group stage flex flex-col !rounded-[24px] !border-0 !bg-[#070a10] ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} className="tile-media object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#070a10] via-[#070a10]/75 to-[#070a10]/15" />
      <div className="relative mt-auto flex flex-col p-7 sm:p-9">{children}</div>
    </div>
  );
}

export function Bento() {
  return (
    <section className="relative py-24 md:py-36">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal className="text-center">
          <h2 className="section-title mx-auto max-w-3xl">Todo lo que tu operación necesita, bajo control.</h2>
          <p className="section-lead mx-auto">
            Para la casa o para la empresa, con la misma gente de principio a fin y
            presencia local en ambos lados de la frontera.
          </p>
        </Reveal>

        <div className="mt-16 grid auto-rows-[minmax(0,auto)] gap-4 lg:grid-cols-6">
          {/* IT empresarial */}
          <Reveal className="h-full lg:col-span-4">
            <PhotoTile
              src="/images/services/it-empresarial.jpg"
              alt="Rack de servidores e infraestructura IT empresarial"
              className="min-h-[26rem] lg:min-h-[30rem]"
              sizes="(max-width: 1024px) 100vw, 800px"
            >
              <h3 className="display max-w-lg text-3xl sm:text-4xl">Tu departamento de sistemas, sin contratar personal.</h3>
              <p className="stage-muted mt-3 max-w-md leading-relaxed">
                Mantenimiento preventivo, respaldos y seguridad básica para que tu
                equipo trabaje y no pelee con la tecnología.
              </p>
              <Link href="/soporte-remoto" className="btn btn-ghost-light mt-6 self-start">
                Ver soporte IT empresarial
                <ArrowIcon />
              </Link>
            </PhotoTile>
          </Reveal>

          {/* Respuesta por WhatsApp */}
          <Reveal delay={80} className="h-full lg:col-span-2">
            <div className="tile flex h-full min-h-[22rem] flex-col justify-between !border-transparent !bg-[#e9f9ef] p-7 sm:p-9 dark:!bg-[#0f2418]">
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1fb85a] text-white">
                <WhatsAppIcon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="display text-3xl text-[#0b2a17] dark:text-white">¿Algo dejó de funcionar?</h3>
                <p className="mt-3 leading-relaxed text-[#2f5a40] dark:text-[#a9d8bb]">
                  Escríbenos y un ingeniero te orienta al momento.
                </p>
                <a
                  href={whatsappUrl("Hola ATRIX, necesito soporte técnico cuanto antes.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp mt-6"
                >
                  {site.phoneDisplay}
                </a>
              </div>
            </div>
          </Reveal>

          {/* Hogares */}
          <Reveal className="h-full scroll-mt-24 lg:col-span-3" as="div">
            <div id="hogares" className="tile h-full scroll-mt-24">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src="/images/guides/hogares-tech.jpg"
                  alt="Hogar con WiFi estable y una cámara de seguridad discreta"
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="tile-media object-cover"
                />
              </div>
              <div className="p-7 sm:p-9">
                <p className="text-sm font-semibold text-signal">Para tu casa</p>
                <h3 className="display mt-2 text-2xl sm:text-3xl">{homeGuide.title}</h3>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {homeGuide.items.map((item) => (
                    <li key={item.title} className="flex gap-2.5 text-sm">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span className="font-medium">{item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* Empresas */}
          <Reveal delay={80} className="h-full lg:col-span-3" as="div">
            <div id="empresas" className="tile h-full scroll-mt-24">
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src="/images/guides/empresas-infra.jpg"
                  alt="Oficina con infraestructura de red, monitores y operación"
                  fill
                  sizes="(max-width: 1024px) 100vw, 600px"
                  className="tile-media object-cover"
                />
              </div>
              <div className="p-7 sm:p-9">
                <p className="text-sm font-semibold text-signal">Para tu empresa</p>
                <h3 className="display mt-2 text-2xl sm:text-3xl">{businessGuide.title}</h3>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {businessGuide.items.map((item) => (
                    <li key={item.title} className="flex gap-2.5 text-sm">
                      <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                      <span className="font-medium">{item.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>

          {/* Por qué ATRIX */}
          <Reveal className="h-full lg:col-span-2">
            <div id="beneficios" className="tile h-full scroll-mt-24 p-7 sm:p-9">
              <h3 className="display text-3xl">Por qué ATRIX</h3>
              <ul className="mt-7 space-y-6">
                {benefits.map((b) => (
                  <li key={b.title}>
                    <p className="font-semibold">{b.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{b.copy}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          {/* Cobertura */}
          <Reveal delay={80} className="h-full lg:col-span-4">
            <div id="cobertura" className="scroll-mt-24 h-full">
              <PhotoTile
                src="/images/home/cobertura-frontera.jpg"
                alt="La frontera entre Nuevo Laredo y Laredo al atardecer"
                className="h-full min-h-[26rem]"
                sizes="(max-width: 1024px) 100vw, 800px"
              >
                <div className="pointer-events-none absolute inset-0" aria-hidden>
                  <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <line x1="34" y1="62" x2="68" y2="36" stroke="#7aa9ff" strokeWidth="0.4" strokeDasharray="1.2 1.2" vectorEffect="non-scaling-stroke" className="coverage-link" />
                  </svg>
                  {nodes.map((n) => (
                    <span key={n.name} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: n.x, top: n.y }}>
                      <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                        <span className="coverage-ping absolute inset-0 rounded-full border border-[#7aa9ff]" />
                        <span className="h-2 w-2 rounded-full bg-[#7aa9ff]" />
                      </span>
                      <span className="absolute top-5 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-white backdrop-blur">
                        {n.name}
                      </span>
                    </span>
                  ))}
                </div>
                <h3 className="display relative max-w-lg text-3xl sm:text-4xl">Presencia local en ambos lados de la frontera.</h3>
                <p className="stage-muted relative mt-3 max-w-md leading-relaxed">
                  Visitas a domicilio y negocio en Nuevo Laredo, soporte y proyectos en
                  Laredo, TX, con seguimiento hasta dejar todo estable.
                </p>
              </PhotoTile>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
