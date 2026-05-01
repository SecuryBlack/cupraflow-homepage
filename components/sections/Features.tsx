"use client";

import { motion } from "framer-motion";
import {
  Server,
  Route,
  ShieldCheck,
  RefreshCw,
  Terminal,
  Activity,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

const features = [
  {
    icon: Server,
    title: "Native Windows Service",
    description:
      "Installs as a first-class Windows Service with auto-start, restart-on-failure, and clean uninstall. No wrappers or hacks.",
  },
  {
    icon: Route,
    title: "L4 & L7 Load Balancer",
    description:
      "TCP/UDP proxy with round-robin, least-connections, and IP-hash algorithms. HTTP/HTTPS routing by host, path, and headers.",
  },
  {
    icon: ShieldCheck,
    title: "High Availability",
    description:
      "VRRP-style failover with floating virtual IP. Automatic master/slave detection and VIP migration in under 5 seconds.",
  },
  {
    icon: RefreshCw,
    title: "Auto-update",
    description:
      "Checks GitHub Releases daily. Downloads, verifies checksum, replaces binary, and restarts cleanly via the service manager.",
  },
  {
    icon: Terminal,
    title: "One-line install",
    description:
      "A single PowerShell command downloads, installs, configures, and starts the agent. No manual steps required.",
  },
  {
    icon: Activity,
    title: "Health checks",
    description:
      "Active TCP and HTTP health checks remove dead backends from the pool automatically. Restored backends rejoin without intervention.",
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
            Why CupraFlow
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)]">
            Built for production networks
          </h2>
          <p className="mt-4 text-[var(--color-muted)] max-w-xl mx-auto">
            Every decision — from Rust as the runtime to the Windows Service integration —
            was made to minimize friction and maximize uptime.
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
