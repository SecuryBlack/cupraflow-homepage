"use client";

import { motion } from "framer-motion";
import { Server, ArrowRight, Cpu, LayoutDashboard } from "lucide-react";

const steps = [
  {
    icon: Server,
    label: "Your server",
    description: "Any Linux or Windows machine",
    color: "var(--color-muted)",
  },
  {
    icon: Cpu,
    label: "OxiPulse agent",
    description: "Collects metrics every 10s",
    color: "var(--color-primary)",
    highlight: true,
  },
  {
    icon: ArrowRight,
    label: "gRPC / OTLP",
    description: "Encrypted, efficient transport",
    color: "var(--color-muted)",
    connector: true,
  },
  {
    icon: LayoutDashboard,
    label: "Your dashboard",
    description: "Any OTLP-compatible backend",
    color: "var(--color-muted)",
  },
];

export function HowItWorks() {
  return (
    <section className="py-16 md:py-24 px-4 border-y border-[var(--color-border)] bg-[var(--color-surface)]/40">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10 md:mb-16">
          <p className="text-sm font-semibold text-[var(--color-primary)] uppercase tracking-widest mb-3">
            Architecture
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)]">
            How it works
          </h2>
          <p className="mt-4 text-[var(--color-muted)] max-w-xl mx-auto">
            The agent runs as a system service, collects metrics locally, and streams them
            to your collector via the OpenTelemetry protocol.
          </p>
        </div>

        {/* Flow diagram */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-0"
        >
          {/* Server box */}
          <FlowNode
            icon={Server}
            label="Your server"
            description="Linux / Windows"
            iconColor="var(--color-muted)"
          />

          <Connector />

          {/* Agent box — highlighted */}
          <FlowNode
            icon={Cpu}
            label="OxiPulse agent"
            description="Collects every 10s"
            iconColor="var(--color-primary)"
            highlight
          />

          <Connector label="gRPC / OTLP" />

          {/* Collector */}
          <FlowNode
            icon={LayoutDashboard}
            label="OTLP collector"
            description="Any compatible backend"
            iconColor="var(--color-muted)"
          />
        </motion.div>

        {/* Feature callouts below the diagram */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center"
        >
          {[
            {
              label: "Resilient",
              detail: "Buffers locally when the collector is unreachable",
            },
            {
              label: "Configurable",
              detail: "Endpoint set via env var or config file — never hardcoded",
            },
            {
              label: "Self-updating",
              detail: "Checks GitHub Releases daily and updates itself automatically",
            },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2">
              <span className="text-sm font-semibold text-[var(--color-primary)]">
                {item.label}
              </span>
              <span className="text-sm text-[var(--color-muted)]">{item.detail}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function FlowNode({
  icon: Icon,
  label,
  description,
  iconColor,
  highlight,
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  iconColor: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={[
        "flex flex-col items-center gap-3 px-6 py-5 rounded-[var(--radius-lg)] border min-w-[160px] transition-all duration-200",
        highlight
          ? "border-[var(--color-primary-dim)] bg-[var(--color-primary-glow)] shadow-[0_0_40px_var(--color-primary-glow)]"
          : "border-[var(--color-border)] bg-[var(--color-surface)]",
      ].join(" ")}
    >
      <div
        className={[
          "w-11 h-11 rounded-[var(--radius-md)] flex items-center justify-center",
          highlight ? "bg-[var(--color-primary-glow)]" : "bg-[var(--color-surface-2)]",
        ].join(" ")}
      >
        <Icon size={20} style={{ color: iconColor }} />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-[var(--color-text)]">{label}</p>
        <p className="text-xs text-[var(--color-muted)] mt-0.5">{description}</p>
      </div>
    </div>
  );
}

function Connector({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-1 px-2 md:px-4">
      {label && (
        <span className="text-xs text-[var(--color-muted)] font-mono hidden md:block mb-1">
          {label}
        </span>
      )}
      {/* horizontal on desktop */}
      <div className="hidden md:flex items-center gap-1">
        <div className="w-8 h-px bg-[var(--color-border)]" />
        <ArrowRight size={14} className="text-[var(--color-muted)]" />
      </div>
      {/* vertical on mobile */}
      <div className="flex md:hidden flex-col items-center gap-1">
        <div className="w-px h-6 bg-[var(--color-border)]" />
        <ArrowRight
          size={14}
          className="text-[var(--color-muted)] rotate-90"
        />
      </div>
    </div>
  );
}
