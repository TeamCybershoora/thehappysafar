'use client';

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import PackageCard from "../components/PackageCard";
import { extendedPackages } from "@/data/packages";
import Navbar from "../components/Navbar";

const heroHighlights = [
  "Tailor-made Rajasthan circuits",
  "Desert, palace & jungle escapes",
  "Dedicated planners on every trip",
];

const serviceColumns = [
  {
    title: "Signature Experiences",
    items: ["Floating breakfasts & royal picnics", "Private folk performances under the stars", "Sunrise hot-air balloons & dune drives"],
  },
  {
    title: "Seamless Logistics",
    items: ["Chauffeured transfers & guides", "24/7 concierge during travel", "Handpicked stays for every comfort"],
  },
];

const uniquePackages = Array.from(new Map(extendedPackages.map((pkg) => [pkg.id, pkg])).values());
const displayPackages = uniquePackages.slice(0, 8);
const SLIDE_INTERVAL = 5000;
const CONTENT_DELAY = 500;

export default function PackagesPage() {
  const carouselPackages = displayPackages.filter((pkg) => Boolean(pkg.image));
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (carouselPackages.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % carouselPackages.length);
    }, SLIDE_INTERVAL);

    return () => {
      window.clearInterval(timer);
    };
  }, [carouselPackages.length]);

  useEffect(() => {
    if (!carouselPackages.length) return;

    const current = carouselPackages[activeIndex];
    if (!current) return;

    // Trigger re-mount of content block so CSS animation (with delay) runs on each slide
    // by changing the key via activeIndex; no JS timers needed for text timing.
  }, [activeIndex, carouselPackages.length]);

  const activePackage = carouselPackages[activeIndex];
  const totalSlides = carouselPackages.length;
  const hasMultipleSlides = totalSlides > 1;

  const goToPrev = useCallback(() => {
    if (!hasMultipleSlides) return;

    setActiveIndex((prev) => {
      const nextIndex = (prev - 1 + totalSlides) % totalSlides;
      return nextIndex;
    });
  }, [hasMultipleSlides, totalSlides]);

  const goToNext = useCallback(() => {
    if (!hasMultipleSlides) return;

    setActiveIndex((prev) => {
      const nextIndex = (prev + 1) % totalSlides;
      return nextIndex;
    });
  }, [hasMultipleSlides, totalSlides]);

  const getHeroTitle = (rawTitle: string) => {
    // Remove trailing sequence like "• 1" or "• 12"
    const withoutSequence = rawTitle.replace(/\s*•\s*\d+\s*$/, "");
    // Then remove any leading non-letter characters like spaces, numbers, dots, or dashes
    return withoutSequence.replace(/^[^A-Za-z]+/, "").trim();
  };

  return (
  <>
  <Navbar />
    <main className="packages-page">
      {activePackage && (
        <section className="packages-hero">
          <div className="packages-hero__media">
            {carouselPackages.map((pkg, index) => (
              <div
                key={pkg.id}
                className={`packages-hero__slide${index === activeIndex ? " is-active" : ""}`}
                aria-hidden={index === activeIndex ? "false" : "true"}
              >
                <Image
                  src={pkg.image}
                  alt={pkg.title}
                  fill
                  priority={index === activeIndex}
                  sizes="(max-width: 768px) 100vw, 1160px"
                />
              </div>
            ))}
          </div>
          <div className="packages-hero__overlay" />
          {hasMultipleSlides && (
            <>
              <button
                type="button"
                className="packages-hero__nav packages-hero__nav--prev"
                onClick={goToPrev}
                aria-label="Previous package"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15.5 4.5 8 12l7.5 7.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                type="button"
                className="packages-hero__nav packages-hero__nav--next"
                onClick={goToNext}
                aria-label="Next package"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m8.5 4.5 7.5 7.5-7.5 7.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </>
          )}
          <div className="packages-hero__content">
            {activePackage && (
              <div className="packages-hero__content-body" key={activeIndex}>
                <p className="packages-eyebrow">Featured escape</p>
                <h1>{getHeroTitle(activePackage.title)}</h1>
               
                <a href="#packages" className="packages-hero__cta">
                  Visit now
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="packages-grid" id="packages">
        <header>
          <p className="packages-eyebrow">All packages</p>
          <h2>Pick a blueprint and we’ll personalise every moment.</h2>
          <p>
            Explore the full library of Rajasthan escapes—from fort residencies and city trails to desert expeditions.
            Each card expands with inclusions, upgrade ideas, and live quote support.
          </p>
        </header>
        <div className="packages-grid__cards">
          {displayPackages.map((pkg) => (
            <PackageCard key={pkg.id} details={pkg} />
          ))}
        </div>
      </section>

      <section className="packages-cta">
        <div className="packages-cta__inner">
          <div>
            <p className="packages-eyebrow">Need a starting point?</p>
            <h2>Share your dates and must-haves—our planners respond within hours.</h2>
            <p>
              Want a fort wedding, wellness break, or multi-generational reunion? Tell us the vibe and we’ll stitch a
              bespoke route with optional upgrades, concierge notes, and on-trip surprises.
            </p>
          </div>
          <a href="/" className="packages-cta__button">
            Start a consultation
          </a>
        </div>
      </section>

      <style jsx>{`
        .packages-page {
          display: flex;
          flex-direction: column;
          gap: 5rem;
          padding-top: 7rem;
          background: linear-gradient(180deg, #fff6eb 0%, #ffffff 55%, #f7fbff 100%);
          padding-bottom: 4rem;
        }

        .packages-eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.32em;
          font-size: 0.7rem;
          color: #ea580c;
        }

        .packages-hero {
          position: relative;
          min-height: clamp(480px, 75vh, 640px);
          border-radius: 32px;
          margin: 0 auto;
          width: min(92vw, 1160px);
          overflow: hidden;
          color: #ffffff;
          display: flex;
          align-items: flex-end;
        }

        .packages-hero__media {
          position: absolute;
          inset: 0;
        }

        .packages-hero__slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transform: scale(1.045);
          transition: opacity 1.1s ease, transform 1.1s ease;
          will-change: opacity, transform;
          z-index: 0;
        }

        .packages-hero__slide.is-active {
          opacity: 1;
          transform: scale(1);
        }

        .packages-hero__slide :global(img) {
          object-fit: cover;
        }

        .packages-hero__overlay {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: linear-gradient(140deg, rgba(15, 23, 42, 0.82) 8%, rgba(15, 23, 42, 0.35) 65%, rgba(15, 23, 42, 0.1) 100%);
        }

        .packages-hero__nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 3rem;
          height: 3rem;
          border-radius: 999px;
          border: 1px solid rgba(255, 255, 255, 0.35);
          background: rgba(15, 23, 42, 0.55);
          color: #ffffff;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 3;
          transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
        }

        .packages-hero__nav:hover {
          transform: translateY(-50%) scale(1.05);
          background: rgba(15, 23, 42, 0.75);
          border-color: rgba(255, 255, 255, 0.55);
        }

        .packages-hero__nav:focus-visible {
          outline: 3px solid rgba(250, 204, 21, 0.8);
          outline-offset: 3px;
        }

        .packages-hero__nav svg {
          width: 1.4rem;
          height: 1.4rem;
        }

        .packages-hero__nav--prev {
          left: clamp(1rem, 3vw, 2rem);
        }

        .packages-hero__nav--next {
          right: clamp(1rem, 3vw, 2rem);
        }

        .packages-hero__content {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          gap: 1.35rem;
          padding: clamp(2.4rem, 5vw, 3.6rem);
          width: 100%;
          min-height: 100%;
          box-sizing: border-box;
          z-index: 2;
          overflow: hidden;
        }

        .packages-hero__content::before {
          content: "";
          position: absolute;
          inset: 0;
          top: 35%;
          background: linear-gradient(180deg, rgba(10, 17, 30, 0) 0%, rgba(10, 17, 30, 0.88) 100%);
          z-index: -1;
          pointer-events: none;
        }

        .packages-hero__content-body {
          opacity: 1;
          transform: translateY(0);
          max-width: min(640px, 100%);
        }

        .packages-hero__content h1 {
          font-size: clamp(2.2rem, 4vw, 3rem);
          line-height: 1.15;
          margin: 1rem 0 1rem 0;
        }

        .packages-hero__content p {
          color: rgba(255, 255, 255, 0.82);
          line-height: 1.65;
        }

        .packages-hero__cta {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.75rem 1.6rem;
          border-radius: 999px;
          background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
          color: #ffffff;
          font-weight: 600;
          text-decoration: none;
          letter-spacing: 0.05em;
          box-shadow: 0 22px 44px rgba(249, 115, 22, 0.25);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .packages-hero__cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 28px 55px rgba(249, 115, 22, 0.32);
        }

        .packages-hero__highlights {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .packages-hero__highlights li {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.55rem 1.1rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.16);
          color: #fff7ed;
          font-weight: 600;
          font-size: 0.85rem;
        }

        .packages-overview {
          width: min(92vw, 1120px);
          margin: 0 auto;
          display: grid;
          gap: 3rem;
        }

        .packages-overview__intro {
          display: grid;
          gap: 2rem;
          align-items: center;
        }

        .packages-overview__intro h2 {
          font-size: clamp(2rem, 3.5vw, 2.75rem);
          color: #0f172a;
        }

        .packages-overview__intro p {
          color: rgba(15, 23, 42, 0.7);
          line-height: 1.7;
        }

        .packages-metrics {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 1.5rem;
          padding: 1.5rem;
          border-radius: 24px;
          background: linear-gradient(135deg, rgba(14, 116, 144, 0.12), rgba(249, 115, 22, 0.18));
          border: 1px solid rgba(14, 116, 144, 0.2);
        }

        .packages-metrics div {
          display: grid;
          gap: 0.4rem;
        }

        .packages-metrics dt {
          font-size: 2rem;
          font-weight: 700;
          color: #0f172a;
        }

        .packages-metrics dd {
          margin: 0;
          color: rgba(15, 23, 42, 0.72);
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .packages-overview__services {
          display: grid;
          gap: 1.5rem;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        }

        .packages-overview__services article {
          padding: 1.6rem 1.8rem;
          border-radius: 22px;
          background: #ffffff;
          box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
          border: 1px solid rgba(226, 232, 240, 0.9);
          display: grid;
          gap: 0.9rem;
        }

        .packages-overview__services h3 {
          font-size: 1.2rem;
          color: #0f172a;
        }

        .packages-overview__services ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 0.6rem;
        }

        .packages-overview__services li {
          position: relative;
          padding-left: 1.35rem;
          color: rgba(15, 23, 42, 0.7);
        }

        .packages-overview__services li::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0.45rem;
          width: 0.55rem;
          height: 0.55rem;
          border-radius: 50%;
          background: linear-gradient(135deg, #f97316, #fb923c);
        }

        .packages-grid {
          width: min(92vw, 1180px);
          margin: 0 auto;
          display: grid;
          gap: 2.5rem;
        }

        .packages-grid header {
          display: grid;
          gap: 0.8rem;
          text-align: left;
        }

        .packages-grid header h2 {
          font-size: clamp(2rem, 3vw, 2.6rem);
          color: #0f172a;
        }

        .packages-grid header p {
          color: rgba(15, 23, 42, 0.72);
          max-width: 720px;
        }

        .packages-grid__cards {
          display: grid;
          gap: 1.8rem;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        }

        .packages-cta {
          width: min(92vw, 1180px);
          margin: 0 auto;
        }

        .packages-cta__inner {
          border-radius: 28px;
          padding: clamp(2.4rem, 5vw, 3.4rem);
          background: linear-gradient(135deg, rgba(14, 116, 144, 0.12), rgba(249, 115, 22, 0.18));
          border: 1px solid rgba(14, 116, 144, 0.25);
          box-shadow: 0 32px 66px rgba(13, 148, 136, 0.22);
          display: grid;
          gap: 1.5rem;
        }

        .packages-cta__inner h2 {
          font-size: clamp(1.9rem, 3vw, 2.4rem);
          color: #0f172a;
        }

        .packages-cta__inner p {
          color: rgba(15, 23, 42, 0.7);
          line-height: 1.7;
        }

        .packages-cta__button {
          justify-self: start;
          display: inline-flex;
          align-items: center;
          padding: 0.75rem 1.6rem;
          border-radius: 999px;
          background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
          color: #ffffff;
          font-weight: 600;
          letter-spacing: 0.05em;
          text-decoration: none;
          box-shadow: 0 22px 44px rgba(249, 115, 22, 0.25);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .packages-cta__button:hover {
          transform: translateY(-2px);
          box-shadow: 0 28px 55px rgba(249, 115, 22, 0.32);
        }

        @media (max-width: 900px) {
          .packages-hero {
            min-height: clamp(420px, 70vh, 560px);
          }

          .packages-hero__nav {
            width: 2.75rem;
            height: 2.75rem;
            background: rgba(15, 23, 42, 0.68);
          }

          .packages-hero__nav--prev {
            left: clamp(1.2rem, 4vw, 1.8rem);
          }

          .packages-hero__nav--next {
            right: clamp(1.2rem, 4vw, 1.8rem);
          }
        }

        @media (max-width: 720px) {
          .packages-hero__content {
            padding: clamp(2rem, 7vw, 2.6rem);
          }

          .packages-cta__inner {
            text-align: center;
          }
          .packages-cta__button {
            justify-self: center;
          }
        }

        @media (max-width: 640px) {
          .packages-page {
            gap: 3.5rem;
          }

          .packages-hero {
            width: min(96vw, 760px);
            min-height: 440px;
          }

          .packages-overview__services article {
            padding: 1.4rem 1.5rem;
          }

          .packages-grid__cards {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
    </>
  );
}
