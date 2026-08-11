"use client";

import { useCallback, useEffect, useState } from "react";
import { adminFetch } from "@/lib/admin-session";
import {
  DEFAULT_INVOICE_TERMS,
  PAYMENT_METHODS,
} from "@/lib/invoice-defaults";
import { downloadInvoicePdf } from "@/lib/invoice-pdf";
import {
  AdminAlert,
  AdminPageHeader,
  AdminPanel,
  Field,
  GhostButton,
  PrimaryButton,
  Section,
} from "@/components/admin/AdminFormFields";

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

  const selectedDraft = drafts.find((d) => d.id === selectedDraftId) ?? null;

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

  async function downloadPdfFromInput(
    input: InvoiceForm,
    busy: "form" | "draft",
  ) {
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
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Factura"
        title="Comprobante de servicio"
        description="Genera un PDF profesional con cliente, proyecto, ingenieros, forma de pago y términos ATRIX. Guarda borradores en Supabase para retomar después."
      />

      {setupNote && <AdminAlert tone="info">{setupNote}</AdminAlert>}
      {error && <AdminAlert tone="error">{error}</AdminAlert>}
      {message && <AdminAlert tone="success">{message}</AdminAlert>}

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(280px,0.85fr)]">
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            void downloadPdf();
          }}
        >
          <AdminPanel className="overflow-hidden">
            <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-bg-elevated/95 px-4 py-3 backdrop-blur md:px-5">
              <div>
                <h2 className="font-display text-lg font-semibold text-fg">
                  Datos del comprobante
                </h2>
                <p className="mt-0.5 text-xs text-muted">
                  Completa las secciones y descarga o guarda borrador.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <PrimaryButton type="submit" disabled={pdfBusy}>
                  {pdfBusy ? "Generando…" : "Descargar PDF"}
                </PrimaryButton>
                <GhostButton disabled={saving} onClick={() => void saveDraft()}>
                  {saving ? "Guardando…" : "Guardar borrador"}
                </GhostButton>
                <GhostButton onClick={() => setForm(emptyForm())}>
                  Limpiar
                </GhostButton>
              </div>
            </div>

            <div className="space-y-4 p-4 md:p-5">
              <Section
                title="Cliente y proyecto"
                description="Identificación del servicio facturado."
              >
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
              </Section>

              <Section
                title="Fechas"
                description="Periodo de prestación del servicio."
              >
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
              </Section>

              <Section
                title="Equipo"
                description="Ingenieros asignados al servicio."
                cols={1}
              >
                <div>
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
                    Ingeniero(s)
                  </p>
                  <div className="mt-2 space-y-2">
                    {form.engineers.map((eng, i) => (
                      <div key={i} className="flex gap-2">
                        <input
                          value={eng}
                          onChange={(e) => setEngineer(i, e.target.value)}
                          placeholder="Nombre del ingeniero"
                          className="min-w-0 flex-1 border border-line bg-bg px-3 py-2.5 text-sm text-fg outline-none transition focus:border-accent"
                        />
                        {form.engineers.length > 1 && (
                          <GhostButton
                            className="!rounded-none !px-3 !py-2 text-xs"
                            onClick={() => removeEngineer(i)}
                          >
                            Quitar
                          </GhostButton>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={addEngineer}
                    className="mt-2 text-xs font-semibold text-accent transition hover:brightness-110"
                  >
                    + Más ingenieros
                  </button>
                </div>
              </Section>

              <Section
                title="Pago y notas"
                description="Forma de pago y observaciones opcionales."
              >
                <label className="block text-sm">
                  <span className="text-[11px] font-semibold tracking-[0.14em] text-muted uppercase">
                    Forma de pago
                  </span>
                  <select
                    value={form.paymentMethod}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, paymentMethod: e.target.value }))
                    }
                    className="mt-1.5 w-full border border-line bg-bg px-3 py-2.5 text-sm text-fg outline-none transition focus:border-accent"
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
                  rows={3}
                />
              </Section>

              <Section
                title="Términos y condiciones"
                description="Texto legal incluido en el PDF. Editable por borrador."
                cols={1}
              >
                <textarea
                  value={form.terms}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, terms: e.target.value }))
                  }
                  rows={12}
                  aria-label="Términos y condiciones"
                  className="w-full border border-line bg-bg px-3 py-2.5 font-mono text-xs leading-relaxed text-fg outline-none transition focus:border-accent"
                />
              </Section>
            </div>
          </AdminPanel>
        </form>

        <aside className="space-y-3 lg:sticky lg:top-6 lg:self-start">
          <AdminPanel>
            <div className="border-b border-line px-4 py-4 md:px-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-display text-lg font-semibold text-fg">
                    Borradores
                  </h2>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    Selecciona uno para descargar, cargar o eliminar.
                  </p>
                </div>
                <span className="shrink-0 border border-line px-2 py-0.5 text-[11px] tabular-nums text-muted">
                  {drafts.length}
                </span>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <PrimaryButton
                  className="!w-full !px-3 !py-2 text-xs"
                  disabled={!selectedDraft || draftPdfBusy}
                  onClick={() => void downloadSelectedDraft()}
                >
                  {draftPdfBusy ? "Generando…" : "Descargar borrador"}
                </PrimaryButton>
                <GhostButton
                  className="!w-full !px-3 !py-2 text-xs"
                  disabled={!selectedDraft}
                  onClick={() =>
                    selectedDraft && loadDraftIntoForm(selectedDraft)
                  }
                >
                  Cargar
                </GhostButton>
              </div>

              {selectedDraft ? (
                <p className="mt-3 border border-accent/25 bg-accent/10 px-3 py-2 text-[11px] leading-relaxed text-fg">
                  <span className="font-semibold text-accent">Seleccionado:</span>{" "}
                  {selectedDraft.clientName || "Sin cliente"} —{" "}
                  {selectedDraft.projectName || "Sin proyecto"}
                </p>
              ) : drafts.length > 0 ? (
                <p className="mt-3 text-[11px] text-muted">
                  Ningún borrador seleccionado.
                </p>
              ) : null}
            </div>

            <ul
              className="max-h-[min(70vh,640px)] divide-y divide-line overflow-y-auto"
              role="radiogroup"
              aria-label="Borradores guardados"
            >
              {drafts.length === 0 && (
                <li className="px-5 py-12 text-center text-sm text-muted">
                  Sin borradores aún. Guarda uno desde el formulario.
                </li>
              )}
              {drafts.map((d) => {
                const selected = selectedDraftId === d.id;
                const engCount = d.engineers.filter((e) => e.trim()).length;
                return (
                  <li key={d.id}>
                    <div
                      className={`flex items-stretch gap-0 transition ${
                        selected
                          ? "border-l-2 border-l-accent bg-accent/10"
                          : "border-l-2 border-l-transparent hover:bg-bg/50"
                      }`}
                    >
                      <label className="flex min-w-0 flex-1 cursor-pointer items-start gap-3 px-4 py-3.5">
                        <input
                          type="radio"
                          name="invoice-draft"
                          className="mt-1 shrink-0 accent-[var(--accent,#1A6BFF)]"
                          checked={selected}
                          onChange={() => setSelectedDraftId(d.id)}
                          aria-label={`Seleccionar borrador de ${d.clientName || d.projectName || "sin nombre"}`}
                        />
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium text-fg">
                            {d.clientName || "Sin cliente"}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-muted">
                            {d.projectName || "Sin proyecto"}
                          </span>
                          <span className="mt-2 flex flex-wrap gap-1.5">
                            {d.paymentMethod && (
                              <span className="border border-line px-1.5 py-0.5 text-[10px] text-muted">
                                {d.paymentMethod}
                              </span>
                            )}
                            {engCount > 0 && (
                              <span className="border border-line px-1.5 py-0.5 text-[10px] text-muted">
                                {engCount} ing.
                              </span>
                            )}
                          </span>
                          <span className="mt-2 block text-[11px] text-muted">
                            {d.createdAt
                              ? new Date(d.createdAt).toLocaleString("es-MX")
                              : ""}
                          </span>
                        </span>
                      </label>
                      <div className="flex flex-col justify-center border-l border-line px-2 py-2">
                        <button
                          type="button"
                          disabled={deletingId === d.id}
                          onClick={() =>
                            void deleteDraft(
                              d.id,
                              d.clientName || d.projectName || "borrador",
                            )
                          }
                          className="px-2 py-1.5 text-[11px] font-semibold text-red-500 transition hover:bg-red-500/10 disabled:opacity-50 dark:text-red-300"
                        >
                          {deletingId === d.id ? "…" : "Eliminar"}
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </AdminPanel>
        </aside>
      </div>
    </div>
  );
}
