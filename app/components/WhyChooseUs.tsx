'use client'
import { BadgeIndianRupee, HeadphonesIcon, Sparkles, Wallet } from "lucide-react";

const pillars = [
  {
    title: "Convenience",
    description:
      "Plan the entire Rajasthan trip from one studio—no juggling portals or vendor calls. We align stays, drivers, and experiences in one brief.",
    icon: Wallet,
  },
  {
    title: "Best Price Guarantee",
    description:
      "We negotiate with palace hotels, boutique camps, and chauffeurs daily to lock the sharpest rates without hidden mark-ups.",
    icon: BadgeIndianRupee,
  },
  {
    title: "Customer Support",
    description:
      "A dedicated planner tracks every leg 24/7 so date changes, delays, or monsoon detours are resolved instantly.",
    icon: HeadphonesIcon,
  },
  {
    title: "Tailored Experiences",
    description:
      "Whether it’s a honeymoon, family trail, or solo residency, every route is tailored with handpicked storytellers and hosts.",
    icon: Sparkles,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="why-choose-wrapper">
      <div className="content">
        <div className="header">
          <span>Why Choose Us?</span>
          <h2>
            Rajasthan trips, choreographed <em>around you.</em>
          </h2>
          <p>
            Jaipur-native planners sync palace stays, desert drives, leopard trails, and wellness rituals so you can focus
            on soaking up pink-city bazaars, blue lanes, dune sunsets, and Aravalli calm.
          </p>
        </div>

        <div className="pillars">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <article key={pillar.title}>
                <div className="icon-circle">
                  <Icon />
                </div>
                <h3>{pillar.title}</h3>
                <p>{pillar.description}</p>
              </article>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .why-choose-wrapper {
          position: relative;
          padding: 5rem 2.5rem;
          overflow: hidden;
          background: linear-gradient(180deg, #fffdf8, #fffaf1);
        }

        .content {
          max-width: 72rem;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .header {
          text-align: left;
          max-width: 40rem;
          margin-bottom: 2.5rem;
        }

        .header > span {
          font-size: 0.9rem;
          font-weight: 700;
          color: #f97316;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          display: inline-block;
          margin-bottom: 0.5rem;
        }

        .header h2 {
          font-size: clamp(2rem, 3vw, 2.8rem);
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 0.5rem;
        }

        .header h2 em {
          color: #f97316;
          font-style: normal;
        }

        .header p {
          font-size: 1rem;
          color: #475569;
        }

        .pillars {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
        }

        .pillars article {
          background: #ffffff;
          border-radius: 1.5rem;
          padding: 1.75rem;
          box-shadow: 0 20px 35px rgba(15, 23, 42, 0.08);
          border: 1px solid rgba(15, 23, 42, 0.05);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .pillars article:hover {
          transform: translateY(-6px);
          box-shadow: 0 25px 45px rgba(249, 115, 22, 0.25);
        }

        .icon-circle {
          width: 56px;
          height: 56px;
          border-radius: 999px;
          background: linear-gradient(145deg, #ffedd5, #fed7aa);
          color: #ea580c;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          box-shadow: 0 10px 20px rgba(249, 115, 22, 0.25);
        }

        .icon-circle :global(svg) {
          width: 26px;
          height: 26px;
        }

        h3 {
          font-size: 1.15rem;
          font-weight: 600;
          color: #0f172a;
          margin-bottom: 0.35rem;
        }

        article p {
          font-size: 0.95rem;
          color: #475569;
          line-height: 1.5;
        }
      `}</style>
    </section>
  );
}
