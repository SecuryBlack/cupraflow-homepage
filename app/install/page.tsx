import type { Metadata } from "next";
import { Terminal, MonitorDown, CheckCircle, ArrowRight } from "lucide-react";
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
    "Install OxiPulse on any Linux, macOS or Windows server in under 60 seconds with a single command.",
};

const platforms = [
  { os: "Linux", arch: "x86_64 (amd64)", status: "stable", binary: "oxipulse-linux-x86_64" },
  { os: "Linux", arch: "ARM64 (aarch64)", status: "stable", binary: "oxipulse-linux-arm64" },
  { os: "Windows", arch: "x86_64", status: "stable", binary: "oxipulse-windows-x86_64.exe" },
  { os: "Windows", arch: "ARM64", status: "beta", binary: "oxipulse-windows-arm64.exe" },
  { os: "macOS", arch: "x86_64", status: "coming-soon", binary: "—" },
  { os: "macOS", arch: "ARM64 (Apple Silicon)", status: "coming-soon", binary: "—" },
];

const statusBadge = (s: string) => {
  if (s === "stable") return <Badge variant="success" dot>Stable</Badge>;
  if (s === "beta") return <Badge variant="warning" dot>Beta</Badge>;
  return <Badge variant="neutral">Coming soon</Badge>;
};

const linuxSteps = [
  {
    title: "Run the install script",
    children: (
      <>
        <p className="text-sm text-[var(--color-muted)]">
          The script detects your architecture, downloads the correct binary from GitHub Releases,
          and sets up a systemd service.
        </p>
        <CodeBlock
          code={`curl -fsSL https://install.oxipulse.dev | sudo bash`}
          language="bash"
          filename="Terminal"
        />
      </>
    ),
  },
  {
    title: "Enter your auth token when prompted",
    children: (
      <>
        <p className="text-sm text-[var(--color-muted)]">
          Get your token from the OxiPulse dashboard. You can also pass it via environment variable
          to skip the prompt.
        </p>
        <CodeBlock
          code={`Enter your OxiPulse token: op_live_xxxxxxxxxxxx`}
          language="bash"
          filename="Token setup"
        />
        <Callout variant="info">
          Your token authenticates the agent against the OTLP ingestor. Keep it secret — treat it
          like a password. Rotate it from the dashboard if compromised.
        </Callout>
      </>
    ),
  },
  {
    title: "The agent starts automatically as a systemd service",
    children: (
      <>
        <CodeBlock
          code={`# Check the service status
systemctl status oxipulse

# Verify it's sending data
journalctl -u oxipulse -f`}
          language="bash"
          filename="Verify"
        />
        <CodeBlock
          code={`● oxipulse.service - OxiPulse Telemetry Agent
     Loaded: loaded (/etc/systemd/system/oxipulse.service; enabled)
     Active: active (running) since Mon 2025-01-01 12:00:00 UTC
   Main PID: 1234 (oxipulse)

Jan 01 12:00:01 myserver oxipulse[1234]: INFO oxipulse: agent started, sending metrics every 10s`}
          language="bash"
          filename="Expected output"
          showCopy={false}
        />
      </>
    ),
  },
];

