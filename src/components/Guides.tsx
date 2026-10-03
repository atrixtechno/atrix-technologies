import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { CheckIcon, SectionHeading } from "@/components/ui";
import { businessGuide, homeGuide } from "@/content/guides";

type Guide = typeof homeGuide;

function GuideCard({
  id,
  guide,
  image,
  imageAlt,
  tag,
}: {
  id: string;
  guide: Guide;
  image: string;
  imageAlt: string;
  tag: string;
}) {
  return (
    <article id={id} className="card-glow group flex h-full scroll-mt-28 flex-col overflow-hidden">
      <div className="relative aspect-[16/8] overflow-hidden">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-elevated via-bg-elevated/40 to-transparent" />
        <span className="chip chip-dark absolute top-4 left-4">{tag}</span>
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <p className="eyebrow">{guide.eyebrow}</p>
        <h3 className="font-display mt-4 text-2xl font-semibold tracking-tight text-balance sm:text-[1.7rem]">
          {guide.title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-[15px]">{guide.intro}</p>
        <ul className="mt-7 grid gap-4 border-t border-line pt-7 sm:grid-cols-2">
          {guide.items.map((item) => (
            <li key={item.title} className="flex gap-3">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent">
                <CheckIcon className="h-3.5 w-3.5" />
              </span>
              <div>
                <h4 className="text-sm font-semibold">{item.title}</h4>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">{item.copy}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

export function AudienceGuides() {
  return (
    <section className="relative border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            index="04"
            eyebrow="Soluciones por perfil"
            title={
              <>
                Tecnología a la medida de{" "}
                <span className="text-gradient">tu casa o tu empresa</span>
              </>
            }
            lead="Mismo estándar de ingeniería, distinto alcance: elige el camino que se parece a tu día a día."
          />
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          <Reveal className="h-full">
            <GuideCard
              id="hogares"
              guide={homeGuide}
              tag="Hogar · Home office"
              image="/images/guides/hogares-tech.jpg"
              imageAlt="Tecnología para el hogar: WiFi estable y seguridad discreta"
            />
          </Reveal>
          <Reveal delay={100} className="h-full">
            <GuideCard
              id="empresas"
              guide={businessGuide}
              tag="PyME · Corporativo"
              image="/images/guides/empresas-infra.jpg"
              imageAlt="Infraestructura IT empresarial: redes, monitores y operación"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
