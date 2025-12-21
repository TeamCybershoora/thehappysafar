 import type { Metadata } from "next";

import FaqView, { type FaqSection } from "./FaqView";

const CALL_NUMBER = "+919251147383";
const WHATSAPP_NUMBER = "+919251147383";

const faqSections: FaqSection[] = [
  {
    eyebrow: "Planning your safar",
    title: "Trip planning basics",
    intro:
      "Your Rajasthan journey should feel effortless. Here’s how we handle the essentials, from customising itineraries to reserving your favourite stays.",
    faqs: [
      {
        question: "Can I customise the suggested itineraries?",
        answer:
          "Absolutely. Every itinerary we share is a starting point. Share your travel vibe, dates, and must-do experiences, and our journey planners will tailor the route, pacing, and stays to match.",
      },
      {
        question: "How far in advance should I enquire?",
        answer:
          "For peak season (October–March) we recommend reaching out 6–8 weeks prior so palace stays and boutique camps are available. We can still work wonders with shorter notice—just let us know your window.",
      },
      {
        question: "Do you plan honeymoons and family trips differently?",
        answer:
          "Yes. Honeymooners often get slower pacing, private dining, and pampering spa slots. Families usually prefer interactive experiences and spacious suites. We curate activities, guides, and logistics accordingly.",
      },
    ],
  },
  {
    eyebrow: "Bookings & payments",
    title: "Reservations, payments, and policies",
    intro:
      "Transparent pricing and secure payments help you book with confidence. These are the most common questions guests ask before confirming their safar.",
    faqs: [
      {
        question: "What is the payment schedule?",
        answer:
          "We take a 30% planning retainer to lock in hotels and experiences. The balance is due 14 days before arrival. For last-minute plans you can settle in a single transaction.",
      },
      {
        question: "How do refunds and changes work?",
        answer:
          "If plans shift, let us know as early as possible. Hotel and experience partners have varied policies, but we’ll negotiate credits or partial refunds on your behalf and detail any supplier fees before processing.",
      },
      {
        question: "Which payment methods do you accept?",
        answer:
          "We support UPI, major credit and debit cards, bank transfers, and international wire payments. Your planner will send a secure payment link with the option you prefer.",
      },
    ],
  },
  {
    eyebrow: "During the journey",
    title: "On-trip support and experiences",
    intro:
      "From airport pickups to last-minute restaurant reservations, our on-ground pods handle the details so you can soak in Rajasthan’s colours.",
    faqs: [
      {
        question: "Will someone assist us while we’re travelling?",
        answer:
          "Yes. You’ll receive a dedicated WhatsApp concierge plus local coordinator numbers in each city. They track your progress, arrange transfers, and step in instantly if you need support.",
      },
      {
        question: "Can you arrange special experiences mid-trip?",
        answer:
          "Of course. Want a surprise desert sundowner or folk performance? Message your concierge and we’ll unlock it, subject to availability and any incremental pricing.",
      },
      {
        question: "Do you offer travel insurance?",
        answer:
          "We partner with reputable insurers and can add a comprehensive policy to your package. Cover includes medical support, trip delays, and baggage protection.",
      },
    ],
  },
  {
    eyebrow: "Logistics",
    title: "Visas, documents, and practicalities",
    intro:
      "A few quick pointers on documentation and practical arrangements help keep your safar hassle-free.",
    faqs: [
      {
        question: "Can you help with domestic flights and trains?",
        answer:
          "Yes. We can book domestic flights, premium train cabins, and chauffeur-driven cars. Tickets are shared digitally and printed copies are waiting with your driver where needed.",
      },
      {
        question: "Do international travellers need a visa?",
        answer:
          "Most foreign nationals require an e-visa for India. We’ll guide you through the application timeline and provide supporting documentation such as hotel confirmations.",
      },
      {
        question: "What should we pack for Rajasthan weather?",
        answer:
          "Pack light breathable layers for the day, a warm shawl or jacket for desert evenings, and comfortable walking shoes. October–February mornings can be crisp in the desert, while summers call for sun protection.",
      },
    ],
  },
];

export const metadata: Metadata = {
  title: "FAQ | The Happy Safar",
  description: "Answers to common questions about planning your Rajasthan journey with The Happy Safar.",
};

export default function FaqPage() {
  return <FaqView sections={faqSections} callNumber={CALL_NUMBER} whatsappNumber={WHATSAPP_NUMBER} />;
}
