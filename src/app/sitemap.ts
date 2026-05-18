import type { MetadataRoute } from "next";

const BASE_URL = "https://www.zyncrox.com";
const locales = ["es", "en"];

export default function sitemap(): MetadataRoute.Sitemap {
  // Public-facing pages (no auth required)
  const publicRoutes = ["", "/login", "/register", "/forgot-password", "/plans"];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of publicRoutes) {
      entries.push({
        url: `${BASE_URL}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1.0 : 0.7,
      });
    }
  }

  // Root redirect (canonical)
  entries.unshift({
    url: BASE_URL,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 1.0,
  });

  return entries;
}
