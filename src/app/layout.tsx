import type { Metadata } from "next";
import { Sora, Syne } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
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
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
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
    images: [{ url: "/brand/atrix-logo.png", width: 1024, height: 1024 }],
  },
  twitter: {
    card: "summary_large_image",
    title: site.legalName,
    description: site.description,
    images: ["/brand/atrix-logo.png"],
  },
  alternates: {
    canonical: "/",
    languages: { "es-MX": "/" },
  },
};

const themeInitScript = `
(function(){
  try {
    var t = localStorage.getItem('atrix-theme');
    if (t !== 'dark' && t !== 'light') t = 'light';
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${syne.variable} ${sora.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
