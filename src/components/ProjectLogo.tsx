import Image from "next/image";

type Size = "sm" | "md" | "lg" | "xl";

const sizes: Record<Size, { box: string; px: number }> = {
  sm: { box: "h-8 w-8", px: 32 },
  md: { box: "h-12 w-12", px: 48 },
  lg: { box: "h-14 w-14 sm:h-16 sm:w-16", px: 64 },
  xl: { box: "h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28", px: 112 },
};

export function ProjectLogo({
  src,
  name,
  size = "md",
  className = "",
}: {
  src: string;
  name: string;
  size?: Size;
  className?: string;
}) {
  const { box, px } = sizes[size];

  return (
    <span
      className={`project-logo relative inline-flex shrink-0 overflow-hidden rounded-full ${box} ${className}`}
      aria-hidden={false}
    >
      <Image
        src={src}
        alt={`Logo de ${name}`}
        width={px}
        height={px}
        className="h-full w-full object-cover"
        sizes={`${px}px`}
      />
    </span>
  );
}
