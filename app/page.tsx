import Hero from "./components/Hero";
import About from "./components/About";
import PackageCard from "./components/PackageCard";
import { curatedPackages } from "@/data/packages";
import PopularDestinations from "./components/PopularDestinations";
import OurServices from "./components/OurServices";
import HowItWorks from "./components/HowItWorks";
import FaqSection from "./components/FaqSection";
import WhyChooseUs from "./components/WhyChooseUs";
import ContactSection from "./components/ContactSection";
import { Skiper39 } from "./components/skiper39";

export default function Home() {
  return (
    <>
      <Hero />
      <div className="space-y-8 bg-linear-to-b from-amber-50 via-white to-white">
        <About />
        <section
          id="packages"
          className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pb-20 pt-10 text-left"
        >
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-600">Featured Packages</p>
            <h2 className="text-3xl font-semibold text-zinc-900">Preview a few soulful journeys.</h2>
            <p className="text-base text-zinc-600">
              Pick a starting template and our planners will customise every stay, transfer, and experience around your dates.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {curatedPackages.map((pkg) => (
              <PackageCard key={pkg.id} details={pkg} />
            ))}
          </div>
        </section>
        <PopularDestinations />
        <OurServices />
        <HowItWorks />
        <FaqSection />
        <WhyChooseUs />
        <ContactSection />
        <section className="relative -mt-8 min-h-[70vh] overflow-hidden text-black bg-[#fff9f2]">
          <Skiper39 />
        </section>
      </div>

    </>
  );
}
