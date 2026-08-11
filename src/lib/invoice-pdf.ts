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

/** Page geometry (pt) */
const MARGIN = 52;
const FOOTER_RESERVED = 44;
const CONT_HEADER_H = 28;

/** Typography (pt) — readable sizes, not micro T&C */
const FONT = {
  title: 15,
  section: 9,
  body: 10,
  label: 8.5,
  meta: 8.5,
  terms: 9.5,
  termsLeading: 13,
  noteLeading: 13,
  footer: 7.5,
  sigTitle: 9,
  sigLabel: 8,
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

/** Split on blank lines first; fall back to single newlines so each block stays intact. */
function splitParagraphs(text: string): string[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];
  const byBlank = normalized
    .split(/\n\s*\n+/)
    .map((p) => p.replace(/\n+/g, " ").trim())
    .filter(Boolean);
  if (byBlank.length > 1) return byBlank;
  return normalized
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function pageBottom(doc: jsPDF): number {
  return doc.internal.pageSize.getHeight() - MARGIN - FOOTER_RESERVED;
}

function drawContinuationHeader(
  doc: jsPDF,
  pageW: number,
  folio: string,
) {
  const y = MARGIN;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(FONT.meta);
  doc.setTextColor(...NAVY);
  doc.text("ATRIX Technologies", MARGIN, y + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(FONT.meta);
  doc.setTextColor(...MUTED);
  doc.text("Comprobante de servicio (continuación)", pageW / 2, y + 10, {
    align: "center",
  });
  doc.text(`Folio  ${folio}`, pageW - MARGIN, y + 10, { align: "right" });

  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(1.5);
  doc.line(MARGIN, y + 18, pageW - MARGIN, y + 18);
}

/**
 * Ensures `need` pt of vertical room below `y`.
 * If not enough, starts a new page with a slim continuation header.
 * Returns the y cursor where content should continue.
 */
function ensureBlockSpace(
  doc: jsPDF,
  y: number,
  need: number,
  folio: string,
  pageW: number,
): number {
  if (y + need <= pageBottom(doc)) return y;
  doc.addPage();
  drawContinuationHeader(doc, pageW, folio);
  return MARGIN + CONT_HEADER_H;
}

function drawFooter(
  doc: jsPDF,
  pageW: number,
  pageH: number,
  pageLabel: string,
) {
  const fy = pageH - 26;
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.6);
  doc.line(MARGIN, fy - 12, pageW - MARGIN, fy - 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(FONT.footer);
  doc.setTextColor(...MUTED);
  doc.text(
    "ATRIX Technologies · atrixnld.com · Nuevo Laredo / Laredo, TX · 867 179 3155",
    MARGIN,
    fy,
  );
  doc.text(pageLabel, pageW - MARGIN, fy, { align: "right" });
}

function drawSignatureBlock(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  title: string,
) {
  doc.setFont("helvetica", "bold");
  doc.setFontSize(FONT.sigTitle);
  doc.setTextColor(...NAVY);
  doc.text(title, x, y);

  const lineY = y + 40;
  doc.setDrawColor(...NAVY);
  doc.setLineWidth(0.7);
  doc.line(x, lineY, x + width, lineY);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(FONT.sigLabel);
  doc.setTextColor(...MUTED);
  const labelY = lineY + 14;
  const third = width / 3;
  doc.text("Nombre", x, labelY);
  doc.text("Firma", x + third, labelY);
  doc.text("Fecha", x + third * 2, labelY);
}

/**
 * Draws a paragraph as an atomic block (never mid-paragraph page break).
 * Returns the y after the paragraph (including trailing gap).
 */
function drawParagraphBlock(
  doc: jsPDF,
  text: string,
  y: number,
  opts: {
    folio: string;
    pageW: number;
    contentW: number;
    fontSize: number;
    leading: number;
    gapAfter: number;
  },
): number {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(opts.fontSize);
  const lines = doc.splitTextToSize(text, opts.contentW) as string[];
  const blockH = lines.length * opts.leading;

  let cursor = ensureBlockSpace(
    doc,
    y,
    blockH + 2,
    opts.folio,
    opts.pageW,
  );

  doc.setFont("helvetica", "normal");
  doc.setFontSize(opts.fontSize);
  doc.setTextColor(...INK);
  doc.text(lines, MARGIN, cursor);
  return cursor + blockH + opts.gapAfter;
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
  const contentW = pageW - MARGIN * 2;
  let y = MARGIN;

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
      MARGIN,
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
    doc.text("ATRIX Technologies", MARGIN, y + 22);
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(FONT.meta);
  doc.setTextColor(...MUTED);
  const rightX = pageW - MARGIN;
  doc.text("Nuevo Laredo, Tamaulipas", rightX, y + 10, { align: "right" });
  doc.text("Laredo, Texas", rightX, y + 22, { align: "right" });
  doc.setTextColor(...ACCENT);
  doc.setFont("helvetica", "bold");
  doc.text("atrixnld.com", rightX, y + 34, { align: "right" });

  y += Math.max(lockupH, 40) + 16;

  /* Accent rule */
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(2);
  doc.line(MARGIN, y, pageW - MARGIN, y);
  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y + 3.5, pageW - MARGIN, y + 3.5);
  y += 24;

  /* ── Document title + meta ── */
  doc.setFont("helvetica", "bold");
  doc.setFontSize(FONT.title);
  doc.setTextColor(...NAVY);
  doc.text("COMPROBANTE DE SERVICIO", MARGIN, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(FONT.meta);
  doc.setTextColor(...MUTED);
  doc.text(`Folio  ${folio}`, rightX, y - 6, { align: "right" });
  doc.text(`Generado  ${generatedLabel}`, rightX, y + 8, { align: "right" });
  y += 26;

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
  const rowPadY = 9;
  const valueMaxW = contentW - labelCol - rowPadX * 2;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(FONT.section);
  doc.setTextColor(...ACCENT);
  doc.text("DATOS DEL SERVICIO", MARGIN, y);
  y += 12;

  for (let i = 0; i < rows.length; i++) {
    const [label, value] = rows[i];
    doc.setFont("helvetica", "normal");
    doc.setFontSize(FONT.body);
    const valueLines = doc.splitTextToSize(value, valueMaxW) as string[];
    const rowH = Math.max(24, valueLines.length * 13 + rowPadY * 2);

    y = ensureBlockSpace(doc, y, rowH + 2, folio, pageW);

    if (i % 2 === 0) {
      doc.setFillColor(...ROW_BG);
      doc.rect(MARGIN, y, contentW, rowH, "F");
    }

    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.4);
    doc.line(MARGIN, y + rowH, pageW - MARGIN, y + rowH);

    const textY = y + rowPadY + 11;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(FONT.label);
    doc.setTextColor(...MUTED);
    doc.text(label.toUpperCase(), MARGIN + rowPadX, textY);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(FONT.body);
    doc.setTextColor(...INK);
    doc.text(valueLines, MARGIN + labelCol, textY);

    y += rowH;
  }

  /* ── Notes (paragraph-aware) ── */
  if (input.notes.trim()) {
    y += 18;
    const noteParas = splitParagraphs(input.notes);
    const headingNeed = 22;
    y = ensureBlockSpace(doc, y, headingNeed, folio, pageW);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(FONT.section);
    doc.setTextColor(...ACCENT);
    doc.text("NOTAS", MARGIN, y);
    y += 14;

    for (const para of noteParas) {
      y = drawParagraphBlock(doc, para, y, {
        folio,
        pageW,
        contentW,
        fontSize: FONT.body,
        leading: FONT.noteLeading,
        gapAfter: 10,
      });
    }
  }

  /* ── Terms (paragraph-aware — never split mid-paragraph) ── */
  y += 20;
  y = ensureBlockSpace(doc, y, 28, folio, pageW);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(FONT.section);
  doc.setTextColor(...ACCENT);
  doc.text("TÉRMINOS Y CONDICIONES", MARGIN, y);
  y += 10;

  doc.setDrawColor(...LINE);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, y, pageW - MARGIN, y);
  y += 14;

  const termParas = splitParagraphs(input.terms);
  for (const para of termParas) {
    y = drawParagraphBlock(doc, para, y, {
      folio,
      pageW,
      contentW,
      fontSize: FONT.terms,
      leading: FONT.termsLeading,
      gapAfter: 12,
    });
  }

  /* ── Signatures (atomic — full block or new page) ── */
  y += 16;
  const sigHeadingH = 16;
  const sigBlockH = 72;
  const sigNeed = sigHeadingH + sigBlockH + 8;
  y = ensureBlockSpace(doc, y, sigNeed, folio, pageW);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(FONT.section);
  doc.setTextColor(...ACCENT);
  doc.text("FIRMAS", MARGIN, y);
  y += sigHeadingH;

  const gap = 28;
  const sigW = (contentW - gap) / 2;
  drawSignatureBlock(doc, MARGIN, y, sigW, "Firma del cliente");
  drawSignatureBlock(
    doc,
    MARGIN + sigW + gap,
    y,
    sigW,
    "Firma del ingeniero",
  );

  /* Footers on every page */
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    drawFooter(doc, pageW, pageH, `Pág. ${p}/${total}`);
  }

  const stamp = now.toISOString().slice(0, 10);
  const filename = `ATRIX-comprobante-${slug(input.clientName)}-${stamp}.pdf`;
  doc.save(filename);
  return filename;
}
