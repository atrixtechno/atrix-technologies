import Image from "next/image";
import Link from "next/link";
import { AndroidLogo, AppleLogo } from "@/components/DeviceFrames";
import { DeviceShowcase } from "@/components/DeviceShowcase";
import { Reveal } from "@/components/Reveal";
import { ArrowIcon, SectionHeading } from "@/components/ui";
import { projectKindLabel, projects } from "@/content/projects";

const gallery = projects.filter((p) => p.previewImage).slice(0, 6);

export function ProjectsTeaser() {
  return (
    <section
      id="proyectos"
      className="relative scroll-mt-24 overflow-hidden border-t border-line py-24 md:py-32"
    >
      <div className="pointer-events-none absolute top-1/3 left-1/2 h-[36rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--accent)_14%,transparent),transparent)]" aria-hidden />

      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              index="05"
              eyebrow="Plataformas digitales"
              title={
                <>
                  Software en producción: <span className="text-gradient">web, iOS y Android</span>
                </>
              }
              lead="Sitios, paneles, apps e integraciones operativas. Plataformas completas que venden y administran negocios reales — no solo páginas."
            />
            <div className="flex shrink-0 flex-col items-start gap-4 lg:items-end">
              <div className="flex flex-wrap gap-2">
                <span className="chip">
                  <AppleLogo className="h-3.5 w-3.5" />
                  iOS
                </span>
                <span className="chip">
                  <AndroidLogo className="h-3.5 w-3.5 text-[#3ddc84]" />
                  Android
                </span>
                <span className="chip">Web · Cloud</span>
              </div>
              <Link href="/proyectos" className="btn btn-primary">
                Ver portafolio completo
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </Reveal>

        {/* Escenario 3D de dispositivos */}
        <Reveal delay={60}>
          <div className="relative mt-10 md:mt-14">
            <DeviceShowcase />
          </div>
        </Reveal>

        <ul className="mt-20 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((project, index) => (
            <Reveal as="li" key={project.slug} delay={(index % 3) * 70}>
              <Link
                href={`/proyectos/${project.slug}`}
                className="card-glow group block overflow-hidden"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {project.previewImage && (
                    <Image
                      src={project.previewImage}
                      alt={project.name}
                      fill
                      quality={90}
                      className="object-cover object-top transition duration-700 group-hover:scale-[1.05]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <span className="mono absolute top-3 left-3 rounded-md border border-white/15 bg-black/45 px-2 py-1 text-[10px] tracking-[0.12em] text-white/85 uppercase backdrop-blur">
                    {projectKindLabel(project.kind)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 p-5">
                  <div className="min-w-0">
                    <p className="font-display truncate text-lg font-semibold">{project.name}</p>
                    <p className="mt-0.5 truncate text-sm text-muted">{project.sector}</p>
                  </div>
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-muted transition group-hover:border-accent group-hover:bg-accent group-hover:text-white">
                    <ArrowIcon className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
