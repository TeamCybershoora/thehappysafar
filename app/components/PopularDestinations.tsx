import ImageReveal from "@/app/components/ui/image-tiles";

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
    <section className="mx-auto max-w-6xl overflow-x-hidden px-6 py-12 text-left">
      <div className="mb-8 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-600">{eyebrow}</p>
        <h2 className="text-3xl font-semibold text-zinc-900">{title}</h2>
        {description ? <p className="text-base text-zinc-600">{description}</p> : null}
      </div>

      <div className="grid gap-10 md:grid-cols-3">
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-100">
          <div className="space-y-2 px-6 pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-600">Jaipur</p>
            <h3 className="text-xl font-semibold text-zinc-900">Pink City Icons</h3>
            <p className="text-sm text-zinc-600">Amber Fort, Hawa Mahal & old bazaars.</p>
          </div>
          <div className="flex w-full justify-center">
            <ImageReveal
              leftImage="./images/jaigarhfort.jpg"
              middleImage="./images/amberfort.webp"
              rightImage="./images/jalmahal.jpg"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-100">
          <div className="space-y-2 px-6 pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-600">Udaipur</p>
            <h3 className="text-xl font-semibold text-zinc-900">Lakes & Palaces</h3>
            <p className="text-sm text-zinc-600">City Palace views & Lake Pichola sunsets.</p>
          </div>
          <div className="flex w-full justify-center">
            <ImageReveal
              leftImage="./images/citypalace.webp"
              middleImage="./images/tajlake.jpg"
              rightImage=".thardesert"
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-zinc-100">
          <div className="space-y-2 px-6 pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-600">Jaisalmer</p>
            <h3 className="text-xl font-semibold text-zinc-900">Thar Desert Trails</h3>
            <p className="text-sm text-zinc-600">Golden fort lanes & sand dune evenings.</p>
          </div>
          <div className="flex w-full justify-center">
            <ImageReveal
              leftImage="./images/thardesert.jpg"
              middleImage="./images/tharcamel.jpg"
              rightImage="./images/thar.webp"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
