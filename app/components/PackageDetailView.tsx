'use client';

import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { curatedPackages } from "@/data/packages";
import PackageCard from "./PackageCard";
import Navbar from "./Navbar";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Heart,
  MapPin,
  PhoneCall,
  Users,
  MoveRight,
} from "lucide-react";

const tabs = ["detail", "itinerary", "map", "photos", "reviews"] as const;

type TabKey = (typeof tabs)[number];

type ItineraryItem = {
  day: number;
  title: string;
  description: string;
};

type RoutePoint = {
  lat: number;
  lng: number;
  label: string;
};

declare global {
  interface Window {
    L?: any;
    __leafletPromise?: Promise<any>;
  }
}

const cityCoordinates: Record<string, RoutePoint> = {
  JAIPUR: { lat: 26.9124, lng: 75.7873, label: "Jaipur" },
  UDAIPUR: { lat: 24.5854, lng: 73.7125, label: "Udaipur" },
  AJMER: { lat: 26.4499, lng: 74.6399, label: "Ajmer" },
  PUSHKAR: { lat: 26.4887, lng: 74.5511, label: "Pushkar" },
  JODHPUR: { lat: 26.2389, lng: 73.0243, label: "Jodhpur" },
  RANTHAMBORE: { lat: 26.0173, lng: 76.5026, label: "Ranthambore" },
  CHITTORGARH: { lat: 24.879, lng: 74.629, label: "Chittorgarh" },
  DELHI: { lat: 28.6139, lng: 77.209, label: "Delhi" },
  AGRA: { lat: 27.1767, lng: 78.0081, label: "Agra" },
  BIKANER: { lat: 28.0229, lng: 73.3119, label: "Bikaner" },
  JAISALMER: { lat: 26.9124, lng: 70.9123, label: "Jaisalmer" },
  "MOUNT ABU": { lat: 24.5925, lng: 72.7156, label: "Mount Abu" },
  CHURU: { lat: 28.3045, lng: 74.9672, label: "Churu" },
  NAHARGARH: { lat: 26.9385, lng: 75.8196, label: "Nahargarh" },
  "RANTHAMBORE JUNGLE SAFARI": { lat: 26.0173, lng: 76.5026, label: "Ranthambore" },
  "SAWAI MADHOPUR": { lat: 26.023, lng: 76.344, label: "Sawai Madhopur" },
  AMER: { lat: 26.9855, lng: 75.8513, label: "Amer" },
  FATEHPUR: { lat: 27.991, lng: 74.9497, label: "Fatehpur" },
  "BIRLA TEMPLE": { lat: 26.9124, lng: 75.7873, label: "Jaipur" },
  "AMBER FORT": { lat: 26.9855, lng: 75.8513, label: "Amber Fort" },
  "JAIGARH FORT": { lat: 26.9847, lng: 75.8456, label: "Jaigarh Fort" },
  "NAHARGARH FORT": { lat: 26.9385, lng: 75.8196, label: "Nahargarh Fort" },
  "JAL MAHAL": { lat: 26.9539, lng: 75.8467, label: "Jal Mahal" },
  "TRADITIONAL MARKET": { lat: 26.9161, lng: 75.8203, label: "Jaipur Markets" },
  "ALBERT HALL MUSEUM": { lat: 26.9124, lng: 75.8180, label: "Albert Hall Museum" },
  "CITY PALACE": { lat: 26.9257, lng: 75.8211, label: "City Palace" },
  "HAWA MAHAL": { lat: 26.9239, lng: 75.8267, label: "Hawa Mahal" },
  "JANTER - MANTER": { lat: 26.9240, lng: 75.8237, label: "Jantar Mantar" },
  "JANTAR MANTAR": { lat: 26.9240, lng: 75.8237, label: "Jantar Mantar" },
  "JANAR-MANTAR": { lat: 26.9240, lng: 75.8237, label: "Jantar Mantar" },
};

const CITY_KEYS = Object.keys(cityCoordinates);

