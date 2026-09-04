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
      <main className="relative z-10">
        <div className="relative overflow-hidden rounded-t-[2rem] bg-bg md:rounded-t-[2.5rem]">
          <div className="grid-tech pointer-events-none absolute inset-0 opacity-50" />
          <div className="relative mx-auto flex min-h-[80svh] max-w-6xl items-center justify-center px-5 py-24 md:px-8 md:py-32">
            <LoginForm />
          </div>
        </div>
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
