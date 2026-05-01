import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Prose } from "@/components/ui/Prose";
import { Callout } from "@/components/ui/Callout";

export const metadata: Metadata = {
  title: "Introduction",
  description: "What is OxiPulse and how does it work.",
};

export default function DocsIntroduction() {
  return (
    <Prose>
      <h1>Introduction</h1>
      <p>
        OxiPulse is an <strong>ultralight, open-source telemetry agent</strong> written in Rust.
        It runs as a background service on your servers and streams vital metrics — CPU, RAM, disk,
        and network — to any OpenTelemetry-compatible collector via gRPC.
      </p>

      <Callout variant="success">
        OxiPulse is free and open source under the{" "}
        <a href="https://github.com/securyblack/oxi-pulse/blob/main/LICENSE">Apache 2.0 license</a>.
        The agent source is fully auditable and requires no SecuryBlack infrastructure.
      </Callout>

      <h2>Why OxiPulse?</h2>
      <p>
        Traditional monitoring agents are heavy. They consume CPU, eat RAM, and often require
        language runtimes. OxiPulse is compiled to a small static binary (~2 MB) with{" "}
        <strong>less than 0.1% CPU overhead</strong>. It runs silently without affecting the
        workloads you&apos;re trying to monitor.
      </p>

      <h2>How it works</h2>
      <p>
        The agent reads kernel-level metrics directly on a configurable interval (default 10s),
        groups them into an OpenTelemetry payload, and sends them via gRPC to your configured OTLP
        endpoint. If the endpoint is unreachable, metrics are stored in a local buffer and replayed
        automatically when connectivity recovers.
      </p>

      <h2>Architecture</h2>
      <p>OxiPulse is composed of a single binary that handles:</p>
      <ul>
        <li>
          <strong>Metric collection</strong> — CPU%, RAM (total/used), disk (total/used on{" "}
          <code>/</code>), network (bytes in/out)
        </li>
        <li>
          <strong>OTLP export</strong> — batched gRPC transport every 10 seconds
        </li>
        <li>
          <strong>Offline buffer</strong> — local disk buffer when the collector is unreachable
        </li>
        <li>
          <strong>Auto-update</strong> — daily check against GitHub Releases
        </li>
      </ul>

      <h2>Licensing</h2>
      <p>
        The agent is licensed under{" "}
        <a href="https://github.com/securyblack/oxi-pulse/blob/main/LICENSE">Apache 2.0</a>. You
        can use it in commercial projects, modify it, and distribute it without restriction. All
        dependencies are Apache-2.0 or MIT compatible — no GPL, no LGPL.
      </p>

      <h2>Next steps</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose mt-6">
        {[
          { title: "Quick Start", href: "/docs/quick-start", desc: "Install and start collecting in 5 minutes" },
          { title: "Configuration", href: "/docs/configuration", desc: "Environment variables and config file" },
          { title: "Metrics", href: "/docs/metrics", desc: "What metrics the agent collects" },
          { title: "Contributing", href: "/docs/contributing", desc: "How to contribute to OxiPulse" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex items-start justify-between gap-3 p-4 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary-dim)] transition-all duration-200"
          >
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors">
                {item.title}
              </p>
              <p className="text-xs text-[var(--color-muted)] mt-0.5">{item.desc}</p>
            </div>
            <ArrowRight size={14} className="text-[var(--color-muted)] group-hover:text-[var(--color-primary)] shrink-0 mt-0.5 transition-colors" />
          </Link>
        ))}
      </div>
    </Prose>
  );
}