const ensureLeaflet = () => {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.L) return Promise.resolve(window.L);
  if (window.__leafletPromise) return window.__leafletPromise;

  window.__leafletPromise = new Promise<any>((resolve, reject) => {
    const cssId = "leaflet-css";
    if (!document.getElementById(cssId)) {
      const link = document.createElement("link");
      link.id = cssId;
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.onload = () => resolve(window.L);
    script.onerror = (error) => {
      console.error("Failed to load Leaflet", error);
      window.__leafletPromise = undefined;
      reject(error);
    };
    document.body.appendChild(script);
  });

  return window.__leafletPromise;
};

const normalizeId = (value: string) => value.replace(/\s+/g, " ").trim();

const formatItinerary = (step: string, index: number): ItineraryItem => {
  const [rawTitle, ...rest] = step.split("::");
  const title = rawTitle?.trim() || `Day ${index + 1}`;
  const description = rest.join("::").trim().replace(/\n{3,}/g, "\n\n");

  return {
    day: index + 1,
    title,
    description,
  };
};

const uppercaseFirst = (key: string) => key.charAt(0).toUpperCase() + key.slice(1);

function RouteMap({ points }: { points: RoutePoint[] }) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let mapInstance: any | null = null;
    let polyline: any | null = null;
    let cancelled = false;

    ensureLeaflet()
      .then((L) => {
        if (!L || cancelled || !mapContainerRef.current || points.length < 2) return;

        mapInstance = L.map(mapContainerRef.current, {
          zoomControl: false,
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 18,
          attribution: "© OpenStreetMap contributors",
        }).addTo(mapInstance);

        const latLngs = points.map((point) => [point.lat, point.lng]);
        polyline = L.polyline(latLngs, {
          color: "#f97316",
          weight: 4,
          opacity: 0.85,
          lineJoin: "round",
          dashArray: "6 8",
        }).addTo(mapInstance);

        points.forEach((point, index) => {
          L.marker([point.lat, point.lng], {
            title: point.label,
          })
            .addTo(mapInstance)
            .bindPopup(`${index + 1}. ${point.label}`)
            .bindTooltip(`${index + 1}. ${point.label}`, {
              direction: "top",
              offset: [0, -8],
              opacity: 0.95,
            });
        });

        mapInstance.fitBounds(polyline.getBounds(), {
          padding: [32, 32],
        });
      })
      .catch((error) => {
        console.error("Unable to initialise route map", error);
      });

    return () => {
      cancelled = true;
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [points]);

  if (points.length < 2) {
    return (
      <div className="flex h-64 w-full items-center justify-center bg-amber-50 text-sm text-amber-700">
        Route preview coming soon.
      </div>
    );
  }

  return <div ref={mapContainerRef} className="h-64 w-full" />;
}

