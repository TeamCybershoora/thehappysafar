"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { MoonIcon } from "../components/ui/moon";
import { SunIcon } from "../components/ui/sun";
import { MenuIcon, type MenuIconHandle } from "../components/ui/menu";
import { useTheme } from "./ThemeProvider";


import { persistAdminSession, hasProperLogin } from "../lib/adminSession";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/packages", label: "Packages" },
  { href: "/city-tour", label: "City Tour" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [isAdminSubmitting, setIsAdminSubmitting] = useState(false);
  const menuIconRef = useRef<MenuIconHandle | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const secretClickCountRef = useRef(0);
  const secretClickTimerRef = useRef<number | null>(null);

  const handleAnchorNav = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!href.startsWith("#")) {
      setIsMenuOpen(false);
      return;
    }
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
    if (!isAdminModalOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeAdminModal();
      }
    };
    document.addEventListener("keydown", handleEsc);
    document.body.classList.add("modal-lock");
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.classList.remove("modal-lock");
    };
  }, [isAdminModalOpen]);

  const closeAdminModal = () => {
    setIsAdminModalOpen(false);
    setAdminPassword("");
    setShowPassword(false);
    setAdminError("");
    secretClickCountRef.current = 0;
    if (secretClickTimerRef.current) {
      window.clearTimeout(secretClickTimerRef.current);
      secretClickTimerRef.current = null;
    }
  };

  const handleLogoSecretClick = () => {
    // Check if already properly logged in
    if (hasProperLogin()) {
      router.push("/admin");
      return;
    }

    secretClickCountRef.current += 1;
    if (secretClickTimerRef.current) {
      window.clearTimeout(secretClickTimerRef.current);
    }
    secretClickTimerRef.current = window.setTimeout(() => {
      secretClickCountRef.current = 0;
    }, 2500);

    if (secretClickCountRef.current >= 5) {
      secretClickCountRef.current = 0;
      setIsAdminModalOpen(true);
      setAdminError("");
      setAdminPassword("");
      if (secretClickTimerRef.current) {
        window.clearTimeout(secretClickTimerRef.current);
        secretClickTimerRef.current = null;
      }
    }
  };

  const handleAdminSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isAdminSubmitting) return;
    setIsAdminSubmitting(true);
    setAdminError("");
    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: adminPassword }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        success?: boolean;
        message?: string;
        admin?: { name?: string; email?: string };
      };
      if (!response.ok || !data.success || !data.admin) {
        setAdminError(data.message ?? "Incorrect password. Please try again.");
        setIsAdminSubmitting(false);
        return;
      }
      persistAdminSession(data.admin);
      closeAdminModal();
      setIsAdminSubmitting(false);
      router.push("/admin");
    } catch (error) {
      console.error("Admin login failed", error);
      setAdminError("Unable to verify right now. Please try again.");
      setIsAdminSubmitting(false);
    }
  };

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

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    if (isMenuOpen) {
      void import("gsap").then(({ gsap }) => {
        gsap.set(menuEl, { y: -20, opacity: 0 });
        gsap.to(menuEl, { y: 0, opacity: 1, duration: 0.35, ease: "power3.out" });
        gsap.fromTo(
          menuItems,
          { y: -10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.25, ease: "power2.out", stagger: 0.06, delay: 0.05 },
        );
      });
    } else {
      void import("gsap").then(({ gsap }) => {
        gsap.to(menuEl, { y: -15, opacity: 0, duration: 0.2, ease: "power2.inOut" });
      });
    }
  }, [isMenuOpen]);

  useEffect(() => {
    if (!menuButtonRef.current) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    void import("gsap").then(({ gsap }) => {
      gsap.to(menuButtonRef.current, {
        rotate: isMenuOpen ? 90 : 0,
        scale: isMenuOpen ? 1.05 : 1,
        duration: 0.3,
        ease: "power2.out",
      });
    });
  }, [isMenuOpen]);

  return (
    <>
      <header className={`navbar ${isNavHidden ? "navbar--hidden" : ""}`}>
        <div className="navbar__inner">
          <div
            className="navbar__logo-block"
            onClick={handleLogoSecretClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleLogoSecretClick();
            }}
            aria-label="The Happy Safar logo"
          >
            <Image
              src="/logo.png"
              alt="The Happy Safar logo"
              width={28}
              height={28}
              className="logo-image"
              priority
            />
          </div>

          {/* <div className="navbar__brand" aria-hidden="true">
          <span>The Happy Safar</span>
        </div> */}

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
              {/* <button
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
            </button> */}
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
              <button
                type="button"
                className="enquire-button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("open-enquiry"));
                }}
              >
                Enquire Now
              </button>
            </div>
          </div>
        </div>

        <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`} ref={mobileMenuRef}>
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={(e) => handleAnchorNav(e, link.href)}>
              {link.label}
            </Link>
          ))}
          <button
            type="button"
            className="mobile-enquire"
            onClick={() => {
              window.dispatchEvent(new CustomEvent("open-enquiry"));
              setIsMenuOpen(false);
            }}
          >
            Enquire Now
          </button>
        </div>
      </header>

      <div
        className={`navbar__overlay ${isMenuOpen ? "visible" : ""}`}
        aria-hidden="true"
        onClick={() => setIsMenuOpen(false)}
      />

      {isAdminModalOpen && (
        <div className="admin-modal__backdrop" role="dialog" aria-modal="true">
          <div className="admin-modal">
            <header>
              <p className="admin-modal__eyebrow">Restricted</p>
              <h3>Admin Access</h3>
              <p>Enter the admin password to continue.</p>
            </header>
            <form onSubmit={handleAdminSubmit}>
              <label htmlFor="admin-password">Password</label>
              <div className="password-input-wrapper">
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {adminError && <p className="admin-modal__error">{adminError}</p>}
              <div className="admin-modal__actions">
                <button type="button" onClick={closeAdminModal} className="admin-modal__secondary">
                  Cancel
                </button>
                <button type="submit" disabled={isAdminSubmitting} className="admin-modal__primary">
                  {isAdminSubmitting ? "Verifying..." : "Unlock"}
                </button>
              </div>
              {hasProperLogin() && (
                <p className="admin-modal__hint">Session active. Unlocking will refresh access.</p>
              )}
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 70;
          
          
          color: var(--color-foreground);
          --nav-orange: rgba(249, 115, 22, 0.1);
          --nav-orange-dark: #c2410c;
          --nav-orange-light: #ffe6d3;
          --nav-height: 90px;
          transition: transform 0.35s ease, opacity 0.25s ease;
          
        }

        .navbar--hidden {
          transform: translateY(-120%);
          opacity: 0;
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

        .navbar__brand {
          display: none;
          align-items: center;
          justify-content: center;
          padding: 0.4rem 1.1rem;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(249, 115, 22, 0.45);
          box-shadow: 0 12px 30px rgba(249, 115, 22, 0.22);
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #f97316;
          font-size: 0.78rem;
        }

        .navbar__brand span {
          white-space: nowrap;
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

        .enquire-wrapper :global(.enquire-button) {
          border-radius: 999px;
          border: 1px solid rgba(249, 115, 22, 0.45);
          background: linear-gradient(135deg, #fff2e2, #ffd7b2);
          padding: 0.6rem 1.2rem;
          font-size: 0.9rem;
          font-weight: 600;
          color: #8b3a0d;
          box-shadow: 0 12px 25px rgba(139, 58, 13, 0.15);
          transition: transform 0.2s ease, background 0.2s ease;
          border: none;
          cursor: pointer;
        }

        .enquire-wrapper :global(.enquire-button:hover) {
          transform: translateY(-2px);
          background: linear-gradient(135deg, #ffc999, #ffb070);
        }

        .menu-toggle {
          display: none;
          border-radius: 999px;
          border: 1px solid rgba(249, 115, 22, 0.35);
          background: #ffffff;
          padding: 0.4rem 0.65rem;
          color: var(--nav-orange-dark);
          cursor: pointer;
          order: 2;
        }

        .menu-toggle:hover {
          background: rgba(255, 255, 255, 1);
        }

        .admin-modal__backdrop {
          position: fixed;
          inset: 0;
          background: rgba(15, 23, 42, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 1rem;
        }

        .admin-modal {
          width: min(360px, 100%);
          background: #fff8f2;
          border-radius: 24px;
          padding: 1.75rem;
          box-shadow: 0 25px 60px rgba(15, 23, 42, 0.35);
          border: 1px solid rgba(249, 115, 22, 0.15);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .admin-modal header h3 {
          margin-top: 0.2rem;
          font-size: 1.35rem;
          color: #0f172a;
        }

        .admin-modal header p {
          margin: 0.3rem 0 0;
          color: #475569;
          font-size: 0.9rem;
        }

        .admin-modal__eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.35em;
          font-size: 0.7rem;
          color: #f97316;
          margin-bottom: 0.25rem;
        }

        .admin-modal form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .admin-modal label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #0f172a;
        }

        .password-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .admin-modal input {
          border-radius: 16px;
          border: 1px solid rgba(249, 115, 22, 0.35);
          padding: 0.85rem 3rem 0.85rem 1rem;
          font-size: 0.95rem;
          outline: none;
          background: #fff;
          transition: border 0.2s ease, box-shadow 0.2s ease;
          width: 100%;
        }

        .password-toggle {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          background: transparent;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 0.35rem;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: color 0.2s ease, background 0.2s ease;
        }

        .password-toggle:hover {
          color: #f97316;
          background: rgba(249, 115, 22, 0.08);
        }

        .password-toggle:active {
          transform: translateY(-50%) scale(0.95);
        }

        .admin-modal input:focus {
          border-color: rgba(249, 115, 22, 0.75);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15);
        }

        .admin-modal__error {
          color: #dc2626;
          font-size: 0.85rem;
        }

        .admin-modal__actions {
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
          margin-top: 0.25rem;
        }

        .admin-modal__secondary,
        .admin-modal__primary {
          border-radius: 999px;
          padding: 0.55rem 1.4rem;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .admin-modal__secondary {
          background: rgba(148, 163, 184, 0.2);
          color: #475569;
        }

        .admin-modal__secondary:hover {
          transform: translateY(-1px);
        }

        .admin-modal__primary {
          background: linear-gradient(135deg, #ffbe98, #f97316);
          color: #fff;
          box-shadow: 0 12px 25px rgba(249, 115, 22, 0.35);
        }

        .admin-modal__primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          box-shadow: none;
        }

        .admin-modal__hint {
          font-size: 0.75rem;
          color: #0f172a;
          opacity: 0.7;
          text-align: right;
        }

        @media (max-width: 950px) {
          .navbar__inner {
            grid-template-columns: auto 1fr auto;
            grid-template-areas: "logo brand actions";
            align-items: center;
            row-gap: 0;
          }

          .navbar__logo-block {
            grid-area: logo;
            justify-self: start;
            padding: 0.35rem 0.75rem;
          }

          .navbar__brand {
            grid-area: brand;
            justify-self: center;
            font-size: 0.82rem;
            letter-spacing: 0.24em;
            display: inline-flex;
            padding: 0.4rem 1.1rem;
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
            grid-area: actions;
            align-items: center;
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
