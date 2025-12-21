"use client";

import { useMemo, useState } from "react";
import Navbar from "../components/Navbar";

type ContactViewProps = {
  callNumber: string;
  whatsappNumber: string;
  email: string;
  officeAddress: string;
  officeCity: string;
  mapEmbedUrl: string;
};

type SubmitState = "idle" | "success" | "error";

const normaliseDigits = (value: string) => value.replace(/[^\d]/g, "");

export default function ContactView({
  callNumber,
  whatsappNumber,
  email,
  officeAddress,
  officeCity,
  mapEmbedUrl,
}: ContactViewProps) {
  const whatsappDigits = useMemo(() => normaliseDigits(whatsappNumber), [whatsappNumber]);
  const callDigits = useMemo(() => normaliseDigits(callNumber), [callNumber]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState<string | null>(null);

  return (
    <>
      <Navbar />
      <main className="contact-page">
        <section className="contact-hero">
          <div className="contact-hero__inner">
            <span className="contact-hero__eyebrow">Connect with our planner desk</span>
            <h1>Your Rajasthan journey starts with a conversation.</h1>
            <p>
              Tell us about your travel vibe, preferred dates, and the kind of memories you’re chasing. Our concierge team
              replies within hours with ideas, availability, and transparent pricing.
            </p>
            <div className="contact-hero__actions">
              <a className="contact-hero__cta-primary" href={`tel:${callNumber}`}>
                Call 
              </a>
              <a
                className="contact-hero__cta-secondary"
                href={`https://wa.me/${whatsappDigits}`}
                target="_blank"
                rel="noopener"
              >
                WhatsApp us
              </a>
              <a className="contact-hero__cta-tertiary" href={`mailto:${email}`}>
                Email
              </a>
            </div>
          </div>
        </section>

        <section className="contact-info">
          <div className="contact-info__grid">
            <article className="contact-card">
              <h2>Planner desk</h2>
              <p>Speak directly with the team that curates palace stays, desert experiences, and on-ground hosts.</p>
              <ul>
                <li>
                  <span>Phone</span>
                  <a href={`tel:${callNumber}`}>+91 {callDigits.slice(-10)}</a>
                </li>
                <li>
                  <span>WhatsApp</span>
                  <a href={`https://wa.me/${whatsappDigits}`} target="_blank" rel="noopener">
                    {whatsappNumber}
                  </a>
                </li>
                <li>
                  <span>Email</span>
                  <a href={`mailto:${email}`}>{email}</a>
                </li>
              </ul>
            </article>

            <article className="contact-card">
              <h2>Experience studio</h2>
              <p>
                Visit us in {officeCity} for itinerary workshops, inspiration boards, and handcrafted decor from the safar
                route.
              </p>
              <ul>
                <li>
                  <span>Studio address</span>
                  <p>{officeAddress}</p>
                </li>
                <li>
                  <span>Hours</span>
                  <p>Monday – Saturday, 10:00 AM to 6:30 PM IST</p>
                </li>
                <li>
                  <span>Follow along</span>
                  <div className="contact-socials">
                    <a href="https://instagram.com/thehappysafar" target="_blank" rel="noopener">
                      Instagram
                    </a>
                    <a href="https://facebook.com/thehappysafar" target="_blank" rel="noopener">
                      Facebook
                    </a>
                    <a href="https://linkedin.com/company/thehappysafar" target="_blank" rel="noopener">
                      LinkedIn
                    </a>
                  </div>
                </li>
              </ul>
            </article>
          </div>
        </section>

        <section className="contact-form">
          <div className="contact-form__inner">
            <div className="contact-form__copy">
              <span className="contact-form__eyebrow">Share your brief</span>
              <h2>Tell us about your safar.</h2>
              <p>
                The more we know about your group size, travel month, budget comfort, and must-see experiences, the better
                we can personalise your Rajasthan journey.
              </p>
              <div className="contact-form__highlights">
                <div>
                  <strong>24h response</strong>
                  <p>A dedicated planner replies within one business day.</p>
                </div>
                <div>
                  <strong>Bespoke curation</strong>
                  <p>Palace stays, boutique camps, and curated experiences tailored for you.</p>
                </div>
                <div>
                  <strong>Concierge support</strong>
                  <p>On-ground pods in Jaipur, Jodhpur, Udaipur, and Jaisalmer keep your plans fluid.</p>
                </div>
              </div>
            </div>

            <form
              className="contact-form__fields"
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
                  email: String(data.get("email") ?? "").trim(),
                  phone: String(data.get("phone") ?? "").trim() || undefined,
                  travelDates: String(data.get("travelDates") ?? "").trim() || undefined,
                  message: String(data.get("message") ?? "").trim(),
                  selectedPackage: "Contact page enquiry",
                  source: "contact-page",
                };

                try {
                  const response = await fetch("/api/enquiry", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                  });

                  if (!response.ok) {
                    throw new Error("Failed to submit contact enquiry");
                  }

                  form.reset();
                  setSubmitState("success");
                } catch (error) {
                  console.error("Contact form submission failed", error);
                  setSubmitState("error");
                  setSubmitError("Unable to send your message right now. Please try again or use the phone/WhatsApp options above.");
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              <label>
                <span>Your name</span>
                <input type="text" name="name" placeholder="Your full name" required />
              </label>
              <label>
                <span>Email</span>
                <input type="email" name="email" placeholder="you@email.com" required />
              </label>
              <label>
                <span>Mobile number</span>
                <input type="tel" name="phone" placeholder="Include country code" />
              </label>
              <label>
                <span>Travel window</span>
                <input type="text" name="travelDates" placeholder="e.g. 18-24 December" />
              </label>
              <label className="contact-form__full">
                <span>What should we know?</span>
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Tell us about your group, interests, budget comfort, and must-do experiences."
                  required
                />
              </label>

              {submitState === "success" && (
                <div className="contact-form__status contact-form__status--success">
                  Thank you! Our planner desk will reach out shortly.
                </div>
              )}
              {submitState === "error" && submitError && (
                <div className="contact-form__status contact-form__status--error">{submitError}</div>
              )}

              <div className="contact-form__actions contact-form__full">
                <button type="submit" className="contact-form__submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending" : "Send enquiry"}
                </button>
                <p className="contact-form__note">
                  By submitting, you agree to be contacted by The Happy Safar’s planner desk.
                </p>
              </div>
            </form>
          </div>
        </section>

        <section className="contact-map">
          <div className="contact-map__inner">
            <div className="contact-map__copy">
              <span className="contact-map__eyebrow">Visit us</span>
              <h2>Drop into our experience studio in {officeCity}.</h2>
              <p>
                Preview textiles, hand-crafted itineraries, and curated experiences while sipping on masala chai. We love
                welcoming travellers before they begin their safar.
              </p>
            </div>
            <div className="contact-map__frame">
              <iframe
                title="The Happy Safar Experience Studio"
                src={mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </section>

        <section className="contact-cta">
          <div className="contact-cta__inner">
            <div>
              <p className="contact-cta__eyebrow">Plan with confidence</p>
              <h2>Let’s craft the Rajasthan chapter you’ll never forget.</h2>
              <p>
                Call, WhatsApp, or send a note. We’ll stitch together a journey with palace suites, desert sunsets, and
                seamless logistics.
              </p>
            </div>
            <div className="contact-cta__actions">
              <a className="contact-cta__button" href={`tel:${callNumber}`}>
                Call now
              </a>
              <a className="contact-cta__button contact-cta__button--secondary" href={`https://wa.me/${whatsappDigits}`} target="_blank" rel="noopener">
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>

        <style jsx>{`
          .contact-page {
            display: flex;
            flex-direction: column;
            gap: 4.5rem;
            padding-top: 2rem;
            padding-bottom: 5rem;
            background: linear-gradient(180deg, #fff7ed 0%, #ffffff 35%, #f8fafc 100%);
          }

          .contact-hero {
            padding: clamp(4.5rem, 9vw, 6rem) clamp(1.5rem, 7vw, 5rem) 0;
          }

          .contact-hero__inner {
            background: linear-gradient(135deg, rgba(255, 240, 224, 0.7), rgba(255, 255, 255, 0.95));
            border-radius: 44px;
            border: 1px solid rgba(249, 115, 22, 0.15);
            box-shadow: 0 40px 90px rgba(15, 23, 42, 0.12);
            padding: clamp(2.4rem, 5vw, 3.6rem);
            display: grid;
            gap: 1.4rem;
            max-width: min(940px, 95vw);
          }

          .contact-hero__eyebrow {
            font-size: 0.75rem;
            letter-spacing: 0.32em;
            text-transform: uppercase;
            color: #f97316;
            font-weight: 600;
          }

          .contact-hero h1 {
            font-size: clamp(2.6rem, 4.8vw, 3.8rem);
            line-height: 1.08;
            color: #0f172a;
          }

          .contact-hero p {
            font-size: clamp(1rem, 2.4vw, 1.25rem);
            color: #475569;
            line-height: 1.7;
          }

          .contact-hero__actions {
            display: flex;
            flex-wrap: wrap;
            gap: 0.9rem;
          }

          .contact-hero__cta-primary,
          .contact-hero__cta-secondary,
          .contact-hero__cta-tertiary {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 999px;
            padding: 0.9rem 1.8rem;
            font-size: 0.82rem;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            font-weight: 700;
            text-decoration: none;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }

          .contact-hero__cta-primary {
            background: linear-gradient(135deg, #ff9327 0%, #f97316 100%);
            color: #0f172a;
            box-shadow: 0 22px 44px rgba(249, 115, 22, 0.2);
          }

          .contact-hero__cta-secondary {
            border: 1px solid rgba(15, 23, 42, 0.1);
            color: #0f172a;
            background: rgba(15, 23, 42, 0.05);
          }

          .contact-hero__cta-tertiary {
            border: 1px solid rgba(249, 115, 22, 0.35);
            color: #f97316;
            background: rgba(249, 115, 22, 0.12);
          }

          .contact-hero__cta-primary:hover,
          .contact-hero__cta-secondary:hover,
          .contact-hero__cta-tertiary:hover {
            transform: translateY(-3px);
          }

          .contact-info {
            padding: 0 clamp(1.5rem, 7vw, 5rem);
          }

          .contact-info__grid {
            display: grid;
            gap: clamp(1.5rem, 4vw, 2.4rem);
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            margin: 0 auto;
            width: min(1080px, 95vw);
          }

          .contact-card {
            background: #ffffff;
            border-radius: 36px;
            border: 1px solid rgba(15, 23, 42, 0.06);
            box-shadow: 0 35px 80px rgba(15, 23, 42, 0.08);
            padding: clamp(2rem, 4vw, 2.6rem);
            display: grid;
            gap: 1.2rem;
          }

          .contact-card h2 {
            font-size: clamp(1.6rem, 2.5vw, 2rem);
            color: #0f172a;
          }

          .contact-card p {
            color: #4b5563;
            line-height: 1.7;
          }

          .contact-card ul {
            display: grid;
            gap: 1.1rem;
          }

          .contact-card li span {
            display: block;
            font-size: 0.72rem;
            letter-spacing: 0.32em;
            text-transform: uppercase;
            color: #f97316;
            font-weight: 600;
            margin-bottom: 0.4rem;
          }

          .contact-card a {
            color: #0f172a;
            font-weight: 600;
            text-decoration: none;
          }

          .contact-card a:hover {
            text-decoration: underline;
          }

          .contact-socials {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
          }

          .contact-socials a {
            font-size: 0.85rem;
            font-weight: 600;
            color: #1e3a8a;
          }

          .contact-form {
            padding: 0 clamp(1.5rem, 7vw, 5rem);
          }

          .contact-form__inner {
            background: #ffffff;
            border-radius: 44px;
            border: 1px solid rgba(15, 23, 42, 0.05);
            box-shadow: 0 40px 90px rgba(15, 23, 42, 0.1);
            padding: clamp(2.2rem, 4vw, 3.2rem);
            display: grid;
            gap: clamp(2rem, 4vw, 2.6rem);
          }

          @media (min-width: 1040px) {
            .contact-form__inner {
              grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
              align-items: start;
            }
          }

          .contact-form__copy {
            display: grid;
            gap: 1.2rem;
          }

          .contact-form__eyebrow {
            font-size: 0.72rem;
            letter-spacing: 0.32em;
            text-transform: uppercase;
            color: #f97316;
            font-weight: 600;
          }

          .contact-form__copy h2 {
            font-size: clamp(1.8rem, 3vw, 2.3rem);
            color: #0f172a;
          }

          .contact-form__copy p {
            color: #4b5563;
            line-height: 1.7;
          }

          .contact-form__highlights {
            display: grid;
            gap: 1rem;
          }

          .contact-form__highlights div {
            background: rgba(249, 115, 22, 0.08);
            border-radius: 24px;
            padding: 1.1rem 1.3rem;
            border: 1px solid rgba(249, 115, 22, 0.16);
          }

          .contact-form__highlights strong {
            display: block;
            font-size: 1.05rem;
            color: #b45309;
            margin-bottom: 0.35rem;
          }

          .contact-form__fields {
            display: grid;
            gap: 1.2rem;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          }

          .contact-form__fields label {
            display: grid;
            gap: 0.55rem;
            font-size: 0.78rem;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: #475569;
            font-weight: 600;
          }

          .contact-form__fields input,
          .contact-form__fields textarea {
            border-radius: 18px;
            border: 1px solid rgba(15, 23, 42, 0.12);
            background: #f8fafc;
            color: #0f172a;
            padding: 0.9rem 1rem;
            font-size: 0.95rem;
            outline: none;
            transition: border 0.2s ease, box-shadow 0.2s ease;
          }

          .contact-form__fields input:focus,
          .contact-form__fields textarea:focus {
            border-color: rgba(99, 102, 241, 0.6);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.16);
          }

          .contact-form__full {
            grid-column: 1 / -1;
          }

          .contact-form__actions {
            display: grid;
            gap: 0.85rem;
          }

          .contact-form__submit {
            border: none;
            border-radius: 999px;
            padding: 0.95rem 1.9rem;
            background: linear-gradient(135deg, #ff9327, #f97316);
            color: #ffffff;
            font-weight: 700;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            font-size: 0.82rem;
            cursor: pointer;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }

          .contact-form__submit:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 20px 40px rgba(249, 115, 22, 0.22);
          }

          .contact-form__submit:disabled {
            opacity: 0.65;
            cursor: not-allowed;
          }

          .contact-form__note {
            font-size: 0.72rem;
            letter-spacing: 0.16em;
            text-transform: uppercase;
            color: #64748b;
          }

          .contact-form__status {
            border-radius: 16px;
            padding: 0.9rem 1.1rem;
            font-size: 0.85rem;
            line-height: 1.6;
          }

          .contact-form__status--success {
            background: rgba(34, 197, 94, 0.16);
            border: 1px solid rgba(22, 163, 74, 0.3);
            color: #166534;
          }

          .contact-form__status--error {
            background: rgba(248, 113, 113, 0.16);
            border: 1px solid rgba(220, 38, 38, 0.3);
            color: #b91c1c;
          }

          .contact-map {
            padding: 0 clamp(1.5rem, 7vw, 5rem);
          }

          .contact-map__inner {
            background: #ffffff;
            border-radius: 44px;
            border: 1px solid rgba(15, 23, 42, 0.05);
            box-shadow: 0 36px 80px rgba(15, 23, 42, 0.1);
            padding: clamp(2.2rem, 4vw, 3rem);
            display: grid;
            gap: clamp(1.6rem, 3vw, 2.2rem);
          }

          @media (min-width: 1040px) {
            .contact-map__inner {
              grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
              align-items: stretch;
            }
          }

          .contact-map__eyebrow {
            font-size: 0.72rem;
            letter-spacing: 0.32em;
            text-transform: uppercase;
            color: #f97316;
            font-weight: 600;
          }

          .contact-map__copy h2 {
            font-size: clamp(1.8rem, 3vw, 2.4rem);
            color: #0f172a;
            margin-bottom: 0.6rem;
          }

          .contact-map__copy p {
            color: #4b5563;
            line-height: 1.7;
          }

          .contact-map__frame {
            border-radius: 32px;
            overflow: hidden;
            min-height: 320px;
            box-shadow: 0 32px 72px rgba(30, 64, 175, 0.18);
          }

          .contact-map__frame iframe {
            border: 0;
            width: 100%;
            height: 100%;
          }

          .contact-cta {
            padding: 0 clamp(1.5rem, 7vw, 5rem);
          }

          .contact-cta__inner {
            background: linear-gradient(135deg, rgba(30, 64, 175, 0.1), rgba(59, 130, 246, 0.15));
            border-radius: 40px;
            padding: clamp(2.4rem, 5vw, 3.2rem);
            border: 1px solid rgba(30, 64, 175, 0.18);
            box-shadow: 0 38px 88px rgba(30, 64, 175, 0.2);
            display: grid;
            gap: 1.5rem;
            align-items: center;
          }

          .contact-cta__eyebrow {
            font-size: 0.72rem;
            letter-spacing: 0.32em;
            text-transform: uppercase;
            color: #1d4ed8;
            font-weight: 600;
          }

          .contact-cta__inner h2 {
            font-size: clamp(1.9rem, 3.2vw, 2.5rem);
            color: #0f172a;
          }

          .contact-cta__inner p {
            color: #1f2937;
            line-height: 1.7;
          }

          .contact-cta__actions {
            display: flex;
            flex-wrap: wrap;
            gap: 0.75rem;
          }

          .contact-cta__button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.85rem 1.8rem;
            border-radius: 999px;
            font-size: 0.82rem;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            font-weight: 700;
            text-decoration: none;
            color: #ffffff;
            background: #1d4ed8;
            box-shadow: 0 24px 52px rgba(29, 78, 216, 0.25);
            transition: transform 0.2s ease, box-shadow 0.2s ease;
          }

          .contact-cta__button--secondary {
            background: rgba(255, 255, 255, 0.18);
            color: #0f172a;
            border: 1px solid rgba(15, 23, 42, 0.2);
            box-shadow: 0 18px 40px rgba(15, 23, 42, 0.12);
          }

          .contact-cta__button:hover {
            transform: translateY(-3px);
          }

          @media (min-width: 960px) {
            .contact-cta__inner {
              grid-template-columns: minmax(0, 1fr) auto;
            }
          }

          @media (max-width: 768px) {
            .contact-hero__inner,
            .contact-card,
            .contact-form__inner,
            .contact-map__inner,
            .contact-cta__inner {
              border-radius: 24px;
            }

            .contact-hero__actions,
            .contact-cta__actions {
              flex-direction: column;
              align-items: stretch;
            }
          }
        `}</style>
      </main>
    </>
  );
}
