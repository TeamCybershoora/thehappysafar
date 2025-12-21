'use client'

import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "./about" },
  { label: "Packages", href: "./packages" },
  { label: "Popular Destinations", href: "/packages" },
  { label: "Contact", href: "./contact" },
  { label: "Terms & Conditions", href: "./terms" },
  { label: "Privacy & Policy", href: "./privacy" },
];

const destinationLinks = [
  "Jaipur Heritage Trails",
  "Jodhpur • Jaisalmer Dunes",
  "Udaipur Lake Residencies",
  "Shekhawati Fresco Loops",
  "Jawai Leopard Safaris",
];

const services: { label: string; value: string; icon: LucideIcon }[] = [
  { label: "Customer Support", value: "+919251147383", icon: Phone },
  { label: "Drop Us an Email", value: "info@thehappysafar.com", icon: Mail },
  { label: "Studio", value: "Saraswati Tower, F-30, Sector 2, Central Spine, Vidyadhar Nagar, Jaipur, Rajasthan 302039", icon: MapPin },
];

export default function Footer() {
  const handleAnchorClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    event.preventDefault();
    const target = document.querySelector(href);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <footer className="footer">
      <div className="footer__grid">
        <div className="footer__brand">
          <div className="footer__brand-header">
            <div className="footer__logo">
              <Image src="/logo.svg" alt="The Happy Safar logo" fill className="footer__logo-img" sizes="48px" />
            </div>
            <div>
              <p className="footer__brand-title">The Happy Safar</p>
              <p className="footer__brand-tagline">Trips with soul</p>
            </div>
          </div>
          <p className="footer__brand-copy">
            We craft Rajasthan-first itineraries—palace stays, chauffeured drives, dune camps, and concierge support—so your desert
            journeys stay soulful and seamless.
          </p>
        </div>

        <div className="footer__col">
          <p className="footer-heading">Quick Links</p>
          <ul className="footer__list">
            {quickLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="footer__link" onClick={(e) => handleAnchorClick(e, link.href)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* <div className="footer__col">
          <p className="footer-heading">Destinations</p>
          <ul className="footer__list footer__list--muted">
            {destinationLinks.map((label) => (
              <li key={label}>{label}</li>
            ))}
          </ul>
        </div> */}

        <div className="footer__col">
          <p className="footer-heading">Services</p>
          <ul className="footer__service-list">
            {services.map((service) => (
              <li key={service.label} className="footer__service">
                <span className="footer__service-icon">
                  <service.icon className="footer__service-icon-svg" />
                </span>
                <div>
                  <p className="footer__service-label">{service.label}</p>
                  <p className="footer__service-value">{service.value}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="footer__bottom-inner">
          <p>{new Date().getFullYear()} The Happy Safar. All rights reserved.</p>
          <p>
            Made by{" "}
            <a href="https://cybershoora.com" target="_blank" rel="noreferrer" className="footer__link">
              @cybershoora
            </a>{" "}
            with ❤️
          </p>
        </div>
      </div>
      <style jsx>{`
        .footer {
          background-color: #050505;
          color: #d4d4d8;
        }

        .footer__grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 2.5rem;
          max-width: 72rem;
          margin-inline: auto;
          padding: 3rem 1.5rem;
        }

        .footer__brand {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .footer__brand-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .footer__logo {
          position: relative;
          width: 3rem;
          height: 3rem;
          border-radius: 999px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.05);
        }

        .footer__logo-img {
          object-fit: contain;
          padding: 0.5rem;
        }

        .footer__brand-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #fff;
        }

        .footer__brand-tagline {
          font-size: 0.65rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #fb923c;
        }

        .footer__brand-copy {
          font-size: 0.9rem;
          color: #a1a1aa;
          line-height: 1.6;
        }

        .footer__col {
          display: flex;
          flex-direction: column;
        }

        .footer-heading {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.4em;
          color: #f97316;
          font-weight: 600;
        }

        .footer__list {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.95rem;
        }

        .footer__list--muted {
          color: #a1a1aa;
        }

        .footer__link {
          color: inherit;
          transition: color 0.25s ease;
        }

        .footer__link:hover {
          color: #fff;
        }

        .footer__service-list {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          font-size: 0.95rem;
        }

        .footer__service {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
        }

        .footer__service-icon {
          display: inline-flex;
          padding: 0.5rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.05);
          color: #fb923c;
        }

        .footer__service-icon-svg {
          width: 1rem;
          height: 1rem;
        }

        .footer__service-label {
          font-size: 0.7rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #71717a;
        }

        .footer__service-value {
          color: #fff;
          font-size: 0.95rem;
        }

        .footer__bottom {
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .footer__bottom-inner {
          max-width: 72rem;
          margin-inline: auto;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          font-size: 0.9rem;
          color: #a1a1aa;
        }

        .footer__cta {
          display: flex;
          gap: 0.75rem;
        }

        .footer__cta-pill {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 999px;
          background: rgba(22, 163, 74, 0.2);
          color: #4ade80;
          transition: background 0.25s ease, color 0.25s ease;
        }

        .footer__cta-pill:hover {
          background: rgba(22, 163, 74, 0.4);
          color: #fff;
        }

        .footer__cta-icon {
          width: 1.1rem;
          height: 1.1rem;
        }

        @media (min-width: 768px) {
          .footer__bottom-inner {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
      `}</style>
    </footer>
  );
}
