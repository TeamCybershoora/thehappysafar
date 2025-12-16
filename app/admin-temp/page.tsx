"use client";

import { useEffect, useState } from "react";

type AdminSummary = {
  id?: string;
  name: string;
  email: string;
  createdAt: string | null;
  updatedAt: string | null;
};

type SeedResponse = {
  success: boolean;
  message?: string;
  admin?: AdminSummary | null;
};

export default function AdminTempSeedPage() {
  const [name, setName] = useState("Amit Kumar");
  const [email, setEmail] = useState("thehappysafar@gmail.com");
  const [password, setPassword] = useState("Amit@123");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SeedResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [admins, setAdmins] = useState<AdminSummary[]>([]);
  const [isListing, setIsListing] = useState(false);

  const canFetch = token.trim().length > 0;

  async function fetchAdmins(currentToken: string) {
    if (!currentToken) return;
    setIsListing(true);
    setError(null);
    try {
      const response = await fetch("/api/admin/records", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": currentToken,
        },
      });
      const data = (await response.json().catch(() => null)) as
        | { success?: boolean; admins?: AdminSummary[]; message?: string }
        | null;
      if (!response.ok || !data?.success || !data.admins) {
        throw new Error(data?.message ?? "Unable to load admin records.");
      }
      setAdmins(data.admins);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setAdmins([]);
    } finally {
      setIsListing(false);
    }
  }

  useEffect(() => {
    if (!token) {
      setAdmins([]);
      return;
    }
    void fetchAdmins(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/admin/records", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-token": token,
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data: SeedResponse = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Request failed");
      }
      setResult(data);
      await fetchAdmins(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 shadow-2xl">
        <header className="mb-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-300">Temporary tool</p>
          <h1 className="mt-3 text-3xl font-semibold">Manual Admin Seed</h1>
          <p className="mt-2 text-sm text-white/70">
            Use this form to push admin credentials into MongoDB via <code className="text-amber-200">/api/admin/records</code>.
            Remove or protect this page after seeding.
          </p>
        </header>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-white/80">Admin name</span>
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white placeholder-white/40 focus:border-amber-300 focus:outline-none"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Amit Kumar"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-white/80">Admin email</span>
            <input
              type="email"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white placeholder-white/40 focus:border-amber-300 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="thehappysafar@gmail.com"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-white/80">Admin password</span>
            <input
              type="text"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white placeholder-white/40 focus:border-amber-300 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Amit@123"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-white/80">
              Seed token <span className="text-white/60">(must match ADMIN_SEED_TOKEN)</span>
            </span>
            <input
              type="password"
              className="mt-1 w-full rounded-xl border border-white/10 bg-white/10 px-4 py-3 text-base text-white placeholder-white/40 focus:border-amber-300 focus:outline-none"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="thehappysafar123"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-amber-400/80 px-4 py-3 text-center text-base font-semibold text-slate-900 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Sending…" : "Seed admin"}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.4em] text-white/60">Existing admins</h2>
          <button
            type="button"
            disabled={!canFetch || isListing}
            onClick={() => fetchAdmins(token)}
            className="rounded-lg border border-white/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-white/70 transition hover:border-amber-300 hover:text-amber-200 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isListing ? "Refreshing…" : "Refresh"}
          </button>
        </div>
        <div className="mt-3 space-y-2 text-sm text-white/80">
          {admins.length === 0 && <p>No admin records loaded.</p>}
          {admins.map((admin) => (
            <div key={admin.id ?? admin.email} className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              <p className="font-semibold text-amber-200">{admin.name}</p>
              <p className="text-white/70">{admin.email}</p>
              <p className="text-xs text-white/50">
                Updated: {admin.updatedAt ? new Date(admin.updatedAt).toLocaleString() : "—"}
              </p>
            </div>
          ))}
        </div>

        {error && (
          <p className="mt-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>
        )}
        {result && (
          <p className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
            {result.message ?? "Admin saved."} {result.admin?.email ? `(${result.admin.email})` : ""}
          </p>
        )}
      </div>
    </div>
  );
}
