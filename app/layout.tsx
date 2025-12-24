import type { Metadata, Viewport } from "next";
import "./global.css";
import { ThemeProvider } from "./components/ThemeProvider";
import SplashLoader from "./components/SplashLoader";
import GlobalEnquiryModal from "./components/GlobalEnquiryModal";
import RouteLayout from "./components/RouteLayout";
import InspectGuard from "./components/guards/InspectGuard";

const BASE_URL = "https://www.thehappysafar.com";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: "The Happy Safar",
  description:
    "The Happy Safar designs bespoke Rajasthan tour packages, luxury stays, and concierge-led travel itineraries across India.",
  url: BASE_URL,
  logo: `${BASE_URL}/images/brand-mark.png`,
  image: `${BASE_URL}/images/og-default.jpg`,
  telephone: "+91 92511 47383",
  priceRange: "$$",
  areaServed: "India",
  sameAs: [
    "https://www.instagram.com/thehappysafar",
    "https://www.facebook.com/thehappysafar",
  ],
  makesOffer: {
    "@type": "OfferCatalog",
    name: "Tailor-made Rajasthan Tours",
    itemListElement: [
      {
        "@type": "Offer",
        name: "Luxury Rajasthan Tour Package",
        url: `${BASE_URL}/packages`,
      },
      {
        "@type": "Offer",
        name: "Honeymoon & Family Travel Planning",
        url: `${BASE_URL}/packages`,
      },
    ],
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "The Happy Safar | Bespoke Rajasthan Tours & Travel Planning",
    template: "%s | The Happy Safar",
  },
  description:
    "Discover bespoke Rajasthan tour packages, luxury stays, and concierge travel planning curated by The Happy Safar for discerning explorers.",
  keywords: [
    "Rajasthan tour packages",
    "luxury travel planner India",
    "Jaipur travel agency",
    "Rajasthan honeymoon itinerary",
    "custom desert safari",
    "palace stay travel planner",
  ],
  category: "Travel",
  creator: "The Happy Safar",
  publisher: "The Happy Safar",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "The Happy Safar | Bespoke Rajasthan Tours & Travel Planning",
    description:
      "Experience curated Rajasthan journeys, private guides, and concierge-backed travel itineraries with The Happy Safar.",
    url: "/",
    siteName: "The Happy Safar",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: `${BASE_URL}/images/og-default.jpg`,
        width: 1200,
        height: 630,
        alt: "The Happy Safar bespoke Rajasthan tour planning",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Happy Safar | Bespoke Rajasthan Tours & Travel Planning",
    description:
      "Luxury Rajasthan tours, palace stays, and desert experiences curated by The Happy Safar travel planners.",
    images: [`${BASE_URL}/images/og-default.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider>
          <InspectGuard />
          <SplashLoader>
            <RouteLayout>
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
              />
              <main>{children}</main>
              <GlobalEnquiryModal />
            </RouteLayout>
          </SplashLoader>
        </ThemeProvider>
      </body>
    </html>
  );
}
