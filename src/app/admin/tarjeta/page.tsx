import type { Metadata } from "next";
import { AdminCardPanel } from "@/components/admin/AdminCardPanel";

export const metadata: Metadata = {
  title: "Tarjeta presentación",
  alternates: { canonical: "/admin/tarjeta" },
};

export default function AdminTarjetaPage() {
  return <AdminCardPanel />;
}
