"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { MoveRight, PhoneCall, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PackageDetails } from "@/types/packages";
import { MapPinIcon } from "./ui/MapPinIcon";

const CALL_NUMBER = "+917426933288";

const parseItineraryStep = (step: string) => {
  const normalized = step.replace(/\r\n/g, "\n");
  const delimiters = ["::", "|", "—", " - "] as const;
  for (const delimiter of delimiters) {
    if (normalized.includes(delimiter)) {
      const [tagCandidate, ...rest] = normalized.split(delimiter);
      const cleanedTag = tagCandidate.trim();
      const remaining = rest.join(delimiter).trim();
      const paragraphs = remaining
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);

      return {
        tag: cleanedTag.length > 0 ? cleanedTag : null,
        content: remaining.length > 0 ? remaining : normalized.trim(),
        paragraphs,
      };
    }
  }

  const firstSentence = normalized.split(/\.|\n/)[0]?.trim();
  const fallbackTag = firstSentence && firstSentence.length > 0 ? firstSentence : null;
  const trimmedContent = normalized.trim();
  const paragraphs = trimmedContent
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return {
    tag: fallbackTag && fallbackTag.length <= 40 ? fallbackTag : null,
    content: trimmedContent,
    paragraphs,
  };
};

export default function PackageCard({
  details,
  className,
}: {
  details: PackageDetails;
  className?: string;
}) {
  const {
    title,
    duration,
    priceTag = "Price on request",
    image,
    itinerary,
    summary,
  } = details;

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<"idle" | "success" | "error">("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const headlineTags = useMemo(() => {
    return itinerary
      .map((stop) => parseItineraryStep(stop).tag)
      .filter((tag): tag is string => Boolean(tag))
      .slice(0, 4);
  }, [itinerary]);

  const summarySegments = useMemo(() => {
    return summary
      .split(/→|,/)
      .map((segment) => segment.trim())
      .filter(Boolean);
  }, [summary]);

  const handleDownloadBrochure = useCallback(async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const usableWidth = pageWidth - margin * 2;
      let cursorY = margin;

      const addHeading = (text: string, size = 18) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(size);
        const lines = doc.splitTextToSize(text, usableWidth);
        for (const line of lines) {
          if (cursorY > 270) {
            doc.addPage();
            cursorY = margin;
          }
          doc.text(line, margin, cursorY);
          cursorY += size > 14 ? 9 : 8;
        }
        cursorY += 2;
      };

      const addBody = (text: string) => {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        const lines = doc.splitTextToSize(text, usableWidth);
        for (const line of lines) {
          if (cursorY > 280) {
            doc.addPage();
            cursorY = margin;
          }
          doc.text(line, margin, cursorY);
          cursorY += 6.5;
        }
        cursorY += 4;
      };

      const addDivider = () => {
        if (cursorY > 280) {
          doc.addPage();
          cursorY = margin;
        }
        doc.setDrawColor(235);
        doc.setLineWidth(0.5);
        doc.line(margin, cursorY, pageWidth - margin, cursorY);
        cursorY += 8;
      };

      addHeading(title, 20);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(90);
      doc.text(`${duration} • ${priceTag}`, margin, cursorY);
      cursorY += 12;

      addDivider();
      addHeading("Overview", 14);
      addBody(summary);

      addDivider();
      addHeading("Itinerary", 14);
      itinerary.forEach((step, index) => {
        const { tag, content } = parseItineraryStep(step);
        addHeading(`Day ${index + 1}${tag ? ` — ${tag}` : ""}`, 12);
        addBody(content);
      });

      addDivider();
      addHeading("Plan your journey", 14);
      addBody("Reach out to The Happy Safar concierge team to personalise this experience and secure your preferred travel dates.");

      const sanitizedTitle = title.replace(/[\\/:*?"<>|]/g, "").trim() || "Safar Package";
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${sanitizedTitle}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate brochure PDF", error);
    } finally {
      setIsDownloading(false);
    }
  }, [duration, itinerary, isDownloading, priceTag, summary, title]);

  useEffect(() => {
    const html = document.documentElement;
    if (showDetailsModal || showEnquiryModal) {
      document.body.classList.add("modal-lock");
      html.classList.add("modal-lock");
    } else {
      document.body.classList.remove("modal-lock");
      html.classList.remove("modal-lock");
    }
    return () => {
      document.body.classList.remove("modal-lock");
      html.classList.remove("modal-lock");
    };
  }, [showDetailsModal, showEnquiryModal]);

  useEffect(() => {
    if (!showEnquiryModal) {
      setIsSubmitting(false);
      setSubmitState("idle");
      setSubmitError(null);
    }
  }, [showEnquiryModal]);

  return (
    <>
      <article
        data-package-id={details.id}
        className={cn(
          "package-card flex flex-col overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl",
          className
        )}
      >
        <div className="relative">
          <img src={image} alt={title} className="h-56 w-full object-cover" loading="lazy" />
          <span className="absolute left-0 top-0 rounded-br-2xl bg-amber-500 px-4 py-1 text-xs font-semibold uppercase text-white shadow-md">
            {priceTag}
          </span>
          <span className="absolute bottom-3 right-3 rounded-full bg-emerald-600/95 px-3 py-1 text-xs font-semibold text-white shadow">
            {duration}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <div>
            <h3 className="text-xl font-semibold text-zinc-900">{title}</h3>
            <div className="mt-2 text-sm text-zinc-600">
              <div className="flex items-start gap-2">
                <MapPinIcon size={22} className="mt-0.5 text-[#8a410d]" />
                <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#8a410d]">
                  {summarySegments.length > 0 ? (
                    summarySegments.map((segment, idx) => (
                      <span key={`${segment}-${idx}`} className="flex items-center gap-2">
                        <span className="rounded-full border border-[#f4c88a] bg-[#fff5e6] px-3 py-1 font-semibold">
                          {segment}
                        </span>
                        {idx < summarySegments.length - 1 && (
                          <span className="text-[#d97706]">→</span>
                        )}
                      </span>
                    ))
                  ) : (
                    <span className="text-zinc-600 normal-case tracking-normal">{summary}</span>
                  )}
                </div>
              </div>
              <p className="mt-3 rounded-2xl bg-amber-50/70 px-4 py-3 text-xs text-zinc-600 shadow-sm">
                Tap “See details” to explore the full day-by-day journey, highlights, and enquiry form.
              </p>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <button
              type="button"
              onClick={() => setShowDetailsModal(true)}
              className="flex items-center justify-center gap-2 rounded-full border border-[#8a410d] px-4 py-2 text-sm font-semibold text-[#8a410d] shadow-sm transition hover:bg-[#fef4ec] sm:flex-[0_0_28%]"
            >
              See details
              <MoveRight className="h-4 w-4" />
            </button>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-1">
              <button
                type="button"
                onClick={() => setShowEnquiryModal(true)}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#8a410d] px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-[#7a360b] sm:flex-[0_0_70%]"
              >
                Enquire Now
                <MoveRight className="h-4 w-4" />
              </button>
              <a
                href={`tel:${CALL_NUMBER}`}
                aria-label="Call our planners"
                className="flex items-center justify-center gap-2 rounded-full border border-[#8a410d] px-4 py-2 text-sm font-semibold text-[#8a410d] shadow-sm transition hover:bg-[#fef4ec] sm:flex-[0_0_20%]"
              >
                <PhoneCall className="h-4 w-4" />
                <span className="sm:hidden">Call</span>
              </a>
            </div>
          </div>
        </div>
      </article>

      {showDetailsModal && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-black/50 backdrop-blur-sm px-4 py-10 sm:py-16"
          onWheelCapture={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          onClick={() => setShowDetailsModal(false)}
        >
          <div
            className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="group absolute right-4 top-4 rounded-full border border-zinc-200 p-2 text-zinc-500 transition hover:bg-zinc-50"
              aria-label="Close details"
              onClick={() => setShowDetailsModal(false)}
            >
              <X className="h-4 w-4 transition group-hover:scale-110" />
            </button>
            <div className="grid gap-0 md:grid-cols-[1fr_1.15fr]">
              <div className="hidden md:block">
                <img src={image} alt={title} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="modal-scroll flex flex-col gap-6 p-6 sm:p-8">
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-zinc-100 pb-5 pr-12">
                  <div className="min-w-50 flex-1">
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-600">Tour details</p>
                    <h3 className="text-2xl font-semibold text-zinc-900">{title}</h3>
                    <p className="text-sm text-zinc-500">
                      {duration} • {priceTag}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDownloadBrochure}
                    disabled={isDownloading}
                    className="brochure-button"
                  >
                    {isDownloading ? "Preparing" : "Download brochure"}
                    <MoveRight className="h-3.5 w-3.5" />
                  </button>
                </div>

                <section className="space-y-3 text-sm text-zinc-600">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">Overview</h4>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-[#8a410d]">
                    {summarySegments.length > 0 ? (
                      summarySegments.map((segment, idx) => (
                        <span key={`modal-summary-${segment}-${idx}`} className="flex items-center gap-2">
                          <span className="rounded-full border border-[#f4c88a] bg-[#fff5e6] px-3 py-1 font-semibold">
                            {segment}
                          </span>
                          {idx < summarySegments.length - 1 && (
                            <span className="text-[#d97706]">→</span>
                          )}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm normal-case tracking-normal text-zinc-600">{summary}</span>
                    )}
                  </div>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-amber-700">
                    <span className="text-base">🗺️</span>
                    <h4 className="text-sm font-semibold uppercase tracking-[0.35em]">Itinerary</h4>
                  </div>
                  <div className="space-y-3">
                    {itinerary.map((stop, index) => {
                      const { tag, content, paragraphs } = parseItineraryStep(stop);
                      const narrative = paragraphs.length > 0 ? paragraphs : [content];

                      return (
                        <article key={`${stop}-${index}`} className="day-card">
                          <header className="day-card__header">
                            <div className="day-card__daywrap">
                              <span className="day-card__day">Day {index + 1}</span>
                              {tag && <span className="day-card__tag">{tag}</span>}
                            </div>
                          </header>
                          <ul className="day-card__body list-disc space-y-3 pl-5 text-left">
                            {narrative.map((block, blockIndex) => (
                              <li
                                key={`${tag ?? `day-${index}`}-block-${blockIndex}`}
                                className="rounded-2xl bg-amber-50/80 p-3 text-amber-900 shadow-sm"
                              >
                                {block}
                              </li>
                            ))}
                          </ul>
                        </article>
                      );
                    })}
                  </div>
                </section>

                <div className="mt-2 flex flex-col gap-3 border-t border-zinc-100 pt-5 sm:flex-row">
                  <button
                    type="button"
                    className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#8a410d] px-5 py-3 text-sm font-semibold text-white shadow hover:bg-[#7a360b]"
                    onClick={() => {
                      setShowDetailsModal(false);
                      setShowEnquiryModal(true);
                    }}
                  >
                    Enquire about this
                    <MoveRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEnquiryModal && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center overflow-y-auto bg-black/50 backdrop-blur-sm px-4 py-10 sm:py-16"
          onWheelCapture={(e) => e.stopPropagation()}
          onWheel={(e) => e.stopPropagation()}
          onClick={() => setShowEnquiryModal(false)}
        >
          <div
            className="w-full max-w-md overflow-hidden rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-scroll space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-600">Package enquiry</p>
                  <h3 className="text-2xl font-semibold text-zinc-900">{title}</h3>
                  <p className="text-sm text-zinc-500">
                    {duration} • {priceTag}
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-full border border-zinc-200 p-1 text-zinc-500 transition hover:bg-zinc-50"
                  aria-label="Close enquiry form"
                  onClick={() => setShowEnquiryModal(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {submitState === "success" ? (
                <div className="enquiry-success">
                  <div className="enquiry-success__icon">✓</div>
                  <h4>Thanks for your enquiry!</h4>
                  <p>We will reach out soon to craft your itinerary.</p>
                  <button
                    type="button"
                    className="enquiry-success__action"
                    onClick={() => {
                      setSubmitState("idle");
                      setSubmitError(null);
                    }}
                  >
                    Add More Enquiry
                  </button>
                </div>
              ) : (
                <form
                  className="space-y-4"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    if (isSubmitting) return;
                    setIsSubmitting(true);
                    setSubmitState("idle");
                    setSubmitError(null);

                    const form = event.currentTarget;
                    const formData = new FormData(form);

                    const payload = {
                      name: String(formData.get("name") ?? "").trim(),
                      email: String(formData.get("email") ?? "").trim(),
                      phone: String(formData.get("phone") ?? "").trim() || undefined,
                      message: String(formData.get("message") ?? "").trim(),
                      selectedPackage: title,
                      source: "package-card",
                    };

                    try {
                      const response = await fetch("/api/enquiry", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                      });

                      if (!response.ok) {
                        throw new Error("Failed to submit enquiry");
                      }

                      setSubmitState("success");
                      form.reset();
                    } catch (error) {
                      console.error("Enquiry submission failed", error);
                      setSubmitState("error");
                      setSubmitError("Unable to send enquiry right now. Please try again or call us.");
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                >
                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Selected package</span>
                    <input
                      readOnly
                      value={title}
                      className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm font-semibold text-zinc-800"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Your name</span>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Saira Sharma"
                      className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
                    />
                  </label>

                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Email</span>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="you@email.com"
                        className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
                      />
                    </label>
                    <label className="flex flex-col gap-2">
                      <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Mobile</span>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="+91 98765 43210"
                        className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
                      />
                    </label>
                  </div>

                  <label className="flex flex-col gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Query / customisation notes</span>
                    <textarea
                      name="message"
                      required
                      rows={4}
                      placeholder="Share your dates, headcount, preferences..."
                      className="rounded-2xl border border-zinc-200 px-4 py-3 text-sm outline-none transition focus:border-amber-500"
                    />
                  </label>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="space-y-2 flex-1">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-2 rounded-full bg-[#8a410d] px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#7a360b] disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isSubmitting ? "Sending..." : "Send enquiry"}
                      </button>
                      {submitState === "error" && submitError && (
                        <p className="text-center text-xs text-amber-700">{submitError}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      className="flex flex-1 items-center justify-center gap-2 rounded-full border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                      onClick={() => setShowEnquiryModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        :global(html.modal-lock), :global(body.modal-lock) {
          overflow: hidden;
        }

        .modal-scroll {
          max-height: 80vh;
          overflow-y: auto;
          padding-right: 0.35rem;
          overscroll-behavior: contain;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .modal-scroll::-webkit-scrollbar {
          display: none;
        }

        .day-card {
          border-radius: 18px;
          border: 1px solid rgba(221, 214, 196, 0.7);
          background: linear-gradient(180deg, #fffbeb 0%, #fff5d6 35%, #ffffff 100%);
          padding: 18px 20px;
          box-shadow: 0 16px 40px rgba(244, 169, 80, 0.08);
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .day-card__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .day-card__daywrap {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          align-items: center;
        }

        .day-card__day {
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #92400e;
        }

        .day-card__tag {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: rgba(245, 158, 11, 0.12);
          color: #92400e;
          border-radius: 999px;
          padding: 6px 12px;
        }

        .day-card__body {
          font-size: 0.9rem;
          line-height: 1.6;
          color: #3f3f46;
        }

        .brochure-button {
          font-size: 0.75rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.75rem;
          background-color: #111827;
          color: #f8fafc;
          border: 3px solid #FFD26D;
          border-radius: 1.5rem;
          font-weight: 700;
          box-shadow: -6px 6px 0 #FFD26D;
          transition: transform 0.4s ease,
            box-shadow 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .brochure-button:hover {
          transform: translate(2px, -2px);
          box-shadow: -5px 5px 0 #FFD26D;
        }

        .brochure-button:disabled {
          opacity: 0.65;
          cursor: not-allowed;
          transform: none;
          box-shadow: -2px 2px 0 #facc15;
        }

        :global(.package-card--highlight) {
          outline: 3px solid rgba(217, 119, 6, 0.45);
          outline-offset: 4px;
          animation: package-card-glow 1.8s ease;
        }

        @keyframes package-card-glow {
          0% {
            box-shadow: 0 0 0 rgba(245, 158, 11, 0);
          }
          40% {
            box-shadow: 0 28px 60px rgba(245, 158, 11, 0.25);
          }
          100% {
            box-shadow: 0 16px 40px rgba(244, 169, 80, 0.08);
          }
        }
      `}</style>
    </>
  );
}
