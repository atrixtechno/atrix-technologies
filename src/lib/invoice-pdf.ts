import type { jsPDF } from "jspdf";

/** Brand colors (RGB) */
const NAVY: [number, number, number] = [10, 16, 32];
const INK: [number, number, number] = [22, 28, 40];
const MUTED: [number, number, number] = [100, 110, 128];
const LINE: [number, number, number] = [220, 226, 236];
const ROW_BG: [number, number, number] = [246, 248, 252];
const ACCENT: [number, number, number] = [26, 107, 255]; // #1A6BFF

/** Light-bg horizontal lockup — native 1200×264 */
const LOCKUP = {
  src: "/brand/atrix-lockup-v3.png",
  nativeW: 1200,
  nativeH: 264,
  /** Display width in PDF points; height derived from aspect ratio */
  displayW: 168,
} as const;

export type InvoicePdfInput = {
  clientName: string;
  projectName: string;
  startDate: string;
  endDate: string;
  engineers: string[];
  paymentMethod: string;
  terms: string;
  notes: string;
};

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

function formatDateEs(isoOrYmd: string) {
  if (!isoOrYmd) return "—";
  const d = new Date(
    isoOrYmd.includes("T") ? isoOrYmd : `${isoOrYmd}T12:00:00`,
  );
  if (Number.isNaN(d.getTime())) return isoOrYmd;
  return d.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function makeFolio(now: Date) {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const seq = String(now.getHours() * 60 + now.getMinutes()).padStart(4, "0");
  return `ATRX-${y}${m}${day}-${seq}`;
}

async function loadLockupDataUrl(): Promise<string | null> {
  try {
    const res = await fetch(LOCKUP.src);
    if (!res.ok) return null;
    const blob = await res.blob();
    return blobToDataUrl(blob);
  } catch {
    return null;
  }
}

function ensureSpace(doc: jsPDF, y: number, need: number, margin: number) {
  const pageH = doc.internal.pageSize.getHeight();
  if (y + need > pageH - margin - 36) {
    doc.addPage();
    return margin;
  }
  return y;
}

function drawFooter(
  doc: jsPDF,
  pageW: number,
  pageH: number,
  margin: number,
  pageLabel: string,
) {
  const fy = pageH - 28;
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.6);
  doc.line(margin, fy - 12, pageW - margin, fy - 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  doc.text(
    "ATRIX Technologies · atrixnld.com · Nuevo Laredo / Laredo, TX · 867 179 3155",
    margin,
    fy,
  );
  doc.text(pageLabel, pageW - margin, fy, { align: "right" });
}

function drawSignatureBlock(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  title: string,
) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...NAVY);
  doc.text(title, x, y);

  const lineY = y + 36;
  doc.setDrawColor(...NAVY);
  doc.setLineWidth(0.7);
  doc.line(x, lineY, x + width, lineY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.setTextColor(...MUTED);
  const labelY = lineY + 12;
  const third = width / 3;
  doc.text("Nombre", x, labelY);
  doc.text("Firma", x + third, labelY);
  doc.text("Fecha", x + third * 2, labelY);
}

/**
 * Builds a professional service receipt PDF and triggers download.
 * Returns the filename used.
 */
