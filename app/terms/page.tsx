import type { Metadata } from "next";
import Navbar from "../components/Navbar";

const LEGAL_NAME = "The Happy Safar";
const BRAND_NAME = "The Happy Safar";
const REGISTERED_ADDRESS =
  "Saraswati Tower, F-30, Sector 2, Central Spine, Vidyadhar Nagar, Jaipur, Rajasthan 302039";
const SUPPORT_PHONE = "+91 92511 47383";
const SUPPORT_EMAIL = "info@thehappysafar.com";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read the detailed Terms & Conditions governing bookings, payments, cancellations, and use of The Happy Safar travel services.",
  alternates: {
    canonical: "/terms",
  },
};

const clauses = [
  {
    title: "Electronic Record",
    paragraphs: [
      "This document is an electronic record generated in terms of the Information Technology Act, 2000, and the rules made thereunder. It does not require any physical or digital signatures.",
      `These Terms of Use govern access to ${BRAND_NAME}'s platform, consisting of the website located at https://www.thehappysafar.com ("Website") and related mobile or digital assets (collectively, "Platform").`,
    ],
  },
  {
    title: "Ownership & Acceptance",
    paragraphs: [
      `${LEGAL_NAME}, a company incorporated under the Companies Act, 1956 with its registered office at ${REGISTERED_ADDRESS}, operates the Platform. The expressions "we", "us", and "our" refer to ${LEGAL_NAME}.`,
      "By accessing, browsing, or otherwise using the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions, the Privacy Policy, and any other policies notified on the Platform.",
      "If you do not agree with any of the terms, you must refrain from accessing the Platform or using the services offered through it.",
    ],
  },
  {
    title: "Eligibility & Account Security",
    paragraphs: [
      "Use of the Platform is permitted only to persons who are competent to contract under the Indian Contract Act, 1872. Minors may use the Platform only with the involvement of a parent or legal guardian.",
      "You are responsible for maintaining the confidentiality of any login credentials and for all activities that occur under your account.",
      "We reserve the right to suspend or terminate access if we believe that account security has been compromised or if these Terms are violated.",
    ],
  },
  {
    title: "Services & Third-Party Content",
    paragraphs: [
      `${BRAND_NAME} curates bespoke travel itineraries, concierge services, accommodation arrangements, and associated on-ground experiences across India.`,
      "Information displayed on the Platform may include descriptions, images, or links supplied by partner hotels, transporters, guides, or activity providers.",
      "We do not guarantee that third-party information is error-free. Any reliance on such content is at your sole risk and discretion.",
    ],
  },
  {
    title: "Booking Process",
    paragraphs: [
      "Itineraries shared by our planners are proposals until a booking deposit specified in the invoice is received.",
      "Services are confirmed only after written acknowledgment from our team and may remain subject to availability until full payment is realised.",
      "We reserve the right to decline or cancel bookings in the event of inaccurate information, unavailability, or circumstances beyond our control. Any such cancellations will be communicated promptly.",
    ],
  },
  {
    title: "Pricing & Payments",
    paragraphs: [
      "All prices are quoted in Indian Rupees unless stated otherwise and are subject to revision based on supplier updates, currency fluctuations, or changes in statutory taxes.",
      "Unless specifically waived, a non-refundable advance of 30% is typically required to initiate confirmations. The balance becomes due 30 days before the departure date or as indicated on your invoice.",
      `Accepted payment modes include bank transfer, UPI, and other gateways expressly authorised by ${LEGAL_NAME}. Payments made through unauthorised channels will not be acknowledged.`,
    ],
  },
  {
    title: "Cancellations, Modifications & Refunds",
    paragraphs: [
      "All cancellation or modification requests must be submitted in writing to the concierge desk at " + SUPPORT_EMAIL + ".",
      "Refund timelines and charges are governed by the policies of partner hotels, airlines, transporters, and activity providers. Non-refundable components or penalties levied by suppliers will be passed on to the traveller.",
      "Force majeure events (including but not limited to natural calamities, government directives, or political disturbances) may necessitate itinerary changes. We will strive to offer comparable alternatives, subject to availability and supplier consent.",
    ],
  },
  {
    title: "Traveller Obligations",
    paragraphs: [
      "You are responsible for ensuring that passports, visas, insurance policies, and health certificates remain valid for the entire trip duration.",
      "You agree not to use the Platform or our services for unlawful, fraudulent, or harmful activities. Any suspected misuse may lead to immediate suspension.",
      "Requests for special assistance (including dietary, medical, or mobility requirements) must be shared in advance so that we can coordinate with relevant suppliers.",
    ],
  },
  {
    title: "Intellectual Property",
    paragraphs: [
      `${LEGAL_NAME} retains all rights, title, and interest in the Platform, including design elements, copy, trademarks, and proprietary tools unless otherwise credited.`,
      "Content may not be copied, reproduced, republished, uploaded, or distributed without prior written consent. Limited personal, non-commercial viewing is permitted.",
    ],
  },
  {
    title: "Limitation of Liability",
    paragraphs: [
      `While we curate experiences with vetted partners, ${LEGAL_NAME} is not liable for acts, omissions, delays, losses, or damages attributable to third-party suppliers.`,
      "In no event shall our aggregate liability exceed the total amount paid by you for the specific services giving rise to the claim.",
    ],
  },
  {
    title: "Governing Law & Dispute Resolution",
    paragraphs: [
      "These Terms are governed by the laws of India. The courts and tribunals at Jaipur, Rajasthan, shall have exclusive jurisdiction over any disputes arising herefrom.",
      "You agree to attempt amicable resolution by notifying us of any concerns within seven (7) days of trip completion before initiating legal proceedings.",
    ],
  },
  {
    title: "Contact Information",
    paragraphs: [
      `${LEGAL_NAME} (${BRAND_NAME})`,
      REGISTERED_ADDRESS,
      `Phone: ${SUPPORT_PHONE}`,
      `Email: ${SUPPORT_EMAIL}`,
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-6 py-16 text-zinc-900">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-600">Terms &amp; Conditions</p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">Usage Terms for The Happy Safar Platform</h1>
          <p className="text-sm leading-6 text-zinc-600">
            These Terms &amp; Conditions constitute a binding agreement between you and {LEGAL_NAME} in relation to the use of the {BRAND_NAME} website,
            ancillary digital properties, and concierge travel services. Please review them carefully before proceeding.
          </p>
        </header>

        <section className="mt-10 space-y-6 text-sm leading-7 text-zinc-700">
          {clauses.map((clause, index) => (
            <article
              key={clause.title}
              className="rounded-3xl border border-amber-100 bg-white/80 p-6 shadow-sm transition hover:shadow-md"
            >
              <header className="flex items-start gap-3">
                <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/15 text-xs font-semibold text-amber-600">
                  {index + 1}
                </span>
                <h2 className="text-base font-semibold text-zinc-900">{clause.title}</h2>
              </header>
              <ul className="mt-4 space-y-3">
                {clause.paragraphs.map((paragraph, idx) => (
                  <li key={idx} className="relative pl-5">
                    <span className="absolute left-0 top-2 h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden />
                    {paragraph}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </section>

        <aside className="mt-10 rounded-3xl border border-dashed border-amber-200 bg-amber-50/70 p-6 text-sm text-amber-700">
          <p>
            By continuing to browse the Platform or confirming a booking, you acknowledge that you have read, understood, and consent to be bound by these
            Terms &amp; Conditions as well as any supplementary policies issued by {LEGAL_NAME} from time to time.
          </p>
        </aside>
      </main>
    </>
  );
}
