export function PageDecor() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="animate-orb absolute -left-24 top-24 h-72 w-72 rounded-full bg-signal/10 blur-3xl" />
      <div className="animate-orb-delayed absolute -right-20 top-[40%] h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
      <div className="animate-orb absolute bottom-10 left-1/3 h-64 w-64 rounded-full bg-signal/5 blur-3xl" />
      <div className="scanline absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
    </div>
  );
}
