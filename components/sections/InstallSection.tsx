"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Terminal, MonitorDown } from "lucide-react";
import { CodeBlock } from "@/components/ui/CodeBlock";

const tabs = [
  { id: "linux", label: "Linux / macOS", icon: Terminal },
  { id: "windows", label: "Windows", icon: MonitorDown },
] as const;

type TabId = (typeof tabs)[number]["id"];

const linuxSteps = [
  {
    step: "1",
    title: "Install with one command",
    code: `curl -fsSL https://install.oxipulse.dev | sudo bash`,
    language: "bash",
  },
  {
    step: "2",
    title: "The installer will prompt for your auth token",
    code: `Enter your OxiPulse token: op_live_xxxxxxxxxxxx`,
    language: "bash",
  },
  {
    step: "3",
    title: "Agent starts automatically as a systemd service",
    code: `● oxipulse.service - OxiPulse telemetry agent
     Loaded: loaded (/etc/systemd/system/oxipulse.service)
     Active: active (running)`,
    language: "bash",
  },
];

const windowsSteps = [
  {
    step: "1",
    title: "Install with PowerShell (run as Administrator)",
    code: `irm https://install.oxipulse.dev/windows | iex`,
    language: "powershell",
  },
  {
    step: "2",
    title: "The installer will prompt for your auth token",
    code: `Enter your OxiPulse token: op_live_xxxxxxxxxxxx`,
    language: "powershell",
  },
  {
    step: "3",
    title: "Agent registers as a Windows Service",
    code: `Status   Name          DisplayName
-------  ----          -----------
Running  OxiPulse      OxiPulse Telemetry Agent`,
    language: "powershell",
  },
];

export function InstallSection() {
  const [activeTab, setActiveTab] = useState<TabId>("linux");
  const steps = activeTab === "linux" ? linuxSteps : windowsSteps;

  return (
    <section className="py-16 md:py-24 px-4" id="install">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <p className="text-sm font-semibold text-[var(--color-primary)] uppercase tracking-widest mb-3">
            Installation
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--color-text)]">
            Up and running in 60 seconds
          </h2>
          <p className="mt-4 text-[var(--color-muted)]">
            One command installs the agent, configures your token, and starts the service.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] mb-8 w-fit max-w-full overflow-x-auto mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={[
                  "flex items-center gap-2 px-4 py-2 text-sm rounded-[var(--radius-md)] transition-all duration-200 cursor-pointer",
                  active
                    ? "bg-[var(--color-primary)] text-[var(--color-bg)] font-semibold"
                    : "text-[var(--color-muted)] hover:text-[var(--color-text)]",
                ].join(" ")}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Steps */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col gap-6"
        >
          {steps.map((s) => (
            <div key={s.step} className="flex gap-4">
              {/* Step number */}
              <div className="flex flex-col items-center gap-2 shrink-0">
                <div className="w-7 h-7 rounded-full bg-[var(--color-primary-glow)] border border-[var(--color-primary-dim)] flex items-center justify-center text-xs font-bold text-[var(--color-primary)]">
                  {s.step}
                </div>
                {s.step !== "3" && (
                  <div className="flex-1 w-px bg-[var(--color-border)] min-h-[20px]" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <p className="text-sm font-medium text-[var(--color-text)] mb-2">{s.title}</p>
                <CodeBlock code={s.code} language={s.language} showCopy={s.step === "1"} />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Link to full install docs */}
        <p className="text-center text-sm text-[var(--color-muted)] mt-8">
          Need advanced configuration?{" "}
          <a href="/install" className="text-[var(--color-primary)] hover:underline">
            Full install guide →
          </a>
        </p>
      </div>
    </section>
  );
}
