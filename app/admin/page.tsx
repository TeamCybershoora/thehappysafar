"use client";

import {
  LayoutDashboard,
  FolderKanban,
  BarChart3,
  FileBarChart,
  Puzzle,
  Building2,
  Users,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

import AdminSidebar, { type AdminNavItem } from "./components/AdminSidebar";

const NAV_ITEMS: AdminNavItem[] = [
  { label: "Dashboard", href: "#dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "#projects", icon: FolderKanban, badge: "3/5", active: true },
  { label: "Analytics", href: "#analytics", icon: BarChart3 },
  { label: "Reports", href: "#reports", icon: FileBarChart, badge: "New" },
  { label: "Extensions", href: "#extensions", icon: Puzzle },
  { label: "Companies", href: "#companies", icon: Building2, badge: "17" },
  { label: "People", href: "#people", icon: Users, badge: "164" },
];

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-slate-100 via-white to-slate-50 text-xs font-semibold text-slate-600 shadow-inner">
      {initials}
    </span>
  );
}

export default function AdminPage() {
  return (
    <div className="min-h-svh bg-[#f8f9fb]">
      <div className="mx-auto flex w-full max-w-360 items-start gap-8 px-6 py-8">
        <AdminSidebar
          navItems={NAV_ITEMS}
          notificationsCount={3}
          workspace={{ initials: "EC", name: "Ember Crest", description: "Construction studio" }}
          usage={{ title: "Starter set overview", detail: "3 of 5 projects created", progress: 3 / 5 }}
          brand={{ shortLabel: "Pro", name: "Prody" }}
        />

        <main className="min-w-0 flex-1 space-y-8 pb-10">
          <header className="rounded-3xl border border-slate-200 bg-white px-8 py-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-4">
              <nav className="flex items-center gap-2 text-sm text-slate-500">
                <span>Projects</span>
                <ChevronRight className="h-4 w-4" />
                <span>Construction</span>
                <ChevronRight className="h-4 w-4" />
                <span className="text-slate-900">House Spectrum Ltd</span>
              </nav>

              <div className="ml-auto flex items-center gap-2">
                <button className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
                  Manage
                </button>
                <button className="rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
                  Share
                </button>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold text-slate-900">House Spectrum Ltd</h1>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                    <ShieldCheck className="h-3.5 w-3.5" /> Certified
                  </span>
                </div>

                <div className="mt-2 flex items-center gap-3 text-sm text-slate-500">
                  <Avatar name="Jessica Parker" />
                  <span>Jessica Parker</span>
                  <span className="h-1 w-1 rounded-full bg-slate-300" />
                  <span>Edited 7 hrs ago</span>
                </div>
              </div>
            </div>
          </header>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-600">Page scroll enabled</p>
                <p className="mt-1 text-sm text-slate-500">
                  Ab scroll poori page (body) pe hoga. Sidebar sticky rahega.
                </p>
              </div>
              <div className="text-sm text-slate-500">Add your dashboard widgets here</div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {Array.from({ length: 10 }).map((_, idx) => (
                <div key={idx} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <p className="text-sm font-semibold text-slate-700">Card {idx + 1}</p>
                  <p className="mt-2 text-sm text-slate-500">This is filler content to prove full page scrolling works.</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
