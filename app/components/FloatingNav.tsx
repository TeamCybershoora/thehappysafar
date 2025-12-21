'use client';

import { useEffect, useRef, useState } from "react";

const templates = [
  "I’d like help planning a Rajasthan journey.",
  "Need a custom India itinerary for my family.",
  "Looking for a quick weekend escape suggestion.",
  "Can someone call me back about my travel dates?",
];

const WHATSAPP_NUMBER = "+919251147383";
const CALL_NUMBER = "+919251147383";

export default function FloatingNav() {
  const [popup, setPopup] = useState<"whatsapp" | "call" | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const cardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (!popup) return;
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setPopup(null);
      }
    };

    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [popup]);

  useEffect(() => {
    if (popup) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [popup]);

  const handleSend = () => {
    const message = selectedTemplate || customMessage.trim() || "Hi! I’d like to plan my next trip with The Happy Safar.";
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setPopup(null);
  };

  return (
    <div className="floating-nav">
      <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        <button
          aria-label="Chat on WhatsApp"
          className="floating-btn floating-btn--whatsapp"
          onClick={() =>
            setPopup((prev) => {
              if (prev === "whatsapp") return null;
              return "whatsapp";
            })
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28" />
          </svg>
        </button>
        <button
          aria-label="Call us"
          className="floating-btn floating-btn--call"
          onClick={() =>
            setPopup((prev) => {
              if (prev === "call") return null;
              return "call";
            })
          }
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 512 512" fill="currentColor">
            <path d="M391 480c-19.52 0-46.94-7.06-88-30c-49.93-28-88.55-53.85-138.21-103.38C116.91 298.77 93.61 267.79 61 208.45c-36.84-67-30.56-102.12-23.54-117.13C45.82 73.38 58.16 62.65 74.11 52a176.3 176.3 0 0 1 28.64-15.2c1-.43 1.93-.84 2.76-1.21c4.95-2.23 12.45-5.6 21.95-2c6.34 2.38 12 7.25 20.86 16c18.17 17.92 43 57.83 52.16 77.43c6.15 13.21 10.22 21.93 10.23 31.71c0 11.45-5.76 20.28-12.75 29.81c-1.31 1.79-2.61 3.5-3.87 5.16c-7.61 10-9.28 12.89-8.18 18.05c2.23 10.37 18.86 41.24 46.19 68.51s57.31 42.85 67.72 45.07c5.38 1.15 8.33-.59 18.65-8.47c1.48-1.13 3-2.3 4.59-3.47c10.66-7.93 19.08-13.54 30.26-13.54h.06c9.73 0 18.06 4.22 31.86 11.18c18 9.08 59.11 33.59 77.14 51.78c8.77 8.84 13.66 14.48 16.05 20.81c3.6 9.53.21 17-2 22c-.37.83-.78 1.74-1.21 2.75a176.5 176.5 0 0 1-15.29 28.58c-10.63 15.9-21.4 28.21-39.38 36.58A67.4 67.4 0 0 1 391 480" />
          </svg>
        </button>
      </div>

      {popup && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-4 text-left shadow-2xl" ref={cardRef}>
            {popup === "whatsapp" ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-500">WhatsApp</p>
                <h4 className="mb-3 mt-1 text-base font-semibold text-slate-900">Choose a quick message</h4>
                <div className="mb-4 flex flex-col gap-2">
                  {templates.map((template) => (
                    <button
                      type="button"
                      key={template}
                      className={`rounded-xl border px-3 py-2 text-left text-sm transition ${
                        selectedTemplate === template
                          ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                          : "border-slate-200 text-slate-600 hover:border-emerald-200"
                      }`}
                      onClick={() => {
                        setSelectedTemplate(template);
                        setCustomMessage("");
                      }}
                    >
                      {template}
                    </button>
                  ))}
                </div>

                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Custom Message
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 p-2 text-sm text-slate-700 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  placeholder="Type your own message..."
                  value={customMessage}
                  onChange={(e) => {
                    setCustomMessage(e.target.value);
                    setSelectedTemplate("");
                  }}
                />
                <button
                  type="button"
                  onClick={handleSend}
                  className="mt-3 inline-flex w-full items-center justify-center rounded-full bg-linear-to-r from-emerald-500 to-emerald-600 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                >
                  Send Message
                </button>
              </>
            ) : (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-500">Call Us</p>
                <h4 className="mb-3 mt-1 text-base font-semibold text-slate-900">Want to talk now?</h4>
                <p className="text-sm text-slate-600">
                  Tap the button below to dial our planner hotline. We’ll help customise your trip in minutes.
                </p>
                <a
                  href={`tel:${CALL_NUMBER}`}
                  className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-linear-to-r from-orange-500 to-orange-600 py-2 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
                  onClick={() => setPopup(null)}
                >
                  Call
                </a>
              </>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .floating-btn {
          pointer-events: auto;
          display: inline-flex;
          height: 3.25rem;
          width: 3.25rem;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          color: #fff;
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
          background-image: linear-gradient(135deg, #10b981, #059669);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .floating-btn--call {
          background-image: linear-gradient(135deg, #f97316, #ea580c);
        }

        .floating-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
        }

        .floating-btn:hover svg {
          animation: float-shake 0.6s ease;
        }

        @keyframes float-shake {
          0%,
          100% {
            transform: rotate(0deg) scale(1);
          }
          20% {
            transform: rotate(-10deg) scale(1.05);
          }
          40% {
            transform: rotate(8deg) scale(1.02);
          }
          60% {
            transform: rotate(-6deg) scale(1.04);
          }
          80% {
            transform: rotate(4deg) scale(1.03);
          }
        }
      `}</style>
    </div>
  );
}
