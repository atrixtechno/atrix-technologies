"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

type Props = Omit<ComponentProps<typeof Link>, "href"> & {
  hash: string;
};

function cleanHash(hash: string) {
  return hash.replace(/^#+/, "").split("#")[0] ?? "";
}

export function SectionLink({ hash, onClick, children, ...props }: Props) {
  const pathname = usePathname();
  const id = cleanHash(hash);
  const href = `/#${id}`;

  function goToSection(e: MouseEvent<HTMLAnchorElement>) {
    onClick?.(e);
    if (e.defaultPrevented) return;
    e.preventDefault();

    if (pathname === "/") {
      window.history.replaceState(null, "", href);
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Navegación completa para evitar hashes acumulados por el router de Next.
    window.location.assign(href);
  }

  return (
    <Link href={href} scroll={false} onClick={goToSection} {...props}>
      {children}
    </Link>
  );
}
