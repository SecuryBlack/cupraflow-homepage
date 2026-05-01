import type { Metadata } from "next";
import { Github } from "lucide-react";
import { Layout } from "@/components/layout";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { changelog, type ChangelogEntry } from "@/lib/changelog";

export const metadata: Metadata = {
  title: "Changelog",
  description: "Release history and changelog for OxiPulse.",
};

const sectionColors: Record<string, string> = {
  Added:    "text-emerald-400",
  Fixed:    "text-blue-400",
  Changed:  "text-amber-400",
  Removed:  "text-red-400",
  Security: "text-purple-400",
};

const typeBadge: Record<ChangelogEntry["type"], React.ReactNode> = {
  major: <Badge variant="primary">Major</Badge>,
  minor: <Badge variant="success">Minor</Badge>,
  patch: <Badge variant="neutral">Patch</Badge>,
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default function ChangelogPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[var(--color-text)] mb-3">
              Changelog
            </h1>
            <p className="text-[var(--color-muted)]">
              All notable changes to OxiPulse, most recent first.
            </p>
          </div>
          <Button
            href="https://github.com/securyblack/oxi-pulse/releases"
            variant="outline"
            size="sm"
            external
            className="shrink-0"
          >
            <Github size={14} />
            GitHub Releases
          </Button>
        </div>

        {/* Timeline */}
        <div className="flex flex-col gap-0">
          {changelog.map((entry, i) => (
            <div key={entry.version} className="flex gap-6">
              {/* Rail */}
              <div className="flex flex-col items-center shrink-0 pt-1">
                <div className="w-3 h-3 rounded-full bg-[var(--color-primary)] ring-4 ring-[var(--color-primary-glow)] shrink-0" />
                {i < changelog.length - 1 && (
                  <div className="w-px flex-1 bg-[var(--color-border)] mt-3 min-h-[40px]" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-16">
                {/* Version header */}
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <a
                    href={`https://github.com/securyblack/oxi-pulse/releases/tag/v${entry.version}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-2xl font-bold text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
                  >
                    v{entry.version}
                  </a>
                  {typeBadge[entry.type]}
                </div>

                <p className="text-sm text-[var(--color-muted)] mb-4">
                  {formatDate(entry.date)}
                </p>

                <p className="text-[var(--color-muted)] mb-6 leading-relaxed">
                  {entry.summary}
                </p>

                {/* Sections */}
                <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] overflow-hidden">
                  {entry.sections.map((section, si) => (
                    <div
                      key={section.label}
                      className={si > 0 ? "border-t border-[var(--color-border)]" : ""}
                    >
                      <div className="px-5 py-3 bg-[var(--color-surface-2)]">
                        <span
                          className={`text-xs font-bold uppercase tracking-widest ${sectionColors[section.label] ?? "text-[var(--color-muted)]"}`}
                        >
                          {section.label}
                        </span>
                      </div>
                      <ul className="px-5 py-4 flex flex-col gap-2">
                        {section.items.map((item) => (
                          <li key={item} className="flex items-start gap-2 text-sm text-[var(--color-muted)]">
                            <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${sectionColors[section.label] ? "bg-current" : "bg-[var(--color-muted)]"} ${sectionColors[section.label]}`} />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {/* End of timeline */}
          <div className="flex gap-6">
            <div className="flex flex-col items-center shrink-0 pt-1">
              <div className="w-3 h-3 rounded-full bg-[var(--color-border)]" />
            </div>
            <p className="text-sm text-[var(--color-muted)] pb-4 pt-0.5">
              OxiPulse project started
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
