import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Bell, HelpCircle, Search } from "lucide-react";

import { cn } from "@/lib/utils";

export interface AdminNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  active?: boolean;
}

export interface AdminSidebarProps {
  navItems: AdminNavItem[];
  notificationsCount?: number;
  workspace: {
    initials: string;
    name: string;
    description: string;
  };
  usage: {
    title: string;
    detail: string;
    progress: number;
  };
  brand?: {
    shortLabel: string;
    name: string;
  };
  className?: string;
}

export default function AdminSidebar({
  navItems,
  notificationsCount = 0,
  workspace,
  usage,
  brand = { shortLabel: "Pro", name: "Prody" },
  className,
}: AdminSidebarProps) {
  const progressPercent = Math.min(Math.max(usage.progress, 0), 1) * 100;

  return (
    <aside
      className={cn(
        "sticky top-8 w-64 shrink-0 overflow-hidden rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-sm",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
          {brand.shortLabel}
        </span>
        <p className="text-lg font-semibold text-slate-900">{brand.name}</p>
      </div>

      <label className="mt-6 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-2 text-sm text-slate-500 focus-within:border-slate-300">
        <Search className="h-4 w-4" />
        <input
          type="search"
          placeholder="Search"
          className="w-full bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
        />
      </label>

      <nav className="mt-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition",
                item.active ? "bg-slate-900 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <span
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-xl border",
                  item.active ? "border-white/10 bg-white/10 text-white" : "border-slate-200 bg-white text-slate-500"
                )}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span>{item.label}</span>
              {item.badge ? (
                <span
                  className={cn(
                    "ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold",
                    item.active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                  )}
                >
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-7 space-y-3 text-sm text-slate-600">
        <Link href="#help" className="flex items-center gap-3 rounded-2xl border border-slate-200 px-3 py-2 hover:bg-slate-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100">
            <HelpCircle className="h-4 w-4 text-slate-500" />
          </span>
          Help center
        </Link>

        <button className="flex w-full items-center gap-3 rounded-2xl border border-slate-200 px-3 py-2 text-left hover:bg-slate-100">
          <span className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100">
            <Bell className="h-4 w-4 text-slate-500" />
            {notificationsCount > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-rose-500 text-[10px] font-semibold text-white">
                {notificationsCount}
              </span>
            ) : null}
          </span>
          Notifications
        </button>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Workspace</p>
        <div className="mt-2 flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
            {workspace.initials}
          </span>
          <div>
            <p className="text-sm font-semibold text-slate-800">{workspace.name}</p>
            <p className="text-xs text-slate-500">{workspace.description}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{usage.title}</p>
        <p className="mt-2 text-sm text-slate-600">{usage.detail}</p>
        <div className="mt-3 h-2 w-full rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-linear-to-r from-sky-400 via-amber-300 to-rose-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </aside>
  );
}
