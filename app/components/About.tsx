"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const plannerProfiles = [
  {
    name: "Ananya Kapoor",
    role: "Luxury desert journeys",
    location: "Jaipur HQ",
    focus: "Designs dune residencies with private hosts and surprise rituals.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Devendra Rathore",
    role: "Heritage circuits lead",
    location: "Jodhpur pod",
    focus: "Blends fort stays, blue-lane walks, and curated storyteller dinners.",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Meera Saxena",
    role: "Wellness retreats in Aravallis",
    location: "Udaipur studio",
    focus: "Maps spa rituals, lake palaces, and mindful culinary sessions.",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Raghav Singh",
    role: "Leopard + safari expert",
    location: "Jawai field desk",
    focus: "Leads dawn tracking, shepherd lunches, and stargazing jeep suppers.",
    image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=800&q=80",
  },
];

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
    <div className="rounded-2xl border border-amber-100 bg-white/80 p-4 text-left shadow-sm backdrop-blur">
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
        <div className="grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <StatCard key={stat.label} active={isInView} {...stat} />
          ))}
        </div>
      </div>

      <div className="planner-slider mt-6" aria-live="polite">
        <p className="planner-slider__label">Meet your planners</p>
        <article key={plannerProfiles[activeIndex].name} className="planner-slider__card">
          <div className="planner-slider__image">
            <img src={plannerProfiles[activeIndex].image} alt={plannerProfiles[activeIndex].name} loading="lazy" />
          </div>
          <div className="planner-slider__body">
            <h4>{plannerProfiles[activeIndex].name}</h4>
            <p className="planner-slider__summary">
              {plannerProfiles[activeIndex].location} · {plannerProfiles[activeIndex].focus}
            </p>
          </div>
        </article>
      </div>
      <style jsx>{`
        .planner-slider {
          position: relative;
          padding-bottom: 1rem;
        }

        .planner-slider__label {
          font-size: 0.75rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #f97316;
          margin-bottom: 0.75rem;
        }

        .planner-slider__card {
          max-width: 340px;
          margin: 0 auto;
          border-radius: 28px;
          background: #fff;
          border: 1px solid rgba(251, 191, 36, 0.35);
          box-shadow: 0 16px 30px rgba(249, 115, 22, 0.18);
          overflow: hidden;
          animation: card-slide 0.6s ease;
        }

        .planner-slider__image {
          height: 260px;
          overflow: hidden;
          position: relative;
        }

        .planner-slider__image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform-origin: center;
          transition: transform 0.6s ease;
        }

        .planner-slider__card:hover .planner-slider__image img {
          transform: scale(1.05);
        }

        .planner-slider__image::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(255, 255, 255, 0) 80%, rgba(255, 255, 255, 5) 100%);
          pointer-events: none;
        }

        .planner-slider__body {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .planner-slider__body h4 {
          font-size: 1.1rem;
          font-weight: 600;
          color: #c2410c;
        }

        .planner-slider__summary {
          font-size: 0.9rem;
          color: #475569;
          line-height: 1.5;
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
