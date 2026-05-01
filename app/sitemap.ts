import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const BASE_URL = "https://oxipulse.dev";

const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "",              changeFrequency: "weekly",  priority: 1.0 },
  { path: "/install",      changeFrequency: "weekly",  priority: 0.9 },
  { path: "/docs",         changeFrequency: "weekly",  priority: 0.8 },
  { path: "/docs/quick-start",     changeFrequency: "monthly", priority: 0.75 },
  { path: "/docs/configuration",   changeFrequency: "monthly", priority: 0.75 },
  { path: "/docs/metrics",         changeFrequency: "monthly", priority: 0.7  },
  { path: "/docs/offline-buffer",  changeFrequency: "monthly", priority: 0.7  },
  { path: "/docs/auto-update",     changeFrequency: "monthly", priority: 0.7  },
  { path: "/docs/contributing",    changeFrequency: "monthly", priority: 0.6  },
  { path: "/changelog",    changeFrequency: "weekly",  priority: 0.65 },
  { path: "/blog",         changeFrequency: "weekly",  priority: 0.65 },
  { path: "/community",    changeFrequency: "monthly", priority: 0.5  },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));

  let blogEntries: MetadataRoute.Sitemap = [];
  try {
    blogEntries = getAllPosts().map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch {
    // No blog posts yet or running in an environment without fs access
  }

  return [...staticEntries, ...blogEntries];
}
