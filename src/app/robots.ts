import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/"],
        disallow: [
          "/*/admin/",
          "/*/super/",
          "/api/",
          "/*/change-password",
          "/*/reset-password",
          "/*/forgot-password",
        ],
      },
    ],
    sitemap: "https://www.zyncrox.com/sitemap.xml",
  };
}
