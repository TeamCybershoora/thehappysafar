import Navbar from "../components/Navbar";
import PackageCard from "../components/PackageCard";
import { cityPackages } from "@/data/cities";

export default function CityTourPage() {
  return (
    <>
      <Navbar />
      <div className="bg-linear-to-b from-amber-50 via-white to-white pt-10">
        <section className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-20 pt-10 text-left">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-600">City Tours</p>
            <h1 className="text-3xl font-semibold text-zinc-900">All City Tour Packages</h1>
            <p className="text-base text-zinc-600">
              Browse our city-focused itineraries. Tap a package to view full details or request a custom plan.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {cityPackages.map((pkg) => (
              <PackageCard key={pkg.id} details={pkg} source="city" />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
