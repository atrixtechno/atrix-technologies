import { Marquee } from "@/components/Marquee";
import { Reveal } from "@/components/Reveal";
import { ArrowIcon, CheckIcon, SectionHeading } from "@/components/ui";
import {
  recommendations,
  recommendationsPage,
} from "@/content/recommendations";

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
      className="relative scroll-mt-24 overflow-hidden border-t border-line py-24 md:py-32"
      aria-labelledby="recomendaciones-heading"
    >
      <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
        <Reveal>
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <SectionHeading
              id="recomendaciones-heading"
              index="07"
              eyebrow={recommendationsPage.eyebrow}
              title={
                <>
                  Personas que <span className="text-gradient">confían en nosotros</span>
                </>
              }
              lead={recommendationsPage.lead}
            />
            <dl className="grid shrink-0 grid-cols-2 gap-3">
              <div className="card flex flex-col-reverse px-5 py-4">
                <dd className="stat-value text-gradient text-3xl">100%</dd>
                <dt className="mono mt-2 text-[10px] tracking-[0.14em] text-muted uppercase">
                  {summary.scoreLabel}
                </dt>
              </div>
              <div className="card flex flex-col-reverse px-5 py-4">
                <dd className="stat-value text-3xl">{summary.reviewCount}</dd>
                <dt className="mono mt-2 text-[10px] tracking-[0.14em] text-muted uppercase">
                  Reseñas en Facebook
                </dt>
              </div>
            </dl>
          </div>
        </Reveal>
      </div>

      <div className="relative mt-14">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-bg to-transparent sm:w-24" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-bg to-transparent sm:w-24" />

        <Marquee duration={60} className="py-2">
          {recommendations.map((item) => (
            <article
              key={item.name}
              className="card flex w-[min(85vw,22rem)] shrink-0 flex-col p-6 sm:w-[24rem]"
            >
              <div className="flex items-center justify-between gap-3">
                <QuoteIcon className="h-7 w-7 text-accent/40" />
                <span className="flex gap-0.5 text-amber-400" aria-label="5 estrellas">
                  {"★★★★★"}
                </span>
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-fg/90 md:text-[15px]">
                “{item.excerpt}”
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-line pt-4">
                <span className="font-display inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent/15 text-sm font-semibold text-accent">
                  {item.name.charAt(0)}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{item.name}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-success">
                    <CheckIcon className="h-3.5 w-3.5" />
                    Recomienda ATRIX · Facebook
                  </p>
                </div>
              </div>
            </article>
          ))}
        </Marquee>
      </div>

      <div className="relative mx-auto mt-12 max-w-[1240px] px-5 text-center sm:px-8">
        <a
          href={recommendationsPage.facebookUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline"
        >
          {recommendationsPage.facebookLabel}
          <ArrowIcon />
        </a>
      </div>
    </section>
  );
}
