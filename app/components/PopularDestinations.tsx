import MagicBento from "./MagicBento";

interface PopularDestinationsProps {
  eyebrow?: string;
  title?: string;
  description?: string;
}

export default function PopularDestinations({
  eyebrow = "Desert & Heritage Hotspots",
  title = "Explore Rajasthan’s most storied circuits.",
  description = "Glide through Jaipur bazaars, Jodhpur’s blue lanes, Udaipur ghats, and the Thar dunes. Hover to uncover signature stays and insider-only experiences.",
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