export async function downloadInvoicePdf(
  input: InvoicePdfInput,
): Promise<string> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 48;
  const contentW = pageW - margin * 2;
  let y = margin;

  const now = new Date();
  const folio = makeFolio(now);
  const generatedLabel = now.toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  /* ── Header ── */
  const lockupH =
    (LOCKUP.displayW * LOCKUP.nativeH) / LOCKUP.nativeW; /* ~37pt */
  const logoData = await loadLockupDataUrl();
  if (logoData) {
    doc.addImage(
      logoData,
      "PNG",
      margin,
      y,
      LOCKUP.displayW,
      lockupH,
      undefined,
      "FAST",
    );
  } else {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(...NAVY);
    doc.text("ATRIX Technologies", margin, y + 22);
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  const rightX = pageW - margin;
  doc.text("Nuevo Laredo, Tamaulipas", rightX, y + 10, { align: "right" });
  doc.text("Laredo, Texas", rightX, y + 22, { align: "right" });
  doc.setTextColor(...ACCENT);
  doc.setFont("helvetica", "bold");
  doc.text("atrixnld.com", rightX, y + 34, { align: "right" });

  y += Math.max(lockupH, 40) + 14;

  /* Accent rule */
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(2);
  doc.line(margin, y, pageW - margin, y);
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.5);
  doc.line(margin, y + 3.5, pageW - margin, y + 3.5);
  y += 22;

  /* ── Document title + meta ── */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(...NAVY);
  doc.text("COMPROBANTE DE SERVICIO", margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text(`Folio  ${folio}`, rightX, y - 6, { align: "right" });
  doc.text(`Generado  ${generatedLabel}`, rightX, y + 8, { align: "right" });
  y += 22;

  /* ── Details table ── */
  const engineers =
    input.engineers.filter((e) => e.trim()).join(", ") || "—";
  const rows: [string, string][] = [
    ["Cliente", input.clientName],
    ["Proyecto", input.projectName],
    ["Fecha de inicio", formatDateEs(input.startDate)],
    ["Fecha de finalización", formatDateEs(input.endDate)],
    ["Ingeniero(s)", engineers],
    ["Forma de pago", input.paymentMethod || "—"],
  ];

  const labelCol = 130;
  const rowPadX = 12;
  const rowPadY = 8;
  const valueMaxW = contentW - labelCol - rowPadX * 2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...ACCENT);
  doc.text("DATOS DEL SERVICIO", margin, y);
  y += 10;

  for (let i = 0; i < rows.length; i++) {
    const [label, value] = rows[i];
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    const valueLines = doc.splitTextToSize(value, valueMaxW) as string[];
    const rowH = Math.max(22, valueLines.length * 12 + rowPadY * 2);

    y = ensureSpace(doc, y, rowH + 2, margin);

    if (i % 2 === 0) {
      doc.setFillColor(...ROW_BG);
      doc.rect(margin, y, contentW, rowH, "F");
    }

    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.4);
    doc.line(margin, y + rowH, pageW - margin, y + rowH);

    const textY = y + rowPadY + 10;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text(label.toUpperCase(), margin + rowPadX, textY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(...INK);
    doc.text(valueLines, margin + labelCol, textY);

    y += rowH;
  }

  /* ── Notes ── */
  if (input.notes.trim()) {
    y += 16;
    y = ensureSpace(doc, y, 40, margin);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...ACCENT);
    doc.text("NOTAS", margin, y);
    y += 10;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...INK);
    const noteLines = doc.splitTextToSize(
      input.notes.trim(),
      contentW,
    ) as string[];
    for (const line of noteLines) {
      y = ensureSpace(doc, y, 14, margin);
      doc.text(line, margin, y);
      y += 12;
    }
  }

  /* ── Terms ── */
  y += 18;
  y = ensureSpace(doc, y, 40, margin);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...ACCENT);
  doc.text("TÉRMINOS Y CONDICIONES", margin, y);
  y += 12;

  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.5);
  doc.line(margin, y - 4, pageW - margin, y - 4);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...INK);
  const termLines = doc.splitTextToSize(input.terms, contentW) as string[];
  for (const line of termLines) {
    y = ensureSpace(doc, y, 12, margin);
    doc.text(line, margin, y);
    y += 10;
  }

  /* ── Signatures ── */
  y += 28;
  const sigBlockH = 64;
  y = ensureSpace(doc, y, sigBlockH + 8, margin);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(...ACCENT);
  doc.text("FIRMAS", margin, y);
  y += 14;

  const gap = 28;
  const sigW = (contentW - gap) / 2;
  drawSignatureBlock(doc, margin, y, sigW, "Firma del cliente");
  drawSignatureBlock(
    doc,
    margin + sigW + gap,
    y,
    sigW,
    "Firma del ingeniero",
  );
  y += sigBlockH;

  /* Footers on every page */
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    drawFooter(doc, pageW, pageH, margin, `Pág. ${p}/${total}`);
  }

  const stamp = now.toISOString().slice(0, 10);
  const filename = `ATRIX-comprobante-${slug(input.clientName)}-${stamp}.pdf`;
  doc.save(filename);
  return filename;
}
