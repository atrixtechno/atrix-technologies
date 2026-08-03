import { businessGuide, developerGuide } from "@/content/guides";

function GuideBlock({
  id,
  eyebrow,
  title,
  intro,
  items,
  tone = "default",
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  items: { title: string; copy: string }[];
  tone?: "default" | "signal";
}) {
  return (
    <section id={id} className="scroll-mt-10 py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <p
          className={`text-xs font-semibold tracking-[0.28em] uppercase ${
            tone === "signal" ? "text-signal" : "text-accent"
          }`}
        >
          {eyebrow}
        </p>
        <h2 className="font-display mt-4 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
          {title}
        </h2>
        <p className="mt-4 max-w-2xl text-muted">{intro}</p>

        <ol className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <li key={item.title} className="relative">
              <span
                className={`font-display text-4xl font-extrabold ${
                  tone === "signal" ? "text-signal/25" : "text-accent/25"
                }`}
              >
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

export function BusinessGuide() {
  return (
    <div className="border-t border-line bg-[linear-gradient(180deg,rgba(10,21,34,0.9),rgba(3,9,18,0.4))]">
      <GuideBlock
        id="negocios"
        eyebrow={businessGuide.eyebrow}
        title={businessGuide.title}
        intro={businessGuide.intro}
        items={businessGuide.items}
      />
    </div>
  );
}

export function DeveloperGuide() {
  return (
    <div className="border-t border-line">
      <GuideBlock
        id="programadores"
        eyebrow={developerGuide.eyebrow}
        title={developerGuide.title}
        intro={developerGuide.intro}
        items={developerGuide.items}
        tone="signal"
      />
    </div>
  );
}
