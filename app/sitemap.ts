import type { MetadataRoute } from "next";

const BASE_URL = "https://www.thehappysafar.com";

const staticRoutes = ["/", "/about", "/contact", "/faq", "/packages", "/terms", "/privacy"];
const packageDetailRoutes = Array.from({ length: 8 }, (_, index) => `/package${index + 1}`);

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [...staticRoutes, ...packageDetailRoutes].map((path) => ({
    url: `${BASE_URL}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.8,
  }));
}
