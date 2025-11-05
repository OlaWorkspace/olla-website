import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/pro", "/api"],
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL || "https://olla.app"}/sitemap.xml`,
  };
}
