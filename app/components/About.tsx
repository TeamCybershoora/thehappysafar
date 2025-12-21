"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const plannerProfiles = [
  {
    name: "Amit Kumar",
    role: "Lead Journey Planner",
    location: "Luxury heritage stays • VIP ground handling • Celebration travel",
    focus:
      "Crafts bespoke Rajasthan circuits with meticulous logistics, premium stays, and on-call concierge support for every family.",
  },
  {
    name: "Deepanshu Bohra",
    role: "Experiential Travel Designer",
    location: "Cultural immersions • Adventure add-ons • Family-friendly itineraries",
    focus:
      "Sculpts immersive moments—from folk performances to dune dinners—while ensuring seamless pacing for all age groups.",
  },
];

const CALL_NUMBER = "+919251147383";

const missionPoints = [
  "Curate hyperlocal experiences with palace historians, folk musicians, and desert naturalists.",
  "Handle every logistic in-house—from luxury SUVs to vetted camel handlers—so you stay carefree.",
  "Design journeys that spotlight Rajasthan’s contrasts: pink cities, blue lanes, Aravalli hills, and Thar dunes.",
];

const stats = [
  { label: "Desert circuits", value: 520, suffix: "+" },
  { label: "Heritage cities", value: 12 },
  { label: "Partner palaces", value: 95 },
];

function useCountUp(target: number, active: boolean, duration = 1400) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }
    let rafId: number;
    const startTimestamp = performance.now();

    const tick = () => {
      const progress = Math.min((performance.now() - startTimestamp) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.round(target * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [active, duration, target]);

  return count;
}

function StatCard({
  label,
  value,
  suffix = "",
  active,
}: {
  label: string;
  value: number;
  suffix?: string;
  active: boolean;
}) {
  const display = useCountUp(value, active);
  return (
    <div className="w-full rounded-2xl border border-amber-100 bg-white/80 p-4 text-left shadow-sm backdrop-blur">
      <p className="text-2xl font-semibold text-zinc-900">
        {display.toLocaleString()}
        <span className="text-amber-500">{suffix}</span>
      </p>
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
    </div>
  );
}

export default function Highlights() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        setIsInView(entries[0].isIntersecting);
      },
      {
        threshold: 0.25,
        rootMargin: "-5% 0px -5% 0px",
      }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const goToNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % plannerProfiles.length);
  }, []);

  const goToPrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + plannerProfiles.length) % plannerProfiles.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(goToNext, 5000);
    return () => clearInterval(timer);
  }, [goToNext]);

  return (
    <section
      id="about"
      className="mx-auto grid max-w-6xl gap-10 px-6 pb-24 pt-16 scroll-mt-24 lg:grid-cols-[1.1fr_0.9fr]"
      ref={sectionRef}
    >
      <div className="space-y-6 text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-500">
          About The Happy Safar
        </p>
        <h2 className="text-3xl font-semibold text-zinc-900 md:text-4xl">
          Rajasthan travel partners crafting soulful, custom itineraries.
        </h2>
        <p className="text-base text-zinc-600">
          We are a boutique travel studio rooted in Jaipur with fixers stationed across the state. From
          Shekhawati fresco trails to Udaipur lake residencies, our team obsesses over detail—matching you
          with local experts, heritage stays, and seamless transfers so every leg of the journey feels effortless.
        </p>
        <ul className="space-y-3 text-sm text-zinc-700">
          {missionPoints.map((point) => (
            <li key={point} className="flex items-start gap-3">
              <span className="mt-1 inline-flex h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {stats.map((stat) => (
            <StatCard key={stat.label} active={isInView} {...stat} />
          ))}
        </div>
      </div>

      <div className="planner-slider mt-6" aria-live="polite">
        <p className="planner-slider__label">Meet your planners</p>
        <article key={plannerProfiles[activeIndex].name} className="planner-slider__card">
          <div className="planner-slider__body">
            <div className="planner-slider__header">
              <h4>{plannerProfiles[activeIndex].name}</h4>
              <span>{plannerProfiles[activeIndex].role}</span>
            </div>
            <p className="planner-slider__summary">{plannerProfiles[activeIndex].location}</p>
            <p className="planner-slider__focus">{plannerProfiles[activeIndex].focus}</p>
            <div className="planner-slider__badge">Available for 1:1 Travel planning</div>
            <a
              href={`tel:${CALL_NUMBER}`}
              className="planner-slider__cta"
              aria-label={`Call ${plannerProfiles[activeIndex].name}`}
            >
              Call {plannerProfiles[activeIndex].name.split(" ")[0]}
            </a>
          </div>
        </article>
      </div>
      <style jsx>{`
        .planner-slider {
          position: relative;
          padding-bottom: 1rem;
          width: 100%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .planner-slider__label {
          font-size: 0.75rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #f97316;
          margin-bottom: 0.75rem;
        }

        .planner-slider__card {
          width: 100%;
          max-width: 360px;
          margin: 0 auto;
          border-radius: 28px;
          background: linear-gradient(150deg, rgba(255, 247, 237, 0.95), #ffffff);
          border: 1px solid rgba(249, 115, 22, 0.35);
         
          animation: card-slide 0.6s ease;
          padding: 1rem 1rem 1rem 1rem;
        }

        .planner-slider__body {
          display: grid;
          gap: 0.8rem;
          justify-items: center;
          text-align: center;
        }

        .planner-slider__header {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          align-items: center;
          text-align: center;
        }

        .planner-slider__header h4 {
          font-size: 1.2rem;
          font-weight: 700;
          color: #c2410c;
        }

        .planner-slider__header span {
          font-size: 0.85rem;
          font-weight: 600;
          color: #fb923c;
          text-transform: uppercase;
          letter-spacing: 0.14em;
        }

        .planner-slider__summary {
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(15, 23, 42, 0.6);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          word-break: break-word;
          text-align: center;
        }

        .planner-slider__focus {
          font-size: 0.95rem;
          line-height: 1.6;
          color: rgba(15, 23, 42, 0.8);
          word-break: break-word;
          text-align: center;
        }

        .planner-slider__badge {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.68rem;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #f97316;
          background: rgba(249, 115, 22, 0.12);
          border-radius: 999px;
          padding: 0.35rem 0.85rem;
          width: max-content;
        }

        .planner-slider__cta {
          justify-self: center;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          border-radius: 999px;
          background: linear-gradient(135deg, #f97316 0%, #f3720d 100%);
          color: #ffffff;
          text-decoration: none;
          font-weight: 600;
          letter-spacing: 0.08em;
          padding: 0.55rem 1.25rem;
          box-shadow: 0 12px 28px rgba(249, 115, 22, 0.25);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .planner-slider__cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 38px rgba(249, 115, 22, 0.32);
        }

        @keyframes card-slide {
          from {
            opacity: 0;
            transform: translateX(40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
}
