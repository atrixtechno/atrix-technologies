import type { Metadata } from "next";
import { AdminInvoicesPanel } from "@/components/admin/AdminInvoicesPanel";

export const metadata: Metadata = {
  title: "Factura",
  alternates: { canonical: "/admin/facturas" },
};

export default function AdminFacturasPage() {
  return <AdminInvoicesPanel />;
}
