import MagicBento from "./MagicBento";

interface PopularDestinationsProps {
  eyebrow?: string;
  title?: string;
  description?: string;
}

export default function PopularDestinations({
  eyebrow = "Popular Destinations",
  title = "Explore top picks across India.",
  description = "Dive into vibrant cities, serene backwaters, and majestic mountains. Hover and click to discover more.",
}: PopularDestinationsProps) {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12 text-left">
      <div className="mb-8 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-600">{eyebrow}</p>
        <h2 className="text-3xl font-semibold text-zinc-900">{title}</h2>
        {description ? <p className="text-base text-zinc-600">{description}</p> : null}
      </div>

      <MagicBento enableTilt />
    </section>
  );
}
