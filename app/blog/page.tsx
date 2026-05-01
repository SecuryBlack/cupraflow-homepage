import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout";
import { Badge } from "@/components/ui/Badge";
import { getAllPosts, formatDate } from "@/lib/blog";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles and updates from the OxiPulse team.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mb-14">
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--color-text)] mb-3">Blog</h1>
          <p className="text-[var(--color-muted)]">
            Engineering articles and project updates from SecuryBlack.
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-[var(--color-muted)]">No posts yet. Check back soon.</p>
        ) : (
          <div className="flex flex-col divide-y divide-[var(--color-border)]">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col gap-3 py-8 first:pt-0 last:pb-0 hover:opacity-90 transition-opacity"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <time className="text-xs text-[var(--color-muted)]">{formatDate(post.date)}</time>
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="neutral" className="text-[10px]">{tag}</Badge>
                  ))}
                </div>
                <h2 className="text-xl font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed">{post.summary}</p>
                <span className="inline-flex items-center gap-1.5 text-sm text-[var(--color-primary)] font-medium">
                  Read more <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
