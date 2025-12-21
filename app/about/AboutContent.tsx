'use client';

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "../components/Navbar";

const tourFocus = [
  { label: "Family Tour", percent: 92 },
  { label: "Adventure Tour", percent: 86 },
  { label: "City Tour", percent: 81 },
  { label: "Honeymoon Tour", percent: 88 },
];

const familyHighlights = [
  "Explore Jaipur's forts with our historian storytellers.",
  "Camel caravans and dune sundowners in Jaisalmer.",
  "Private lake dinners and craft workshops in Udaipur.",
];

const featureBadges = [
  { icon: "🌍", label: "100+ Destinations" },
  { icon: "💰", label: "Best Price" },
  { icon: "⭐", label: "Great Customer" },
];

const serviceHighlights = [
  {
    title: "Tailored itineraries",
    summary: "Each day is personalised around your pace, passions, and travel style.",
  },
  {
    title: "Expert local guides",
    summary: "Desert naturalists, palace custodians, and city insiders bring Rajasthan alive.",
  },
  {
    title: "Seamless logistics",
    summary: "From airport pickups to sunset setups, our team choreographs every transition.",
  },
];

const CALL_NUMBER = "+917426933288";

const teamMembers = [
  {
    name: "Amit Kumar",
    role: "Lead Journey Planner",
    bio: "Crafts bespoke Rajasthan circuits with meticulous logistics, premium stays, and on-call concierge support for every family.",
    speciality: ["Luxury heritage stays", "VIP ground handling", "Celebration travel"],
  },
  {
    name: "Deepanshu Bohra",
    role: "Experiential Travel Designer",
    bio: "Sculpts immersive moments—from folk performances to dune dinners—while ensuring seamless pacing for all age groups.",
    speciality: ["Cultural immersions", "Adventure add-ons", "Family-friendly itineraries"],
  },
];

