import type { Metadata } from "next";
import { Prose } from "@/components/ui/Prose";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Callout } from "@/components/ui/Callout";

export const metadata: Metadata = {
  title: "Configuration",
  description: "All environment variables and config file options for OxiPulse.",
};

const envVars = [
  { name: "OXIPULSE_TOKEN",         required: true,  default: "—",                                  desc: "Agent authentication token" },
  { name: "OXIPULSE_ENDPOINT",      required: false, default: "https://ingest.oxipulse.dev",        desc: "OTLP gRPC endpoint" },
  { name: "OXIPULSE_INTERVAL_SECS", required: false, default: "10",                                 desc: "Metric collection interval in seconds" },
  { name: "OXIPULSE_LOG_LEVEL",     required: false, default: "info",                               desc: "Log verbosity: trace, debug, info, warn, error" },
  { name: "OXIPULSE_BUFFER_PATH",   required: false, default: "/var/lib/oxipulse/buffer",           desc: "Local offline buffer directory" },
  { name: "OXIPULSE_BUFFER_MAX_MB", required: false, default: "100",                               desc: "Max offline buffer size in MB" },
];

export default function ConfigurationPage() {
  return (
    <Prose>
      <h1>Configuration</h1>
      <p>
        OxiPulse reads configuration from environment variables or a{" "}
        <code>config.toml</code> file. Environment variables always take priority over the
        config file.
      </p>

      <h2>Environment variables</h2>

      <div className="not-prose overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] my-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
              <th className="text-left px-4 py-3 font-semibold text-[var(--color-text)]">Variable</th>
              <th className="text-left px-4 py-3 font-semibold text-[var(--color-text)]">Required</th>
              <th className="text-left px-4 py-3 font-semibold text-[var(--color-text)]">Default</th>
              <th className="text-left px-4 py-3 font-semibold text-[var(--color-text)]">Description</th>
            </tr>
          </thead>
          <tbody>
            {envVars.map((v) => (
              <tr key={v.name} className="border-b border-[var(--color-border)] last:border-0">
                <td className="px-4 py-3 font-mono text-[var(--color-primary)] text-xs">{v.name}</td>
                <td className="px-4 py-3">
                  {v.required ? (
                    <span className="text-xs font-medium text-amber-400">Yes</span>
                  ) : (
                    <span className="text-xs text-[var(--color-muted)]">No</span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--color-muted)]">{v.default}</td>
                <td className="px-4 py-3 text-sm text-[var(--color-muted)]">{v.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2>Config file</h2>
      <p>
        Alternatively, place a <code>config.toml</code> file at one of the following locations:
      </p>
      <ul>
        <li><code>/etc/oxipulse/config.toml</code> (Linux, system-wide)</li>
        <li><code>~/.config/oxipulse/config.toml</code> (Linux, user-level)</li>
        <li><code>C:\ProgramData\OxiPulse\config.toml</code> (Windows)</li>
      </ul>

      <CodeBlock
        code={`# config.toml
token          = "op_live_xxxxxxxxxxxx"
endpoint       = "https://ingest.oxipulse.dev"
interval_secs  = 10
log_level      = "info"
buffer_path    = "/var/lib/oxipulse/buffer"
buffer_max_mb  = 100`}
        language="toml"
        filename="config.toml"
      />

      <Callout variant="warning">
        Never commit <code>config.toml</code> to version control — it contains your auth token.
        The installer&apos;s default <code>.gitignore</code> excludes it, but double-check before
        pushing to a public repository.
      </Callout>

      <h2>Priority order</h2>
      <p>Configuration is resolved in this order (highest priority first):</p>
      <ol>
        <li>Environment variables</li>
        <li><code>config.toml</code> file</li>
        <li>Built-in defaults</li>
      </ol>

      <h2>Setting via systemd</h2>
      <p>
        To set environment variables without modifying the config file, use a systemd override:
      </p>
      <CodeBlock
        code={`# Create override directory
mkdir -p /etc/systemd/system/oxipulse.service.d

# Create override file
cat > /etc/systemd/system/oxipulse.service.d/override.conf << EOF
[Service]
Environment="OXIPULSE_LOG_LEVEL=debug"
Environment="OXIPULSE_INTERVAL_SECS=5"
EOF

systemctl daemon-reload && systemctl restart oxipulse`}
        language="bash"
        filename="systemd override"
      />
    </Prose>
  );
}
