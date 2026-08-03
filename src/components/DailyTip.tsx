import { getDailyTip } from "@/content/tips";

export function DailyTip() {
  const tip = getDailyTip();

  return (
    <section
      id="consejo"
      className="scroll-mt-10 border-y border-line bg-bg-elevated/60 py-16 md:py-20"
      aria-labelledby="daily-tip-title"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.28em] text-accent uppercase">
              Consejo del día
            </p>
            <p className="mt-2 text-sm capitalize text-muted">{tip.label}</p>
            <h2
              id="daily-tip-title"
              className="font-display mt-4 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl"
            >
              {tip.title}
            </h2>
          </div>
          <span className="inline-flex w-fit rounded-full border border-line px-3 py-1 text-[11px] font-semibold tracking-[0.16em] text-signal uppercase">
            {tip.audience}
          </span>
        </div>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-muted md:text-lg">
          {tip.copy}
        </p>
      </div>
    </section>
  );
}
