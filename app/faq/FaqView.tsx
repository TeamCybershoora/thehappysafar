"use client";

import type { FC } from "react";
import Navbar from "../components/Navbar";

export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqSection = {
  eyebrow: string;
  title: string;
  intro: string;
  faqs: FaqItem[];
};

type FaqViewProps = {
  sections: FaqSection[];
  callNumber: string;
  whatsappNumber: string;
};

const formatPhoneDigits = (value: string) => value.replace(/[^\d]/g, "");

const FaqView: FC<FaqViewProps> = ({ sections, callNumber, whatsappNumber }) => {
  const whatsappDigits = formatPhoneDigits(whatsappNumber);

  return (
    <>
    <Navbar />
    <main className="faq-page">
      <section className="faq-hero">
        <div className="faq-hero__glow" aria-hidden="true" />
        <div className="faq-hero__inner">
          <span className="faq-hero__eyebrow">FAQ</span>
          <h1>All your Rajasthan planning questions, answered.</h1>
          <p>
            We collected the most common questions travellers ask before locking in their Rajasthan safar. Browse by
            topic, or reach out if you need personalised guidance.
          </p>
          <div className="faq-hero__actions">
            <a href={`tel:${callNumber}`} className="faq-hero__cta-primary">
              Talk to a planner
            </a>
            <a href={`https://wa.me/${whatsappDigits}`} className="faq-hero__cta-secondary" target="_blank" rel="noopener">
              WhatsApp concierge
            </a>
          </div>
        </div>
      </section>

      <div className="faq-grid">
        {sections.map((section) => (
          <section key={section.title} className="faq-section">
            <div className="faq-section__header">
              <span className="faq-section__eyebrow">{section.eyebrow}</span>
              <h2>{section.title}</h2>
              <p>{section.intro}</p>
            </div>

            <div className="faq-section__list">
              {section.faqs.map((faq, index) => (
                <details key={faq.question} className="faq-item" open={index === 0}>
                  <summary>
                    <span className="faq-item__index">{String(index + 1).padStart(2, "0")}</span>
                    <span className="faq-item__question">{faq.question}</span>
                    <span className="faq-item__icon" aria-hidden="true" />
                  </summary>
                  <div className="faq-item__answer">
                    <p>{faq.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="faq-cta">
        <div className="faq-cta__inner">
          <div>
            <p className="faq-cta__eyebrow">Need something specific?</p>
            <h2>We’ll craft your bespoke Rajasthan itinerary.</h2>
            <p>
              Share your travel vibe, preferred dates, and headcount. Our planners respond within hours with tailored
              suggestions and transparent pricing.
            </p>
          </div>
          <a className="faq-cta__button" href="mailto:info@thehappysafar.com">
            Email the planner desk
          </a>
        </div>
      </section>

      <style jsx>{`
        .faq-page {
          display: flex;
          flex-direction: column;
          gap: 4rem;
          padding-top: 2rem;
          padding-bottom: 6rem;
          background: radial-gradient(circle at top, rgba(255, 220, 186, 0.35), rgba(255, 255, 255, 0.9) 45%, #f8fafc 100%);
        }

        .faq-hero {
          position: relative;
          padding: clamp(4rem, 8vw, 6rem) clamp(1.5rem, 7vw, 5rem);
          isolation: isolate;
        }

        .faq-hero__glow {
          position: absolute;
          inset: 0;
          background: conic-gradient(from 120deg at 30% 30%, rgba(249, 115, 22, 0.24), transparent 56%);
          filter: blur(90px);
          opacity: 0.8;
        }

        .faq-hero__inner {
          position: relative;
          z-index: 1;
          max-width: min(860px, 94vw);
          display: grid;
          gap: 1.5rem;
        }

        .faq-hero__eyebrow {
          font-size: 0.75rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #f97316;
          font-weight: 600;
        }

        .faq-hero h1 {
          font-size: clamp(2.4rem, 5vw, 3.6rem);
          color: #0f172a;
          line-height: 1.1;
        }

        .faq-hero p {
          font-size: clamp(1rem, 2.2vw, 1.3rem);
          line-height: 1.7;
          color: #475569;
          max-width: 720px;
        }

        .faq-hero__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .faq-hero__cta-primary,
        .faq-hero__cta-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0.9rem 1.9rem;
          font-size: 0.85rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 700;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
        }

        .faq-hero__cta-primary {
          background: linear-gradient(135deg, #ffa63d 0%, #f97316 100%);
          color: #0f172a;
          box-shadow: 0 20px 40px rgba(249, 115, 22, 0.25);
        }

        .faq-hero__cta-secondary {
          background: rgba(15, 23, 42, 0.08);
          color: #0f172a;
          border: 1px solid rgba(15, 23, 42, 0.22);
        }

        .faq-hero__cta-primary:hover,
        .faq-hero__cta-secondary:hover {
          transform: translateY(-3px);
        }

        .faq-grid {
          display: grid;
          gap: clamp(2.5rem, 4vw, 3rem);
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          width: min(1080px, 92vw);
          margin: 0 auto;
        }

        .faq-section {
          background: #ffffff;
          border-radius: 32px;
          padding: clamp(1.8rem, 3vw, 2.4rem);
          box-shadow: 0 32px 68px rgba(15, 23, 42, 0.08);
          border: 1px solid rgba(15, 23, 42, 0.05);
          display: grid;
          gap: 1.6rem;
        }

        .faq-section__header {
          display: grid;
          gap: 0.75rem;
        }

        .faq-section__eyebrow {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.32em;
          color: #f97316;
          font-weight: 600;
        }

        .faq-section h2 {
          font-size: clamp(1.6rem, 2.8vw, 2rem);
          color: #0f172a;
        }

        .faq-section__header p {
          color: #4b5563;
          line-height: 1.6;
          font-size: 0.98rem;
        }

        .faq-section__list {
          display: grid;
          gap: 1rem;
        }

        .faq-item {
          border-radius: 22px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          background: #f8fafc;
          overflow: hidden;
          transition: border 0.2s ease, box-shadow 0.2s ease;
        }

        .faq-item[open] {
          border-color: rgba(249, 115, 22, 0.35);
          box-shadow: 0 18px 36px rgba(249, 115, 22, 0.12);
        }

        .faq-item summary {
          list-style: none;
          cursor: pointer;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 1rem;
          padding: 1.1rem 1.4rem;
          font-weight: 600;
          color: #0f172a;
          font-size: 0.95rem;
        }

        .faq-item summary::-webkit-details-marker {
          display: none;
        }

        .faq-item__index {
          font-size: 0.8rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #f97316;
        }

        .faq-item__icon {
          width: 12px;
          height: 12px;
          position: relative;
        }

        .faq-item__icon::before,
        .faq-item__icon::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 10px;
          height: 2px;
          background: #0f172a;
          transform: translate(-50%, -50%);
          transition: transform 0.2s ease;
        }

        .faq-item__icon::after {
          transform: translate(-50%, -50%) rotate(90deg);
        }

        .faq-item[open] .faq-item__icon::after {
          transform: translate(-50%, -50%) rotate(180deg);
        }

        .faq-item__answer {
          padding: 0 1.4rem 1.4rem;
          display: grid;
          gap: 0.75rem;
          color: #475569;
          font-size: 0.95rem;
          line-height: 1.7;
        }

        .faq-cta {
          padding: clamp(2.4rem, 6vw, 3.6rem) clamp(1.5rem, 7vw, 4rem);
        }

        .faq-cta__inner {
          background: linear-gradient(135deg, rgba(29, 78, 216, 0.09), rgba(59, 130, 246, 0.08)),
            url("/textures/marble-noise.png") repeat;
          border-radius: 36px;
          padding: clamp(2.2rem, 4vw, 3rem);
          border: 1px solid rgba(29, 78, 216, 0.12);
          box-shadow: 0 28px 64px rgba(30, 64, 175, 0.18);
          display: grid;
          gap: 1.5rem;
          align-items: center;
        }

        .faq-cta__eyebrow {
          font-size: 0.75rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          color: #1e3a8a;
          font-weight: 600;
        }

        .faq-cta h2 {
          font-size: clamp(1.8rem, 3vw, 2.3rem);
          color: #0f172a;
        }

        .faq-cta p {
          color: #1f2937;
          line-height: 1.7;
          font-size: 1rem;
        }

        .faq-cta__button {
          justify-self: start;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          padding: 0.9rem 1.8rem;
          background: #1e3a8a;
          color: #ffffff;
          border-radius: 999px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-size: 0.82rem;
          font-weight: 700;
          text-decoration: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .faq-cta__button:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 40px rgba(30, 64, 175, 0.25);
        }

        @media (min-width: 960px) {
          .faq-cta__inner {
            grid-template-columns: 1fr auto;
          }
        }

        @media (max-width: 768px) {
          .faq-grid {
            grid-template-columns: 1fr;
          }

          .faq-item summary {
            grid-template-columns: auto 1fr;
            gap: 0.75rem;
          }

          .faq-item__icon {
            display: none;
          }
        }
      `}</style>
    </main>
    </>
  );
};

export default FaqView;
