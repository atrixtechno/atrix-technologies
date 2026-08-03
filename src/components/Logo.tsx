import Image from "next/image";

type LogoProps = {
  variant?: "full" | "mark" | "full-light" | "mark-light";
  className?: string;
  priority?: boolean;
  size?: number;
};

const assets = {
  full: { src: "/brand/atrix-logo-on-dark.png", w: 1538, h: 1600 },
  "full-light": { src: "/brand/atrix-logo.png", w: 1600, h: 1442 },
  mark: { src: "/brand/atrix-mark-on-dark.png", w: 512, h: 512 },
  "mark-light": { src: "/brand/atrix-mark.png", w: 512, h: 512 },
} as const;

export function Logo({
  variant = "mark",
  className = "",
  priority = false,
  size,
}: LogoProps) {
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
      className={`h-auto w-auto object-contain ${className}`}
      style={isMark ? { width, height } : { width, height: "auto" }}
      priority={priority}
    />
  );
}
