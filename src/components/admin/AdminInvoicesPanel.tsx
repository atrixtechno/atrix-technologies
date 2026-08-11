"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-session";
import {
  DEFAULT_INVOICE_TERMS,
  PAYMENT_METHODS,
} from "@/lib/invoice-defaults";
import { Field } from "@/components/admin/AdminFormFields";

type InvoiceForm = {
  clientName: string;
  projectName: string;
  startDate: string;
  endDate: string;
  engineers: string[];
  paymentMethod: string;
  terms: string;
  notes: string;
};

const emptyForm = (): InvoiceForm => ({
  clientName: "",
  projectName: "",
  startDate: "",
  endDate: "",
  engineers: [""],
  paymentMethod: "Transferencia bancaria",
  terms: DEFAULT_INVOICE_TERMS,
  notes: "",
});

export function AdminInvoicesPanel() {
  const [form, setForm] = useState<InvoiceForm>(emptyForm);
  const [setupNote, setSetupNote] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<
    { id: string; clientName: string; projectName: string; createdAt: string }[]
  >([]);
  const [saving, setSaving] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/invoices", {
        credentials: "same-origin",
      });
      const data = await res.json();
      setSetupNote(data.setupNote ?? null);
      setDrafts(
        (data.invoices ?? []).map(
          (inv: {
            id: string;
            clientName: string;
            projectName: string;
            createdAt: string;
          }) => ({
            id: inv.id,
            clientName: inv.clientName,
            projectName: inv.projectName,
            createdAt: inv.createdAt,
          }),
        ),
      );
    } catch {
      setSetupNote("No se pudieron cargar borradores (PDF sigue disponible).");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function setEngineer(index: number, value: string) {
    setForm((f) => {
      const engineers = [...f.engineers];
      engineers[index] = value;
      return { ...f, engineers };
    });
  }

  function addEngineer() {
    setForm((f) => ({ ...f, engineers: [...f.engineers, ""] }));
  }

  function removeEngineer(index: number) {
    setForm((f) => ({
      ...f,
      engineers: f.engineers.filter((_, i) => i !== index),
    }));
  }

  async function saveDraft() {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await adminFetch("/api/admin/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: form.clientName,
          projectName: form.projectName,
          startDate: form.startDate || null,
          endDate: form.endDate || null,
          engineers: form.engineers.filter((e) => e.trim()),
          paymentMethod: form.paymentMethod,
          terms: form.terms,
          notes: form.notes || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo guardar");
      setMessage("Borrador guardado en Supabase.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al guardar borrador");
    } finally {
      setSaving(false);
    }
  }

  async function downloadPdf() {
    if (!form.clientName.trim() || !form.projectName.trim()) {
      setError("Indica al menos cliente y proyecto para el PDF.");
      return;
    }
    setPdfBusy(true);
    setError(null);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF({ unit: "pt", format: "letter" });
      const pageW = doc.internal.pageSize.getWidth();
      const margin = 48;
      let y = margin;

      try {
        const logoRes = await fetch("/brand/atrix-logo.png");
        const blob = await logoRes.blob();
        const dataUrl = await blobToDataUrl(blob);
        doc.addImage(dataUrl, "PNG", margin, y, 110, 36);
      } catch {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.text("ATRIX Technologies", margin, y + 20);
      }

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100);
      doc.text("Nuevo Laredo, Tamaulipas · Laredo, TX", pageW - margin, y + 14, {
        align: "right",
      });
      doc.text("atrixnld.com", pageW - margin, y + 28, { align: "right" });
      y += 56;

      doc.setDrawColor(196, 163, 90);
      doc.setLineWidth(1.5);
      doc.line(margin, y, pageW - margin, y);
      y += 28;

      doc.setTextColor(20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Comprobante de servicio", margin, y);
      y += 28;

      doc.setFontSize(11);
      const rows: [string, string][] = [
        ["Cliente", form.clientName],
        ["Proyecto", form.projectName],
        ["Inicio", form.startDate || "—"],
        ["Finalización", form.endDate || "—"],
        [
          "Ingeniero(s)",
          form.engineers.filter((e) => e.trim()).join(", ") || "—",
        ],
        ["Forma de pago", form.paymentMethod || "—"],
      ];

      for (const [label, value] of rows) {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(90);
        doc.text(`${label}:`, margin, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(20);
        const lines = doc.splitTextToSize(value, pageW - margin - 160);
        doc.text(lines, margin + 120, y);
        y += Math.max(18, lines.length * 14);
      }

      if (form.notes.trim()) {
        y += 8;
        doc.setFont("helvetica", "bold");
        doc.setTextColor(90);
        doc.text("Notas:", margin, y);
        y += 14;
        doc.setFont("helvetica", "normal");
        doc.setTextColor(20);
        const noteLines = doc.splitTextToSize(
          form.notes,
          pageW - margin * 2,
        );
        doc.text(noteLines, margin, y);
        y += noteLines.length * 12 + 12;
      }

      y += 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(20);
      doc.text("Términos y condiciones", margin, y);
      y += 16;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(40);
      const termLines = doc.splitTextToSize(
        form.terms,
        pageW - margin * 2,
      );
      for (const line of termLines) {
        if (y > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += 11;
      }

      const stamp = new Date().toISOString().slice(0, 10);
      const filename = `ATRIX-comprobante-${slug(form.clientName)}-${stamp}.pdf`;
      doc.save(filename);
      setMessage(`PDF descargado: ${filename}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al generar PDF");
    } finally {
      setPdfBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
          3. Factura
        </p>
        <h1 className="font-display mt-2 text-3xl font-semibold tracking-tight text-fg md:text-4xl">
          Comprobante de servicio
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
          Genera un PDF profesional con datos del cliente, proyecto, ingenieros,
          forma de pago y términos ATRIX. Opcionalmente guarda borradores en
          Supabase.
        </p>
      </header>

      {setupNote && (
        <div className="border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-fg">
          {setupNote}
        </div>
      )}
      {error && (
        <div className="border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm">
          {error}
        </div>
      )}
      {message && (
        <div className="border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm">
          {message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <form
          className="space-y-5 border border-line bg-bg-elevated/70 p-4 backdrop-blur md:p-6"
          onSubmit={(e) => {
            e.preventDefault();
            void downloadPdf();
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="client"
              label="Nombre del cliente"
              value={form.clientName}
              onChange={(v) => setForm((f) => ({ ...f, clientName: v }))}
            />
            <Field
              id="project"
              label="Nombre del proyecto"
              value={form.projectName}
              onChange={(v) => setForm((f) => ({ ...f, projectName: v }))}
            />
            <Field
              id="start"
              label="Fecha de comienzo"
              value={form.startDate}
              onChange={(v) => setForm((f) => ({ ...f, startDate: v }))}
              type="date"
            />
            <Field
              id="end"
              label="Fecha de finalización"
              value={form.endDate}
              onChange={(v) => setForm((f) => ({ ...f, endDate: v }))}
              type="date"
            />
          </div>

          <div>
            <p className="text-xs tracking-[0.12em] text-muted uppercase">
              Ingeniero(s)
            </p>
            <div className="mt-2 space-y-2">
              {form.engineers.map((eng, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={eng}
                    onChange={(e) => setEngineer(i, e.target.value)}
                    placeholder="Nombre del ingeniero"
                    className="min-w-0 flex-1 border border-line bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-accent"
                  />
                  {form.engineers.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEngineer(i)}
                      className="border border-line px-3 text-xs text-muted"
                    >
                      Quitar
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addEngineer}
              className="mt-2 text-xs font-semibold text-accent"
            >
              + Más ingenieros
            </button>
          </div>

          <label className="block text-sm">
            <span className="text-xs tracking-[0.12em] text-muted uppercase">
              Forma de pago
            </span>
            <select
              value={form.paymentMethod}
              onChange={(e) =>
                setForm((f) => ({ ...f, paymentMethod: e.target.value }))
              }
              className="mt-1.5 w-full border border-line bg-bg px-3 py-2 text-sm text-fg outline-none focus:border-accent"
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>

          <Field
            id="notes"
            label="Notas (opcional)"
            value={form.notes}
            onChange={(v) => setForm((f) => ({ ...f, notes: v }))}
            as="textarea"
            rows={2}
          />

          <label className="block text-sm">
            <span className="text-xs tracking-[0.12em] text-muted uppercase">
              Términos y condiciones
            </span>
            <textarea
              value={form.terms}
              onChange={(e) =>
                setForm((f) => ({ ...f, terms: e.target.value }))
              }
              rows={14}
              className="mt-1.5 w-full border border-line bg-bg px-3 py-2 font-mono text-xs leading-relaxed text-fg outline-none focus:border-accent"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <button
              type="submit"
              disabled={pdfBusy}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-ink disabled:opacity-50"
            >
              {pdfBusy ? "Generando…" : "Descargar PDF"}
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => void saveDraft()}
              className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-fg disabled:opacity-50"
            >
              {saving ? "Guardando…" : "Guardar borrador"}
            </button>
            <button
              type="button"
              onClick={() => setForm(emptyForm())}
              className="rounded-full border border-line px-5 py-2.5 text-sm font-semibold text-muted"
            >
              Limpiar
            </button>
          </div>
        </form>

        <aside className="border border-line bg-bg-elevated/70 p-4 backdrop-blur md:p-5">
          <h2 className="font-display text-lg font-semibold text-fg">
            Borradores recientes
          </h2>
          <p className="mt-1 text-xs text-muted">
            Últimos comprobantes guardados en Supabase.
          </p>
          <ul className="mt-4 divide-y divide-line">
            {drafts.length === 0 && (
              <li className="py-6 text-center text-sm text-muted">
                Sin borradores aún.
              </li>
            )}
            {drafts.map((d) => (
              <li key={d.id} className="py-3 text-sm">
                <p className="font-medium text-fg">{d.clientName}</p>
                <p className="text-xs text-muted">{d.projectName}</p>
                <p className="mt-1 text-[11px] text-muted">
                  {d.createdAt
                    ? new Date(d.createdAt).toLocaleString("es-MX")
                    : ""}
                </p>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

function slug(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
