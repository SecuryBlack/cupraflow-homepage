"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PulseAnimation } from "./PulseAnimation";

export function CTASection() {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] p-6 sm:p-12 overflow-hidden"
        >
          {/* Background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(51,225,191,0.06) 0%, transparent 100%)",
            }}
          />

          <div className="relative z-10">
            <PulseAnimation className="mb-8 max-w-xs mx-auto opacity-60" />

            <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)] mb-4">
              Start monitoring in{" "}
              <span className="text-gradient-primary">60 seconds</span>
            </h2>
            <p className="text-[var(--color-muted)] mb-8 max-w-lg mx-auto">
              One command. Any Linux or Windows server. Near-zero impact on your workloads.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button href="/install" variant="primary" size="lg">
                Get Started for free
                <ArrowRight size={16} />
              </Button>
              <Button
                href="https://github.com/securyblack/oxi-pulse"
                variant="ghost"
                size="lg"
                external
              >
                <Github size={16} />
                Star on GitHub
              </Button>
            </div>

            <p className="text-xs text-[var(--color-muted)] mt-6">
              Apache 2.0 · No credit card · No vendor lock-in
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
