"use client";

import { useState } from "react";
import CurvedLoop from "../components/CurvedLoop";

const HERO_BG =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80";

const highlights = ["Schedule", "Wishlist", "About"];

export default function Hero() {
  const [isEnquireOpen, setEnquireOpen] = useState(false);

  return (
    <section className="hero-nz" aria-labelledby="hero-nz-title">
      <div className="hero-nz__bg" />
      <div className="hero-nz__overlay" />
      <div className="hero-nz__fade" aria-hidden="true" />

      <div className="hero-nz__chrome">
        <div className="hero-nz__top">
          <div className="hero-nz__indicator" aria-hidden="true" />
          <span>Tailor every escape with The Happy Safar</span>

          <div className="hero-nz__search" role="search">
            <input type="text" placeholder="Search Indian journeys" aria-label="Search Indian journeys" />
            <button type="button">Search</button>
          </div>
        </div>

        <div className="hero-nz__main">
          <div className="hero-nz__text">
            <div className="hero-nz__heading-block">
              <p className="hero-nz__eyebrow">The Happy Safar</p>
              <h1 id="hero-nz-title">
                <span>India</span> Awaits You
              </h1>
            </div>
            <div className="hero-nz__desc-grid">
              <p>
                From Ladakh’s moonlike passes to Kerala’s backwaters, The Happy Safar choreographs
                journeys that feel handcrafted, heartfelt, and full of India’s soul. We obsess over
                every rail ride, palace stay, and street-food crawl so you can just immerse yourself.
              </p>
            </div>

            <div className="hero-nz__cta-row">
              <a className="hero-nz__cta-primary" href="#get-started">
                Plan with THS
              </a>
              <a className="hero-nz__cta-ghost" href="#itinerary">
                See sample routes
              </a>
            </div>
          </div>

          <div className="hero-nz__rail-stack">
            <div className="hero-nz__enquire-launch">
              <p className="hero-nz__enquire-label">Need help planning?</p>
              <button type="button" onClick={() => setEnquireOpen(true)}>
                Enquire Now
              </button>
              <span>Talk to a planner in under 10 minutes.</span>
            </div>
            <div className="hero-nz__rail" aria-label="Quick actions">
              <span className="hero-nz__rail-label">Plan & Go</span>
              {highlights.map((item) => (
                <button key={item} type="button">
                  {item}
                </button>
              ))}
            </div>
             
          </div>
          
        </div>

        {isEnquireOpen && (
          <div className="hero-nz__modal" role="dialog" aria-modal="true" aria-labelledby="enquire-heading">
            <div className="hero-nz__modal-backdrop" onClick={() => setEnquireOpen(false)} />
            <div className="hero-nz__modal-card">
              <button className="hero-nz__modal-close" aria-label="Close enquiry" onClick={() => setEnquireOpen(false)}>
                ×
              </button>
              <p className="hero-nz__modal-eyebrow">Talk to The Happy Safar</p>
              <h2 id="enquire-heading">Plan your India escape</h2>
              <form className="hero-nz__modal-form">
                <input type="text" placeholder="Your name" required />
                <input type="tel" placeholder="Mobile number" required />
                <input type="email" placeholder="Email" required />
                <textarea placeholder="What kind of trip are you dreaming about?" rows={4} />
                <div className="hero-nz__modal-actions">
                  <button type="submit" className="hero-nz__modal-primary">
                    Send Enquiry
                  </button>
                  <button type="button" className="hero-nz__modal-whatsapp" aria-label="Chat on WhatsApp">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" role="img">
                      <path
                        fill="currentColor"
                        d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01m-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23m4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07s.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28"
                      />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
         <CurvedLoop marqueeText="The Happy Safar ✦ Across India ✦ Custom Trips ✦" speed={7} curveAmount={200} />
      </div>

      <style jsx>{`
        .hero-nz {
          position: relative;
          min-height: min(105vh, 1000px);
          width: 100%;
          overflow: hidden;
          color: #fff;
          border-radius: 0;
          --nav-height: 96px;
          margin-top: calc(-1 * var(--nav-height));
          padding-top: var(--nav-height);
        }

        .hero-nz__fade {
          position: absolute;
          inset: auto 0 0 0;
          height: 160px;
          background: linear-gradient(180deg, rgba(9, 9, 11, 0) 0%, rgba(5, 5, 6, 0.85) 65%, #050506 100%);
          pointer-events: none;
          z-index: 0;
        }

        .hero-nz__bg {
          position: absolute;
          inset: 0;
          background-image: url(${HERO_BG});
          background-size: cover;
          background-position: center;
          filter: saturate(1.05);
        }

        .hero-nz__overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.75));
        }

        .hero-nz__chrome {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          padding: clamp(1.5rem, 4vw, 3rem);
          height: 100%;
        }

        .hero-nz__top {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
        }

        .hero-nz__indicator {
          width: 120px;
          height: 6px;
          border-radius: 999px;
          background: #F46F12;
        }

        .hero-nz__search {
          margin-left: auto;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.45rem 0.6rem 0.45rem 1rem;
          background: rgba(255, 255, 255, 0.12);
          border-radius: 999px;
          backdrop-filter: blur(12px);
        }

        .hero-nz__search input {
          background: transparent;
          border: none;
          color: #fff;
          font-size: 0.95rem;
          width: 180px;
        }

        .hero-nz__search input::placeholder {
          color: rgba(255, 255, 255, 0.7);
        }

        .hero-nz__search input:focus {
          outline: none;
        }

        .hero-nz__search button {
          border: none;
          border-radius: 999px;
          padding: 0.45rem 1.1rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: #111;
          background: #fff;
          cursor: pointer;
        }

        .hero-nz__main {
          display: grid;
          grid-template-columns: minmax(0, 2.8fr) minmax(200px, 1fr);
          gap: clamp(2rem, 5vw, 5rem);
          align-items: end;
        }

        .hero-nz__heading-block {
          background: transparent;
          border-radius: 24px;
          padding: 1rem 1.5rem;
          backdrop-filter: blur(5px);
          border: none;
          display: inline-block;
          width: fit-content;
        }

        .hero-nz__text h1 {
          font-family: "Paralucent-DemiBold";
          font-size: clamp(3rem, 7vw, 5.5rem);
          line-height: 0.95;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .hero-nz__text h1 span {
          display: block;
          color: #F46F12;
        }

        .hero-nz__eyebrow {
          font-family: "Paralucent-DemiBold";
          text-transform: uppercase;
          letter-spacing: 0.4em;
          color: #ffffff;
          margin-bottom: 0.4rem;
        }

        .hero-nz__desc-grid {
          margin-top: 1.5rem;
          max-width: 50ch;
          color: rgba(255, 255, 255, 0.9);
          font-size: 1rem;
          line-height: 1.6;
        }

        .hero-nz__cta-row {
          margin-top: 2rem;
          display: flex;
          gap: 1.25rem;
          flex-wrap: wrap;
        }

        .hero-nz__cta-primary {
          border-radius: 999px;
          padding: 0.85rem 2.4rem;
          font-size: 1rem;
          font-weight: 700;
          background: #ffffff;
          color: #F46F12;
          text-decoration: none;
         
        }

        .hero-nz__cta-ghost {
          border-radius: 999px;
          padding: 0.85rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.6);
          text-decoration: none;
          color: #fff;
          backdrop-filter: blur(10px);
        }

        .hero-nz__rail {
          background: #ffffff;
          border-radius: 28px;
          padding: 1.75rem 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.05), 0 30px 50px rgba(0, 0, 0, 0.35);
        }

        .hero-nz__rail-label {
          text-transform: uppercase;
          letter-spacing: 0.3em;
          font-family: "Paralucent-DemiBold";
          font-size: 0.85rem;
          color: #F46F12;
          margin-bottom: 0.5rem;
        }

        .hero-nz__rail button {
          border: none;
          background: #FDD9BF;
          border-radius: 999px;
          color: #F46F12;
          padding: 0.65rem 1rem;
          font-size: 0.95rem;
          text-align: left;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .hero-nz__rail button:hover {
          background: #F46F12;
          color: #fff;
          transform: translateX(4px);
        }

        .hero-nz__rail-stack {
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }

        .hero-nz__enquire-launch {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          backdrop-filter: blur(12px);
          padding: 1.1rem 1.5rem;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        .hero-nz__enquire-label {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }

        .hero-nz__enquire-launch button {
          border: none;
          border-radius: 999px;
          padding: 0.85rem 1.5rem;
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          background: #f46f12;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .hero-nz__enquire-launch button:hover {
          transform: translateY(-2px);
        }

        .hero-nz__enquire-launch span {
          margin: 0;
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.75);
        }

        .hero-nz__modal {
          position: fixed;
          inset: 0;
          display: grid;
          place-items: center;
          z-index: 99;
          animation: fadeIn 0.3s ease forwards;
        }

        .hero-nz__modal-backdrop {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(4px);
        }

        .hero-nz__modal-card {
          position: relative;
          z-index: 1;
          background: rgba(255, 255, 255, 0.98);
          color: #0f172a;
          border-radius: 32px;
          padding: clamp(1.5rem, 3vw, 2.5rem);
          width: min(420px, 90vw);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.35);
          animation: slideUp 0.35s ease forwards;
        }

        .hero-nz__modal-close {
          position: absolute;
          top: 1rem;
          right: 1rem;
          border: none;
          background: transparent;
          font-size: 1.5rem;
          cursor: pointer;
        }

        .hero-nz__modal-eyebrow {
          font-size: 0.8rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: #c2410c;
          margin: 0 0 0.4rem;
        }

        .hero-nz__modal h2 {
          margin: 0 0 1rem;
          font-size: 1.75rem;
          color: #111;
        }

        .hero-nz__modal-form {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
        }

        .hero-nz__modal-form input,
        .hero-nz__modal-form textarea {
          border-radius: 18px;
          border: 1px solid rgba(0, 0, 0, 0.1);
          padding: 0.75rem 1rem;
          font-size: 0.95rem;
        }

        .hero-nz__modal-actions {
          display: flex;
          align-items: stretch;
          gap: 0.75rem;
        }

        .hero-nz__modal-primary {
          border: none;
          border-radius: 999px;
          padding: 0.85rem 0;
          font-weight: 700;
          color: #fff;
          background: #f46f12;
          cursor: pointer;
          width: 100%;
        }

        .hero-nz__modal-whatsapp {
          width: 20%;
          border-radius: 999px;
          border: none;
          background: #22c55e;
          color: #fff;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .hero-nz {
            min-height: 90vh;
          }

          .hero-nz__top {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }

          .hero-nz__search {
            width: 100%;
            justify-content: space-between;
          }

          .hero-nz__search input {
            width: 100%;
          }

          .hero-nz__main {
            grid-template-columns: 1fr;
          }

          .hero-nz__rail {
            flex-direction: row;
            flex-wrap: wrap;
          }

          .hero-nz__rail button {
            flex: 1 1 calc(50% - 0.65rem);
          }
        }
      `}</style>
    </section>
  );
}