export default function AboutContent() {
  const [focusProgress, setFocusProgress] = useState(() => tourFocus.map(() => 0));
  const [hasAnimated, setHasAnimated] = useState(false);
  const metricsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (hasAnimated) return;
    const node = metricsRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setHasAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    const targetValues = tourFocus.map((item) => item.percent);
    const duration = 1200;
    const start = performance.now();
    let frameId = 0;

    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setFocusProgress(targetValues.map((value) => Math.round(value * eased)));
      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      } else {
        setFocusProgress(targetValues);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [hasAnimated]);

  return (
 <>
 <Navbar />
    <main className="about-page">
      <section className="about-hero">
        <div className="about-hero__media" aria-hidden="true">
          <Image
            src="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1920&q=80"
            alt="Sunrise over the Thar desert"
            fill
            priority
            sizes="100vw"
          />
          <div className="about-hero__scrim" />
        </div>
        <div className="about-hero__content">
          <div className="about-hero__inner">
            <p className="about-eyebrow">About Us</p>
            <h1>We design Rajasthan journeys filled with stories, smiles, and seamless service.</h1>
            <p>
              The Happy Safar is your trusted travel studio based in Jaipur, Rajasthan. For over seven years we have crafted
              bespoke tours across forts, dunes, palaces, and lake cities while keeping hospitality at the heart of every
              itinerary.
            </p>
            <p>
              With an in-house team of planners, field experts, and chauffeurs, we stay by your side from the first call to the
              farewell hug—ensuring your holiday is effortless, immersive, and unforgettable.
            </p>
          </div>
        </div>
      </section>

      <section className="about-overview">
        <div className="about-overview__copy">
          <p className="about-eyebrow">The Holiday Trips</p>
          <h2>Custom tours for every kind of traveller.</h2>
          <p>
            Whether you crave culture, adventure, or slow moments with family, we curate handcrafted routes across Rajasthan’s
            iconic cities and hidden gems. From palace stays to desert safaris, every detail is shaped by your preferences.
          </p>
          <p>
            Let our planners bundle heritage, comfort, and surprise into one memorable journey. All you need to do is arrive and
            enjoy the safar.
          </p>
        </div>
        <div className="about-overview__metrics" ref={metricsRef}>
          {tourFocus.map((focus, index) => {
            const currentValue = Math.min(focus.percent, focusProgress[index] ?? 0);
            return (
              <div key={focus.label} className="overview-progress">
                <div className="overview-progress__header">
                  <span>{focus.label}</span>
                  <span>{currentValue}%</span>
                </div>
                <div className="overview-progress__track" aria-hidden="true">
                  <div className="overview-progress__fill" style={{ width: `${currentValue}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="family-feature">
        <div className="family-feature__image" aria-hidden="true">
          <Image
            src="https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80"
            alt="Family on camel safari at sunset in the Thar desert"
            fill
            sizes="(max-width: 1024px) 100vw, 540px"
          />
        </div>
        <div className="family-feature__stack">
          <article className="family-feature__card">
            <p className="about-eyebrow">Family Tour</p>
            <h3>Memories for every generation.</h3>
            <p>
              Discover Rajasthan together with curated stays, colourful markets, and desert adventures. We align arrival times,
              meals, and experiences so grandparents, parents, and kids all feel the joy of exploration.
            </p>
            <ul>
              {familyHighlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <aside className="family-feature__badge-card" aria-label="Service highlights">
            <ul>
              {featureBadges.map((badge) => (
                <li key={badge.label}>
                  <span aria-hidden="true">{badge.icon}</span>
                  <span>{badge.label}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="about-services">
        <div className="about-services__panel">
          <p className="about-eyebrow">About Services</p>
          <h2>Top-tier planning backed by heartfelt hospitality.</h2>
          <p>
            We take care of everything—route design, stays, transfers, dining, and on-ground support—so you can simply immerse
            yourself in Rajasthan’s charm. Expect prompt responses, thoughtful touches, and memories you’ll keep returning to.
          </p>
          <div className="about-services__grid">
            {serviceHighlights.map((service) => (
              <article key={service.title} className="about-services__card">
                <h3>{service.title}</h3>
                <p>{service.summary}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-team">
        <header>
          <p className="about-eyebrow">Meet your planners</p>
          <h2>The specialists shaping your Rajasthan story.</h2>
          <p>
            Speak directly with the planners who choreograph every transfer, host, and surprise moment. Amit and Deepanshu stay on
            call to fine-tune the journey before and during your safar.
          </p>
        </header>
        <div className="about-team__grid">
          {teamMembers.map((member) => (
            <article key={member.name} className="about-team__card">
              <div className="about-team__body">
                <div className="about-team__header">
                  <h3>{member.name}</h3>
                  <span className="about-team__role">{member.role}</span>
                </div>
                <p>{member.bio}</p>
                {member.speciality && (
                  <ul className="about-team__list">
                    {member.speciality.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
                <div className="about-team__badge">Available for 1:1 planning call</div>
                <a href={`tel:${CALL_NUMBER}`} className="about-team__call" aria-label={`Call ${member.name}`}>
                  Call {member.name.split(" ")[0]}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="about-cta">
        <div className="about-cta__inner">
          <div>
            <p className="about-eyebrow">Ready when you are</p>
            <h2>Let’s co-create your Rajasthan narrative.</h2>
            <p>
              Whether it’s a three-day escapade or a fourteen-night celebration, our planners sync with your pace and pulse.
              Share your wishlist and we’ll weave the rest.
            </p>
          </div>
          <div className="about-cta__actions">
            <Link href="/#contact" className="about-hero__button about-hero__button--primary">
              Start my itinerary
            </Link>
            <Link href="/#packages" className="about-hero__button about-hero__button--ghost">
              Browse curated journeys
            </Link>
          </div>
        </div>
      </section>

      <style jsx>{`
        .about-page {
          padding: 120px 0 80px;
          background: linear-gradient(180deg, #fff 0%, #f7fafc 100%);
          display: flex;
          flex-direction: column;
          gap: 5rem;
        }

        .about-eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.3em;
          font-size: 0.7rem;
          color: #fb923c;
          font-weight: 600;
        }

        .about-hero,
        .about-overview,
        .family-feature,
        .about-services,
        .about-team,
        .about-cta {
          width: min(92%, 1120px);
          margin: 0 auto;
        }

        .about-hero {
          position: relative;
          min-height: 440px;
          border-radius: 28px;
          overflow: hidden;
          color: #ffffff;
          display: flex;
          align-items: flex-end;
        }

        .about-hero__media {
          position: absolute;
          inset: 0;
        }

        .about-hero__media :global(img) {
          object-fit: cover;
        }

        .about-hero__scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(200deg, rgba(15, 23, 42, 0.15) 0%, rgba(15, 23, 42, 0.75) 65%);
        }

        .about-hero__content {
          position: relative;
          padding: clamp(2.4rem, 5vw, 3.6rem);
          max-width: 560px;
          display: grid;
          gap: 1.4rem;
        }

        .about-hero__content h1 {
          font-size: clamp(2.4rem, 4vw, 3.4rem);
          line-height: 1.1;
          font-weight: 700;
        }

        .about-hero__content p {
          font-size: 1rem;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.82);
        }

        .about-hero__cta {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .about-hero__button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 999px;
          padding: 0.85rem 1.8rem;
          font-weight: 600;
          font-size: 0.95rem;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .about-hero__button--primary {
          background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
          color: #ffffff;
          box-shadow: 0 20px 40px rgba(249, 115, 22, 0.25);
        }

        .about-hero__button--primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 26px 52px rgba(249, 115, 22, 0.32);
        }

        .about-hero__button--ghost {
          background: rgba(255, 255, 255, 0.12);
          color: #fcd9b6;
          border: 1px solid rgba(255, 255, 255, 0.4);
        }

        .about-hero__button--ghost:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.2);
        }

        .about-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: clamp(1.8rem, 4vw, 2.8rem);
          align-items: start;
        }

        .about-overview__copy {
          display: grid;
          gap: 1rem;
        }

        .about-overview__copy h2 {
          font-size: clamp(1.9rem, 3vw, 2.4rem);
          color: #0f172a;
        }

        .about-overview__copy p {
          color: rgba(15, 23, 42, 0.7);
          line-height: 1.7;
        }

        .about-overview__metrics {
          display: grid;
          gap: 1.2rem;
        }

        .overview-progress {
          display: grid;
          gap: 0.5rem;
        }

        .overview-progress__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.95rem;
          font-weight: 600;
          color: #0f172a;
        }

        .overview-progress__track {
          height: 8px;
          border-radius: 999px;
          background: rgba(249, 115, 22, 0.18);
          overflow: hidden;
        }

        .overview-progress__fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(135deg, #f97316 0%, #f59e0b 100%);
        }

        .family-feature {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: clamp(1.8rem, 4vw, 3rem);
          align-items: stretch;
        }

        .family-feature__image {
          position: relative;
          border-radius: 24px;
          overflow: hidden;
          min-height: 260px;
          box-shadow: 0 24px 48px rgba(15, 23, 42, 0.2);
        }

        .family-feature__image :global(img) {
          object-fit: cover;
        }

        .family-feature__stack {
          display: grid;
          gap: clamp(1.2rem, 2vw, 1.8rem);
        }

        .family-feature__card {
          background: #ffffff;
          border-radius: 20px;
          padding: clamp(1.6rem, 3vw, 2rem);
          box-shadow: 0 18px 36px rgba(148, 163, 184, 0.18);
          display: grid;
          gap: 1rem;
        }

        .family-feature__card h3 {
          font-size: 1.6rem;
          color: #0f172a;
        }

        .family-feature__card p,
        .family-feature__card li {
          color: rgba(15, 23, 42, 0.7);
          line-height: 1.6;
        }

        .family-feature__card ul {
          display: grid;
          gap: 0.75rem;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .family-feature__card li {
          position: relative;
          padding-left: 1.4rem;
        }

        .family-feature__card li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.6rem;
          width: 0.6rem;
          height: 0.6rem;
          border-radius: 50%;
          background: #f97316;
        }

        .family-feature__badge-card {
          background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
          color: #ffffff;
          border-radius: 20px;
          padding: clamp(1.6rem, 3vw, 2rem);
          box-shadow: 0 24px 48px rgba(249, 115, 22, 0.25);
        }

        .family-feature__badge-card ul {
          list-style: none;
          display: grid;
          gap: 1rem;
          padding: 0;
          margin: 0;
        }

        .family-feature__badge-card li {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 600;
        }

        .family-feature__badge-card span:first-child {
          font-size: 1.2rem;
        }

        .about-services {
          background: #ffffff;
          border-radius: 28px;
          box-shadow: 0 20px 45px rgba(148, 163, 184, 0.18);
          padding: clamp(2rem, 4vw, 2.8rem);
          display: grid;
          gap: 1.8rem;
        }

        .about-services__panel {
          display: grid;
          gap: 1rem;
        }

        .about-services__panel h2 {
          font-size: clamp(1.9rem, 3vw, 2.4rem);
          color: #0f172a;
        }

        .about-services__panel p {
          color: rgba(15, 23, 42, 0.7);
        }

        .about-services__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.2rem;
        }

        .about-services__card {
          border: 1px solid rgba(226, 232, 240, 0.8);
          border-radius: 18px;
          padding: 1.4rem 1.6rem;
          background: #fffdf9;
          display: grid;
          gap: 0.5rem;
        }

        .about-services__card h3 {
          font-size: 1.1rem;
          color: #c2410c;
        }

        .about-team {
          display: grid;
          gap: 2.6rem;
        }

        .about-team header {
          text-align: center;
          display: grid;
          gap: 0.9rem;
        }

        .about-team header h2 {
          font-size: clamp(1.9rem, 3vw, 2.4rem);
          color: #0f172a;
        }

        .about-team header p {
          color: rgba(15, 23, 42, 0.7);
          max-width: 640px;
          margin: 0 auto;
        }

        .about-team__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.8rem;
        }

        .about-team__card {
          background: #ffffff;
          border-radius: 24px;
          border: 1px solid rgba(226, 232, 240, 0.9);
          box-shadow: 0 20px 42px rgba(100, 116, 139, 0.22);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.9rem 1.9rem 2rem;
        }

        .about-team__body {
          display: grid;
          gap: 0.9rem;
          text-align: left;
        }

        .about-team__header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 1rem;
        }

        .about-team__body h3 {
          font-size: 1.2rem;
          color: #0f172a;
        }

        .about-team__role {
          font-size: 0.78rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(148, 163, 184, 0.9);
          white-space: nowrap;
        }

        .about-team__body p {
          color: rgba(15, 23, 42, 0.72);
          line-height: 1.6;
        }

        .about-team__list {
          list-style: none;
          display: grid;
          gap: 0.5rem;
          padding: 0;
          margin: 0;
        }

        .about-team__list li {
          position: relative;
          padding-left: 1.35rem;
          font-size: 0.9rem;
          color: rgba(15, 23, 42, 0.7);
        }

        .about-team__list li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.55rem;
          width: 0.55rem;
          height: 0.55rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #f97316, #fb923c);
        }

        .about-team__badge {
          align-self: start;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.9rem;
          border-radius: 999px;
          background: rgba(14, 116, 144, 0.08);
          color: #0e7490;
          font-size: 0.78rem;
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .about-team__call {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          margin-top: 0.6rem;
          padding: 0.6rem 1.4rem;
          border-radius: 999px;
          background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
          color: #ffffff;
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          box-shadow: 0 18px 30px rgba(249, 115, 22, 0.25);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .about-team__call:hover {
          transform: translateY(-1px);
          box-shadow: 0 24px 45px rgba(249, 115, 22, 0.32);
        }

        .about-cta {
          background: linear-gradient(135deg, rgba(14, 116, 144, 0.12), rgba(249, 115, 22, 0.18));
          border: 1px solid rgba(14, 116, 144, 0.25);
          border-radius: 28px;
          padding: clamp(2.4rem, 5vw, 3.4rem);
          box-shadow: 0 32px 66px rgba(13, 148, 136, 0.24);
        }

        .about-cta__inner {
          display: grid;
          gap: 1.4rem;
          align-items: start;
        }

        .about-cta__inner h2 {
          font-size: clamp(1.8rem, 3vw, 2.4rem);
          color: #0f172a;
        }

        .about-cta__inner p {
          color: rgba(15, 23, 42, 0.7);
          max-width: 520px;
        }

        .about-cta__actions {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
        }

        @media (max-width: 960px) {
          .about-hero {
            border-radius: 20px;
          }

          .about-hero__cta {
            flex-direction: column;
          }

          .about-overview,
          .family-feature,
          .about-services,
          .about-cta {
            border-radius: 20px;
          }
        }

        @media (max-width: 640px) {
          .about-page {
            gap: 4rem;
            padding: 110px 0 60px;
          }

          .about-hero,
          .about-overview,
          .family-feature,
          .about-services,
          .about-team,
          .about-cta {
            width: min(95%, 650px);
          }

          .about-hero__content {
            padding: 2rem;
          }

          .about-hero__button,
          .about-cta__actions .about-hero__button {
            width: 100%;
          }

          .family-feature__badge-card {
            justify-self: stretch;
          }

          .about-cta__actions {
            flex-direction: column;
          }
        }
      `}</style>
    </main>
    </>
  );
}
