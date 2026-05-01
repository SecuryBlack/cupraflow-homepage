import type { Metadata } from "next";
import { Prose } from "@/components/ui/Prose";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Callout } from "@/components/ui/Callout";

export const metadata: Metadata = {
  title: "Quick Start",
  description: "Install OxiPulse and start collecting server metrics in under 5 minutes.",
};

export default function QuickStart() {
  return (
    <Prose>
      <h1>Quick Start</h1>
      <p>
        This guide gets OxiPulse installed and sending metrics in under 5 minutes.
        You&apos;ll need a server running Linux (x86_64 or ARM64) or Windows, and an OTLP-compatible
        endpoint to receive metrics.
      </p>

      <h2>Step 1 — Get your token</h2>
      <p>
        Log in to the OxiPulse dashboard and generate an agent token from the{" "}
        <strong>Settings → Tokens</strong> page. It will look like{" "}
        <code>op_live_xxxxxxxxxxxx</code>.
      </p>
      <Callout variant="info">
        If you&apos;re self-hosting your own OTLP collector, you can skip the token step and set{" "}
        <code>OXIPULSE_ENDPOINT</code> directly to your collector&apos;s gRPC address.
      </Callout>

      <h2>Step 2 — Install the agent</h2>
      <h3>Linux / macOS</h3>
      <CodeBlock
        code={`curl -fsSL https://install.oxipulse.dev | sudo bash`}
        language="bash"
        filename="Terminal"
      />
      <h3>Windows (PowerShell — run as Administrator)</h3>
      <CodeBlock
        code={`irm https://install.oxipulse.dev/windows | iex`}
        language="powershell"
        filename="PowerShell"
      />
      <p>
        The installer will prompt for your token, detect your architecture, download the correct
        binary, and register the agent as a system service with automatic restart.
      </p>

      <h2>Step 3 — Verify the agent is running</h2>
      <h3>Linux</h3>
      <CodeBlock
        code={`systemctl status oxipulse`}
        language="bash"
      />
      <CodeBlock
        code={`● oxipulse.service - OxiPulse Telemetry Agent
     Active: active (running)`}
        language="bash"
        filename="Expected output"
        showCopy={false}
      />
      <h3>Windows</h3>
      <CodeBlock
        code={`Get-Service -Name OxiPulse`}
        language="powershell"
      />

      <h2>Step 4 — Check data is flowing</h2>
      <p>
        Within 10–20 seconds of starting the agent, metrics should appear in your dashboard or
        OTLP backend. You can also tail the logs to confirm:
      </p>
      <CodeBlock
        code={`# Linux
journalctl -u oxipulse -f

# Windows
Get-EventLog -LogName Application -Source OxiPulse -Newest 10`}
        language="bash"
        filename="Logs"
      />
      <CodeBlock
        code={`INFO oxipulse: agent started, sending metrics every 10s
INFO oxipulse: metrics sent successfully (cpu=12.4%, ram=3.1GB/8GB)`}
        language="bash"
        filename="Expected log output"
        showCopy={false}
      />

      <Callout variant="success">
        That&apos;s it. OxiPulse is now running and streaming your server&apos;s vital signs.
        The agent will also check for updates daily and self-update automatically.
      </Callout>

      <h2>Next steps</h2>
      <ul>
        <li>
          <a href="/docs/configuration">Configuration reference</a> — customize intervals,
          log level, buffer path
        </li>
        <li>
          <a href="/docs/metrics">Metrics</a> — full list of what the agent collects
        </li>
        <li>
          <a href="/docs/offline-buffer">Offline buffer</a> — how resilience works
        </li>
      </ul>
    </Prose>
  );
}
