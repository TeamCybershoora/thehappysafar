"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MoonIcon } from "../components/ui/moon";
import { SunIcon } from "../components/ui/sun";
import { MenuIcon, type MenuIconHandle } from "../components/ui/menu";
import { useTheme } from "./ThemeProvider";


import { gsap } from "gsap";

const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About Us" },
  { href: "#packages", label: "Packages" },
  { href: "#faq", label: "FAQ's" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const menuIconRef = useRef<MenuIconHandle | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const handleAnchorNav = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) return;
    event.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (isMenuOpen) {
      menuIconRef.current?.startAnimation();
      document.body.classList.add("nav-lock");
      setIsNavHidden(false);
    } else {
      menuIconRef.current?.stopAnimation();
      document.body.classList.remove("nav-lock");
    }
    return () => document.body.classList.remove("nav-lock");
  }, [isMenuOpen]);

  useEffect(() => {
    let lastY = typeof window !== "undefined" ? window.scrollY : 0;
    const handleScroll = () => {
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastY + 6;
      const scrollingUp = currentY < lastY - 6;

      if (!isMenuOpen && scrollingDown && currentY > 120) {
        setIsNavHidden(true);
      } else if (scrollingUp || currentY < 80) {
        setIsNavHidden(false);
      }

      lastY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMenuOpen]);

  useEffect(() => {
    if (!mobileMenuRef.current) return;
    const menuEl = mobileMenuRef.current;
    const menuItems = menuEl.querySelectorAll("a, .mobile-enquire");

    if (isMenuOpen) {
      gsap.set(menuEl, { y: -20, opacity: 0 });
      gsap.to(menuEl, { y: 0, opacity: 1, duration: 0.35, ease: "power3.out" });
      gsap.fromTo(
        menuItems,
        { y: -10, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.25, ease: "power2.out", stagger: 0.06, delay: 0.05 }
      );
    } else {
      gsap.to(menuEl, { y: -15, opacity: 0, duration: 0.2, ease: "power2.inOut" });
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (!menuButtonRef.current) return;
    gsap.to(menuButtonRef.current, {
      rotate: isMenuOpen ? 90 : 0,
      scale: isMenuOpen ? 1.05 : 1,
      duration: 0.3,
      ease: "power2.out",
    });
  }, [isMenuOpen]);

  return (
    <>
      <header className={`navbar ${isNavHidden ? "navbar--hidden" : ""}`}>
        <div className="navbar__inner">
        <div className="navbar__logo-block">
          <Image
            src="/logo.png"
            alt="The Happy Safar logo"
            width={28}
            height={28}
            className="logo-image"
            priority
          />
        </div>

        <div className="navbar__pill">
          <nav className="navbar__links">
            {navLinks.map((link) => (
              <div className="nav-btn" key={link.href}>
                <Link href={link.href} onClick={(e) => handleAnchorNav(e, link.href)}>
                  {link.label}
                </Link>
              </div>
            ))}
          </nav>
        </div>

        <div className="navbar__actions">
          <div className="theme-wrapper">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="icon-toggle"
            >
              <span className="sr-only">Toggle theme</span>
              {theme === "light" ? (
                <MoonIcon className="icon" size={24} />
              ) : (
                <SunIcon className="icon" size={24} />
              )}
            </button>
          </div>
          <button
            type="button"
            className="menu-toggle"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            ref={menuButtonRef}
          >
            <MenuIcon
              ref={menuIconRef}
              className={`menu-icon ${isMenuOpen ? "open" : ""}`}
              size={26}
            />
          </button>
          <div className="enquire-wrapper desktop-only">
            <a href="#enquire">Enquire Now</a>
          </div>
        </div>
        </div>

        <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`} ref={mobileMenuRef}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={(e) => handleAnchorNav(e, link.href)}>
              {link.label}
            </Link>
          ))}
          <a href="#enquire" className="mobile-enquire" onClick={() => setIsMenuOpen(false)}>
            Enquire Now
          </a>
        </div>
      </header>

      <div className={`navbar__overlay ${isMenuOpen ? "visible" : ""}`} aria-hidden="true" />

      <style jsx>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: transparent;
          color: var(--color-foreground);
          --nav-orange: rgba(249, 115, 22, 0.1);
          --nav-orange-dark: #c2410c;
          --nav-orange-light: #ffe6d3;
          --nav-height: 90px;
          transition: transform 0.35s ease, opacity 0.25s ease;
        }

        .navbar--hidden {
          transform: translateY(-120%);
        }

        .navbar__inner {
          margin: 0 auto;
          max-width: 100vw;
          padding: 0.85rem 1.75rem;
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 1.25rem;
          transition: filter 0.3s ease, opacity 0.25s ease;
        }

        .navbar--hidden .navbar__inner {
          filter: blur(2px);
          opacity: 0.25;
        }

        .navbar__logo-block {
          display: inline-flex;
          align-items: center;
          justify-content: flex-start;
          padding: 0.4rem 0.9rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
          justify-self: start;
        }

        .logo-image {
          display: block;
          height: auto;
          width: 120px;
        }

        .navbar__pill {
          display: inline-flex;
          justify-content: center;
          width: fit-content;
          max-width: min(100%, 720px);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(249, 115, 22, 0.2);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.6),
            0 15px 35px rgba(0, 0, 0, 0.06);
          padding: 0.4rem 1rem;
          justify-self: center;
        }

        .navbar__links {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          white-space: nowrap;
        }

        .nav-btn {
          flex: 0 0 auto;
          text-align: center;
          border-radius: 999px;
          border: 1px solid transparent;
          transition: transform 0.2s ease, box-shadow 0.25s ease, border-color 0.2s ease,
            background 0.25s ease;
          white-space: nowrap;
          
        }

        .nav-btn :global(a) {
          display: block;
          width: 100%;
          padding: 0.35rem 0.5rem;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--nav-orange-dark);
          white-space: nowrap;
          transition: color 0.2s ease;
        }

        .nav-btn:hover {
          border-color: rgba(249, 115, 22, 0.5);
          background: rgba(249, 115, 22, 0.08);
          transform: translateY(-1px);
         
        }

        .nav-btn:active {
          transform: translateY(2px) scale(0.98);
          box-shadow: inset 0 6px 18px rgba(249, 115, 22, 0.3);
          border-color: rgba(249, 115, 22, 0.6);
          background: linear-gradient(180deg, rgba(255, 255, 255, 0.9), rgba(255, 232, 209, 0.9));
        }

        .nav-btn:focus-within {
          border-color: rgba(249, 115, 22, 0.65);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.2), 0 10px 20px rgba(249, 115, 22, 0.2);
        }

        .navbar__actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.75rem;
          justify-self: end;
          position: relative;
        }

        .theme-wrapper,
        .enquire-wrapper {
          display: flex;
          justify-content: center;
        }

        .theme-wrapper .icon-toggle {
          border-radius: 999px;
          border: 1px solid rgba(249, 115, 22, 0.35);
          background: rgba(255, 255, 255, 0.9);
          padding: 0.4rem 0.65rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease;
          color: var(--nav-orange-dark);
        }

        .theme-wrapper .icon-toggle:hover {
          background: rgba(249, 115, 22, 0.08);
          transform: translateY(-1px);
        }

        .icon-toggle .icon {
          display: block;
        }

        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }

        .enquire-wrapper a {
          border-radius: 999px;
          border: 1px solid rgba(249, 115, 22, 0.45);
          background: linear-gradient(135deg, #fff2e2, #ffd7b2);
          padding: 0.6rem 1.2rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: #8b3a0d;
          text-decoration: none;
          box-shadow: 0 12px 25px rgba(139, 58, 13, 0.15);
          transition: transform 0.2s ease, background 0.2s ease;
        }

        .enquire-wrapper a:hover {
          transform: translateY(-2px);
          background: linear-gradient(135deg, #ffc999, #ffb070);
        }

        .menu-toggle {
          display: none;
          border-radius: 999px;
          border: 1px solid rgba(249, 115, 22, 0.35);
          background: rgba(255, 255, 255, 0.9);
          padding: 0.4rem 0.65rem;
          color: var(--nav-orange-dark);
          cursor: pointer;
          order: 2;
        }

        .menu-toggle:hover {
          background: rgba(249, 115, 22, 0.08);
        }

        @media (max-width: 950px) {
          .navbar__inner {
            grid-template-columns: auto auto;
            grid-template-areas:
              "logo actions"
              "pill pill";
            row-gap: 0.75rem;
          }

          .navbar__logo-block {
            grid-area: logo;
          }

          .navbar__pill {
            grid-area: pill;
            justify-self: center;
          }

          .navbar__actions {
            grid-area: actions;
            justify-content: flex-end;
            gap: 0.5rem;
          }

          .navbar__pill,
          .navbar__links {
            display: none;
          }

          .navbar__actions {
            justify-content: flex-end;
            gap: 0.5rem;
          }

          .menu-toggle {
            display: inline-flex;
          }

          .theme-wrapper {
            order: 1;
          }

          .menu-toggle {
            order: 2;
          }

          .enquire-wrapper {
            display: none;
          }

          .mobile-menu {
            display: flex;
          }
        }

        .mobile-menu {
          display: none;
          flex-direction: column;
          gap: 0.5rem;
          padding: 1.1rem 1.5rem;
          border-radius: 1.25rem;
          background: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(249, 115, 22, 0.2);
          box-shadow: 0 25px 45px rgba(0, 0, 0, 0.15);
          position: fixed;
          top: var(--nav-height);
          left: 50%;
          transform: translateX(-50%);
          width: min(340px, 90vw);
          z-index: 60;
        }

        .mobile-menu :global(a) {
          text-decoration: none;
          font-weight: 600;
          color: var(--nav-orange-dark);
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
        }

        .mobile-menu :global(a:last-child) {
          border-bottom: none;
        }

        .mobile-enquire {
          margin-top: 0.5rem;
          text-align: center;
          border-radius: 999px;
          background: linear-gradient(135deg, #fff2e2, #ffd7b2);
          padding: 0.65rem 1rem;
          border: 1px solid rgba(249, 115, 22, 0.4);
        }

        .mobile-menu.open {
          display: flex;
        }

        .navbar__overlay {
          position: fixed;
          inset: 0;

          backdrop-filter: blur(5px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
          z-index: 40;
        }

        .navbar__overlay.visible {
          opacity: 1;
          pointer-events: auto;
        }
      `}</style>
    </>
  );
}
