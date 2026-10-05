import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ConsentGatedAnalytics } from "@/components/ConsentGatedAnalytics";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { HashGuard } from "@/components/HashGuard";
import { ScrollReset } from "@/components/ScrollReset";
import { ThemeProvider } from "@/components/ThemeProvider";
import { site } from "@/content/site";
import "./globals.css";

const googleVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim();

const body = Geist({
  variable: "--font-body-face",
  subsets: ["latin"],
});

// Solo para datos: horas, canales, estados y medidas.
const mono = Geist_Mono({
  variable: "--font-mono-face",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.legalName} · Soporte IT, CCTV y software en ${site.city}`,
    template: `%s · ${site.legalName}`,
  },
  description: site.description,
  applicationName: site.legalName,
  authors: [{ name: site.legalName, url: site.url }],
  creator: site.legalName,
  publisher: site.legalName,
  category: "technology",
  keywords: [
    "ATRIX Technologies",
    "soporte técnico Nuevo Laredo",
    "CCTV Laredo TX",
    "redes e infraestructura",
    "desarrollo de software",
    "soporte IT empresarial",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  ...(googleVerification
    ? { verification: { google: googleVerification } }
    : {}),
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    shortcut: "/favicon-32.png",
  },
  openGraph: {
    title: site.legalName,
    description: site.description,
    url: site.url,
    siteName: site.legalName,
    locale: "es_MX",
    type: "website",
    images: [
      {
        url: "https://atrixnld.com/brand/og-atrix-v2.png",
        width: 1200,
        height: 630,
        alt: `${site.legalName} — ${site.motto}`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.legalName,
    description: site.description,
    images: ["https://atrixnld.com/brand/og-atrix-v2.png"],
  },
  alternates: {
    canonical: "/",
    languages: { "es-MX": site.url },
  },
};

export const viewport: Viewport = {
  themeColor: "#050506",
  colorScheme: "light dark",
};

const themeInitScript = `
(function(){
  try {
    var t = localStorage.getItem('atrix-theme');
    if (t !== 'dark' && t !== 'light') t = 'dark';
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
})();
`;

const scrollResetScript = `
(function(){
  try {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    var nav = performance.getEntriesByType('navigation')[0];
    if (nav && nav.type === 'reload') {
      if (location.pathname === '/' && location.hash) {
        history.replaceState(null, '', '/');
      }
      window.scrollTo(0, 0);
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${body.variable} ${mono.variable} h-full`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script dangerouslySetInnerHTML={{ __html: scrollResetScript }} />
      </head>
      <body className="min-h-full antialiased">
        <ThemeProvider>
          <HashGuard />
          <ScrollReset />
          <ConsentGatedAnalytics />
          <CookieConsentBanner />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
