export type ReleaseType = "major" | "minor" | "patch";

export interface ChangelogEntry {
  version: string;
  date: string;
  type: ReleaseType;
  summary: string;
  sections: {
    label: "Added" | "Fixed" | "Changed" | "Removed" | "Security";
    items: string[];
  }[];
}

export const changelog: ChangelogEntry[] = [
  {
    version: "0.1.10",
    date: "2026-04-06",
    type: "patch",
    summary: "Update checks now happen 5 minutes after startup instead of 24 hours.",
    sections: [
      {
        label: "Fixed",
        items: [
          "The auto-updater previously waited a full 24 hours before its first check, so restarting the agent never triggered a prompt update pickup. The agent now checks for a new release 5 minutes after startup and then every 24 hours, meaning a restart is enough to pull a pending update within minutes.",
        ],
      },
    ],
  },
  {
    version: "0.1.9",
    date: "2026-04-06",
    type: "minor",
    summary: "Opt-in usage telemetry and remote configuration.",
    sections: [
      {
        label: "Added",
        items: [
          "Opt-in usage telemetry — the agent can now send anonymous usage pings (version, OS, arch, uptime, metrics exported, buffer occupancy) to SecuryBlack once every 24 hours. Disabled by default for all installations, including agents upgrading from previous versions.",
          "Remote configuration fetch — on startup the agent calls the SecuryBlack API with its token to retrieve server-side settings. This allows telemetry to be enabled or disabled per agent from the dashboard without touching the local config file.",
          "New config key `telemetry_enabled` (absent → defers to server, `true` → always on, `false` → always off) and corresponding `OXIPULSE_TELEMETRY` environment variable override.",
          "New optional config key `api_url` and `OXIPULSE_API_URL` environment variable for self-hosted or staging deployments.",
        ],
      },
    ],
  },
  {
    version: "0.1.8",
    date: "2026-04-05",
    type: "patch",
    summary: "Report agent version as an OTLP resource attribute and update TLS dependencies.",
    sections: [
      {
        label: "Added",
        items: [
          "Agent version is now attached as the `service.version` resource attribute in every OTLP export, allowing the ingestor to track which version of OxiPulse each agent is running.",
        ],
      },
      {
        label: "Changed",
        items: [
          "Updated `rustls-webpki` to the latest patch release (security maintenance).",
        ],
      },
    ],
  },
  {
    version: "0.1.7",
    date: "2026-03-27",
    type: "patch",
    summary: "Dependency lockfile cleanup following 0.1.6.",
    sections: [
      {
        label: "Changed",
        items: [
          "Updated Cargo.lock to fully reflect the dependency changes shipped in 0.1.6. No functional changes.",
        ],
      },
    ],
  },
  {
    version: "0.1.6",
    date: "2026-03-27",
    type: "patch",
    summary: "Connectivity, installer fixes and a security dependency update.",
    sections: [
      {
        label: "Fixed",
        items: [
          "Reachability check now tries IPv4 addresses before IPv6, preventing long stalls when the ingestor host has no IPv6 listener.",
          "Linux install script reads TTY input via `/dev/tty` so the installer works correctly when executed through a pipe (`curl … | bash`).",
          "Windows install script uses the `PROCESSOR_ARCHITECTURE` environment variable for architecture detection instead of .NET `RuntimeInformation`, improving compatibility across environments.",
        ],
      },
      {
        label: "Changed",
        items: [
          "Updated `tar` dependency to the latest patch release (security maintenance).",
        ],
      },
    ],
  },
  {
    version: "0.1.5",
    date: "2026-03-19",
    type: "patch",
    summary: "Maintenance release with updated dependencies.",
    sections: [
      {
        label: "Changed",
        items: [
          "Updated Cargo.lock to keep dependencies in sync with the published crate.",
        ],
      },
    ],
  },
  {
    version: "0.1.4",
    date: "2026-03-19",
    type: "patch",
    summary: "Critical TLS fixes for agents connecting to HTTPS ingestors.",
    sections: [
      {
        label: "Fixed",
        items: [
          "Enabled explicit TLS in the OTLP exporter so metrics are correctly delivered over HTTPS endpoints.",
          "Activated TLS in the tonic transport layer to resolve connection failures when the ingestor is behind HTTPS.",
        ],
      },
    ],
  },
  {
    version: "0.1.3",
    date: "2026-03-15",
    type: "patch",
    summary: "Fix reachability check port for HTTPS ingestor endpoints.",
    sections: [
      {
        label: "Fixed",
        items: [
          "Reachability pre-check now uses port 443 when the configured OTLP endpoint scheme is https://, preventing false \"unreachable\" results on standard HTTPS deployments.",
        ],
      },
    ],
  },
  {
    version: "0.1.2",
    date: "2026-03-15",
    type: "patch",
    summary: "Fix file logging in Windows Service mode and improve offline reconnection.",
    sections: [
      {
        label: "Fixed",
        items: [
          "Log output is now written to disk when the agent runs as a Windows Service (previously only visible in interactive mode).",
          "Offline reconnection logic corrected — agent resumes sending buffered metrics as soon as the ingestor becomes reachable again.",
        ],
      },
    ],
  },
  {
    version: "0.1.1",
    date: "2026-03-14",
    type: "patch",
    summary: "Windows Service integration and installer fix for non-English locales.",
    sections: [
      {
        label: "Added",
        items: [
          "Native Windows Service Manager integration — the agent can now be installed, started, stopped and uninstalled as a proper Windows Service via the PowerShell installer.",
        ],
      },
      {
        label: "Fixed",
        items: [
          "Windows installer now uses well-known SIDs when setting ACL permissions, fixing failures on systems with non-English locale account names.",
        ],
      },
    ],
  },
  {
    version: "0.1.0",
    date: "2025-03-01",
    type: "minor",
    summary: "Initial public release. Ultralight telemetry agent for Linux and Windows.",
    sections: [
      {
        label: "Added",
        items: [
          "CPU, RAM, disk and network metric collection via native OS APIs",
          "OTLP/gRPC export with configurable endpoint and interval",
          "Offline buffer — metrics persisted to disk when collector is unreachable",
          "Auto-update — daily check against GitHub Releases with SHA256 verification",
          "One-line install script for Linux (curl | bash) with systemd service registration",
          "One-line install script for Windows (irm | iex) with Windows Service registration",
          "Support for x86_64 and ARM64 on Linux; x86_64 on Windows",
          "Configuration via environment variables or config.toml file",
          "Apache 2.0 license",
        ],
      },
    ],
  },
];
