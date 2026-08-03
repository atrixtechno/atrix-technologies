import type { Metadata } from "next";
import { Sora, Syne } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.legalName} · ${site.city}`,
    template: `%s · ${site.legalName}`,
  },
  description: site.description,
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: site.legalName,
    description: site.description,
    url: site.url,
    siteName: site.legalName,
    locale: "es_MX",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${syne.variable} ${sora.variable} h-full`}>
      <body className="min-h-full antialiased">{children}</body>
    </html>
  );
}
