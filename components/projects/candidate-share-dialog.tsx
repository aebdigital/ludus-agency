"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  FileDown,
  FileText,
  Share2,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Student } from "@/lib/data";
import {
  CANDIDATE_SHARE_FIELDS,
  DEFAULT_CANDIDATE_SHARE_FIELDS,
  candidatePdfDocumentHtml,
  candidateSummaryText,
  printCandidatesPdf,
  shareCandidates,
  type CandidateShareField,
} from "@/lib/export";
import { cn } from "@/lib/utils";

type PreviewMode = "text" | "pdf";
const CANDIDATE_SHARE_FIELD_IDS = CANDIDATE_SHARE_FIELDS.map(
  (field) => field.id
);

export function CandidateShareDialog({
  open,
  onClose,
  students,
  title = "Zdieľať študentov",
  heading = "Casting — uchádzači",
  description,
  onPdfOpened,
}: {
  open: boolean;
  onClose: () => void;
  students: Student[];
  title?: string;
  heading?: string;
  description?: string;
  onPdfOpened?: () => void;
}) {
  const [fields, setFields] = useState<CandidateShareField[]>(
    DEFAULT_CANDIDATE_SHARE_FIELDS
  );
  const [previewMode, setPreviewMode] = useState<PreviewMode>("text");
  const [notice, setNotice] = useState<string | null>(null);
  const selectedFields = useMemo(
    () => fields.filter((field) => CANDIDATE_SHARE_FIELD_IDS.includes(field)),
    [fields]
  );
  const allSelected = selectedFields.length === CANDIDATE_SHARE_FIELDS.length;
  const dialogDescription =
    description ?? `${students.length} vybraných · nastavenia platia pre všetkých`;
  const textPreview = useMemo(
    () => candidateSummaryText(students, { fields: selectedFields, heading }),
    [students, selectedFields, heading]
  );
  const pdfPreview = useMemo(
    () => candidatePdfDocumentHtml(students, heading, selectedFields),
    [students, selectedFields, heading]
  );

  const toggleField = (field: CandidateShareField) => {
    setFields((current) => {
      const currentFields = current.filter((item) =>
        CANDIDATE_SHARE_FIELD_IDS.includes(item)
      );
      return currentFields.includes(field)
        ? currentFields.filter((item) => item !== field)
        : [...currentFields, field];
    });
  };

  const toggleAll = () => {
    setFields(
      allSelected ? [] : CANDIDATE_SHARE_FIELDS.map((field) => field.id)
    );
  };

  const handleShare = async () => {
    setNotice(null);
    if (previewMode === "pdf") {
      const opened = printCandidatesPdf(students, heading, selectedFields);
      if (!opened) {
        setNotice("Prehliadač zablokoval PDF okno. Povoľte vyskakovacie okná.");
        return;
      }
      flushSync(() => {
        (onPdfOpened ?? onClose)();
      });
      return;
    }

    try {
      const result = await shareCandidates(students, {
        fields: selectedFields,
        heading,
      });
      if (result === "copied") {
        setNotice("Text bol skopírovaný do schránky.");
      }
      if (result === "unavailable") {
        setNotice("Zdieľanie nie je v tomto prehliadači dostupné.");
      }
    } catch (error) {
      console.error("Zdieľanie zlyhalo:", error);
      setNotice("Zdieľanie zlyhalo. Skúste to, prosím, znova.");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      description={dialogDescription}
      className="max-w-7xl"
      bodyClassName="max-h-[78vh]"
      footer={
        <div className="flex w-full items-center justify-between gap-3">
          <p className="min-h-5 text-xs text-muted-foreground">
            {notice}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Zrušiť
            </Button>
            <Button size="sm" className="gap-1.5" onClick={handleShare}>
              <Share2 className="size-4" /> Zdieľať
            </Button>
          </div>
        </div>
      }
    >
      <div className="grid gap-5 lg:grid-cols-[320px_minmax(0,1fr)] xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold">Informácie</p>
              <p className="text-xs text-muted-foreground">
                {selectedFields.length} z {CANDIDATE_SHARE_FIELDS.length} vybrané
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={toggleAll}>
              {allSelected ? "Zrušiť" : "Všetko"}
            </Button>
          </div>

          <div className="space-y-1.5">
            {CANDIDATE_SHARE_FIELDS.map((field) => {
              const checked = fields.includes(field.id);
              return (
                <label
                  key={field.id}
                  className={cn(
                    "flex cursor-pointer gap-3 rounded-md border p-2.5 transition-colors",
                    checked
                      ? "border-primary/40 bg-primary/5"
                      : "border-border hover:bg-secondary"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleField(field.id)}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[6px] border",
                      checked
                        ? "border-transparent bg-primary text-primary-foreground"
                        : "border-border bg-card"
                    )}
                    aria-hidden
                  >
                    {checked && <Check className="size-3.5" strokeWidth={3} />}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">
                      {field.label}
                    </span>
                    <span className="block text-xs leading-snug text-muted-foreground">
                      {field.description}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm font-semibold">Náhľad</p>
            <div className="inline-flex rounded-md border border-border bg-card p-0.5">
              <PreviewModeButton
                active={previewMode === "text"}
                onClick={() => setPreviewMode("text")}
                icon={FileText}
                label="Text"
              />
              <PreviewModeButton
                active={previewMode === "pdf"}
                onClick={() => setPreviewMode("pdf")}
                icon={FileDown}
                label="PDF"
              />
            </div>
          </div>

          {previewMode === "text" ? (
            <A4PreviewFrame>
              <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-[#1a1a1a]">
                {textPreview}
              </pre>
            </A4PreviewFrame>
          ) : (
            <PdfPreviewFrame html={pdfPreview} />
          )}
        </div>
      </div>
    </Dialog>
  );
}

function PdfPreviewFrame({ html }: { html: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const cleanupRef = useRef<() => void>(() => {});
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);

  const getMetrics = useCallback(() => {
    const iframe = iframeRef.current;
    const doc = iframe?.contentDocument;
    const win = iframe?.contentWindow;
    if (!iframe || !doc || !win) return null;

    const pages = Array.from(doc.querySelectorAll<HTMLElement>(".page"));
    const firstPage = pages[0];
    if (!firstPage) return null;

    const pageWidth =
      firstPage.getBoundingClientRect().width || firstPage.offsetWidth;
    const pageHeight =
      pageWidth > 0 ? (pageWidth * 297) / 210 : win.innerHeight;
    const scrollElement = doc.scrollingElement ?? doc.documentElement;
    const scrollHeight = Math.max(
      scrollElement.scrollHeight,
      doc.body?.scrollHeight ?? 0,
      firstPage.offsetTop + firstPage.scrollHeight
    );
    const count =
      pages.length > 1
        ? pages.length
        : Math.max(1, Math.ceil((scrollHeight - firstPage.offsetTop) / pageHeight));

    return {
      count,
      firstPage,
      pageHeight,
      pages,
      win,
    };
  }, []);

  const syncPage = useCallback(() => {
    const metrics = getMetrics();
    if (!metrics) return;

    const activePage =
      metrics.pages.length > 1
        ? metrics.pages.reduce((closest, current, index) => {
            const currentDistance = Math.abs(
              current.offsetTop - metrics.win.scrollY
            );
            const closestDistance = Math.abs(
              metrics.pages[closest].offsetTop - metrics.win.scrollY
            );
            return currentDistance < closestDistance ? index : closest;
          }, 0) + 1
        : Math.round(
            (metrics.win.scrollY - metrics.firstPage.offsetTop) /
              metrics.pageHeight
          ) + 1;

    setPageCount(metrics.count);
    setPage(Math.min(Math.max(activePage, 1), metrics.count));
  }, [getMetrics]);

  const scrollToPage = useCallback(
    (nextPage: number) => {
      const metrics = getMetrics();
      if (!metrics) return;

      const boundedPage = Math.min(Math.max(nextPage, 1), metrics.count);
      const target =
        metrics.pages.length > 1
          ? metrics.pages[boundedPage - 1].offsetTop
          : metrics.firstPage.offsetTop + (boundedPage - 1) * metrics.pageHeight;

      metrics.win.scrollTo({ top: target, behavior: "smooth" });
      setPage(boundedPage);
    },
    [getMetrics]
  );

  const handleLoad = useCallback(() => {
    cleanupRef.current();
    const win = iframeRef.current?.contentWindow;
    if (!win) return;

    const onScroll = () => syncPage();
    const onPagesReady = () => syncPage();
    win.addEventListener("scroll", onScroll, { passive: true });
    win.addEventListener("pdf-pages-ready", onPagesReady);
    cleanupRef.current = () => {
      win.removeEventListener("scroll", onScroll);
      win.removeEventListener("pdf-pages-ready", onPagesReady);
    };
    win.scrollTo({ top: 0, left: 0 });
    setPage(1);
    syncPage();
    window.setTimeout(syncPage, 160);
    window.setTimeout(syncPage, 360);
  }, [syncPage]);

  useEffect(() => {
    return () => cleanupRef.current();
  }, []);

  return (
    <div className="overflow-hidden rounded-md border border-border bg-secondary/45">
      <div className="flex items-center justify-between gap-3 border-b border-border bg-card px-3 py-2">
        <span className="min-w-16 text-xs tabular-nums text-muted-foreground">
          {page} / {pageCount}
        </span>
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => scrollToPage(page - 1)}
            disabled={page <= 1}
            aria-label="Predchádzajúca strana"
            title="Predchádzajúca strana"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            onClick={() => scrollToPage(page + 1)}
            disabled={page >= pageCount}
            aria-label="Ďalšia strana"
            title="Ďalšia strana"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
      <iframe
        ref={iframeRef}
        title="PDF náhľad"
        srcDoc={html}
        onLoad={handleLoad}
        className="block h-[62vh] min-h-[520px] w-full border-0"
      />
    </div>
  );
}

function A4PreviewFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-h-[62vh] min-h-[520px] overflow-auto rounded-md border border-border bg-secondary/45 p-4 scrollbar-thin">
      <div
        className="mx-auto w-full max-w-[820px] bg-white p-8 text-[#1a1a1a] shadow-card sm:p-10"
        style={{ aspectRatio: "210 / 297" }}
      >
        {children}
      </div>
    </div>
  );
}

function PreviewModeButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof FileText;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center gap-1.5 rounded-[6px] px-3 text-xs font-medium transition-colors",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      <Icon className="size-3.5" />
      {label}
    </button>
  );
}
