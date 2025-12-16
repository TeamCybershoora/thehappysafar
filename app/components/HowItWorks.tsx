'use client'
import { CalendarCheck2, ClipboardList, Ticket } from "lucide-react";

const steps = [
  {
    id: "01",
    title: "Choose Rajasthan Circuit",
    description:
      "Pick a signature loop—Jaipur + Udaipur, Marwar dunes, Aravalli wellness—or share the cities you want blended together.",
    icon: Ticket,
  },
  {
    id: "02",
    title: "Share Rituals & Details",
    description: "Tell us your crew size, pace, and wish-list. We tailor palace stays, drives, storytellers, and meals around it.",
    icon: ClipboardList,
  },
  {
    id: "03",
    title: "Confirm & Journey Easy",
    description: "Get a WhatsApp-ready plan with chauffeurs, hosts, and concierge support. Approve to unlock seamless execution.",
    icon: CalendarCheck2,
  },
];

export default function HowItWorks() {
  return (
    <section className="how-section">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 text-left text-white">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-3 text-sm uppercase tracking-[0.5em] text-white">
            <span className="h-px w-8 text-white" aria-hidden /> How it Works
          </div>
          <h2 className="text-3xl font-semibold leading-tight text-white">Here's a short overview of how our services work</h2>
          <p className="max-w-2xl text-base text-amber-50/90">
            Follow three simple steps to confirm your journey—every card unlocks personalised planning, flexible options,
            and fast confirmation so you can focus on the excitement.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article
                key={step.id}
                className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white text-left text-[#F46F12] shadow-xl"
              >
                <div className="flex items-center justify-between px-5 pt-5 text-sm font-semibold text-[#F46F12]">
                  <span className="rounded-full bg-zinc-100 px-3 py-1">{step.id}</span>
                  <Icon className="h-5 w-5 text-[#F46F12]" />
                </div>
                <div className="flex flex-1 flex-col gap-2 px-5 pb-5 text-left">
                  <h3 className="text-lg font-semibold text-zinc-900">{step.title}</h3>
                  <p className="text-sm text-zinc-600">{step.description}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
      <style jsx>{`
        .how-section {
          position: relative;
          background: #F46F12;
          padding: 4rem 0;
          overflow: hidden;
        }

        .how-section::before,
        .how-section::after {
          content: "";
          position: absolute;
          left: 0;
          width: 100%;
          height: 6rem;
          pointer-events: none;
          z-index: 1;
        }

        .how-section::before {
          top: 0;
          background: linear-gradient(180deg, rgba(255, 255, 255, 3), rgba(122, 45, 0, 0));
        }

        .how-section::after {
          bottom: 0;
          background: linear-gradient(0deg, rgba(255, 255, 255, 3), rgba(122, 45, 0, 0));
        }

        .how-section :global(.mx-auto) {
          position: relative;
          z-index: 2;
        }
      `}</style>
    </section>
  );
}
