import type { Metadata } from "next";
import { Terminal, MonitorDown, ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout";
import { Badge } from "@/components/ui/Badge";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Callout } from "@/components/ui/Callout";
import { StepList } from "@/components/ui/StepList";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Install",
  description:
    "Install CupraFlow on Windows in under 60 seconds with a single PowerShell command.",
};

const platforms = [
  { os: "Windows", arch: "x86_64", status: "stable", binary: "cupraflow-x86_64-pc-windows-msvc.zip" },
  { os: "Windows", arch: "ARM64", status: "beta", binary: "cupraflow-aarch64-pc-windows-msvc.zip" },
  { os: "Linux", arch: "x86_64 (amd64)", status: "planned", binary: "—" },
  { os: "Linux", arch: "ARM64 (aarch64)", status: "planned", binary: "—" },
];

const statusBadge = (s: string) => {
  if (s === "stable") return <Badge variant="success" dot>Stable</Badge>;
  if (s === "beta") return <Badge variant="warning" dot>Beta</Badge>;
  return <Badge variant="neutral">Planned</Badge>;
};

const windowsSteps = [
  {
    title: "Open PowerShell as Administrator and run:",
    children: (
      <>
        <p className="text-sm text-[var(--color-muted)]">
          The script detects your architecture, downloads the latest binary from GitHub Releases,
          and registers a native Windows Service.
        </p>
        <CodeBlock
          code={`irm https://install.cupraflow.dev/windows | iex`}
          language="powershell"
          filename="PowerShell (Admin)"
        />
        <Callout variant="warning">
          Must be run as Administrator to register the Windows Service. Right-click PowerShell →
          "Run as administrator".
        </Callout>
      </>
    ),
  },
  {
    title: "Verify the service is running",
    children: (
      <>
        <CodeBlock
          code={`Get-Service -Name CupraFlow`}
          language="powershell"
          filename="Verify"
        />
        <CodeBlock
          code={`Status   Name          DisplayName
-------  ----          -----------
Running  CupraFlow      CupraFlow Agent`}
          language="powershell"
          filename="Expected output"
          showCopy={false}
        />
      </>
    ),
  },
  {
    title: "Edit the configuration file",
    children: (
      <>
        <p className="text-sm text-[var(--color-muted)]">
          The default config is created at{" "}
          <code className="font-mono text-xs">C:\ProgramData\CupraFlow\config.toml</code>.
          Customize ports, logging, and backend pool.
        </p>
        <CodeBlock
          code={`# C:\\ProgramData\\CupraFlow\\config.toml
[server]
port = 8080
bind_address = "0.0.0.0"

[logging]
level = "info"
format = "json"

[loadbalancer]
enabled = true
algorithm = "round_robin"
health_check_interval = 30
backends = [
  { name = "web1", address = "10.0.0.10:80", weight = 1 },
  { name = "web2", address = "10.0.0.11:80", weight = 1 },
]`}
          language="toml"
          filename="config.toml"
        />
        <Callout variant="info">
          After editing the config, restart the service:{" "}
          <code className="font-mono text-xs">Restart-Service -Name CupraFlow</code>
        </Callout>
      </>
    ),
  },
];

const linuxSteps = [
  {
    title: "Linux support is planned",
    children: (
      <>
        <p className="text-sm text-[var(--color-muted)]">
          Linux builds and systemd integration are on the roadmap. For now, CupraFlow runs on
          Windows Server 2019/2022 and Windows 10/11.
        </p>
        <Callout variant="info">
          Track progress on{" "}
          <a href="https://github.com/sb-mcampoe/cupraflow/issues" className="text-[var(--color-primary)] hover:underline">
            GitHub Issues
          </a>.
        </Callout>
      </>
    ),
  },
];

