import type { PackageDetails } from "@/types/packages";

export const curatedPackages: PackageDetails[] = [
  {
    id: "jaipur-udaipur",
    title: "Jaipur Udaipur Tour Package",
    duration: "4N/5D",
    priceTag: "Price on request",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    summary: "Jaipur → Amber Fort, City Palace, Hawa Mahal → Udaipur → Fateh Sagar Lake, Lake Pichola",
    itinerary: [
      "Meet & greet at Jaipur",
      "Guided heritage walk",
      "Drive to Udaipur via Chittorgarh",
      "Sunset cruise & farewell dinner",
    ],
    ctaLink: "/#enquiry",
    whatsappLink: "https://wa.me/919123456789",
  },
  {
    id: "kashmir-luxe",
    title: "Himalayan Wellness & Kashmir Sojourn",
    duration: "6N/7D",
    priceTag: "From ₹85,000",
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80",
    summary: "Srinagar → Gulmarg → Pahalgam → Srinagar",
    itinerary: [
      "Shikara welcome & kahwa ritual",
      "Private gondola & ski guide",
      "Aru Valley picnic brunch",
      "Spa day + wazwan chef pop-up",
    ],
  },
  {
    id: "goa-hidden",
    title: "Hidden Goa Creative Escape",
    duration: "3N/4D",
    priceTag: "From ₹42,000",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    summary: "Assagao atelier stay → Fontainhas → Chorao Island",
    itinerary: [
      "Slow-brunch tasting trail",
      "Indigo dye workshop with local artist",
      "Mangrove SUP & birding",
      "Chef’s table with live music",
    ],
  },
  
];

export const extendedPackages: PackageDetails[] = Array.from({ length: 50 }, (_, index) => {
  const base = curatedPackages[index % curatedPackages.length];
  const sequence = index + 1;

  return {
    ...base,
    id: `${base.id}-${sequence}`,
    title: `${base.title} • ${sequence}`,
  };
});
