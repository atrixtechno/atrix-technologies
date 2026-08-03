import { businessGuide, homeGuide } from "@/content/guides";

function GuideBlock({
  id,
  eyebrow,
  title,
  intro,
  items,
  tone = "accent",
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  items: { title: string; copy: string }[];
  tone?: "accent" | "signal";
}) {
  const color = tone === "signal" ? "text-signal" : "text-accent";
  const ghost = tone === "signal" ? "text-signal/25" : "text-accent/25";

  return (
    <section id={id} className="scroll-mt-10 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p className={`text-xs font-semibold tracking-[0.28em] uppercase ${color}`}>
          {eyebrow}
        </p>
        <h2 className="font-display mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
          {title}
        </h2>
        <p className="mt-4 max-w-2xl text-muted">{intro}</p>
        <ol className="mt-12 grid gap-8 sm:grid-cols-2">
          {items.map((item, index) => (
            <li key={item.title}>
              <span className={`font-display text-4xl font-extrabold ${ghost}`}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display mt-2 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function AudienceGuides() {
  return (
    <div className="border-t border-line">
      <div className="bg-[linear-gradient(180deg,rgba(10,21,34,0.95),rgba(3,9,18,0.35))]">
        <GuideBlock
          id="hogares"
          eyebrow={homeGuide.eyebrow}
          title={homeGuide.title}
          intro={homeGuide.intro}
          items={homeGuide.items}
        />
      </div>
      <div className="border-t border-line">
        <GuideBlock
          id="empresas"
          eyebrow={businessGuide.eyebrow}
          title={businessGuide.title}
          intro={businessGuide.intro}
          items={businessGuide.items}
          tone="signal"
        />
      </div>
    </div>
  );
}
