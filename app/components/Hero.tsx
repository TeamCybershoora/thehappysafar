"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { curatedPackages } from "@/data/packages";
import Navbar from "./Navbar";

export default function Hero() {
  const heroPackages = useMemo(
    () => curatedPackages.filter((pkg) => Boolean(pkg.image)).slice(0, 5),
    [],
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const outgoingTimeoutRef = useRef<number | null>(null);
  const router = useRouter();

  const openEnquiry = useCallback(() => {
    window.dispatchEvent(
      new CustomEvent("open-enquiry", {
        detail: {
          source: "hero",
        },
      }),
    );
  }, []);

  useEffect(() => {
    if (heroPackages.length <= 1) return undefined;

    const interval = window.setInterval(() => {
      setActiveIndex((prev) => {
        setOutgoingIndex(prev);
        if (outgoingTimeoutRef.current) {
          window.clearTimeout(outgoingTimeoutRef.current);
        }
        outgoingTimeoutRef.current = window.setTimeout(() => {
          setOutgoingIndex(null);
          outgoingTimeoutRef.current = null;
        }, 650);

        return (prev + 1) % heroPackages.length;
      });
    }, 5000);

    return () => {
      window.clearInterval(interval);
      if (outgoingTimeoutRef.current) {
        window.clearTimeout(outgoingTimeoutRef.current);
        outgoingTimeoutRef.current = null;
      }
    };
  }, [heroPackages.length]);

  const activePackage = heroPackages[activeIndex];
  const outgoingPackage = outgoingIndex !== null ? heroPackages[outgoingIndex] : null;

  return (
    <>
      <Navbar />
      <section className="package-hero" aria-live="polite">
        {activePackage && (
          <div className="package-hero__backdrop" aria-hidden="true">
            <Image
              src={activePackage.image}
              alt=""
              fill
              priority
              quality={70}
              sizes="100vw"
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
        )}
        <div className="package-hero__gradient" aria-hidden="true" />
        <div className="package-hero__blend" aria-hidden="true" />

        <div className="package-hero__layout">
          <div className="package-hero__content">
            <div className="package-hero__eyebrow">Featured Journeys</div>
            <h1 className="package-hero__title">
              <span
                key={activePackage ? activePackage.id : "fallback"}
                className="package-hero__title-text"
              >
                {activePackage ? activePackage.title.trim() : "Signature Rajasthan Escapes"}
              </span>
            </h1>
            {activePackage && (
              <p className="package-hero__meta">
                <span>{activePackage.duration}</span>
                {activePackage.priceTag ? <span>{activePackage.priceTag}</span> : null}
              </p>
            )}

            <div className="package-hero__cta-row">
              <button type="button" className="package-hero__cta-primary" onClick={openEnquiry}>
                Enquire Now
              </button>
              <button
                type="button"
                className="package-hero__cta-ghost"
                onClick={() => router.push("/packages")}
              >
                Explore More
              </button>
            </div>
          </div>

          <div className="package-hero__cards" aria-hidden="true">
            {outgoingPackage ? (
              <div key={`out-${outgoingPackage.id}`} className="package-hero-card package-hero-card--out">
                <div className="package-hero-card__img">
                  <Image
                    src={outgoingPackage.image}
                    alt=""
                    fill
                    sizes="420px"
                    quality={70}
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="package-hero-card__overlay" />
                <div className="package-hero-card__text">
                  <div className="package-hero-card__title">{outgoingPackage.title.trim()}</div>
                  <div className="package-hero-card__meta">
                    <span>{outgoingPackage.duration}</span>
                    {outgoingPackage.priceTag ? <span>{outgoingPackage.priceTag}</span> : null}
                  </div>
                </div>
              </div>
            ) : null}

            {activePackage ? (
              <div key={`in-${activePackage.id}`} className="package-hero-card package-hero-card--in">
                <div className="package-hero-card__img">
                  <Image
                    src={activePackage.image}
                    alt=""
                    fill
                    sizes="(max-width: 900px) 100vw, 420px"
                    quality={70}
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="package-hero-card__overlay" />
                <div className="package-hero-card__text">
                  <div className="package-hero-card__title">{activePackage.title.trim()}</div>
                  <div className="package-hero-card__meta">
                    <span>{activePackage.duration}</span>
                    {activePackage.priceTag ? <span>{activePackage.priceTag}</span> : null}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
      <style jsx>{`
        .package-hero {
          position: relative;
          min-height: min(96vh, 960px);
          width: 100%;
          padding: clamp(6rem, 12vw, 8rem) clamp(1.5rem, 6vw, 6rem) clamp(4rem, 12vw, 6rem);
          display: flex;
          align-items: center;
          color: #fff;
          overflow: hidden;
        }

        .package-hero__backdrop {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .package-hero__gradient {
          position: absolute;
          inset: 0;
          z-index: 1;
          background: radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.12), transparent 40%),
            linear-gradient(180deg, rgba(7, 12, 20, 0.1) 0%, rgba(7, 12, 20, 0.8) 65%, rgba(7, 12, 20, 0.94) 100%);
        }

        .package-hero__blend {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 160px;
          z-index: 2;
          pointer-events: none;
          background: linear-gradient(180deg, rgba(255, 251, 235, 0) 80%, #fffbeb 100%);
        }

        .package-hero__layout {
          position: relative;
          z-index: 3;
          width: 100%;
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(320px, 1fr);
          gap: clamp(2rem, 5vw, 5rem);
          align-items: center;
        }

        .package-hero__content {
          max-width: 720px;
          padding: 1rem;
          display: grid;
          gap: clamp(1rem, 3vw, 1.8rem);
        }

        .package-hero__eyebrow {
          font-size: 0.85rem;
          letter-spacing: 0.45em;
          text-transform: uppercase;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.78);
        }

        .package-hero__title {
          font-size: clamp(3rem, 8vw, 4.8rem);
          line-height: 0.95;
          margin: 0;
          font-family: "Paralucent-DemiBold", "Sora", sans-serif;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .package-hero__title-text {
          display: inline-block;
          animation: packageHeroTitleIn 600ms ease-out;
        }

        @keyframes packageHeroTitleIn {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.96);
            letter-spacing: 0.6em;
          }
          55% {
            opacity: 1;
            transform: translateY(0) scale(1.02);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            letter-spacing: 0.04em;
          }
        }

        .package-hero__meta {
          display: flex;
          gap: 1rem;
          font-size: 0.95rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 600;
          color: rgba(255, 255, 255, 0.72);
        }

        .package-hero__cta-row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .package-hero__cta-primary {
          border-radius: 999px;
          padding: 0.85rem 2.1rem;
          font-size: 1rem;
          font-weight: 700;
          border: none;
          background: linear-gradient(135deg, #ff924a, #f46f12);
          color: #0b101a;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .package-hero__cta-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 30px rgba(244, 111, 18, 0.4);
        }

        .package-hero__cta-ghost {
          border-radius: 999px;
          padding: 0.85rem 2rem;
          font-size: 1rem;
          font-weight: 700;
          border: 1px solid rgba(255, 255, 255, 0.28);
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: border-color 0.2s ease, background 0.2s ease;
        }

        .package-hero__cta-ghost:hover {
          border-color: rgba(244, 111, 18, 0.65);
          background: rgba(244, 111, 18, 0.18);
        }

        .package-hero__cards {
          position: relative;
          height: min(420px, 48vh);
          display: grid;
          align-items: center;
          justify-items: end;
        }

        .package-hero-card {
          position: absolute;
          right: 0;
          width: min(420px, 100%);
          height: 100%;
          border-radius: 28px;
          overflow: hidden;
          box-shadow: 0 24px 50px rgba(0, 0, 0, 0.45);
          background: rgba(12, 18, 28, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.16);
          will-change: transform, opacity;
        }

        .package-hero-card__img {
          position: absolute;
          inset: 0;
        }

        .package-hero-card__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.08), rgba(0, 0, 0, 0.78));
        }

        .package-hero-card__text {
          position: absolute;
          inset: auto 0 0 0;
          padding: 1.25rem 1.25rem 1.1rem;
          display: grid;
          gap: 0.55rem;
        }

        .package-hero-card__title {
          font-size: 1.1rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.96);
        }

        .package-hero-card__meta {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          font-size: 0.85rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.82);
        }

        .package-hero-card--in {
          animation: packageHeroCardIn 650ms ease both;
          z-index: 2;
        }

        .package-hero-card--out {
          animation: packageHeroCardOut 650ms ease both;
          z-index: 1;
        }

        @keyframes packageHeroCardIn {
          0% {
            opacity: 0;
            transform: translateX(80px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes packageHeroCardOut {
          0% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateX(-40px) scale(0.98);
          }
        }

        @media (max-width: 900px) {
          .package-hero {
            min-height: 88vh;
            padding: clamp(5rem, 18vw, 7rem) clamp(1.25rem, 8vw, 3rem) clamp(3rem, 12vw, 5rem);
            align-items: center;
          }

          .package-hero__layout {
            grid-template-columns: 1fr;
          }

          .package-hero__cards {
            justify-items: start;
          }
        }

        @media (max-width: 640px) {
          .package-hero__title {
            font-size: clamp(2.4rem, 11vw, 3rem);
          }

          .package-hero__meta {
            flex-direction: column;
            gap: 0.25rem;
            letter-spacing: 0.28em;
          }

          .package-hero__cards {
            display: none;
          }

          .package-hero__cta-row {
            flex-direction: column;
          }

          .package-hero__cta-primary,
          .package-hero__cta-ghost {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </>
  );
}
