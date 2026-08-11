import Image from "next/image";

type Props = {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  sizes?: string;
  priority?: boolean;
  aspect?: string;
};

/** Full-bleed professional photo frame used across marketing sections. */
export function SectionMedia({
  src,
  alt,
  className = "",
  imgClassName = "object-cover object-center",
  sizes = "(max-width: 1152px) 100vw, 1152px",
  priority = false,
  aspect = "aspect-[16/10]",
}: Props) {
  return (
    <div
      className={`relative overflow-hidden border border-line bg-bg-elevated ${aspect} ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
      <Image
        src={src}
        alt={alt}
        fill
        quality={90}
        priority={priority}
        className={imgClassName}
        sizes={sizes}
      />
    </div>
  );
}