export default function InstallPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Page header */}
        <div className="mb-12">
          <Badge variant="primary" className="mb-4">v0.1.0</Badge>
          <h1 className="text-4xl sm:text-5xl font-bold text-[var(--color-text)] mb-4">
            Install CupraFlow
          </h1>
          <p className="text-lg text-[var(--color-muted)] max-w-2xl">
            A single PowerShell command installs the agent, registers it as a Windows Service,
            and starts it. Up and running in under 60 seconds.
          </p>
        </div>

        {/* Quick install */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-6">Quick install</h2>
          <Tabs defaultValue="windows">
            <TabsList>
              <TabsTrigger value="windows">
                <MonitorDown size={14} />
                Windows
              </TabsTrigger>
              <TabsTrigger value="linux">
                <Terminal size={14} />
                Linux
              </TabsTrigger>
            </TabsList>

            <TabsContent value="windows">
              <StepList steps={windowsSteps} />
            </TabsContent>

            <TabsContent value="linux">
              <StepList steps={linuxSteps} />
            </TabsContent>
          </Tabs>
        </section>

        {/* Service management */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-2">
            Managing the service
          </h2>
          <p className="text-sm text-[var(--color-muted)] mb-6">
            The agent runs in the background with automatic restart on failure.
          </p>
          <CodeBlock
            code={`# Start
Start-Service -Name CupraFlow

# Stop
Stop-Service -Name CupraFlow

# Restart
Restart-Service -Name CupraFlow

# Check status
Get-Service -Name CupraFlow

# View logs
Get-Content "C:\ProgramData\CupraFlow\cupraflow.log" -Tail 50`}
            language="powershell"
            filename="PowerShell"
          />
        </section>

        {/* Configuration */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-2">Configuration</h2>
          <p className="text-sm text-[var(--color-muted)] mb-6">
            CupraFlow reads configuration from a TOML file. Environment variables are not yet supported.
          </p>

          <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                  <th className="text-left px-4 py-3 font-semibold text-[var(--color-text)]">Section</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--color-text)]">Key</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--color-text)]">Default</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--color-text)]">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["server", "port", "8080", "Listener port"],
                  ["server", "bind_address", "0.0.0.0", "Bind address"],
                  ["logging", "level", "info", "Log level (trace, debug, info, warn, error)"],
                  ["logging", "format", "pretty", "Output format (pretty, compact, json)"],
                  ["service", "startup", "auto", "Service start type (auto, manual, disabled)"],
                  ["loadbalancer", "enabled", "false", "Enable load balancer"],
                  ["loadbalancer", "algorithm", "round_robin", "Balancing algorithm"],
                  ["update", "channel", "stable", "Update channel (stable, beta, dev)"],
                ].map(([section, key, def, desc]) => (
                  <tr key={`${section}-${key}`} className="border-b border-[var(--color-border)] last:border-0">
                    <td className="px-4 py-3 font-mono text-[var(--color-primary)] text-xs">{section}</td>
                    <td className="px-4 py-3 font-mono text-[var(--color-primary)] text-xs">{key}</td>
                    <td className="px-4 py-3 font-mono text-[var(--color-muted)] text-xs">{def}</td>
                    <td className="px-4 py-3 text-[var(--color-muted)]">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <CodeBlock
            code={`# C:\\ProgramData\\CupraFlow\\config.toml
[server]
port = 8080
bind_address = "0.0.0.0"

[logging]
level = "info"
format = "json"

[service]
name = "CupraFlow"
description = "Agente de gestion de red y balanceo de carga"
startup = "auto"

[loadbalancer]
enabled = true
algorithm = "round_robin"
health_check_interval = 30
backends = [
  { name = "web1", address = "10.0.0.10:80", weight = 1 },
  { name = "web2", address = "10.0.0.11:80", weight = 1 },
]`}
            language="toml"
            filename="config.toml (example)"
          />
          <Callout variant="warning">
            The config file is read on startup. Restart the service after making changes.
          </Callout>
        </section>

        {/* Supported platforms */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-6">
            Supported platforms
          </h2>
          <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                  <th className="text-left px-4 py-3 font-semibold text-[var(--color-text)]">OS</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--color-text)]">Architecture</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--color-text)]">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--color-text)]">Binary</th>
                </tr>
              </thead>
              <tbody>
                {platforms.map((p, i) => (
                  <tr key={i} className="border-b border-[var(--color-border)] last:border-0">
                    <td className="px-4 py-3 text-[var(--color-text)]">{p.os}</td>
                    <td className="px-4 py-3 text-[var(--color-muted)]">{p.arch}</td>
                    <td className="px-4 py-3">{statusBadge(p.status)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-[var(--color-muted)]">{p.binary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Uninstall */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-6">Uninstall</h2>
          <CodeBlock
            code={`# Stop and remove the service
Stop-Service -Name CupraFlow
sc.exe delete CupraFlow

# Remove files
Remove-Item -Recurse -Force "C:\Program Files\CupraFlow"
Remove-Item -Recurse -Force "C:\ProgramData\CupraFlow"`}
            language="powershell"
          />
        </section>

        {/* Next steps */}
        <section>
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-6">Next steps</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Read the docs",
                description: "Learn about configuration, load balancing, and health checks.",
                href: "/docs",
              },
              {
                title: "Configuration reference",
                description: "Full list of config file options and defaults.",
                href: "/docs/configuration",
              },
              {
                title: "Contributing",
                description: "Open an issue or submit a PR on GitHub.",
                href: "https://github.com/sb-mcampoe/cupraflow",
              },
              {
                title: "Changelog",
                description: "See what changed in each release.",
                href: "/changelog",
              },
            ].map((item) => (
              <a
                key={item.title}
                href={item.href}
                className="group flex items-start gap-3 p-5 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary-dim)] transition-all duration-200"
              >
                <div className="flex-1">
                  <p className="font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors mb-1">
                    {item.title}
                  </p>
                  <p className="text-sm text-[var(--color-muted)]">{item.description}</p>
                </div>
                <ArrowRight
                  size={16}
                  className="text-[var(--color-muted)] group-hover:text-[var(--color-primary)] shrink-0 mt-0.5 transition-colors"
                />
              </a>
            ))}
          </div>
        </section>
      </div>
    </Layout>
  );
}
