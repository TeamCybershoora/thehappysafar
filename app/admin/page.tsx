"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAdminSessionActive, clearAdminSession } from "../lib/adminSession";

const CHROME_HIDE_CLASS = "admin-page--chromeless";
type PanelKey = "home" | "about" | "packages" | "faq" | "contact";

export default function AdminPage() {
  const router = useRouter();
  const [sessionActive, setSessionActive] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activePanel, setActivePanel] = useState<PanelKey>("home");
  const [feedback, setFeedback] = useState<string | null>(null);
  const quickAccessLinks = useMemo(
    () => [
      { label: "Homepage", panel: "home" as PanelKey, description: "Hero, headlines, and CTA copy" },
      { label: "About Page", panel: "about" as PanelKey, description: "Team story & imagery" },
      { label: "Packages", panel: "packages" as PanelKey, description: "Featured trips & pricing tags" },
      { label: "FAQ", panel: "faq" as PanelKey, description: "Visitor questions & answers" },
      { label: "Contact", panel: "contact" as PanelKey, description: "Support details & location" },
    ],
    []
  );

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.classList.add(CHROME_HIDE_CLASS);
    return () => {
      document.body.classList.remove(CHROME_HIDE_CLASS);
    };
  }, []);

  useEffect(() => {
    if (!isAdminSessionActive()) {
      router.replace("/");
    } else {
      setSessionActive(true);
    }
  }, [router]);

  if (!sessionActive) {
    return (
      <main className="admin-locked">
        <div className="admin-locked__card">
          <p className="admin-locked__eyebrow">Restricted</p>
          <h1>Access locked</h1>
          <p>You need an active admin session to view this page.</p>
          <Link href="/" className="admin-locked__btn">
            Return home
          </Link>
        </div>
        <style jsx>{`
          .admin-locked {
            min-height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 3rem 1.5rem;
            background: #fff9f3;
          }
          .admin-locked__card {
            text-align: center;
            background: #fff;
            padding: 2rem;
            border-radius: 24px;
            border: 1px solid rgba(249, 115, 22, 0.2);
            box-shadow: 0 20px 45px rgba(15, 23, 42, 0.08);
            max-width: 420px;
            width: 100%;
          }
          .admin-locked__eyebrow {
            text-transform: uppercase;
            letter-spacing: 0.35em;
            font-size: 0.7rem;
            color: #f97316;
            margin-bottom: 0.5rem;
          }
          h1 {
            margin-bottom: 0.75rem;
            font-size: 1.5rem;
            color: #0f172a;
          }
          p {
            color: #475569;
          }
          .admin-locked__btn {
            margin-top: 1.5rem;
            display: inline-flex;
            padding: 0.65rem 1.4rem;
            border-radius: 999px;
            background: linear-gradient(135deg, #ffbe98, #f97316);
            color: white;
            font-weight: 600;
            text-decoration: none;
          }
        `}</style>
      </main>
    );
  }

  const dashboardClassName = `admin-dashboard${sidebarCollapsed ? " admin-dashboard--collapsed" : ""}`;
  const currentPanelLabel = quickAccessLinks.find((link) => link.panel === activePanel)?.label ?? "Panel";

  const handlePanelSubmit = (panel: PanelKey) => (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    if (typeof window !== "undefined") {
      window.localStorage.setItem(`ths-admin-draft-${panel}`, JSON.stringify(payload));
    }
    setFeedback(`${currentPanelLabel} draft saved locally. Connect an API to publish changes.`);
  };

  const renderPanelContent = () => {
    switch (activePanel) {
      case "home":
        return (
          <form className="admin-form" onSubmit={handlePanelSubmit("home")}>
            <h3>Homepage hero configuration</h3>
            <p className="admin-form__hint">Adjust the hero background, eyebrow label, heading lines, and CTA copy for the landing experience.</p>
            <label className="admin-field">
              <span className="admin-field__label">Background image URL</span>
              <input
                name="heroBackground"
                defaultValue="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80"
              />
            </label>
            <div className="admin-form__grid">
              <label className="admin-field">
                <span className="admin-field__label">Hero eyebrow (small label)</span>
                <input name="heroEyebrow" defaultValue="The Happy Safar" />
              </label>
              <label className="admin-field">
                <span className="admin-field__label">Hero highlight word</span>
                <input name="heroHighlight" defaultValue="Rajasthan" />
              </label>
            </div>
            <label className="admin-field">
              <span className="admin-field__label">Hero headline trailing text</span>
              <input name="heroHeadlineTail" defaultValue="Awaits You" />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">Supporting description</span>
              <textarea
                name="heroDescription"
                rows={4}
                defaultValue="From Jaipur’s pink boulevards to the dunes of Jaisalmer and the blue lanes of Jodhpur, The Happy Safar scripts soulful Rajasthan stories. We obsess over palace stays, chauffeured drives, and local hosts so every leg of your desert escape feels effortless."
              />
            </label>
            <div className="admin-form__grid">
              <label className="admin-field">
                <span className="admin-field__label">Primary CTA label</span>
                <input name="primaryCta" defaultValue="Plan with THS" />
              </label>
              <label className="admin-field">
                <span className="admin-field__label">Secondary CTA label</span>
                <input name="secondaryCta" defaultValue="See sample routes" />
              </label>
            </div>
            <div className="admin-form__actions">
              <button type="submit">Save draft</button>
            </div>
          </form>
        );
      case "about":
        return (
          <form className="admin-form" onSubmit={handlePanelSubmit("about")}>
            <h3>About page content</h3>
            <p className="admin-form__hint">Update your brand story and planner highlights.</p>
            <label className="admin-field">
              <span className="admin-field__label">Section headline</span>
              <input name="aboutHeadline" defaultValue="Meet the planners crafting Rajasthan with heart" />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">Intro paragraph</span>
              <textarea
                name="aboutIntro"
                rows={4}
                defaultValue="We design palace residencies, dune escapes, and bespoke drives so every itinerary feels personal and poetic."
              />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">Featured planner names (comma separated)</span>
              <input name="aboutPlanners" defaultValue="Ananya Kapoor, Karan Mehta, Leela Bhati" />
            </label>
            <div className="admin-form__actions">
              <button type="submit">Save draft</button>
            </div>
          </form>
        );
      case "packages":
        return (
          <form className="admin-form" onSubmit={handlePanelSubmit("packages")}>
            <h3>Featured packages</h3>
            <p className="admin-form__hint">Control the headline and CTA copy for curated journeys.</p>
            <label className="admin-field">
              <span className="admin-field__label">Section headline</span>
              <input name="packagesHeadline" defaultValue="Preview a few soulful journeys." />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">Section description</span>
              <textarea
                name="packagesDescription"
                rows={3}
                defaultValue="Pick a starting template and our planners will customise every stay, transfer, and experience around your dates."
              />
            </label>
            <label className="admin-field">
              <span className="admin-field__label">CTA label</span>
              <input name="packagesCta" defaultValue="Plan your Rajasthan escape" />
            </label>
            <div className="admin-form__actions">
              <button type="submit">Save draft</button>
            </div>
          </form>
        );
      case "faq":
        return (
          <form className="admin-form" onSubmit={handlePanelSubmit("faq")}>
            <h3>Frequently asked questions</h3>
            <p className="admin-form__hint">Add a new Q&A or update the hero copy for the FAQ block.</p>
            <div className="admin-form__grid">
              <label className="admin-field">
                <span className="admin-field__label">New question</span>
                <input name="faqQuestion" placeholder="e.g. Do you arrange desert safaris?" />
              </label>
              <label className="admin-field">
                <span className="admin-field__label">Answer</span>
                <textarea name="faqAnswer" rows={3} placeholder="Provide a concise answer for travellers." />
              </label>
            </div>
            <label className="admin-field">
              <span className="admin-field__label">FAQ banner copy</span>
              <textarea
                name="faqBanner"
                rows={2}
                defaultValue="Planning each journey with trusted local partners so you always feel cared for."
              />
            </label>
            <div className="admin-form__actions">
              <button type="submit">Save draft</button>
            </div>
          </form>
        );
      case "contact":
        return (
          <form className="admin-form" onSubmit={handlePanelSubmit("contact")}>
            <h3>Contact & support</h3>
            <p className="admin-form__hint">Maintain the hotline, email, and studio details visible on the site.</p>
            <div className="admin-form__grid">
              <label className="admin-field">
                <span className="admin-field__label">Phone number</span>
                <input name="contactPhone" defaultValue="(+91) 74269 33288" />
              </label>
              <label className="admin-field">
                <span className="admin-field__label">Email address</span>
                <input name="contactEmail" defaultValue="info@thehappysafar.com" />
              </label>
            </div>
            <label className="admin-field">
              <span className="admin-field__label">Studio address</span>
              <textarea
                name="contactAddress"
                rows={3}
                defaultValue="Saraswati Tower, F-30, Sector 2, Central Spine, Vidyadhar Nagar, Jaipur, Rajasthan 302039"
              />
            </label>
            <div className="admin-form__actions">
              <button type="submit">Save draft</button>
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <main className={dashboardClassName}>
        <aside className="admin-sidebar">
          <div className="admin-sidebar__quick">
            <p className="admin-sidebar__section-label">Admin panel</p>
            <div className="admin-sidebar__quick-grid">
              {quickAccessLinks.map((link) => (
                <button
                  key={link.panel}
                  type="button"
                  className={`admin-sidebar__quick-btn${activePanel === link.panel ? " admin-sidebar__quick-btn--active" : ""}`}
                  onClick={() => {
                    setSidebarCollapsed(true);
                    setActivePanel(link.panel);
                    setFeedback(null);
                  }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </aside>
        <section className="admin-main">
          <header className="admin-main__topbar">
            <div className="admin-main__topbar-left">
              <button
                type="button"
                className="admin-main__toggle"
                onClick={() => setSidebarCollapsed((prev) => !prev)}
                aria-pressed={sidebarCollapsed}
              >
                {sidebarCollapsed ? "Show menu" : "Hide menu"}
              </button>
              <div>
                <p className="admin-main__subhead">Session active</p>
                <h2>{currentPanelLabel}</h2>
              </div>
            </div>
            <button
              type="button"
              className="admin-main__logout"
              onClick={() => {
                clearAdminSession();
                router.replace("/");
              }}
            >
              Log out
            </button>
          </header>
          <div className="admin-main__content">
            {feedback && <p className="admin-feedback">{feedback}</p>}
            <div className="admin-main__editor">{renderPanelContent()}</div>
          </div>
        </section>
      </main>
      <style jsx>{`
        .admin-dashboard {
          min-height: 100vh;
          display: grid;
          grid-template-columns: minmax(260px, 320px) 1fr;
          background: #0f172a;
          color: #0f172a;
          transition: grid-template-columns 0.35s ease;
          position: relative;
        }
        .admin-dashboard--collapsed {
          grid-template-columns: 0px 1fr;
        }
        .admin-sidebar {
          background: radial-gradient(circle at top left, rgba(244, 113, 30, 0.12), rgba(15, 23, 42, 0.95));
          color: #f8fafc;
          padding: 3.5rem 2.25rem 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 2rem;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          transition: opacity 0.25s ease, transform 0.35s ease;
        }
        .admin-dashboard--collapsed .admin-sidebar {
          opacity: 0;
          transform: translateX(-60px);
          pointer-events: none;
        }
        .admin-sidebar__brand h1 {
          margin: 0.75rem 0 0.5rem;
          font-size: 1.75rem;
          font-weight: 600;
          color: #fff;
        }
        .admin-sidebar__brand p {
          color: rgba(248, 250, 252, 0.7);
          font-size: 0.95rem;
        }
        .admin-sidebar__eyebrow {
          text-transform: uppercase;
          letter-spacing: 0.35em;
          font-size: 0.7rem;
          color: rgba(248, 250, 252, 0.6);
        }
        .admin-sidebar__nav {
          display: grid;
          gap: 0.5rem;
        }
        .admin-sidebar__item {
          text-align: left;
          padding: 0.85rem 1rem;
          border-radius: 0.85rem;
          font-weight: 600;
          background: transparent;
          color: rgba(248, 250, 252, 0.7);
          border: 1px solid transparent;
          transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
        }
        .admin-sidebar__item--active,
        .admin-sidebar__item:not(:disabled):hover {
          background: rgba(248, 250, 252, 0.12);
          color: #f8fafc;
          border-color: rgba(248, 250, 252, 0.24);
        }
        .admin-sidebar__item:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
        .admin-sidebar__quick {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .admin-sidebar__section-label {
          text-transform: uppercase;
          letter-spacing: 0.28em;
          font-size: 0.65rem;
          color: rgba(248, 250, 252, 0.5);
        }
        .admin-sidebar__quick-grid {
          display: grid;
          gap: 0.5rem;
        }
        .admin-dashboard--collapsed .admin-sidebar__quick-grid {
          gap: 0.35rem;
        }
        .admin-sidebar__quick-btn {
          border-radius: 0.75rem;
          padding: 0.65rem 0.9rem;
          text-align: left;
          background: rgba(248, 250, 252, 0.08);
          border: 1px solid rgba(248, 250, 252, 0.15);
          color: #f8fafc;
          font-weight: 600;
          transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }
        .admin-sidebar__quick-btn:hover {
          background: rgba(248, 250, 252, 0.15);
          border-color: rgba(248, 250, 252, 0.3);
          transform: translateX(4px);
        }
        .admin-sidebar__quick-btn--active {
          background: rgba(248, 250, 252, 0.22);
          border-color: rgba(248, 250, 252, 0.45);
          color: #ffffff;
        }
        .admin-sidebar__hint {
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(248, 250, 252, 0.45);
        }
        .admin-main {
          background: linear-gradient(180deg, #fffaf5 0%, #ffffff 35%, #f8fafc 100%);
          padding: 3rem 3.5rem;
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        .admin-main__topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.5rem;
        }
        .admin-main__topbar-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }
        .admin-main__toggle {
          border-radius: 999px;
          padding: 0.55rem 1.35rem;
          border: 1px solid rgba(15, 23, 42, 0.15);
          background: rgba(15, 23, 42, 0.04);
          color: #0f172a;
          font-weight: 600;
          cursor: pointer;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.7);
          transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
        }
        .admin-main__toggle:hover {
          background: rgba(15, 23, 42, 0.08);
          border-color: rgba(15, 23, 42, 0.25);
        }
        .admin-dashboard--collapsed .admin-main__toggle {
          background: rgba(249, 115, 22, 0.12);
          border-color: rgba(249, 115, 22, 0.35);
          color: #c2410c;
        }
        .admin-main__subhead {
          text-transform: uppercase;
          letter-spacing: 0.3em;
          font-size: 0.7rem;
          color: #f97316;
        }
        .admin-main__topbar h2 {
          margin-top: 0.35rem;
          font-size: 1.9rem;
          font-weight: 600;
          color: #0f172a;
        }
        .admin-main__logout {
          border-radius: 999px;
          padding: 0.65rem 1.6rem;
          border: none;
          background: linear-gradient(135deg, rgba(248, 113, 113, 0.9), rgba(239, 68, 68, 0.7));
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 12px 24px rgba(239, 68, 68, 0.25);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .admin-main__logout:hover {
          transform: translateY(-1px);
          box-shadow: 0 16px 28px rgba(239, 68, 68, 0.35);
        }
        .admin-main__content {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .admin-main__editor {
          min-width: 0;
        }
        .admin-feedback {
          background: rgba(34, 197, 94, 0.12);
          border: 1px solid rgba(34, 197, 94, 0.35);
          color: #166534;
          padding: 0.85rem 1.25rem;
          border-radius: 18px;
          font-weight: 600;
        }
        .admin-form {
          background: #fff;
          border-radius: 24px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 25px 45px rgba(15, 23, 42, 0.08);
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          color: #1f2937;
        }
        .admin-form h3 {
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
          color: #0f172a;
        }
        .admin-form__hint {
          font-size: 0.9rem;
          color: rgba(15, 23, 42, 0.65);
          margin-bottom: 0.5rem;
        }
        .admin-field {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.6rem;
          font-weight: 600;
          color: #0f172a;
        }
        .admin-field__label {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          color: rgba(15, 23, 42, 0.65);
        }
        .admin-field input,
        .admin-field textarea,
        .admin-form input,
        .admin-form textarea {
          border-radius: 0.85rem;
          border: 1px solid rgba(15, 23, 42, 0.12);
          padding: 0.75rem 0.9rem;
          font-size: 0.95rem;
          font-weight: 500;
          color: #1f2937;
          background: rgba(249, 250, 251, 0.95);
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .admin-form input:focus,
        .admin-form textarea:focus {
          border-color: rgba(249, 115, 22, 0.55);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.15);
          outline: none;
        }
        .admin-form__grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }
        .admin-form__actions {
          display: flex;
          justify-content: flex-end;
        }
        .admin-form__actions button {
          border-radius: 999px;
          padding: 0.65rem 1.8rem;
          border: none;
          background: linear-gradient(135deg, #f97316, #fb923c);
          color: #fff;
          font-weight: 600;
          cursor: pointer;
          box-shadow: 0 16px 30px rgba(249, 115, 22, 0.25);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .admin-form__actions button:hover {
          transform: translateY(-1px);
          box-shadow: 0 20px 35px rgba(249, 115, 22, 0.35);
        }
        @media (max-width: 960px) {
          .admin-dashboard {
            grid-template-columns: 1fr;
          }
          .admin-dashboard--collapsed {
            grid-template-columns: 1fr;
          }
          .admin-sidebar {
            border-right: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 2.5rem 1.75rem;
          }
          .admin-dashboard--collapsed .admin-sidebar {
            display: none;
          }
          .admin-main {
            padding: 2rem 1.75rem 3rem;
          }
          .admin-main__topbar {
            flex-direction: column;
            align-items: flex-start;
          }
          .admin-main__logout {
            align-self: stretch;
            text-align: center;
          }
          .admin-main__topbar-left {
            width: 100%;
            justify-content: space-between;
          }
          .admin-main__toggle {
            flex-shrink: 0;
          }
          .admin-form {
            padding: 1.5rem;
            border-radius: 20px;
          }
        }
      `}</style>
      <style jsx global>{`
        .${CHROME_HIDE_CLASS} .navbar,
        .${CHROME_HIDE_CLASS} .floating-nav,
        .${CHROME_HIDE_CLASS} footer.footer {
          display: none !important;
        }
      `}</style>
    </>
  );
}
