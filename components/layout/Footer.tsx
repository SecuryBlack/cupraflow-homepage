import Link from "next/link";
import { Activity, Github } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Install",   href: "/install" },
    { label: "Changelog", href: "/changelog" },
    { label: "Roadmap",   href: "https://github.com/securyblack/oxi-pulse/issues", external: true },
  ],
  Docs: [
    { label: "Introduction",  href: "/docs" },
    { label: "Quick Start",   href: "/docs/quick-start" },
    { label: "Configuration", href: "/docs/configuration" },
    { label: "Contributing",  href: "/docs/contributing" },
  ],
  Community: [
    { label: "GitHub",  href: "https://github.com/securyblack/oxi-pulse", external: true },
    { label: "Issues",  href: "https://github.com/securyblack/oxi-pulse/issues", external: true },
    { label: "License", href: "https://github.com/securyblack/oxi-pulse/blob/main/LICENSE", external: true },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] mt-16 md:mt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4 group w-fit">
              <span className="text-[var(--color-primary)] group-hover:opacity-80 transition-opacity">
                <Activity size={20} strokeWidth={2.5} />
              </span>
              <span className="font-semibold text-[var(--color-text)] tracking-tight">
                OxiPulse
              </span>
            </Link>
            <p className="text-sm text-[var(--color-muted)] leading-relaxed mb-4">
              Ultralight telemetry agent for your servers. Written in Rust.
            </p>
            <a
              href="https://github.com/securyblack/oxi-pulse"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
            >
              <Github size={15} />
              securyblack/oxi-pulse
            </a>
            <div className="mt-5 pt-4 border-t border-[var(--color-border)]">
              <p className="text-xs text-[var(--color-muted)] mb-1">Made by</p>
              <a
                href="https://securyblack.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[var(--color-text)] hover:text-[var(--color-primary)] transition-colors"
              >
                SecuryBlack →
              </a>
              <p className="text-xs text-[var(--color-muted)] mt-1 leading-relaxed">
                Cybersecurity tools for the modern web.
              </p>
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-xs font-semibold text-[var(--color-text)] uppercase tracking-widest mb-4">
                {group}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      {...("external" in link && link.external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--color-muted)]">
            © {new Date().getFullYear()} OxiPulse. Licensed under Apache 2.0.
          </p>
          <a
            href="https://securyblack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
          >
            OxiPulse by SecuryBlack
          </a>
        </div>
      </div>
    </footer>
  );
}
