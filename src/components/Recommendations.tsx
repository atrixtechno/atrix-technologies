import { Marquee } from "@/components/Marquee";
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

export function Recommendations() {
  const { summary } = recommendationsPage;

  return (
    <section
      id="recomendaciones"
      className="relative scroll-mt-10 overflow-hidden border-t border-line py-20 md:py-28"
      aria-labelledby="recomendaciones-heading"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="animate-orb absolute -right-16 top-10 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
        <div className="animate-orb-delayed absolute -left-10 bottom-0 h-48 w-48 rounded-full bg-signal/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        <Reveal>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">
                Recomendaciones
              </p>
              <h2
                id="recomendaciones-heading"
                className="font-display mt-4 text-3xl font-bold tracking-tight md:text-5xl"
              >
                {recommendationsPage.title}
              </h2>
              <div className="animate-line mt-4 h-px w-24 bg-accent/50" />
              <p className="mt-4 text-muted">{recommendationsPage.lead}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="border border-line bg-bg-elevated/60 px-4 py-3">
                <p className="font-display text-xl font-extrabold text-accent tabular-nums">
                  100%
                </p>
                <p className="text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">
                  {summary.scoreLabel}
                </p>
              </div>
              <div className="border border-line bg-bg-elevated/60 px-4 py-3">
                <p className="font-display text-xl font-extrabold tabular-nums">
                  {summary.reviewCount}
                </p>
                <p className="text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">
                  En Facebook
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      <div className="relative mt-10 md:mt-14">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-bg to-transparent sm:w-16 md:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-bg to-transparent sm:w-16 md:w-24" />

        <Marquee duration={55} className="py-1">
          {recommendations.map((item) => (
            <article
              key={item.name}
              className="flex w-[min(85vw,22rem)] shrink-0 flex-col border border-line bg-bg-elevated/55 p-5 sm:w-[24rem] sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <QuoteIcon className="h-7 w-7 shrink-0 text-accent/35" />
                <span className="rounded-full border border-line px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">
                  Facebook
                </span>
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-fg md:text-[15px]">
                “{item.excerpt}”
              </p>
              <div className="mt-5 border-t border-line pt-4">
                <p className="font-display text-base font-semibold">{item.name}</p>
                <p className="mt-1 text-xs font-medium text-signal">
                  ✓ Recomienda ATRIX · Facebook
                </p>
              </div>
            </article>
          ))}
        </Marquee>
      </div>

      <div className="relative mx-auto mt-10 max-w-6xl px-5 text-center md:px-8">
        <a
          href={recommendationsPage.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-line px-6 py-3 text-sm font-semibold text-fg transition hover:border-accent/40 hover:bg-bg-elevated"
        >
          {recommendationsPage.facebookLabel} · {site.name}
        </a>
      </div>
    </section>
  );
}
