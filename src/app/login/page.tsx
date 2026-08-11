import type { Metadata } from "next";
import { LoginForm } from "@/components/LoginForm";

export const metadata: Metadata = {
  title: "Acceso",
  description: "Acceso interno ATRIX Technologies.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/login" },
};

export default function LoginPage() {
  return (
    <main className="atmosphere relative min-h-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-tech opacity-40" />
      <div className="relative mx-auto flex min-h-full max-w-6xl items-center justify-center px-5 py-16 md:px-8 md:py-24">
        <LoginForm />
      </div>
    </main>
  );
}
