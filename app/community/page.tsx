import type { Metadata } from "next";
import { Github, Bug, GitPullRequest, Star, FileText } from "lucide-react";
import { Layout } from "@/components/layout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Community",
  description: "Join the OxiPulse open-source community on GitHub.",
};

const links = [
  {
    icon: Github,
    title: "Source code",
    description: "Browse the full agent source. Fork it, audit it, build on it.",
    href: "https://github.com/securyblack/oxi-pulse",
    cta: "View on GitHub",
  },
  {
    icon: Bug,
    title: "Report a bug",
    description: "Found something wrong? Open an issue and we'll investigate.",
    href: "https://github.com/securyblack/oxi-pulse/issues/new?template=bug_report.md",
    cta: "Open issue",
  },
  {
    icon: GitPullRequest,
    title: "Contribute",
    description: "Submit a fix or a new feature. Read the contributing guide first.",
    href: "/docs/contributing",
    cta: "Contributing guide",
  },
  {
    icon: Star,
    title: "Star the repo",
    description: "Help other developers discover OxiPulse.",
    href: "https://github.com/securyblack/oxi-pulse",
    cta: "Star on GitHub",
  },
  {
    icon: FileText,
    title: "License",
    description: "Apache 2.0 — free to use, modify, and distribute commercially.",
    href: "https://github.com/securyblack/oxi-pulse/blob/main/LICENSE",
    cta: "Read license",
  },
];

export default function CommunityPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--color-text)] mb-4">
            Community
          </h1>
          <p className="text-lg text-[var(--color-muted)] max-w-xl mx-auto">
            OxiPulse is built in the open. Everything happens on GitHub — issues, pull requests,
            discussions, releases.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Button
              href="https://github.com/securyblack/oxi-pulse"
              variant="primary"
              size="md"
              external
            >
              <Github size={16} />
              securyblack/oxi-pulse
            </Button>
          </div>
        </div>

        {/* Links grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-20">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Card key={link.title} hover className="flex flex-col gap-4">
                <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-[var(--color-primary)]" />
                </div>
                <div className="flex-1">
                  <h2 className="font-semibold text-[var(--color-text)] mb-1">{link.title}</h2>
                  <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-4">
                    {link.description}
                  </p>
                  <Button
                    href={link.href}
                    variant="outline"
                    size="sm"
                    external={link.href.startsWith("http")}
                  >
                    {link.cta}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* SecuryBlack note */}
        <div className="text-center border-t border-[var(--color-border)] pt-12">
          <p className="text-sm text-[var(--color-muted)] max-w-lg mx-auto">
            OxiPulse is an independent open-source project maintained by{" "}
            <a
              href="https://securyblack.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
            >
              SecuryBlack
            </a>
            . Commercial support and hosted infrastructure are available separately.
          </p>
        </div>
      </div>
    </Layout>
  );
}
