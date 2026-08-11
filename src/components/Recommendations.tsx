import { Reveal } from "@/components/Reveal";
import {
  recommendations,
  recommendationsPage,
} from "@/content/recommendations";
import { site } from "@/content/site";

function QuoteIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M7.2 18c1.9 0 3.3-1.5 3.3-3.4S9.1 11.2 7.2 11.2c-.2 0-.5 0-.7.1.5-1.7 1.9-3.1 4-4.1L9.2 5C5.4 6.6 3 9.6 3 14c0 2.4 1.8 4 4.2 4Zm9.6 0c1.9 0 3.3-1.5 3.3-3.4s-1.4-3.4-3.3-3.4c-.2 0-.5 0-.7.1.5-1.7 1.9-3.1 4-4.1L18.8 5C15 6.6 12.6 9.6 12.6 14c0 2.4 1.8 4 4.2 4Z" />
    </svg>
  );
}

function FacebookMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14C17.174 2.097 15.943 2 14.643 2 11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5Z" />
    </svg>
  );
}

export function Recommendations() {
  const { summary } = recommendationsPage;

  return (
    <section
      id="recomendaciones"
      className="relative scroll-mt-10 border-t border-line py-24 md:py-28"
      aria-labelledby="recomendaciones-heading"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="animate-orb absolute -right-16 top-10 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
        <div className="animate-orb-delayed absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-signal/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid items-end gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">
              {recommendationsPage.eyebrow}
            </p>
            <h2
              id="recomendaciones-heading"
              className="font-display mt-4 max-w-2xl text-3xl font-bold tracking-tight md:text-5xl"
            >
              {recommendationsPage.title}
            </h2>
            <div className="animate-line mt-4 h-px w-24 bg-accent/50" />
            <p className="mt-4 max-w-xl text-muted">{recommendationsPage.lead}</p>
          </Reveal>

          <Reveal delay={80}>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="border border-line bg-bg-elevated/60 px-4 py-5 sm:px-5">
                <p className="font-display text-2xl font-extrabold tracking-tight text-accent sm:text-3xl">
                  100%
                </p>
                <p className="mt-1 text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                  {summary.scoreLabel.replace("100% ", "")}
                </p>
              </div>
              <div className="border border-line bg-bg-elevated/60 px-4 py-5 sm:px-5">
                <p className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {summary.reviewCount}
                </p>
                <p className="mt-1 text-xs font-semibold tracking-[0.14em] text-muted uppercase">
                  Reseñas en Facebook
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <ul className="mt-12 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((item, index) => (
            <Reveal key={`${item.name}-${index}`} delay={index * 70}>
              <li className="flex h-full flex-col border border-line bg-bg-elevated/45 p-5 transition hover:border-accent/35 sm:p-6">
                <QuoteIcon className="h-7 w-7 text-accent/35" />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-fg md:text-[15px]">
                  “{item.excerpt}”
                </p>
                <div className="mt-6 border-t border-line pt-4">
                  <p className="font-display text-base font-semibold">{item.name}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-signal">
                    <span aria-hidden>✓</span>
                    Recomienda ATRIX · {item.source}
                  </p>
                </div>
              </li>
            </Reveal>
          ))}

          <Reveal delay={recommendations.length * 70}>
            <li className="flex h-full flex-col justify-between border border-dashed border-line bg-bg/40 p-5 sm:p-6">
              <div>
                <div className="inline-flex h-10 w-10 items-center justify-center border border-line bg-bg-elevated text-[#1877F2]">
                  <FacebookMark className="h-5 w-5" />
                </div>
                <h3 className="font-display mt-4 text-lg font-semibold">
                  Más opiniones en Facebook
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  Lee las {summary.reviewCount} recomendaciones públicas de{" "}
                  {site.name} y deja la tuya si ya trabajaste con nosotros.
                </p>
              </div>
              <a
                href={recommendationsPage.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary mt-6 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold"
              >
                {recommendationsPage.facebookLabel}
              </a>
            </li>
          </Reveal>
        </ul>
      </div>
    </section>
  );
}
