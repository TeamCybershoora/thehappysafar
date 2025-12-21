import type { Metadata } from "next";
import Navbar from "../components/Navbar";

const BRAND_NAME = "The Happy Safar";
const PLATFORM_URL = "https://www.thehappysafar.com";
const REGISTERED_ADDRESS =
  "Saraswati Tower, F-30, Sector 2, Central Spine, Vidyadhar Nagar, Jaipur, Rajasthan 302039";
const SUPPORT_PHONE = "+91 92511 47383";
const SUPPORT_EMAIL = "info@thehappysafar.com";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Learn how The Happy Safar collects, uses, shares, and protects personal information across its travel planning platform.",
  alternates: {
    canonical: "/privacy",
  },
};

const PLATFORM_URLS = [
  "https://www.thehappysafar.com/",
  "https://www.thehappysafar.in/",
  "https://www.thehappysafar.online/",
];

const sections = [
  {
    heading: "Introduction",
    paragraphs: [
      `This Privacy Policy describes how ${BRAND_NAME} and its affiliates (collectively “${BRAND_NAME}”, “we”, “our”, “us”) collect, use, share, protect or otherwise process your personal data through our websites: ${PLATFORM_URLS.join(", ")} (collectively referred to as the “Platform”).`,
      "You may be able to browse certain sections of the Platform without registering with us. We do not offer any product or service outside India and your personal data will primarily be stored and processed in India.",
      "By visiting the Platform, providing your information, or availing any product/service offered on the Platform, you expressly agree to be bound by the terms and conditions of this Privacy Policy, the Terms of Use, and any applicable service/product terms and conditions.",
    ],
  },
  {
    heading: "Collection",
    paragraphs: [
      "We collect your personal data when you use our Platform, services, or otherwise interact with us. This includes information provided during registration such as name, date of birth, address, mobile number, and email ID.",
      "Some sensitive personal data, such as payment instrument information or biometric identifiers (for example, facial features), may be collected with your consent to enable specific features.",
      "We may track your behaviour and preferences on our Platform. If you receive an email or call from someone claiming to be from THE HAPPY SAFAR asking for your PIN or passwords, please do not provide it and report it to the appropriate law enforcement agency.",
    ],
  },
  {
    heading: "Usage",
    paragraphs: [
      "We use your personal data to provide the services you request, fulfil orders, enhance customer experience, resolve disputes, and inform you about offers and updates.",
      "We also use this data to detect and protect against fraud and other criminal activity. You may opt out of marketing communications at any time through the mechanisms provided.",
    ],
  },
  {
    heading: "Sharing",
    paragraphs: [
      "We may share your personal data internally within our group entities and affiliates to provide access to services and products. These entities may market to you unless you explicitly opt out.",
      "We may also disclose personal data to third-party service providers (including logistics partners, payment gateways, and other vendors) to facilitate our services, and to law-enforcement or government agencies when required by law or to protect the rights and safety of our users or the public.",
    ],
  },
  {
    heading: "Security Precautions",
    paragraphs: [
      "We adopt reasonable security practices and procedures to protect your personal data. However, no internet transmission is completely secure, and you accept the inherent risks associated with online platforms.",
      "You are responsible for safeguarding your login credentials and account information.",
    ],
  },
  {
    heading: "Data Deletion and Retention",
    paragraphs: [
      "You may delete your account via the Platform’s profile settings or by contacting us. We retain your data only for as long as necessary to fulfil the purposes for which it was collected or as required by law.",
      "We may retain anonymised data for research and analytical purposes.",
    ],
  },
  {
    heading: "Consent",
    paragraphs: [
      "By visiting the Platform, you consent to the collection, use, storage, disclosure, and processing of your information as described in this Privacy Policy.",
      "You authorise ${BRAND_NAME} and its partners to contact you via SMS, instant messaging apps, calls, and email. You can withdraw your consent by writing to our Grievance Officer; withdrawal will be processed in accordance with law.",
    ],
  },
  {
    heading: "Changes to this Privacy Policy",
    paragraphs: [
      "Please review this Privacy Policy periodically for updates. We will notify you of significant changes as required under applicable law.",
    ],
  },
  {
    heading: "Grievance Officer",
    paragraphs: [
      `${BRAND_NAME}`,
      REGISTERED_ADDRESS,
      `Email: ${SUPPORT_EMAIL}`,
      `Phone: ${SUPPORT_PHONE}`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-6 py-16 text-zinc-900">
        <header className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-600">Privacy Policy</p>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-900">How The Happy Safar Protects Your Information</h1>
          <p className="text-sm leading-6 text-zinc-600">
            This Privacy Policy explains how {BRAND_NAME} handles personal information collected through our travel planning platforms. Please read it carefully
            before engaging with our services.
          </p>
        </header>

        <section className="mt-10 space-y-6 text-sm leading-7 text-zinc-700">
          {sections.map((section, index) => (
            <article
              key={section.heading}
              className="rounded-3xl border border-amber-100 bg-white/80 p-6 shadow-sm transition hover:shadow-md"
            >
              <header className="flex items-start gap-3">
                <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-amber-500/15 text-xs font-semibold text-amber-600">
                  {index + 1}
                </span>
                <h2 className="text-base font-semibold text-zinc-900">{section.heading}</h2>
              </header>
              <ul className="mt-4 space-y-3">
                {section.paragraphs.map((paragraph, idx) => (
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
            By continuing to browse the Platform or utilising our services, you acknowledge that you have read, understood, and consent to this Privacy Policy
            as well as any supplementary policies issued by {BRAND_NAME} from time to time.
          </p>
        </aside>
      </main>
    </>
  );
}
