 "use client";

import { BedDouble, Compass, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const serviceCards = [
  {
    id: "trusted",
    title: "Trusted India Travel Services",
    description:
      "Safe, reliable journeys led by seasoned planners who know the Himalayas, coasts, deserts, and metros inside out.",
    icon: ShieldCheck,
  },
  {
    id: "stay",
    title: "Comfortable Accommodation",
    description:
      "Curated stays—cosy havelis, heritage hotels, and boutique desert camps—with seamless check-ins.",
    icon: BedDouble,
  },
  {
    id: "guidance",
    title: "Expert Tour Guidance",
    description:
      "Local hosts bring history, crafts, and cuisine alive through intimate storytelling and on-ground care.",
    icon: Compass,
  },
  {
    id: "custom",
    title: "Customized Tour Packages",
    description:
      "Mix Goa beaches, Kerala backwaters, Ladakh passes or North-East forests—every itinerary bends to your travel style.",
    icon: Sparkles,
  },
];

const heroImages = [
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80",
];

const coverageStats = [
  { value: 1200, suffix: "+", label: "Trips planned" },
  { value: 85, suffix: "+", label: "Cities covered" },
  { value: 140, suffix: "+", label: "Partner stays" },
];

function useCountUp(target: number, active: boolean, duration = 1200) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }
    let rafId: number;
    const start = performance.now();

    const tick = () => {
      const progress = Math.min((performance.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
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

function StatBadge({
  value,
  suffix = "",
  label,
  active,
}: {
  value: number;
  suffix?: string;
  label: string;
  active: boolean;
}) {
  const display = useCountUp(value, active);
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-left shadow-sm backdrop-blur">
      <p className="text-2xl font-semibold text-white">
        {display.toLocaleString()}
        <span className="text-amber-200">{suffix}</span>
      </p>
      <p className="text-xs uppercase tracking-wide text-white/80">{label}</p>
    </div>
  );
}

export default function OurServices() {
  const statsRef = useRef<HTMLDivElement | null>(null);
  const [statsInView, setStatsInView] = useState(false);

  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setStatsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-linear-to-b from-white via-amber-50/40 to-white py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8 text-left">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-amber-700">
              <span className="h-2 w-2 rounded-full bg-amber-500" aria-hidden />
              Our Services
            </div>
            <h1 className="text-3xl font-semibold text-zinc-900 md:text-4xl">India-wide journeys with trusted care.</h1>
            <p className="text-base text-zinc-600">
              We choreograph India from Kashmir to Kanyakumari—well-planned trips, reliable transport, comfortable stays,
              and on-ground experts. Expect memorable, safe, and soulful explorations across every state.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {serviceCards.map((card) => {
              const Icon = card.icon;
              return (
                <article
                  key={card.id}
                  className="flex h-full flex-col gap-2 rounded-2xl border border-amber-100 bg-white/90 p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900">{card.title}</h3>
                  <p className="text-sm text-zinc-600">{card.description}</p>
                </article>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <button className="inline-flex items-center rounded-full bg-[#8a410d] px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-amber-200 transition hover:bg-[#75360b]">
              Book Now
            </button>
            <div className="text-sm text-zinc-500">
              <p className="font-semibold text-zinc-800">Need guidance?</p>
              <p>Talk to a planner in under 10 minutes.</p>
            </div>
          </div>
        </div>

        <div
          className="relative overflow-hidden rounded-[28px] bg-linear-to-br from-[#0d47a1] via-[#0066c3] to-[#00b0ff] p-1 shadow-2xl"
          ref={statsRef}
        >
          <div className="relative h-full w-full rounded-[26px] bg-[url('https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center">
            <div className="absolute inset-0 bg-linear-to-b from-[#03183b]/30 to-[#03183b]/80" />

            <div className="relative flex h-full flex-col justify-between gap-6 p-6 text-left text-white">
              <div className="space-y-3">
                <span className="inline-flex max-w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-[0.3em]">India coverage</span>
                <h2 className="text-4xl font-semibold uppercase tracking-wider">Across India</h2>
                <p className="max-w-sm text-sm text-white/90">
                  From Rajasthan palaces to Kerala backwaters—our planners choreograph seamless routes,
                  trusted stays, and on-ground expertise in every state.
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {coverageStats.map((stat) => (
                    <StatBadge key={stat.label} active={statsInView} {...stat} />
                  ))}
                </div>
              </div>

              <div className="relative flex flex-col items-center gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="flex flex-1 items-center justify-center gap-4">
                  {heroImages.map((src, index) => (
                    <div key={src} className="relative h-24 w-24 overflow-hidden rounded-full border-4 border-white/30 shadow-lg">
                      <img src={src} alt={`India highlight ${index + 1}`} className="h-full w-full object-cover" loading="lazy" />
                    </div>
                  ))}
                </div>
                <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold uppercase tracking-wide text-[#0d47a1] shadow">
                  Book Now
                </button>
              </div>
            </div>

           
          </div>
        </div>
      </div>
    </section>
  );
}
