"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Wifi,
  RefreshCw,
  Shield,
  Terminal,
  BarChart3,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

const features = [
  {
    icon: Zap,
    title: "Ultralight by design",
    description:
      "~2 MB static binary, <0.1% CPU overhead. Runs silently in the background without impacting your workloads.",
  },
  {
    icon: Wifi,
    title: "gRPC / OpenTelemetry",
    description:
      "Ships metrics via OTLP over gRPC every 10 seconds. Compatible with any OTLP-capable backend — no vendor lock-in.",
  },
  {
    icon: Shield,
    title: "Offline resilience",
    description:
      "If the collector goes down, the agent buffers data locally and replays it automatically when the connection recovers.",
  },
  {
    icon: RefreshCw,
    title: "Auto-update",
    description:
      "Checks GitHub Releases daily. Downloads, replaces, and restarts itself with zero manual intervention.",
  },
  {
    icon: Terminal,
    title: "One-line install",
    description:
      "A single curl or PowerShell command installs the agent, injects your auth token, and registers it as a system service.",
  },
  {
    icon: BarChart3,
    title: "Vital metrics",
    description:
      "CPU usage, RAM (total/used), disk I/O, and network (bytes in/out). Everything you need to understand server health at a glance.",
  },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function Features() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-10 md:mb-16">
          <p className="text-sm font-semibold text-[var(--color-primary)] uppercase tracking-widest mb-3">
            Why OxiPulse
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)]">
            Built for production, not for demos
          </h2>
          <p className="mt-4 text-[var(--color-muted)] max-w-xl mx-auto">
            Every decision — language, protocol, install flow — was made to minimize friction
            and resource cost on the machines you care about.
          </p>
        </div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={item}>
                <Card hover glow className="h-full flex flex-col gap-4">
                  <div className="w-10 h-10 rounded-[var(--radius-md)] bg-[var(--color-primary-glow)] border border-[var(--color-primary-dim)] flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-[var(--color-primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--color-text)] mb-1.5">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-[var(--color-muted)] leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