const windowsSteps = [
  {
    title: "Open PowerShell as Administrator and run:",
    children: (
      <>
        <p className="text-sm text-[var(--color-muted)]">
          The script detects your architecture, downloads the binary from GitHub Releases, and
          registers a native Windows Service.
        </p>
        <CodeBlock
          code={`irm https://install.oxipulse.dev/windows | iex`}
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
    title: "Enter your auth token when prompted",
    children: (
      <>
        <CodeBlock
          code={`Enter your OxiPulse token: op_live_xxxxxxxxxxxx`}
          language="powershell"
          filename="Token setup"
        />
      </>
    ),
  },
  {
    title: "The agent registers and starts as a Windows Service",
    children: (
      <>
        <CodeBlock
          code={`# Check service status
Get-Service -Name OxiPulse

# View logs
Get-EventLog -LogName Application -Source OxiPulse -Newest 20`}
          language="powershell"
          filename="Verify"
        />
        <CodeBlock
          code={`Status   Name          DisplayName
-------  ----          -----------
Running  OxiPulse      OxiPulse Telemetry Agent`}
          language="powershell"
          filename="Expected output"
          showCopy={false}
        />
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
            Install OxiPulse
          </h1>
          <p className="text-lg text-[var(--color-muted)] max-w-2xl">
            A single command installs the agent, injects your auth token, and registers it as a
            system service. Up and running in under 60 seconds.
          </p>
        </div>

        {/* Quick install */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-6">Quick install</h2>
          <Tabs defaultValue="linux">
            <TabsList>
              <TabsTrigger value="linux">
                <Terminal size={14} />
                Linux / macOS
              </TabsTrigger>
              <TabsTrigger value="windows">
                <MonitorDown size={14} />
                Windows
              </TabsTrigger>
            </TabsList>

            <TabsContent value="linux">
              <StepList steps={linuxSteps} />
            </TabsContent>

            <TabsContent value="windows">
              <StepList steps={windowsSteps} />
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
          <Tabs defaultValue="linux-mgmt">
            <TabsList>
              <TabsTrigger value="linux-mgmt">
                <Terminal size={14} />
                Linux (systemd)
              </TabsTrigger>
              <TabsTrigger value="windows-mgmt">
                <MonitorDown size={14} />
                Windows
              </TabsTrigger>
            </TabsList>
            <TabsContent value="linux-mgmt">
              <CodeBlock
                code={`# Start
systemctl start oxipulse

# Stop
systemctl stop oxipulse

# Restart
systemctl restart oxipulse

# Enable on boot (already done by installer)
systemctl enable oxipulse

# Live logs
journalctl -u oxipulse -f`}
                language="bash"
                filename="systemd"
              />
            </TabsContent>
            <TabsContent value="windows-mgmt">
              <CodeBlock
                code={`# Start
Start-Service -Name OxiPulse

# Stop
Stop-Service -Name OxiPulse

# Restart
Restart-Service -Name OxiPulse

# Check status
Get-Service -Name OxiPulse

# View logs (Event Viewer)
Get-EventLog -LogName Application -Source OxiPulse -Newest 50`}
                language="powershell"
                filename="PowerShell"
              />
            </TabsContent>
          </Tabs>
        </section>

        {/* Configuration */}
        <section className="mb-16">
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-2">Configuration</h2>
          <p className="text-sm text-[var(--color-muted)] mb-6">
            OxiPulse reads configuration from environment variables or a config file.
            Environment variables always take priority.
          </p>

          <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] mb-6">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                  <th className="text-left px-4 py-3 font-semibold text-[var(--color-text)]">Variable</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--color-text)]">Default</th>
                  <th className="text-left px-4 py-3 font-semibold text-[var(--color-text)]">Description</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["OXIPULSE_TOKEN", "—", "Auth token (required)"],
                  ["OXIPULSE_ENDPOINT", "https://ingest.oxipulse.dev", "OTLP gRPC endpoint"],
                  ["OXIPULSE_INTERVAL_SECS", "10", "Metrics collection interval"],
                  ["OXIPULSE_LOG_LEVEL", "info", "Log verbosity (trace, debug, info, warn, error)"],
                  ["OXIPULSE_BUFFER_PATH", "/var/lib/oxipulse/buffer", "Offline buffer location"],
                ].map(([name, def, desc]) => (
                  <tr key={name} className="border-b border-[var(--color-border)] last:border-0">
                    <td className="px-4 py-3 font-mono text-[var(--color-primary)] text-xs">{name}</td>
                    <td className="px-4 py-3 font-mono text-[var(--color-muted)] text-xs">{def}</td>
                    <td className="px-4 py-3 text-[var(--color-muted)]">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <CodeBlock
            code={`# /etc/oxipulse/config.toml (Linux)
token          = "op_live_xxxxxxxxxxxx"
endpoint       = "https://ingest.oxipulse.dev"
interval_secs  = 10
log_level      = "info"`}
            language="toml"
            filename="config.toml (optional)"
          />
          <Callout variant="warning">
            Never commit <code className="font-mono">config.toml</code> to version control. It
            contains your auth token. The file is excluded by the default{" "}
            <code className="font-mono">.gitignore</code>.
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
          <Tabs defaultValue="linux-rm">
            <TabsList>
              <TabsTrigger value="linux-rm">
                <Terminal size={14} />
                Linux
              </TabsTrigger>
              <TabsTrigger value="windows-rm">
                <MonitorDown size={14} />
                Windows
              </TabsTrigger>
            </TabsList>
            <TabsContent value="linux-rm">
              <CodeBlock
                code={`systemctl stop oxipulse && systemctl disable oxipulse
rm -f /usr/local/bin/oxipulse
rm -f /etc/systemd/system/oxipulse.service
rm -rf /etc/oxipulse /var/lib/oxipulse
systemctl daemon-reload`}
                language="bash"
              />
            </TabsContent>
            <TabsContent value="windows-rm">
              <CodeBlock
                code={`Stop-Service -Name OxiPulse
sc.exe delete OxiPulse
Remove-Item -Recurse -Force "C:\Program Files\OxiPulse"`}
                language="powershell"
              />
            </TabsContent>
          </Tabs>
        </section>

        {/* Next steps */}
        <section>
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-6">Next steps</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Read the docs",
                description: "Learn about metrics, offline buffer, and auto-update.",
                href: "/docs",
              },
              {
                title: "Configuration reference",
                description: "Full list of environment variables and config file options.",
                href: "/docs/configuration",
              },
              {
                title: "Contributing",
                description: "Open an issue or submit a PR on GitHub.",
                href: "https://github.com/securyblack/oxi-pulse",
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
