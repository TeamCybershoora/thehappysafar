"use client";

import { useEffect, useRef, useState } from "react";

const missionPoints = [
  "Curate hyperlocal experiences with storytellers, naturalists, and artisans.",
  "Handle every logistic in-house—from visas to vetted chauffeurs—so you stay carefree.",
  "Design journeys that spotlight India’s contrasts: deserts, coasts, rainforests, and Himalayan wilds.",
];

const stats = [
  { label: "Trips planned", value: 1200, suffix: "+" },
  { label: "Cities covered", value: 85 },
  { label: "Partner stays", value: 140 },
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
          India-wide travel partners crafting soulful, custom itineraries.
        </h2>
        <p className="text-base text-zinc-600">
          We are a boutique travel studio headquartered in Jaipur with planners stationed across
          India. From wellness-led retreats in the Nilgiris to palace residencies in Rajasthan, our
          team obsesses over detail—matching you with local experts, unique stays, and seamless
          transfers so every leg of the journey feels effortless.
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

      <div className="rounded-3xl border border-amber-100 bg-gradient-to-br from-white/90 via-white/70 to-amber-50/40 p-8 shadow-lg backdrop-blur">
        <h3 className="text-xl font-semibold text-zinc-900">Meet your planners</h3>
        <p className="mt-4 text-sm text-zinc-600">
          Every itinerary is helmed by a dedicated travel lead plus a destination host on ground.
          They coordinate surprise touches, track live weather, and adjust plans in real time so you
          can simply show up.
        </p>
        <div className="mt-6 space-y-4">
          {[
            { name: "Ananya Kapoor", role: "Luxury desert journeys", location: "Jaipur HQ" },
            { name: "Rishi Menon", role: "Coastal & islands lead", location: "Kochi studio" },
            { name: "Meera Saxena", role: "Wellness & retreats", location: "Bangalore pod" },
          ].map((member) => (
            <div
              key={member.name}
              className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm backdrop-blur"
            >
              <p className="text-sm font-semibold text-zinc-900">{member.name}</p>
              <p className="text-xs text-amber-600">{member.role}</p>
              <p className="text-xs text-zinc-500">{member.location}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
