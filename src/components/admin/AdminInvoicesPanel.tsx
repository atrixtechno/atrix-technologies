"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-session";
import {
  DEFAULT_INVOICE_TERMS,
  PAYMENT_METHODS,
} from "@/lib/invoice-defaults";
import { downloadInvoicePdf } from "@/lib/invoice-pdf";
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

type InvoiceDraftRow = InvoiceForm & {
  id: string;
  createdAt: string;
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

function mapApiDraft(inv: {
  id: string;
  clientName?: string | null;
  projectName?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  engineers?: string[] | null;
  paymentMethod?: string | null;
  terms?: string | null;
  notes?: string | null;
  createdAt?: string | null;
}): InvoiceDraftRow {
  const engineers = Array.isArray(inv.engineers)
    ? inv.engineers.filter((e) => typeof e === "string")
    : [];
  return {
    id: inv.id,
    clientName: inv.clientName ?? "",
    projectName: inv.projectName ?? "",
    startDate: inv.startDate ?? "",
    endDate: inv.endDate ?? "",
    engineers: engineers.length > 0 ? engineers : [""],
    paymentMethod: inv.paymentMethod ?? "Transferencia bancaria",
    terms: inv.terms?.trim() ? inv.terms : DEFAULT_INVOICE_TERMS,
    notes: inv.notes ?? "",
    createdAt: inv.createdAt ?? "",
  };
}

export function AdminInvoicesPanel() {
  const [form, setForm] = useState<InvoiceForm>(emptyForm);
  const [setupNote, setSetupNote] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<InvoiceDraftRow[]>([]);
  const [selectedDraftId, setSelectedDraftId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [draftPdfBusy, setDraftPdfBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedDraft =
    drafts.find((d) => d.id === selectedDraftId) ?? null;

  const load = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/invoices", {
        credentials: "same-origin",
      });
      const data = await res.json();
      setSetupNote(data.setupNote ?? null);
      const next = (data.invoices ?? []).map(
        (inv: Parameters<typeof mapApiDraft>[0]) => mapApiDraft(inv),
      ) as InvoiceDraftRow[];
      setDrafts(next);
      setSelectedDraftId((prev) =>
        prev && next.some((d) => d.id === prev) ? prev : null,
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

  async function deleteDraft(id: string, label: string) {
    const ok = window.confirm(
      `¿Eliminar el borrador de «${label}»? Esta acción no se puede deshacer.`,
    );
    if (!ok) return;

    setDeletingId(id);
    setError(null);
    setMessage(null);
    try {
      const res = await adminFetch(`/api/admin/invoices/${id}`, {
        method: "DELETE",
        credentials: "same-origin",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          (data as { error?: string }).error || "No se pudo eliminar",
        );
      }
      if (selectedDraftId === id) setSelectedDraftId(null);
      setMessage("Borrador eliminado.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al eliminar borrador");
    } finally {
      setDeletingId(null);
    }
  }

  function loadDraftIntoForm(draft: InvoiceDraftRow) {
    setForm({
      clientName: draft.clientName,
      projectName: draft.projectName,
      startDate: draft.startDate,
      endDate: draft.endDate,
      engineers:
        draft.engineers.filter((e) => e.trim()).length > 0
          ? draft.engineers
          : [""],
      paymentMethod: draft.paymentMethod,
      terms: draft.terms || DEFAULT_INVOICE_TERMS,
      notes: draft.notes,
    });
    setSelectedDraftId(draft.id);
    setMessage("Borrador cargado en el formulario.");
    setError(null);
  }

  async function downloadPdfFromInput(input: InvoiceForm, busy: "form" | "draft") {
    if (!input.clientName.trim() || !input.projectName.trim()) {
      setError("Indica al menos cliente y proyecto para el PDF.");
      return;
    }
    if (busy === "form") setPdfBusy(true);
    else setDraftPdfBusy(true);
    setError(null);
    try {
      const filename = await downloadInvoicePdf({
        clientName: input.clientName,
        projectName: input.projectName,
        startDate: input.startDate,
        endDate: input.endDate,
        engineers: input.engineers,
        paymentMethod: input.paymentMethod,
        terms: input.terms || DEFAULT_INVOICE_TERMS,
        notes: input.notes,
      });
      setMessage(`PDF descargado: ${filename}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al generar PDF");
    } finally {
      if (busy === "form") setPdfBusy(false);
      else setDraftPdfBusy(false);
    }
  }

  async function downloadPdf() {
    await downloadPdfFromInput(form, "form");
  }

  async function downloadSelectedDraft() {
    if (!selectedDraft) {
      setError("Selecciona un borrador para descargar el PDF.");
      return;
    }
    await downloadPdfFromInput(selectedDraft, "draft");
  }

  return (
    <div className="space-y-6">
      <header>
        <p className="text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">
          Factura
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
            Selecciona un borrador para descargar su PDF o cargarlo en el
            formulario.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={!selectedDraft || draftPdfBusy}
              onClick={() => void downloadSelectedDraft()}
              className="rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-ink disabled:cursor-not-allowed disabled:opacity-40"
            >
              {draftPdfBusy ? "Generando…" : "Descargar borrador"}
            </button>
            <button
              type="button"
              disabled={!selectedDraft}
              onClick={() => selectedDraft && loadDraftIntoForm(selectedDraft)}
              className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-fg disabled:cursor-not-allowed disabled:opacity-40"
            >
              Cargar en formulario
            </button>
          </div>

          {!selectedDraft && drafts.length > 0 && (
            <p className="mt-3 text-[11px] text-muted">
              Ningún borrador seleccionado.
            </p>
          )}
          {selectedDraft && (
            <p className="mt-3 text-[11px] text-accent">
              Seleccionado: {selectedDraft.clientName || "Sin cliente"} —{" "}
              {selectedDraft.projectName || "Sin proyecto"}
            </p>
          )}

          <ul
            className="mt-4 divide-y divide-line"
            role="radiogroup"
            aria-label="Borradores guardados"
          >
            {drafts.length === 0 && (
              <li className="py-6 text-center text-sm text-muted">
                Sin borradores aún.
              </li>
            )}
            {drafts.map((d) => {
              const selected = selectedDraftId === d.id;
              return (
                <li key={d.id} className="py-1">
                  <div
                    className={`flex items-start gap-3 rounded-md px-2 py-2 transition ${
                      selected
                        ? "bg-accent/10 ring-1 ring-accent/40"
                        : "hover:bg-bg/60"
                    }`}
                  >
                    <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3">
                      <input
                        type="radio"
                        name="invoice-draft"
                        className="mt-1 shrink-0 accent-[var(--accent,#1A6BFF)]"
                        checked={selected}
                        onChange={() => setSelectedDraftId(d.id)}
                        aria-label={`Seleccionar borrador de ${d.clientName || d.projectName || "sin nombre"}`}
                      />
                      <span className="min-w-0 text-sm">
                        <span className="block font-medium text-fg">
                          {d.clientName || "Sin cliente"}
                        </span>
                        <span className="block text-xs text-muted">
                          {d.projectName || "Sin proyecto"}
                        </span>
                        <span className="mt-1 block text-[11px] text-muted">
                          {d.createdAt
                            ? new Date(d.createdAt).toLocaleString("es-MX")
                            : ""}
                        </span>
                      </span>
                    </label>
                    <button
                      type="button"
                      disabled={deletingId === d.id}
                      onClick={() =>
                        void deleteDraft(
                          d.id,
                          d.clientName || d.projectName || "borrador",
                        )
                      }
                      className="shrink-0 border border-red-500/30 px-2.5 py-1 text-[11px] font-semibold text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                    >
                      {deletingId === d.id ? "…" : "Eliminar"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </div>
  );
}
