import Image from "next/image";
import Link from "next/link";
import { AndroidLogo, AppleLogo } from "@/components/DeviceFrames";
import { Reveal } from "@/components/Reveal";
import { ArrowIcon } from "@/components/ui";
import { projectKindLabel, projects } from "@/content/projects";

// Un caso de cada tipo primero: sitio web, plataforma con apps, sistema y programas de escritorio.
const FEATURED = ["boombeejobs", "dentalmate", "moes-pos", "contatrix", "grupo-gi-casa-de-cambio", "moneychange"];
const gallery = FEATURED.map((slug) => projects.find((p) => p.slug === slug)).filter((p): p is (typeof projects)[number] => Boolean(p?.previewImage));

function host(url?: string) {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

export function ProjectsTeaser() {
  return (
    <section id="proyectos" className="relative scroll-mt-16 overflow-hidden py-24 md:py-36">
      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="section-title">{projects.length} casos reales, operando hoy.</h2>
              <p className="section-lead">
                Sitios, plataformas con apps, puntos de venta y programas de escritorio
                que venden y administran negocios reales todos los días.
              </p>
            </div>
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
                <span className="chip">Web</span>
                <span className="chip">Windows</span>
              </div>
              <Link href="/proyectos" className="btn btn-primary">
                Ver los {projects.length} proyectos
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </Reveal>

        <ul className="mt-14 grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {gallery.map((project, index) => (
            <Reveal as="li" key={project.slug} delay={(index % 3) * 60}>
              <Link href={`/proyectos/${project.slug}`} className="group block">
                <div className="tile">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {project.previewImage && (
                      <Image
                        src={project.previewImage}
                        alt={project.name}
                        fill
                        quality={90}
                        className="tile-media object-cover object-top"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 420px"
                      />
                    )}
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-[#0b0d12] backdrop-blur">
                      <span className="led" />
                      {host(project.url) ?? projectKindLabel(project.kind)}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="font-display truncate text-lg font-semibold">{project.name}</p>
                    <p className="mt-0.5 truncate text-sm text-muted">
                      {projectKindLabel(project.kind)} · {project.sector}
                    </p>
                  </div>
                  <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-muted transition-colors group-hover:border-accent group-hover:bg-accent group-hover:text-white">
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
