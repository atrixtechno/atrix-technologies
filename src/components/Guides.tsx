import { Reveal } from "@/components/Reveal";
import { SectionMedia } from "@/components/SectionMedia";
import { businessGuide, homeGuide } from "@/content/guides";

function GuideBlock({
  id,
  eyebrow,
  title,
  intro,
  items,
  image,
  imageAlt,
  tone = "accent",
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  items: { title: string; copy: string }[];
  image: string;
  imageAlt: string;
  tone?: "accent" | "signal";
}) {
  const color = tone === "signal" ? "text-signal" : "text-accent";
  const ghost = tone === "signal" ? "text-signal/25" : "text-accent/25";
  const line = tone === "signal" ? "bg-signal/50" : "bg-accent/50";

  return (
    <section id={id} className="scroll-mt-10 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid items-start gap-8 lg:grid-cols-[1fr_0.95fr] lg:gap-12">
          <Reveal>
            <p className={`text-xs font-semibold tracking-[0.28em] uppercase ${color}`}>
              {eyebrow}
            </p>
            <h2 className="font-display mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
              {title}
            </h2>
            <div className={`animate-line mt-4 h-px w-24 ${line}`} />
            <p className="mt-4 max-w-2xl text-muted">{intro}</p>
          </Reveal>
          <Reveal delay={90}>
            <SectionMedia
              src={image}
              alt={imageAlt}
              aspect="aspect-[16/10]"
              sizes="(max-width: 1024px) 100vw, 48vw"
            />
          </Reveal>
        </div>
        <ol className="mt-12 grid gap-8 sm:grid-cols-2">
          {items.map((item, index) => (
            <Reveal key={item.title} delay={index * 80}>
              <li className="transition hover:translate-x-1">
                <span className={`font-display text-4xl font-extrabold ${ghost}`}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display mt-2 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.copy}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function AudienceGuides() {
  return (
    <div className="border-t border-line">
      <div className="bg-bg-elevated/60">
        <GuideBlock
          id="hogares"
          eyebrow={homeGuide.eyebrow}
          title={homeGuide.title}
          intro={homeGuide.intro}
          items={homeGuide.items}
          image="/images/guides/hogares-tech.jpg"
          imageAlt="Tecnología para el hogar: WiFi estable y seguridad discreta"
        />
      </div>
      <div className="border-t border-line">
        <GuideBlock
          id="empresas"
          eyebrow={businessGuide.eyebrow}
          title={businessGuide.title}
          intro={businessGuide.intro}
          items={businessGuide.items}
          image="/images/guides/empresas-infra.jpg"
          imageAlt="Infraestructura IT empresarial: redes, monitores y operación"
          tone="signal"
        />
      </div>
    </div>
  );
}
