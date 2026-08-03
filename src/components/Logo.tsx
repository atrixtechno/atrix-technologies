import Image from "next/image";

type LogoProps = {
  variant?: "full" | "mark" | "full-light" | "mark-light";
  className?: string;
  priority?: boolean;
  size?: number;
};

const assets = {
  // v2: regenerados limpios para dark (rompe cache CDN del asset viejo)
  full: { src: "/brand/atrix-logo-dark-v2.png", w: 1600, h: 1442 },
  "full-light": { src: "/brand/atrix-logo.png", w: 1600, h: 1442 },
  mark: { src: "/brand/atrix-mark-dark-v2.png", w: 512, h: 512 },
  "mark-light": { src: "/brand/atrix-mark.png", w: 512, h: 512 },
} as const;

export function Logo({
  variant = "mark",
  className = "",
  priority = false,
  size,
  fill = false,
}: LogoProps & { fill?: boolean }) {
  const asset = assets[variant];
  const isMark = variant === "mark" || variant === "mark-light";
  const width = size ?? (isMark ? 40 : 280);
  const height = isMark ? width : Math.round((width * asset.h) / asset.w);

  return (
    <Image
      src={asset.src}
      alt="ATRIX Technologies"
      width={width}
      height={height}
      className={`object-contain ${fill ? "h-full w-full" : "h-auto w-auto"} ${className}`}
      style={
        fill
          ? { width: "100%", height: "100%" }
          : isMark
            ? { width, height }
            : { width, height: "auto" }
      }
      priority={priority}
    />
  );
}
