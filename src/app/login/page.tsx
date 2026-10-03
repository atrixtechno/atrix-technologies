import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Acceso",
  description: "Acceso interno ATRIX Technologies.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return (
    <div className="atmosphere relative min-h-screen">
      <Header />
      <main className="relative">
        <div className="relative overflow-hidden">
          <div className="grid-tech pointer-events-none absolute inset-0" />
          <div className="pointer-events-none absolute top-1/3 left-1/2 h-[30rem] w-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--accent)_18%,transparent),transparent)]" />
          <div className="relative mx-auto flex min-h-[86svh] max-w-[1240px] items-center justify-center px-5 pt-32 pb-24 md:px-8">
            <LoginForm />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
