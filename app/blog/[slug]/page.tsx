import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Layout } from "@/components/layout";
import { Badge } from "@/components/ui/Badge";
import { getAllPosts, getPostBySlug, formatDate } from "@/lib/blog";
import { renderMarkdown } from "@/lib/markdown";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const html = renderMarkdown(post.content);

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Back */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          All posts
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <time className="text-sm text-[var(--color-muted)]">{formatDate(post.date)}</time>
            {post.tags.map((tag) => (
              <Badge key={tag} variant="neutral" className="text-[10px]">{tag}</Badge>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] leading-tight mb-3">
            {post.title}
          </h1>
          <p className="text-[var(--color-muted)]">By {post.author}</p>
        </header>

        {/* Content */}
        <article
          className={[
            "max-w-none",
            "[&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-[var(--color-text)] [&_h2]:mt-10 [&_h2]:mb-4",
            "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[var(--color-text)] [&_h3]:mt-8 [&_h3]:mb-3",
            "[&_p]:text-[var(--color-muted)] [&_p]:leading-relaxed [&_p]:mb-4",
            "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5",
            "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:flex [&_ol]:flex-col [&_ol]:gap-1.5",
            "[&_li]:text-[var(--color-muted)] [&_li]:leading-relaxed",
            "[&_a]:text-[var(--color-primary)] [&_a]:underline-offset-4 [&_a:hover]:underline",
            "[&_strong]:text-[var(--color-text)] [&_strong]:font-semibold",
            "[&_hr]:border-[var(--color-border)] [&_hr]:my-8",
            "[&_pre]:mb-4 [&_pre]:rounded-[var(--radius-lg)] [&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:bg-[#0A0A0A] [&_pre]:border [&_pre]:border-[var(--color-border)] [&_pre]:text-sm [&_pre]:leading-relaxed",
            "[&_code]:font-mono [&_code]:text-[var(--color-text)]",
            "[&_:not(pre)>code]:text-[var(--color-primary)] [&_:not(pre)>code]:bg-[var(--color-surface-2)] [&_:not(pre)>code]:px-1.5 [&_:not(pre)>code]:py-0.5 [&_:not(pre)>code]:rounded-sm [&_:not(pre)>code]:text-sm",
            "[&_table]:w-full [&_table]:border-collapse [&_table]:mb-6 [&_table]:text-sm",
            "[&_th]:border [&_th]:border-[var(--color-border)] [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:font-semibold [&_th]:text-[var(--color-text)] [&_th]:bg-[var(--color-surface-2)]",
            "[&_td]:border [&_td]:border-[var(--color-border)] [&_td]:px-3 [&_td]:py-2 [&_td]:text-[var(--color-muted)]",
            "[&_blockquote]:border-l-2 [&_blockquote]:border-[var(--color-primary)] [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-[var(--color-muted)] [&_blockquote]:mb-4",
          ].join(" ")}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </Layout>
  );
}
