import type { Metadata } from "next";
import { AdminDashboardHome } from "@/components/admin/AdminDashboardHome";

export const metadata: Metadata = {
  title: "Dashboard",
  alternates: { canonical: "/admin" },
};

export default function AdminDashboardPage() {
  return <AdminDashboardHome />;
}
