import PackageCard from "../components/PackageCard";
import { extendedPackages } from "@/data/packages";

export default function PackagesPage() {
  return (
    <main className="bg-amber-50/40 py-16">
      <section className="mx-auto flex max-w-6xl flex-col gap-8 px-6 text-left">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-600">All Packages</p>
          <h1 className="text-3xl font-semibold text-zinc-900">Plan soulful journeys anywhere in India.</h1>
          <p className="text-base text-zinc-600">
            Whether it’s three cards or fifty, every experience flows through this grid. Cards will automatically wrap
            to the next row—three across on desktop, one per row on mobile—so you can keep adding without layout issues.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {extendedPackages.map((pkg) => (
            <PackageCard key={pkg.id} details={pkg} />
          ))}
        </div>
      </section>
    </main>
  );
}
