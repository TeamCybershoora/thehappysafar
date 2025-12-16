"use client";

import { useState } from "react";
import { ChevronDown, Clock3, Headphones, MapPin, ShieldCheck } from "lucide-react";

const trustFeatures = [
  {
    title: "GPS Tracked SUVs",
    description: "Desert drives and city hops are monitored live for safety across Rajasthan.",
    icon: ShieldCheck,
    accent: { border: "#bbf7d0", background: "#f0fdf4" },
  },
  {
    title: "Heritage-Trained Drivers",
    description: "Licensed chauffeurs who know every ghat, bazaar, and offbeat fort lane.",
    icon: MapPin,
    accent: { border: "#ddd6fe", background: "#f5f3ff" },
  },
  {
    title: "Buffer-Friendly Itineraries",
    description: "Routes are timed for palace traffic, sunset dunes, and leopard trails.",
    icon: Clock3,
    accent: { border: "#bae6fd", background: "#e0f2fe" },
  },
  {
    title: "24x7 Desert Desk",
    description: "On-ground planners in Jaipur and Jodhpur keep WhatsApp support always on.",
    icon: Headphones,
    accent: { border: "#bbf7d0", background: "#ecfdf5" },
  },
];

const faqItems = [
  {
    question: "What makes your Rajasthan trips special?",
    answer:
      "Each itinerary blends palace stays, curated storytellers, and private chauffeurs. We handle every pass, permit, and surprise ritual so you explore worry-free.",
  },
  {
    question: "When is the best time to visit Rajasthan?",
    answer:
      "October to March gives crisp desert weather. For summer, we curate Aravalli wellness or lake-side residencies, and monsoon safaris in Jawai or Kumbhalgarh.",
  },
  {
    question: "How do you manage transport across cities?",
    answer:
      "We use vetted SUVs with GPS, premium trains between select hubs, and chartered dune transfers when needed—always tracked by our command desk.",
  },
  {
    question: "Can you support seniors, kids, or special requests?",
    answer:
      "Yes. We add shorter drives, step-free suites, medical-on-call, kids’ treasure trails, or culinary sessions—whatever your crew needs.",
  },
  {
    question: "Do I get help during the journey?",
    answer:
      "Absolutely. A planner plus on-ground host track every leg 24/7 for tweaks, delays, or extra experiences. Just ping us on WhatsApp.",
  },
  {
    question: "How many days do I need for Rajasthan circuits?",
    answer:
      "Weekend Jaipur runs are 3–4 days, classic Jaipur–Jodhpur–Udaipur circuits sit at 6–8 days, and deep-dive desert + leopard trails span 9–12 days.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);
  const contentRefs = useState<(HTMLDivElement | null)[]>([])[0];

  return (
    <section id="faq" className="faq-section">
      <div className="faq-grid">
        <div className="trust-column">
          <div className="eyebrow-group">
            <p className="eyebrow">Trusted Solution</p>
            <h2>
              Trusted solution for your <span>Rajasthan journeys</span>
            </h2>
          </div>
          <div className="trust-list">
            {trustFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="trust-card"
                  style={{
                    borderColor: feature.accent.border,
                    background: feature.accent.background,
                  }}
                >
                  <div className="icon-wrap">
                    <Icon />
                  </div>
                  <div>
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="faq-column">
          <p className="faq-eyebrow">Most popular FAQs</p>
          <h3>FAQs for Rajasthan travel planning</h3>
          <div className="faq-list">
            {faqItems.map((item, index) => {
              const isOpen = index === openIndex;
              const contentHeight = contentRefs[index]?.scrollHeight ?? 0;
              return (
                <div key={item.question} className={`faq-item ${isOpen ? "faq-item--open" : ""}`}>
                  <button className="faq-trigger" onClick={() => setOpenIndex(isOpen ? -1 : index)}>
                    <span>{item.question}</span>
                    <span className={`marker ${isOpen ? "marker--open" : ""}`}>
                      <ChevronDown />
                    </span>
                  </button>
                  <div
                    className="faq-answer"
                    ref={(el) => {
                      contentRefs[index] = el;
                    }}
                    style={{
                      maxHeight: isOpen ? contentHeight : 0,
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <p>{item.answer}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .faq-section {
          background: #fff;
          padding: 4rem 0;
        }

        .faq-grid {
          margin: 0 auto;
          max-width: 72rem;
          display: grid;
          gap: 2rem;
          padding: 0 1.5rem;
        }

        @media (min-width: 1024px) {
          .faq-grid {
            grid-template-columns: 1.05fr 0.95fr;
          }
        }

        .trust-column {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .eyebrow-group .eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.4em;
          font-size: 0.75rem;
          font-weight: 600;
          color: #d97706;
          margin-bottom: 0.5rem;
        }

        .eyebrow-group h2 {
          font-size: clamp(1.75rem, 2vw, 2.5rem);
          font-weight: 600;
          color: #0f172a;
        }

        .eyebrow-group h2 span {
          color: #F46F12;
        }

        .trust-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .trust-card {
          display: flex;
          gap: 1rem;
          padding: 1.25rem;
          border-width: 1px;
          border-style: solid;
          border-radius: 1.25rem;
          box-shadow: 0 10px 18px rgba(15, 23, 42, 0.05);
        }

        .icon-wrap {
          width: 3rem;
          height: 3rem;
          border-radius: 999px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #b45309;
          box-shadow: 0 6px 12px rgba(15, 23, 42, 0.05);
        }

        .icon-wrap :global(svg) {
          width: 1.5rem;
          height: 1.5rem;
        }

        .trust-card h3 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.35rem;
          color: #0f172a;
        }

        .trust-card p {
          font-size: 0.9rem;
          color: #52525b;
        }

        .faq-column {
          background: rgba(251, 191, 36, 0.18);
          padding: 2rem;
          border-radius: 2rem;
          box-shadow: inset 0 0 20px rgba(251, 191, 36, 0.25);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .faq-eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.4em;
          font-size: 0.75rem;
          font-weight: 600;
          color: #F46F12;
        }

        .faq-column h3 {
          font-size: 1.75rem;
          font-weight: 600;
          color: #F46F12;
        }

        .faq-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .faq-item {
          border: 1px solid rgba(245, 158, 11, 0.4);
          border-radius: 1rem;
          background: rgba(255, 255, 255, 0.9);
          padding: 1rem 1.25rem;
          box-shadow: 0 10px 20px rgba(15, 23, 42, 0.04);
        }

        .faq-trigger {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: none;
          border: none;
          padding: 0;
          font: inherit;
          cursor: pointer;
          color: #0f172a;
        }

        .faq-trigger span:first-of-type {
          font-size: 1rem;
          font-weight: 600;
        }

        .faq-item--open .faq-trigger span:first-of-type {
          color: #dc2626;
        }

        .marker {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2rem;
          height: 2rem;
          border-radius: 999px;
          background: rgba(180, 83, 9, 0.1);
          color: #b45309;
          margin-left: 1rem;
          transition: transform 0.25s ease, background 0.25s ease;
        }

        .marker :global(svg) {
          width: 1.25rem;
          height: 1.25rem;
        }

        .marker--open {
          transform: rotate(180deg);
          background: rgba(180, 83, 9, 0.2);
        }

        .faq-answer {
          overflow: hidden;
          transition: max-height 0.35s ease, opacity 0.3s ease;
          margin-top: 0.5rem;
        }

        .faq-answer p {
          font-size: 0.95rem;
          color: #52525b;
          line-height: 1.5;
        }
      `}</style>
    </section>
  );
}
