"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type EnquiryEventDetail = {
  subject?: string;
  source?: string;
  prefill?: {
    name?: string;
    email?: string;
    phone?: string;
    message?: string;
  };
};

type SubmitState = "idle" | "success" | "error";

const DEFAULT_SOURCE = "global-modal";

export default function GlobalEnquiryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [detail, setDetail] = useState<Required<Pick<EnquiryEventDetail, "source">> & EnquiryEventDetail>({
    source: DEFAULT_SOURCE,
  });

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSubmitState("idle");
    setSubmitError(null);
    setIsSubmitting(false);
  }, []);

  useEffect(() => {
    const handleOpen = (event: Event) => {
      const custom = event as CustomEvent<EnquiryEventDetail>;
      const incoming = custom.detail ?? {};
      setDetail({
        source: incoming.source ?? DEFAULT_SOURCE,
        subject: incoming.subject,
        prefill: incoming.prefill,
      });
      setFormKey((prev) => prev + 1);
      setSubmitState("idle");
      setSubmitError(null);
      setIsSubmitting(false);
      setIsOpen(true);
    };

    const handleClose = () => closeModal();

    window.addEventListener("open-enquiry", handleOpen as EventListener);
    window.addEventListener("close-enquiry", handleClose as EventListener);

    return () => {
      window.removeEventListener("open-enquiry", handleOpen as EventListener);
      window.removeEventListener("close-enquiry", handleClose as EventListener);
    };
  }, [closeModal]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKey);
    document.body.classList.add("modal-lock");

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.classList.remove("modal-lock");
    };
  }, [isOpen, closeModal]);

  const prefill = useMemo(() => detail.prefill ?? {}, [detail.prefill]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="enquiry-modal" role="dialog" aria-modal="true" aria-labelledby="global-enquiry-heading">
      <div className="enquiry-modal__backdrop" onClick={closeModal} aria-hidden="true" />
      <div className="enquiry-modal__card" role="document">
        <button type="button" className="enquiry-modal__close" onClick={closeModal} aria-label="Close enquiry form">
          ×
        </button>
        <p className="enquiry-modal__eyebrow">Talk to The Happy Safar planner desk</p>
        <h2 id="global-enquiry-heading">Plan your Rajasthan escape</h2>
        {detail.subject && <p className="enquiry-modal__context">Interest: {detail.subject}</p>}

        {submitState === "success" ? (
          <div className="enquiry-modal__success">
            <div className="enquiry-modal__success-icon">✓</div>
            <h3>Thank you!</h3>
            <p>Our concierge will reach out shortly to craft your itinerary.</p>
            <button
              type="button"
              className="enquiry-modal__primary"
              onClick={closeModal}
            >
              Close
            </button>
          </div>
        ) : (
          <form
            key={formKey}
            className="enquiry-modal__form"
            onSubmit={async (event) => {
              event.preventDefault();
              if (isSubmitting) return;

              setIsSubmitting(true);
              setSubmitState("idle");
              setSubmitError(null);

              const form = event.currentTarget;
              const data = new FormData(form);

              const payload = {
                name: String(data.get("name") ?? "").trim(),
                phone: String(data.get("phone") ?? "").trim(),
                email: String(data.get("email") ?? "").trim(),
                message: String(data.get("message") ?? "").trim(),
                selectedPackage: detail.subject ?? undefined,
                source: detail.source ?? DEFAULT_SOURCE,
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

                form.reset();
                setSubmitState("success");
              } catch (error) {
                console.error("Global enquiry submission failed", error);
                setSubmitState("error");
                setSubmitError("Unable to submit right now. Please try again or WhatsApp us.");
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            <label>
              <span>Your name</span>
              <input name="name" type="text" placeholder="Your full name" defaultValue={prefill.name ?? ""} required />
            </label>
            <label>
              <span>Mobile number</span>
              <input name="phone" type="tel" placeholder="Include country code" defaultValue={prefill.phone ?? ""} required />
            </label>
            <label>
              <span>Email address</span>
              <input name="email" type="email" placeholder="you@email.com" defaultValue={prefill.email ?? ""} required />
            </label>
            <label className="enquiry-modal__full">
              <span>Trip expectations</span>
              <textarea
                name="message"
                rows={4}
                placeholder="Tell us about your dates, group size, budget comfort, and wishlist."
                defaultValue={prefill.message ?? ""}
                required
              />
            </label>

            {submitState === "error" && submitError && (
              <p className="enquiry-modal__status enquiry-modal__status--error">{submitError}</p>
            )}

            <div className="enquiry-modal__actions enquiry-modal__full">
              <button type="submit" className="enquiry-modal__primary" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send enquiry"}
              </button>
            </div>
          </form>
        )}
      </div>

      <style jsx>{`
        .enquiry-modal {
          position: fixed;
          inset: 0;
          z-index: 120;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(1.5rem, 4vw, 2.5rem);
        }

        .enquiry-modal__backdrop {
          position: absolute;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          backdrop-filter: blur(6px);
        }

        .enquiry-modal__card {
          position: relative;
          z-index: 1;
          width: min(560px, 100%);
          border-radius: 32px;
          background: linear-gradient(135deg, rgba(255, 247, 237, 0.95), rgba(255, 255, 255, 0.98));
          border: 1px solid rgba(249, 115, 22, 0.18);
          box-shadow: 0 40px 90px rgba(15, 23, 42, 0.18);
          padding: clamp(1.8rem, 4vw, 2.6rem);
          display: grid;
          gap: 1rem;
        }

        .enquiry-modal__close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          border: none;
          background: rgba(15, 23, 42, 0.08);
          color: #0f172a;
          border-radius: 999px;
          width: 2.5rem;
          height: 2.5rem;
          font-size: 1.5rem;
          line-height: 1;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .enquiry-modal__close:hover {
          transform: scale(1.05);
        }

        .enquiry-modal__eyebrow {
          font-size: 0.72rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #f97316;
          font-weight: 600;
        }

        .enquiry-modal h2 {
          font-size: clamp(1.9rem, 3.2vw, 2.4rem);
          color: #0f172a;
          margin: 0;
        }

        .enquiry-modal__context {
          font-size: 0.85rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #475569;
          font-weight: 600;
        }

        .enquiry-modal__form {
          display: grid;
          gap: 1.1rem;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        }

        .enquiry-modal__form label {
          display: grid;
          gap: 0.55rem;
          font-size: 0.78rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #475569;
          font-weight: 600;
        }

        .enquiry-modal__form input,
        .enquiry-modal__form textarea {
          border-radius: 18px;
          border: 1px solid rgba(15, 23, 42, 0.12);
          background: #fff;
          padding: 0.9rem 1rem;
          font-size: 0.95rem;
          color: #0f172a;
          outline: none;
          transition: border 0.2s ease, box-shadow 0.2s ease;
        }

        .enquiry-modal__form input:focus,
        .enquiry-modal__form textarea:focus {
          border-color: rgba(249, 115, 22, 0.55);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.18);
        }

        .enquiry-modal__full {
          grid-column: 1 / -1;
        }

        .enquiry-modal__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
        }

        .enquiry-modal__primary {
          flex: 1 1 160px;
          border: none;
          border-radius: 999px;
          padding: 0.85rem 1.6rem;
          background: linear-gradient(135deg, #ff9327, #f97316);
          color: #fff;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-size: 0.8rem;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .enquiry-modal__primary:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 20px 40px rgba(249, 115, 22, 0.25);
        }

        .enquiry-modal__primary:disabled {
          opacity: 0.65;
          cursor: not-allowed;
        }

        .enquiry-modal__secondary {
          flex: 1 1 140px;
          border-radius: 999px;
          padding: 0.85rem 1.6rem;
          border: 1px solid rgba(15, 23, 42, 0.2);
          background: rgba(15, 23, 42, 0.05);
          color: #0f172a;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: 0.78rem;
          cursor: pointer;
        }

        .enquiry-modal__status {
          font-size: 0.85rem;
          border-radius: 14px;
          padding: 0.75rem 1rem;
        }

        .enquiry-modal__status--error {
          background: rgba(248, 113, 113, 0.16);
          border: 1px solid rgba(220, 38, 38, 0.3);
          color: #b91c1c;
        }

        .enquiry-modal__success {
          display: grid;
          gap: 1rem;
          text-align: center;
        }

        .enquiry-modal__success-icon {
          width: 56px;
          height: 56px;
          margin: 0 auto;
          border-radius: 18px;
          background: rgba(34, 197, 94, 0.18);
          color: #166534;
          display: grid;
          place-items: center;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .enquiry-modal__success h3 {
          font-size: 1.4rem;
          color: #0f172a;
          margin: 0;
        }

        .enquiry-modal__success p {
          color: #475569;
          margin: 0;
          line-height: 1.6;
        }

        @media (max-width: 640px) {
          .enquiry-modal {
            padding: max(1rem, env(safe-area-inset-top)) max(1rem, env(safe-area-inset-right))
              max(1rem, env(safe-area-inset-bottom)) max(1rem, env(safe-area-inset-left));
          }

          .enquiry-modal__card {
            width: 100%;
            max-width: 420px;
            max-height: min(90vh, 720px);
            border-radius: 24px;
            padding: 1.75rem;
            overflow-y: auto;
          }

          .enquiry-modal__close {
            top: 0.75rem;
            right: 0.75rem;
          }

          .enquiry-modal__form {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .enquiry-modal__actions {
            flex-direction: column;
          }

          .enquiry-modal__primary,
          .enquiry-modal__secondary {
            width: 100%;
            flex: 1 1 auto;
          }
        }

        @media (max-width: 360px) {
          .enquiry-modal__card {
            padding: 1.5rem;
          }

          .enquiry-modal__form input,
          .enquiry-modal__form textarea {
            font-size: 0.9rem;
          }

          .enquiry-modal__primary,
          .enquiry-modal__secondary {
            font-size: 0.75rem;
            letter-spacing: 0.15em;
          }
        }
      `}</style>
    </div>
  );
}
