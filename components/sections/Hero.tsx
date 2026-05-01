"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github, Activity } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { PulseAnimation } from "./PulseAnimation";

const INSTALL_CMD = `curl -fsSL https://install.oxipulse.dev | sudo bash`;

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: "easeOut" as const },
  }),
};

export function Hero() {
  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-border) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-border) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
          opacity: 0.35,
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 40%, transparent 100%)",
        }}
      />

      {/* Primary glow blob */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(51,225,191,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center gap-4 sm:gap-6">
        {/* Top badge */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="flex flex-col items-center gap-2">
          <Badge variant="primary" dot>
            <Activity size={11} />
            Open Source · Apache 2.0
          </Badge>
          <a
            href="https://securyblack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors tracking-wide"
          >
            by <span className="text-[var(--color-muted-2,#9a9a9a)] hover:text-[var(--color-primary)] transition-colors font-medium">SecuryBlack</span>
          </a>
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
        >
          Server{" "}
          <span className="text-gradient-primary">vital signs.</span>
          <br />
          Zero overhead.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className="max-w-2xl text-lg sm:text-xl text-[var(--color-muted)] leading-relaxed"
        >
          OxiPulse is an ultralight telemetry agent written in{" "}
          <span className="text-[var(--color-text)]">Rust</span>. Monitor CPU, RAM,
          disk and network with{" "}
          <span className="text-[var(--color-text)]">near-zero resource usage</span>{" "}
          and real-time gRPC streaming.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Button href="/install" variant="primary" size="lg">
            Get Started
            <ArrowRight size={16} />
          </Button>
          <Button
            href="https://github.com/securyblack/oxi-pulse"
            variant="outline"
            size="lg"
            external
          >
            <Github size={16} />
            View on GitHub
          </Button>
        </motion.div>

        {/* Install snippet */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.4}
          className="w-full max-w-xl"
        >
          <CodeBlock code={INSTALL_CMD} language="bash" filename="Linux / macOS" />
          <p className="text-xs text-[var(--color-muted)] mt-2">
            Also available for{" "}
            <a href="/install#windows" className="text-[var(--color-primary)] hover:underline">
              Windows (PowerShell)
            </a>
          </p>
        </motion.div>

        {/* Pulse animation */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.55}
          className="w-full max-w-lg mt-4"
        >
          <PulseAnimation />
        </motion.div>

        {/* Stats strip */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.6}
          className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--color-muted)]"
        >
          {[
            ["~2 MB", "binary size"],
            ["<0.1%", "CPU usage"],
            ["Rust", "memory safe"],
            ["gRPC", "OTLP protocol"],
          ].map(([value, label]) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="text-[var(--color-primary)] font-semibold">{value}</span>
              <span>{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
