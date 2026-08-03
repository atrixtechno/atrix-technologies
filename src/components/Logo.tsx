import Image from "next/image";

type LogoProps = {
  variant?: "full" | "mark" | "full-light";
  className?: string;
  priority?: boolean;
  size?: number;
};

const assets = {
  full: { src: "/brand/atrix-logo-on-dark.png", w: 480, h: 480 },
  "full-light": { src: "/brand/atrix-logo.png", w: 480, h: 480 },
  mark: { src: "/brand/atrix-mark-on-dark.png", w: 160, h: 160 },
} as const;

export function Logo({
  variant = "mark",
  className = "",
  priority = false,
  size,
}: LogoProps) {
  const asset = assets[variant];
  const width = size ?? (variant === "mark" ? 40 : 280);
  const height =
    variant === "mark" ? width : Math.round((width * asset.h) / asset.w);

  return (
    <Image
      src={asset.src}
      alt="ATRIX Technologies"
      width={width}
      height={height}
      className={`h-auto w-auto object-contain ${className}`}
      style={variant === "mark" ? { width, height } : { width, height: "auto" }}
      priority={priority}
    />
  );
}
