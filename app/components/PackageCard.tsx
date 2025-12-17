"use client";

import { useEffect, useState } from "react";
import { MoveRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PackageDetails } from "@/types/packages";

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
    ctaLink = "/#enquiry",
  } = details;

  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEnquiryModal, setShowEnquiryModal] = useState(false);

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

  return (
    <>
      <article
        className={cn(
          "flex flex-col overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-xl transition hover:-translate-y-1 hover:shadow-2xl",
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
              <p className="flex items-start gap-2">
                <span aria-hidden="true">📍</span>
                <span>{summary}</span>
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-6 text-xs text-zinc-500">
                {itinerary.map((stop) => (
                  <li key={stop}>{stop}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setShowDetailsModal(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#8a410d] px-4 py-2 text-sm font-semibold text-[#8a410d] shadow-sm transition hover:bg-[#fef4ec]"
            >
              See details
              <MoveRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setShowEnquiryModal(true)}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#8a410d] px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-[#7a360b]"
            >
              Enquire Now
              <MoveRight className="h-4 w-4" />
            </button>
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
            className="w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid gap-0 md:grid-cols-[1fr_1.15fr]">
              <div className="hidden md:block">
                <img src={image} alt={title} className="h-full w-full object-cover" loading="lazy" />
              </div>
              <div className="modal-scroll flex flex-col gap-6 p-6 sm:p-8">
                <div className="flex items-start justify-between gap-4 border-b border-zinc-100 pb-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-600">Tour details</p>
                    <h3 className="text-2xl font-semibold text-zinc-900">{title}</h3>
                    <p className="text-sm text-zinc-500">
                      {duration} • {priceTag}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="rounded-full border border-zinc-200 p-1 text-zinc-500 transition hover:bg-zinc-50"
                    aria-label="Close details"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <section className="space-y-3 text-sm text-zinc-600">
                  <h4 className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">Overview</h4>
                  <p className="leading-6 text-zinc-600">{summary}</p>
                </section>

                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-amber-700">
                    <span className="text-base">🗺️</span>
                    <h4 className="text-sm font-semibold uppercase tracking-[0.35em]">Itinerary</h4>
                  </div>
                  <div className="space-y-3">
                    {itinerary.map((stop, index) => (
                      <article key={`${stop}-detail`} className="day-card">
                        <header className="day-card__header">
                          <div>
                            <p className="day-card__day">Day {index + 1}</p>
                            <p className="day-card__tag">Rajasthan circuit</p>
                          </div>
                        </header>
                        <p className="day-card__body">{stop}</p>
                      </article>
                    ))}
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
                  <a
                    href={ctaLink}
                    target="_blank"
                    rel="noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-full border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                  >
                    Download brochure
                    <MoveRight className="h-4 w-4" />
                  </a>
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

              <div className="rounded-2xl bg-amber-50/80 p-4 text-sm text-zinc-600">
                <p className="font-semibold text-amber-800">Included trail</p>
                <ul className="mt-2 list-disc space-y-1 pl-4">
                  {itinerary.map((stop) => (
                    <li key={`${stop}-modal`}>{stop}</li>
                  ))}
                </ul>
              </div>

              <form className="space-y-4">
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
                <button
                  type="submit"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#8a410d] px-5 py-3 text-sm font-semibold text-white shadow hover:bg-[#7a360b]"
                >
                  Send enquiry
                </button>
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-2 rounded-full border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
                  onClick={() => setShowEnquiryModal(false)}
                >
                  Cancel
                </button>
              </div>
              </form>
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
      `}</style>
    </>
  );
}
