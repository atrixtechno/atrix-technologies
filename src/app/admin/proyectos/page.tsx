import type { Metadata } from "next";
import { AdminProjectsPanel } from "@/components/admin/AdminProjectsPanel";

export const metadata: Metadata = {
  title: "Proyecto",
  alternates: { canonical: "/admin/proyectos" },
};

export default function AdminProyectosPage() {
  return <AdminProjectsPanel />;
}