export default function PackageDetailView({ packageId }: { packageId: string }) {
  const normalizedTarget = normalizeId(packageId);
  const packageIndex = curatedPackages.findIndex((pkg) => normalizeId(pkg.id) === normalizedTarget);

  if (packageIndex === -1) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="text-3xl font-semibold text-zinc-900">Package not found</h1>
        <p className="text-sm text-zinc-600">
          The requested journey is unavailable right now. Please explore our other curated escapes.
        </p>
      </div>
    );
  }

  const travelPackage = curatedPackages[packageIndex];
  const [activeTab, setActiveTab] = useState<TabKey>("detail");
  const [openDetailIndex, setOpenDetailIndex] = useState<number | null>(null);
  const [showRouteMap, setShowRouteMap] = useState(false);
  const [isBrochureDownloading, setIsBrochureDownloading] = useState(false);
  const [quoteSubmitState, setQuoteSubmitState] = useState<"idle" | "success" | "error">("idle");
  const [quoteSubmitError, setQuoteSubmitError] = useState<string | null>(null);
  const [isQuoteSubmitting, setIsQuoteSubmitting] = useState(false);

  const summarySegments = useMemo(() => {
    return travelPackage.summary
      .split(/→|,|\u2023|\u2022|-/)
      .map((segment) => segment.trim())
      .filter(Boolean);
  }, [travelPackage.summary]);

  const summaryHighlights = useMemo(() => {
    return summarySegments.slice(0, 5);
  }, [summarySegments]);

  const itinerary = useMemo(() => {
    return travelPackage.itinerary.map((step, index) => formatItinerary(step, index));
  }, [travelPackage.itinerary]);

  const otherPackages = curatedPackages.filter((_, index) => index !== packageIndex);

  const routePoints = useMemo(() => {
    const seen = new Set<string>();
    const points: RoutePoint[] = [];

    const considerSegment = (raw: string) => {
      const upper = raw.toUpperCase();
      for (const key of CITY_KEYS) {
        if (seen.has(key)) continue;
        if (upper.includes(key)) {
          seen.add(key);
          points.push(cityCoordinates[key]);
          break;
        }
      }
    };

    summarySegments.forEach(considerSegment);
    itinerary.forEach((item) => considerSegment(item.title));

    return points;
  }, [summarySegments, itinerary]);

  useEffect(() => {
    const handleResponsiveMap = () => {
      if (typeof window === "undefined") return;
      setShowRouteMap(window.innerWidth >= 768);
    };

    handleResponsiveMap();
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResponsiveMap);
      return () => window.removeEventListener("resize", handleResponsiveMap);
    }
  }, []);

  const handleDownloadBrochure = useCallback(async () => {
    if (isBrochureDownloading) return;
    setIsBrochureDownloading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 18;
      const contentWidth = pageWidth - margin * 2;
      let cursorY = margin;

      const colors = {
        background: [248, 243, 232],
        header: [19, 19, 20],
        accent: [241, 132, 40],
        accentMuted: [253, 196, 138],
        accentSoft: [255, 229, 196],
        textDark: [42, 34, 28],
        textMuted: [107, 94, 82],
        tableRow: [254, 248, 239],
        tableRowAlt: [250, 238, 220],
      } as const;

      const setFillColor = (color: readonly number[]) => {
        doc.setFillColor(color[0], color[1], color[2]);
      };

      const setTextColor = (color: readonly number[]) => {
        doc.setTextColor(color[0], color[1], color[2]);
      };

      const applyPageBackground = () => {
        setFillColor(colors.background);
        doc.rect(0, 0, pageWidth, pageHeight, "F");
      };

      const ensureSpace = (requiredHeight: number) => {
        if (cursorY + requiredHeight > pageHeight - margin) {
          doc.addPage();
          applyPageBackground();
          cursorY = margin;
        }
      };

      applyPageBackground();

      const drawHeader = () => {
        const headerHeight = 48;
        ensureSpace(headerHeight);
        setFillColor(colors.header);
        doc.roundedRect(margin, cursorY, contentWidth, headerHeight, 12, 12, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        setTextColor([255, 255, 255]);
        doc.text("Travel Brochure", margin + 16, cursorY + 26);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Curated by The Happy Safar", margin + 16, cursorY + 37);

        const pillWidth = 70;
        const pillHeight = 20;
        setFillColor(colors.accent);
        doc.roundedRect(margin + contentWidth - pillWidth - 16, cursorY + 14, pillWidth, pillHeight, 10, 10, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        setTextColor(colors.header);
        doc.text("thehappysafar.com", margin + contentWidth - pillWidth / 2 - 16, cursorY + 27, {
          align: "center",
        });

        cursorY += headerHeight + 14;
      };

      const drawPackageHighlightCard = () => {
        const paddingX = 18;
        const paddingY = 16;
        const highlightTitles = travelPackage.itinerary
          .slice(0, 3)
          .map((step, index) => formatItinerary(step, index).title);
        const titleLines = doc.splitTextToSize(travelPackage.title.toUpperCase(), contentWidth - paddingX * 2);
        const metaLine = `${travelPackage.duration} • ${travelPackage.priceTag}`;
        const highlightsHeight = highlightTitles.reduce((total, title) => {
          const lines = doc.splitTextToSize(title, contentWidth - paddingX * 2 - 10);
          return total + lines.length * 6 + 4;
        }, 0);
        const cardHeight = paddingY * 2 + titleLines.length * 9 + 12 + 10 + highlightsHeight;

        ensureSpace(cardHeight);
        setFillColor(colors.accent);
        doc.roundedRect(margin, cursorY, contentWidth, cardHeight, 14, 14, "F");

        let textY = cursorY + paddingY;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        setTextColor([255, 255, 255]);
        titleLines.forEach((line: string) => {
          doc.text(line, margin + paddingX, textY);
          textY += 10;
        });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.text(metaLine, margin + paddingX, textY + 2);
        textY += 14;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.text("TRIP HIGHLIGHTS", margin + paddingX, textY);
        textY += 8;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        highlightTitles.forEach((item: string) => {
          const lines = doc.splitTextToSize(item, contentWidth - paddingX * 2 - 10);
          setFillColor([255, 255, 255]);
          doc.circle(margin + paddingX + 2, textY - 2, 1.2, "F");
          lines.forEach((line: string, lineIndex: number) => {
            doc.text(line, margin + paddingX + 8, textY + lineIndex * 6);
          });
          textY += lines.length * 6 + 4;
        });

        cursorY += cardHeight + 14;
      };

      const drawSummaryCard = () => {
        const paddingX = 18;
        const paddingY = 16;
        const summaryLines = doc.splitTextToSize(travelPackage.summary, contentWidth - paddingX * 2);
        const cardHeight = paddingY * 2 + summaryLines.length * 6.5 + 18;

        ensureSpace(cardHeight);
        setFillColor(colors.accentMuted);
        doc.roundedRect(margin, cursorY, contentWidth, cardHeight, 12, 12, "F");

        let textY = cursorY + paddingY;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        setTextColor(colors.textDark);
        doc.text("TRIP OVERVIEW", margin + paddingX, textY);
        textY += 9;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10.5);
        setTextColor(colors.textMuted);
        summaryLines.forEach((line: string) => {
          doc.text(line, margin + paddingX, textY);
          textY += 6.5;
        });

        cursorY += cardHeight + 16;
      };

      const drawItineraryTable = () => {
        if (!travelPackage.itinerary.length) {
          return;
        }

        const tableWidth = contentWidth;
        const dayColWidth = 24;
        const highlightColWidth = 62;
        const detailColWidth = tableWidth - dayColWidth - highlightColWidth;

        ensureSpace(26);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(14);
        setTextColor(colors.textDark);
        doc.text("DAY-BY-DAY ITINERARY", margin, cursorY);
        cursorY += 10;

        // Table header
        const headerHeight = 12;
        ensureSpace(headerHeight + 4);
        setFillColor(colors.header);
        doc.roundedRect(margin, cursorY, tableWidth, headerHeight, 8, 8, "F");
        setTextColor([255, 255, 255]);
        doc.setFontSize(10);
        doc.text("Day", margin + 6, cursorY + 8);
        doc.text("Highlight", margin + dayColWidth + 6, cursorY + 8);
        doc.text("Details", margin + dayColWidth + highlightColWidth + 6, cursorY + 8);
        cursorY += headerHeight;

        let altRow = false;

        travelPackage.itinerary.forEach((step, index) => {
          const formatted = formatItinerary(step, index);
          const highlightLines = doc.splitTextToSize(formatted.title, highlightColWidth - 10);
          const detailLines = doc.splitTextToSize(
            formatted.description.replace(/\s+/g, " ").trim(),
            detailColWidth - 10,
          );

          const rowHeight = Math.max(highlightLines.length, detailLines.length) * 6 + 10;
          ensureSpace(rowHeight + 4);

          setFillColor(altRow ? colors.tableRowAlt : colors.tableRow);
          doc.rect(margin, cursorY, tableWidth, rowHeight, "F");

          let textY = cursorY + 8;
          setTextColor(colors.textDark);
          doc.setFont("helvetica", "bold");
          doc.setFontSize(10);
          doc.text(`Day ${formatted.day}`, margin + 6, textY);

          setTextColor(colors.textDark);
          highlightLines.forEach((line: string, lineIdx: number) => {
            doc.text(line, margin + dayColWidth + 6, textY + lineIdx * 6);
          });

          setTextColor(colors.textMuted);
          doc.setFont("helvetica", "normal");
          detailLines.forEach((line: string, lineIdx: number) => {
            doc.text(line, margin + dayColWidth + highlightColWidth + 6, textY + lineIdx * 6);
          });

          cursorY += rowHeight;
          altRow = !altRow;
        });

        cursorY += 16;
      };

      const drawFooter = () => {
        const footerHeight = 54;
        ensureSpace(footerHeight + 12);
        setFillColor(colors.header);
        doc.roundedRect(margin, cursorY, contentWidth, footerHeight, 12, 12, "F");

        let textY = cursorY + 18;
        setTextColor([255, 255, 255]);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.text("Plan Your Journey", margin + 16, textY);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        textY += 8;
        doc.text(
          "Connect with The Happy Safar concierge team to customise this itinerary and secure your dream travel dates.",
          margin + 16,
          textY,
          { maxWidth: contentWidth - 32 },
        );

        textY += 14;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.text("Contact", margin + 16, textY);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9.5);
        setTextColor(colors.accentSoft);
        textY += 6;
        doc.text("Email", margin + 16, textY);
        doc.text(": info@thehappysafar.com", margin + 32, textY);
        textY += 6;
        doc.text("Phone", margin + 16, textY);
        doc.text(": +91 92511 47383", margin + 32, textY);
        textY += 6;
        doc.text("Website", margin + 16, textY);
        doc.text(": www.thehappysafar.com", margin + 32, textY);

        cursorY += footerHeight + 6;
      };

      drawHeader();
      drawPackageHighlightCard();
      drawSummaryCard();
      drawItineraryTable();
      drawFooter();

      const sanitizedTitle = travelPackage.title.replace(/[\\/:*?"<>|]/g, "").trim() || "Safar Package";
      const blob = doc.output("blob");
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${sanitizedTitle} - Brochure.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to generate brochure PDF", error);
    } finally {
      setIsBrochureDownloading(false);
    }
  }, [isBrochureDownloading, travelPackage]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "detail":
        return (
          <section className="space-y-8">
            <div className="flex flex-col gap-4 rounded-2xl border border-amber-100 bg-amber-50/40 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-zinc-900">Tour Details</h2>
                <p className="mt-2 text-base font-semibold uppercase tracking-[0.2em] text-amber-600">
                  {travelPackage.title.trim().replaceAll("  ", " ")}
                </p>
              </div>
              <button
                type="button"
                onClick={handleDownloadBrochure}
                disabled={isBrochureDownloading}
                className="inline-flex items-center gap-2 rounded-full border border-amber-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700 transition hover:bg-amber-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isBrochureDownloading ? "Preparing" : "Download brochure"}
                <MoveRight className="h-3.5 w-3.5" />
              </button>
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-900">Overview</h3>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-zinc-700">
                {travelPackage.summary}
              </p>
            </div>
            <div>
              <h3 className="text-base font-semibold text-zinc-900">Day-by-day highlights</h3>
              <p className="mt-2 text-sm text-zinc-600">
                Tap a day card to skim the experiences we choreograph across this circuit.
              </p>
              <div className="mt-4 space-y-3">
                {itinerary.map((item, index) => {
                  const isOpen = openDetailIndex === index;
                  return (
                    <div
                      key={item.day}
                      className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm"
                    >
                      <button
                        type="button"
                        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                        onClick={() =>
                          setOpenDetailIndex((current) => (current === index ? null : index))
                        }
                      >
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-600">
                          Day {item.day}
                        </p>
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full border border-amber-100 bg-amber-50 text-amber-600 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </span>
                      </button>
                      <div
                        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        {isOpen ? (
                          <div className="overflow-hidden px-5 pb-5 text-sm leading-6 text-zinc-700">
                            <p className="text-sm font-semibold text-zinc-900">
                              {item.title}
                            </p>
                            <div className="mt-2 space-y-3">
                              {item.description.split(/\n{2,}/).map((paragraph, idx) => (
                                <p key={idx}>{paragraph.trim()}</p>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
              {routePoints.length >= 2 && (
                <div className="mt-5 space-y-4 rounded-2xl border border-amber-100 bg-white/70 p-4 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-semibold text-zinc-900">Route overview</h4>
                      <p className="text-xs text-zinc-600">Preview the trip path across key cities.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowRouteMap((prev) => !prev)}
                      className="rounded-full border border-amber-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-600 transition hover:bg-amber-500 hover:text-white md:hidden"
                    >
                      {showRouteMap ? "Hide map" : "View map"}
                    </button>
                  </div>
                  {showRouteMap ? (
                    <div className="overflow-hidden rounded-xl border border-amber-100">
                      <RouteMap key="visible" points={routePoints} />
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </section>
        );
      case "itinerary":
        return (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Itinerary</h2>
            <div className="divide-y divide-zinc-100 rounded-xl border border-zinc-100 bg-white shadow-sm">
              {itinerary.map((item) => (
                <details key={item.day} className="group" open={item.day === 1}>
                  <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-4 text-left text-sm font-semibold text-zinc-900 transition-colors hover:text-amber-600">
                    <span>
                      Day {item.day}
                      <span className="ml-2 text-xs font-medium uppercase tracking-wide text-amber-600">
                        {item.title}
                      </span>
                    </span>
                    <span className="text-xl text-amber-500 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <div className="space-y-3 px-6 pb-6 text-sm leading-6 text-zinc-700">
                    {item.description.split(/\n{2,}/).map((paragraph, idx) => (
                      <p key={idx}>{paragraph.trim()}</p>
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </section>
        );
      case "map":
        return (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Map</h2>
            <div className="overflow-hidden rounded-xl border border-zinc-100 shadow-sm">
              <iframe
                title="Rajasthan tour map"
                className="h-64 w-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d570093.1603842754!2d73.92410884553575!3d26.422504004028953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3969be15b4adbdc7%3A0x9e4b672168f5afbd!2sRajasthan!5e0!3m2!1sen!2sin!4v1705852800000!5m2!1sen!2sin"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </section>
        );
      case "photos":
        return (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Gallery</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="relative h-48 overflow-hidden rounded-xl">
                <Image
                  src={travelPackage.image}
                  alt={travelPackage.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="relative h-48 overflow-hidden rounded-xl">
                <Image
                  src="https://images.unsplash.com/photo-1548588684-5c837c7e8e30?q=80&w=800"
                  alt="Amber Fort"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="relative h-48 overflow-hidden rounded-xl">
                <Image
                  src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=800"
                  alt="Udaipur Lake"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="relative h-48 overflow-hidden rounded-xl">
                <Image
                  src="https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=800"
                  alt="Desert safari"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </section>
        );
      case "reviews":
        return (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-zinc-900">Traveller Stories</h2>
            <div className="space-y-6">
              {["Curated experiences made booking easy.", "Every transfer and stay felt seamless."].map((quote, index) => (
                <blockquote key={index} className="rounded-xl border border-zinc-100 bg-white p-6 shadow-sm">
                  <p className="text-sm italic text-zinc-700">“{quote}”</p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-amber-600">
                    — Happy Safar Guest
                  </p>
                </blockquote>
              ))}
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-amber-50 via-white to-white pt-0 sm:pt-32 md:pt-0">
      <Navbar />
      <div className="relative h-[65vh] min-h-120 w-full overflow-hidden rounded-b-[2.5rem] bg-black/10 shadow-lg md:-mt-24 md:min-h-140 md:rounded-none md:bg-transparent md:shadow-none">
        <Image
          src={travelPackage.image}
          alt={travelPackage.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/45 to-black/25" />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-16 text-white sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.4em] text-amber-300">Signature Itinerary</p>
          <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
            {travelPackage.title.trim().replaceAll("  ", " ")}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm font-medium text-amber-100 sm:mt-6 sm:gap-4">
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {travelPackage.duration}
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Ideal for families & couples
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Jaipur · Jodhpur · Udaipur
            </span>
          </div>
          <div className="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:gap-3">
            {summaryHighlights.map((highlight) => (
              <span
                key={highlight}
                className="rounded-full border border-white/40 bg-white/10 px-3 py-1 text-xs uppercase tracking-wide text-amber-200 backdrop-blur"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto -mt-12 flex max-w-6xl flex-col gap-10 px-4 pb-20 sm:px-6 lg:-mt-16 lg:flex-row">
        <div className="flex-1 space-y-8">
          <nav className="flex items-center gap-2 overflow-x-auto rounded-xl border border-zinc-100 bg-white p-1.5 text-sm shadow-sm sm:gap-4 sm:p-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-lg px-3 py-2 text-sm font-semibold capitalize transition sm:px-4 ${
                  activeTab === tab
                    ? "bg-amber-500 text-white"
                    : "text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                {uppercaseFirst(tab)}
              </button>
            ))}
          </nav>
          <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5 sm:p-8">
            {renderTabContent()}
          </div>
        </div>

        <aside className="w-full lg:w-90">
          <div className="space-y-6 lg:sticky lg:top-28">
            <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-black/5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-amber-600">Price</p>
                  <p className="mt-2 text-3xl font-semibold text-zinc-900">{travelPackage.priceTag}</p>
                </div>
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase text-amber-700">
                  Quote in 12h
                </span>
              </div>
              <p className="mt-4 text-sm text-zinc-600">
                Share your travel dates and we will tailor stays, transfers, and experiences just for your crew.
              </p>
              <form
                className="mt-6 space-y-4"
                onSubmit={async (event) => {
                  event.preventDefault();
                  if (isQuoteSubmitting) return;

                  setIsQuoteSubmitting(true);
                  setQuoteSubmitState("idle");
                  setQuoteSubmitError(null);

                  const form = event.currentTarget;
                  const data = new FormData(form);

                  const name = String(data.get("name") ?? "").trim();
                  const email = String(data.get("email") ?? "").trim();
                  const phone = String(data.get("phone") ?? "").trim();
                  const travelDates = String(data.get("travelDates") ?? "").trim();
                  const enquiryNotes = String(data.get("message") ?? "").trim();
                  const termsAccepted = data.get("terms") === "on";

                  if (!name || !email || !phone || !enquiryNotes || !termsAccepted) {
                    setQuoteSubmitState("error");
                    setQuoteSubmitError("Please fill in all required fields and accept the terms before submitting.");
                    setIsQuoteSubmitting(false);
                    return;
                  }

                  const messageSections = [
                    travelDates ? `Preferred travel dates: ${travelDates}` : null,
                    enquiryNotes || null,
                  ].filter(Boolean);

                  const payload = {
                    name,
                    email,
                    phone: phone || undefined,
                    message:
                      messageSections.length > 0
                        ? messageSections.join("\n\n")
                        : "Traveller requested a tailored quote without additional notes.",
                    selectedPackage: `${travelPackage.title} — Price on request form`,
                    source: "package-detail-price-request",
                  };

                  try {
                    const response = await fetch("/api/enquiry", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(payload),
                    });

                    if (!response.ok) {
                      throw new Error("Failed to submit enquiry");
                    }

                    setQuoteSubmitState("success");
                    form.reset();
                  } catch (error) {
                    console.error("Package detail enquiry failed", error);
                    setQuoteSubmitState("error");
                    setQuoteSubmitError("We couldn’t send your enquiry. Please try again or call us directly.");
                  } finally {
                    setIsQuoteSubmitting(false);
                  }
                }}
              >
                {quoteSubmitState === "success" ? (
                  <div className="space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center text-sm text-emerald-800">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <Check className="h-6 w-6" />
                    </div>
                    <h3 className="text-base font-semibold text-emerald-700">Thank you for your response!</h3>
                    <p>
                      Your price request for <strong>{travelPackage.title}</strong> is now with our planners. A confirmation has been
                      emailed to you as well.
                    </p>
                    <button
                      type="button"
                      className="text-xs font-semibold uppercase tracking-wide text-emerald-700 underline"
                      onClick={() => setQuoteSubmitState("idle")}
                    >
                      Send another enquiry
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid gap-4">
                      <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
                        Full Name
                        <input
                          required
                          name="name"
                          className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                          placeholder="Your name"
                          type="text"
                        />
                      </label>
                      <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
                        Email Address
                        <input
                          required
                          name="email"
                          className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                          placeholder="name@email.com"
                          type="email"
                        />
                      </label>
                      <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
                        Mobile Number
                        <input
                          required
                          name="phone"
                          className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                          placeholder="With country code"
                          type="tel"
                        />
                      </label>
                      <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
                        Travel Dates
                        <input
                          name="travelDates"
                          className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                          type="date"
                        />
                      </label>
                      <label className="text-xs font-semibold uppercase tracking-wide text-zinc-600">
                        Your Enquiry
                        <textarea
                          name="message"
                          required
                          rows={4}
                          className="mt-1 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                          placeholder="Tell us about your dream journey"
                        />
                      </label>
                    </div>
                    <label className="flex items-start gap-3 text-xs text-zinc-600">
                      <input type="checkbox" name="terms" required className="mt-0.5" />
                      <span>
                        I agree with The Happy Safar’s
                        <a className="ml-1 text-amber-600 underline" href="#">
                          Terms
                        </a>
                        &
                        <a className="ml-1 text-amber-600 underline" href="#">
                          Privacy
                        </a>
                        .
                      </span>
                    </label>
                    {quoteSubmitState === "error" && quoteSubmitError && (
                      <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
                        {quoteSubmitError}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={isQuoteSubmitting}
                      className="w-full rounded-xl bg-amber-500 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg transition hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isQuoteSubmitting ? "Sending..." : "Submit Enquiry"}
                    </button>
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <button type="button" className="flex items-center gap-2 font-semibold text-amber-600">
                        <Heart className="h-4 w-4" /> Save to wish list
                      </button>
                      <span className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-amber-500" /> 240 saved
                      </span>
                    </div>
                  </>
                )}
              </form>
            </div>

            <div className="rounded-2xl bg-linear-to-br from-amber-500 to-orange-500 p-6 text-white shadow-xl">
              <h3 className="text-lg font-semibold">Why book with us?</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" /> Private itinerary designers
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" /> On-ground concierge 24/7
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" /> Curated stays & activities
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4" /> Transparent pricing promise
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-zinc-100 bg-white p-5 shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                <PhoneCall className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-zinc-900">Have questions?</p>
                <p className="text-xs text-zinc-600">Call our travel experts now</p>
                <a className="mt-1 block text-sm font-semibold text-amber-600" href="tel:+917426933288">
                  +91 74269 33288
                </a>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {otherPackages.length > 0 && (
        <section className="mx-auto mt-12 max-w-6xl px-4 pb-24 sm:px-6">
          <div className="flex flex-col gap-2 pb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-600">More journeys</p>
            <h2 className="text-3xl font-semibold text-zinc-900">Browse more handcrafted Rajasthan escapes</h2>
            <p className="text-base text-zinc-600">
              Discover a few other curated circuits our planners can personalise for your crew.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {otherPackages.map((pkg) => (
              <PackageCard key={pkg.id} details={pkg} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
