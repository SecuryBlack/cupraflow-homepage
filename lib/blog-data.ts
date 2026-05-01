// Blog posts are defined here as TypeScript modules so they are bundled at
// build time and do not require filesystem access at runtime (Cloudflare Workers).
//
// To add a new post: add an entry to this array.

export interface PostData {
  slug: string;
  title: string;
  date: string;
  author: string;
  summary: string;
  tags: string[];
  content: string;
}

export const posts: PostData[] = [
  {
    slug: "zero-downtime-autoupdate-rust",
    title: "Zero-downtime auto-updates in a Rust binary",
    date: "2025-10-10",
    author: "SecuryBlack",
    summary: "How CupraFlow replaces itself in place and delegates restart to the OS service manager ” no downtime, no manual intervention.",
    tags: ["rust", "engineering"],
    content: `
CupraFlow ships updates silently. No package manager, no SSH session, no restart window to schedule.
Once a new release is tagged on GitHub, every running agent picks it up within 24 hours (and within
5 minutes of the next restart). Here's exactly how it works.

## The constraints

A monitoring agent has an awkward update problem. It must:

1. Download the new binary without interrupting metric collection
2. Replace itself atomically ” a partially-written binary would be unexecutable
3. Hand off cleanly so the service manager restarts it with the new version
4. Never brick a remote server if a download fails

## How CupraFlow solves it

The updater runs as a background Tokio task that wakes up 5 minutes after startup and then every 24 hours.

\`\`\`
startup
  â””â”€ 5 min â†’ check GitHub Releases API
              â”œâ”€ no new version â†’ sleep 24 h â†’ repeat
              â””â”€ new version found
                  â”œâ”€ download binary for current platform/arch
                  â”œâ”€ verify SHA256
                  â”œâ”€ atomic rename (replace in place)
                  â””â”€ std::process::exit(0)
\`\`\`

The key step is the atomic rename. On Linux, \`rename(2)\` is guaranteed atomic on the same filesystem.
On Windows, the \`self_update\` crate uses \`MoveFileExW\` with \`MOVEFILE_REPLACE_EXISTING\`.
Either way, there is no moment where the binary on disk is partially written.

## Delegating the restart

CupraFlow does not restart itself. After replacing the binary it calls \`std::process::exit(0)\` ” a clean
exit with code 0. The OS service manager sees a stopped service and restarts it automatically:

- **systemd**: \`Restart=on-failure\` (or \`always\`) in the unit file restarts the process
- **Windows Service Manager**: the service recovery policy restarts on exit

The new binary starts, collects the version from \`CARGO_PKG_VERSION\` at compile time, and reports it
to the ingestor as a resource attribute on every OTLP export.

## What happens if the download fails?

The update task catches all errors and logs a warning. The existing binary keeps running.
On the next 24-hour cycle it tries again. The agent never exits unless a complete, verified binary
is in place.

\`\`\`rust
match tokio::task::spawn_blocking(check_and_update).await {
    Ok(Ok(updated)) => {
        if updated {
            std::process::exit(0); // clean handoff to service manager
        }
    }
    Ok(Err(e)) => warn!("update check failed: {}", e), // keep running
    Err(e)  => error!("update task panicked: {}", e),  // keep running
}
\`\`\`

## No package manager required

This matters more than it sounds. Many servers run locked-down environments where \`apt\`, \`yum\` or
\`winget\` are restricted or behind an approval process. CupraFlow's binary is a single static file.
There is nothing to install, no dependency graph to satisfy, and no repository to trust beyond
GitHub Releases.

The SHA256 verification step ensures the downloaded binary matches what was published, protecting
against corrupted downloads or network interference.
`.trim(),
  },
  {
    slug: "offline-buffer-deep-dive",
    title: "How CupraFlow survives network outages",
    date: "2025-09-25",
    author: "SecuryBlack",
    summary: "A look inside the ring buffer and exponential backoff that keep CupraFlow collecting metrics even when the network is down for hours.",
    tags: ["engineering", "rust", "observability"],
    content: `
A monitoring agent that stops recording data when the network goes down is not very useful.
CupraFlow is designed to keep collecting and to flush everything once connectivity returns,
with no gaps in the time series. Here's how the offline buffer works.

## The ring buffer

When the ingestor is unreachable, metric snapshots are stored in an in-memory ring buffer.
The default capacity is **8,640 snapshots** ” exactly 24 hours of data at the default 10-second
interval. When the buffer is full, the oldest snapshot is dropped to make room for the newest.
The agent always has the most recent 24 hours, never more.

\`\`\`toml
# config.toml
buffer_max_size = 8640   # 24 h at 10 s interval (default)
\`\`\`

You can raise this for longer outage tolerance or lower it on memory-constrained devices.
At 10 seconds per snapshot, each snapshot is roughly 64 bytes of metric data, so 8,640
snapshots consume under 1 MB of RAM.

## Exponential backoff for connectivity checks

Checking reachability on every collection tick would generate a lot of noise and waste
resources during a prolonged outage. CupraFlow uses exponential backoff: after the first
failure it checks again after 2 ticks, then 4, 8… up to a ceiling of approximately 30 seconds.

\`\`\`
tick 1: unreachable â†’ mark offline, backoff = 1 tick
tick 2: skip check (countdown = 1)
tick 3: check â†’ still unreachable â†’ backoff = 2 ticks
tick 4-5: skip
tick 6: check â†’ still unreachable â†’ backoff = 4 ticks
...ceiling at ~30 s
\`\`\`

When the ingestor comes back, the backoff resets immediately and the agent flushes the buffer
in order ” oldest snapshot first ” before recording the current tick.

## The reachability check

Before attempting an OTLP export, CupraFlow does a lightweight TCP handshake to the ingestor's
host and port. This avoids the overhead of a full gRPC connection attempt when the endpoint is
clearly unreachable. The check prefers IPv4 addresses over IPv6 to avoid stalls on hosts where
the ingestor has no IPv6 listener.

## Flush on reconnect

When connectivity is restored the agent drains the entire buffer before sending the current
metric snapshot. The ingestor receives a burst of historical data with the correct timestamps,
so dashboards show a continuous time series rather than a gap followed by a sudden jump.

\`\`\`
offline for 2 hours â†’ reconnect
  â†’ flush 720 buffered snapshots (in timestamp order)
  â†’ send current snapshot
  â†’ resume normal 10 s cadence
\`\`\`

## Practical implications

- A VPS that loses connectivity overnight will have a full, uninterrupted time series in the morning.
- A Raspberry Pi on a flaky home connection will never show gaps shorter than 24 hours.
- The buffer is in-memory, so a crash or power cut loses any un-flushed data. Persistence to disk
  is on the roadmap for a future release.
`.trim(),
  },
  {
    slug: "rust-vs-go-monitoring",
    title: "Why we wrote a monitoring agent in Rust instead of Go",
    date: "2025-09-08",
    author: "SecuryBlack",
    summary: "Go produces excellent system tools. We chose Rust anyway. Here's the honest reasoning.",
    tags: ["rust", "engineering"],
    content: `
Go is the default choice for infrastructure tooling in 2025. Prometheus, Grafana Agent, Telegraf,
Docker, Kubernetes ” the list is long. When we started CupraFlow, we seriously considered Go.
We chose Rust. Here's why.

## The core constraint: resource overhead

A monitoring agent runs on every server you own. On a $4/month VPS with 512 MB of RAM and one
shared vCPU, a 200 MB RSS agent is not acceptable. The agent itself becomes a thing to monitor.

Go's runtime carries a garbage collector. For most workloads this is invisible. For a long-running
daemon that allocates metric structs every 10 seconds, GC pauses are rare but non-zero. More
importantly, Go's minimum RSS on a real workload tends to be 20“50 MB just for the runtime, heap,
and goroutine stacks.

Rust has no runtime and no garbage collector. CupraFlow's RSS in steady state is under 8 MB.
On a constrained edge node or a Raspberry Pi, that difference matters.

## Single static binary, for real

Go produces statically-linked binaries by default ” unless you use CGO, which most network and
system libraries do. Cross-compiling a CGO binary for Linux ARM64 from macOS requires a full
cross-compilation toolchain and is notoriously fragile.

Rust's static linking story is simpler. CupraFlow targets \`x86_64-unknown-linux-musl\` and
\`aarch64-unknown-linux-musl\`, which produce fully static binaries with zero shared library
dependencies. The same binary runs on Alpine, Debian, Ubuntu, RHEL ” any Linux distribution.

## The OpenTelemetry SDK

CupraFlow speaks OTLP natively. The official Rust OpenTelemetry SDK is mature, async-native
(built on Tokio), and integrates cleanly with Tonic for gRPC. There is no need for a separate
exporter process or a sidecar.

The Go OpenTelemetry SDK is also production-quality, so this was not a deciding factor on its own.

## What Go would have been better for

We are not anti-Go. If CupraFlow needed:

- A large number of plugins with dynamic dispatch (Telegraf's model)
- Fast iteration on protocol integrations
- A big contributor community (Go's tooling ecosystem is excellent)

…Go would have been the right call. For a focused, single-purpose binary where memory footprint
and startup time matter more than plugin breadth, Rust was the better fit.

## The tradeoff we accepted

Rust has a steeper learning curve and a slower compile cycle. Our CI build takes longer than it
would in Go. The borrow checker caught real bugs during development ” which was the point ” but
it also slowed initial implementation.

For a tool that runs unattended on thousands of servers, correctness and efficiency outweigh
developer convenience. That tradeoff made sense for us.
`.trim(),
  },
  {
    slug: "monitor-raspberry-pi",
    title: "Monitor a Raspberry Pi with CupraFlow",
    date: "2025-08-22",
    author: "SecuryBlack",
    summary: "CupraFlow's ARM64 binary and sub-10 MB footprint make it ideal for Raspberry Pi. Here's how to get CPU, RAM, disk and network metrics flowing in minutes.",
    tags: ["tutorial", "raspberry-pi", "linux"],
    content: `
A Raspberry Pi running a home server, a media centre, or a self-hosted service deserves the same
monitoring as a cloud VM ” but the agent needs to fit alongside everything else on limited hardware.
CupraFlow compiles to a native ARM64 binary and uses under 8 MB of RAM in steady state.

## Prerequisites

- Raspberry Pi 3, 4 or 5 (64-bit OS)
- Raspberry Pi OS (64-bit), Ubuntu Server, or any 64-bit ARM Linux
- An CupraFlow account at [app.securyblack.com](https://app.securyblack.com) ” or your own OTLP ingestor

<Callout type="info">
  CupraFlow also builds for \`armv7\` (32-bit ARM), but the 64-bit binary is recommended for
  Raspberry Pi 3 and newer when running a 64-bit OS.
</Callout>

## 1. Install the agent

\`\`\`bash
curl -fsSL https://install.cupraflow.dev | sudo bash
\`\`\`

The installer detects the ARM64 architecture automatically and downloads the correct binary.
It installs to \`/usr/local/bin/CupraFlow\` and registers a systemd service.

## 2. Create an agent in SecuryBlack

Log into [app.securyblack.com](https://app.securyblack.com), navigate to **Agents**, and click
**New agent**. Give it a name (e.g. \`raspberrypi-home\`) and copy the token shown ” it will not
be displayed again.

## 3. Configure the agent

\`\`\`bash
sudo mkdir -p /etc/CupraFlow
sudo nano /etc/CupraFlow/config.toml
\`\`\`

\`\`\`toml
endpoint = "https://ingest.securyblack.com:4317"
token    = "YOUR_TOKEN_HERE"

# Pi-friendly settings
interval_secs   = 30    # every 30 s reduces CPU overhead on older Pis
buffer_max_size = 2880  # 24 h at 30 s interval
\`\`\`

A 30-second interval is a good default for a Pi. It halves the CPU load compared to the 10-second
default while still giving useful resolution.

## 4. Start the service

\`\`\`bash
sudo systemctl enable --now CupraFlow
sudo systemctl status CupraFlow
\`\`\`

## 5. Verify in the dashboard

Open the agent detail page in SecuryBlack. Within 30“60 seconds you should see CPU, RAM, disk
and network charts populating with data. CPU usage on a Pi 4 at 30-second intervals is under 0.05%.

## Tips for constrained Pis

**Raspberry Pi Zero / Pi 1 (ARMv6):** These use a 32-bit ARMv6 core not covered by the ARMv7
binary. Compile from source targeting \`arm-unknown-linux-musleabihf\` or use the 32-bit ARMv7
binary with a compatibility wrapper.

**SD card longevity:** CupraFlow buffers metrics in RAM, not on disk, so it does not add wear
to the SD card during normal operation.

**Low RAM (512 MB):** At the default buffer size of 8,640 snapshots the buffer uses under 1 MB.
At a 30-second interval with a 2,880-snapshot buffer it uses under 200 KB. Safe on any Pi.
`.trim(),
  },
  {
    slug: "monitor-hetzner-vps",
    title: "Monitor your Hetzner VPS with CupraFlow",
    date: "2025-08-05",
    author: "SecuryBlack",
    summary: "Get CPU, RAM, disk and network metrics from your Hetzner Cloud or dedicated server in under 5 minutes.",
    tags: ["tutorial", "hetzner", "linux"],
    content: `
Hetzner is a favourite for developers who want solid hardware at European prices. A CX22 starts
at â‚¬3.79/month with 2 vCPUs and 4 GB RAM ” leaving little budget for a heavy monitoring agent.
CupraFlow's 8 MB footprint and sub-0.1% CPU overhead are a natural fit.

## Prerequisites

- Hetzner Cloud server or dedicated server running a 64-bit Linux distribution
- An CupraFlow account at [app.securyblack.com](https://app.securyblack.com)

## 1. SSH into your server

\`\`\`bash
ssh root@YOUR_SERVER_IP
\`\`\`

## 2. Install CupraFlow

\`\`\`bash
curl -fsSL https://install.cupraflow.dev | sudo bash
\`\`\`

The installer detects x86_64 or ARM64 automatically, downloads the correct binary, installs it
to \`/usr/local/bin/CupraFlow\`, and registers a systemd service.

## 3. Create an agent in SecuryBlack

In [app.securyblack.com](https://app.securyblack.com) go to **Agents â†’ New agent**, give it a
name (e.g. \`hetzner-cx22-fsn\`), and copy the one-time token.

## 4. Configure the agent

\`\`\`bash
sudo mkdir -p /etc/CupraFlow
sudo tee /etc/CupraFlow/config.toml > /dev/null <<EOF
endpoint = "https://ingest.securyblack.com:4317"
token    = "YOUR_TOKEN_HERE"
EOF
\`\`\`

## 5. Start and enable the service

\`\`\`bash
sudo systemctl enable --now CupraFlow
sudo journalctl -fu CupraFlow
\`\`\`

You should see log lines like:

\`\`\`
INFO CupraFlow: config loaded endpoint=https://ingest.securyblack.com:4317
INFO CupraFlow: OTLP exporter initialised
INFO CupraFlow: metrics collected and recorded cpu=2.1% ram_used_mb=312
\`\`\`

## 6. View metrics in the dashboard

Open the agent detail page in SecuryBlack. Charts for CPU, RAM, disk and network will populate
within the first collection interval (10 seconds by default).

## Monitoring multiple Hetzner servers

Create one agent entry per server. Each gets a unique token. You can group them in the
Infrastructure Map view to get a visual overview of your entire Hetzner fleet.

## Network metrics and Hetzner's traffic limits

Hetzner includes a monthly traffic allowance. The \`net_bytes_in\` and \`net_bytes_out\` counters
in CupraFlow are cumulative since agent startup ” useful for spotting traffic spikes but not a
replacement for Hetzner's own traffic graph in the console.
`.trim(),
  },
  {
    slug: "CupraFlow-vs-telegraf",
    title: "CupraFlow vs Telegraf",
    date: "2025-07-18",
    author: "SecuryBlack",
    summary: "Telegraf is one of the most capable metric agents available. CupraFlow is deliberately narrower. Here's when each makes sense.",
    tags: ["comparison", "observability"],
    content: `
Telegraf is an impressive piece of software. Written in Go and maintained by InfluxData, it
supports over 300 input plugins and can ship data to dozens of output targets. CupraFlow covers
exactly one input (system metrics) and exactly one output (OTLP/gRPC). The comparison is not
competitive ” they solve different problems.

## Resource usage

Telegraf's Go binary with a minimal config typically uses 30“80 MB of RAM and 0.1“0.5% CPU.
That is acceptable on most servers but noticeable on constrained hardware.

CupraFlow uses under 8 MB of RAM and under 0.05% CPU in steady state. The difference matters
on a $4 VPS, a Raspberry Pi, or an edge device where every megabyte counts.

## Protocol support

| | CupraFlow | Telegraf |
|---|---|---|
| OTLP/gRPC | âœ“ native | âœ“ via plugin |
| Prometheus remote write | ” | âœ“ |
| InfluxDB line protocol | ” | âœ“ native |
| Kafka, MQTT, AMQP | ” | âœ“ |
| OpenTelemetry (input) | ” | âœ“ |

Telegraf's output breadth is unmatched. If you need to write to InfluxDB, Kafka, and an S3
bucket simultaneously, Telegraf is the right tool.

## Plugin ecosystem

Telegraf's 300+ input plugins cover databases (MySQL, PostgreSQL, Redis), cloud providers
(AWS CloudWatch, GCP Stackdriver), network equipment, custom scripts, and more. CupraFlow
collects only CPU, RAM, disk, and network from the host OS.

If you need to correlate application metrics with system metrics in the same pipeline, Telegraf
gives you that in one agent.

## Offline resilience

Neither Telegraf nor most of its output plugins buffer metrics across restarts by default.
CupraFlow has a built-in ring buffer that stores up to 24 hours of snapshots in memory and
flushes them when the ingestor reconnects.

## Auto-update

Telegraf is distributed via package managers (\`apt\`, \`yum\`). Updates require a package manager
invocation or a CI pipeline. CupraFlow checks GitHub Releases 5 minutes after startup and
replaces itself automatically.

## When to choose Telegraf

- You already use InfluxDB or the TICK stack
- You need metrics from databases, message brokers, or custom scripts alongside system metrics
- Your team is comfortable operating a more complex configuration

## When to choose CupraFlow

- You want a drop-in agent with zero configuration complexity
- Resource footprint is a constraint
- You use an OTLP-compatible backend (Grafana, Honeycomb, Datadog, SecuryBlack)
- You want automatic updates and offline resilience out of the box
`.trim(),
  },
  {
    slug: "CupraFlow-vs-datadog-agent",
    title: "CupraFlow vs Datadog Agent",
    date: "2025-06-30",
    author: "SecuryBlack",
    summary: "Datadog is a powerful observability platform. CupraFlow is a lean open-source agent. Here's an honest comparison for teams evaluating both.",
    tags: ["comparison", "observability"],
    content: `
Datadog and CupraFlow are not direct competitors. Datadog is a full observability platform with
APM, logs, synthetics, security and dashboards built in. CupraFlow is a lightweight agent that
ships system metrics to any OTLP backend. The question is not "which is better" but "what do
you actually need."

## Resource overhead

The Datadog Agent requires a minimum of 256 MB of RAM and uses 0.5“3% CPU on a typical server.
On a large fleet of powerful machines this is negligible. On a VPS, a Raspberry Pi, or an edge
device it is significant.

CupraFlow uses under 8 MB of RAM and under 0.05% CPU. It was designed specifically for constrained
environments.

## Cost

Datadog pricing is based on host count and features. Infrastructure monitoring starts at around
\$15“\$27 per host per month (depending on plan), billed annually. For a 50-server fleet that is
\$750“\$1,350 per month before any APM, log management, or add-ons.

CupraFlow is Apache 2.0. SecuryBlack's hosted ingestor is included in the SecuryBlack subscription.
There is no per-host fee.

## Protocol and vendor lock-in

The Datadog Agent sends data exclusively to Datadog's endpoints. If you want to move away from
Datadog, your metric history stays in Datadog's infrastructure.

CupraFlow uses OTLP ” an open standard. Your data goes to whatever backend you point it at.
You can run your own OpenTelemetry Collector, send to Grafana Cloud, or use SecuryBlack's ingestor.
Switching backends requires changing one line in \`config.toml\`.

## Feature depth

Datadog wins on breadth without question: APM traces, log correlation, network performance
monitoring, CI visibility, real user monitoring. CupraFlow does one thing ” system metrics ” and
does it with minimal overhead.

## When Datadog makes sense

- You need APM and log correlation alongside infrastructure metrics
- Your budget accommodates per-host pricing
- You want a single vendor for the full observability stack

## When CupraFlow makes sense

- You need lightweight system metrics without APM or log management
- Cost per host is a constraint
- You want to own your data and avoid vendor lock-in
- Your backend already speaks OTLP
`.trim(),
  },
  {
    slug: "monitor-windows-server",
    title: "Monitor a Windows Server with CupraFlow",
    date: "2025-06-15",
    author: "SecuryBlack",
    summary: "CupraFlow installs as a native Windows Service with a single PowerShell command. Here's how to get metrics flowing from any Windows machine in minutes.",
    tags: ["tutorial", "windows"],
    content: `
Most monitoring agents treat Windows as an afterthought. CupraFlow ships a first-class Windows
Service integration ” the agent installs via a one-line PowerShell command, registers as a service
that starts automatically on boot, and writes structured logs to the Windows Event Viewer.

## Prerequisites

- Windows Server 2016 or later (or Windows 10/11)
- PowerShell 5.1 or later (pre-installed on all modern Windows versions)
- An CupraFlow account at [app.securyblack.com](https://app.securyblack.com)

## 1. Install the agent

Open PowerShell **as Administrator** and run:

\`\`\`powershell
irm https://install.cupraflow.dev | iex
\`\`\`

The installer:
- Downloads the correct binary for your architecture (x86_64 or ARM64)
- Installs it to \`C:\\Program Files\\CupraFlow\\CupraFlow.exe\`
- Creates the config directory at \`C:\\ProgramData\\CupraFlow\\\`
- Registers and starts the **CupraFlow** Windows Service

## 2. Create an agent in SecuryBlack

Log into [app.securyblack.com](https://app.securyblack.com), go to **Agents â†’ New agent**,
give it a name, and copy the token. It is shown only once.

## 3. Configure the agent

\`\`\`powershell
@"
endpoint = "https://ingest.securyblack.com:4317"
token    = "YOUR_TOKEN_HERE"
"@ | Set-Content "C:\ProgramData\CupraFlow\config.toml"
\`\`\`

## 4. Restart the service

\`\`\`powershell
Restart-Service CupraFlow
Get-Service CupraFlow   # should show Status: Running
\`\`\`

## 5. Verify in the dashboard

Open the agent detail page in SecuryBlack. CPU, RAM, disk and network charts will populate
within the first collection interval (10 seconds by default).

## Viewing logs

CupraFlow writes structured logs to \`C:\\ProgramData\\CupraFlow\\CupraFlow.log\` (rolling daily).
You can also view recent entries directly:

\`\`\`powershell
Get-Content "C:\ProgramData\CupraFlow\CupraFlow.log" -Tail 50
\`\`\`

## Service management

\`\`\`powershell
# Check status
Get-Service CupraFlow

# Stop the agent
Stop-Service CupraFlow

# Disable auto-start
Set-Service CupraFlow -StartupType Disabled

# Uninstall
Stop-Service CupraFlow
sc.exe delete CupraFlow
Remove-Item "C:\\Program Files\\CupraFlow" -Recurse
Remove-Item "C:\\ProgramData\\CupraFlow" -Recurse
\`\`\`

## Auto-update on Windows

CupraFlow checks for updates 5 minutes after startup. When a new version is found it replaces
the binary in \`C:\\Program Files\\CupraFlow\\\` and exits cleanly. The Windows Service Manager
restarts the process automatically with the new binary ” no manual intervention required.
`.trim(),
  },
  {
    slug: "CupraFlow-grafana-setup",
    title: "CupraFlow + Grafana: complete setup guide",
    date: "2025-05-28",
    author: "SecuryBlack",
    summary: "Route CupraFlow metrics through the OpenTelemetry Collector into Prometheus and visualise them in Grafana with a practical dashboard.",
    tags: ["tutorial", "grafana", "observability"],
    content: `
CupraFlow speaks OTLP. Grafana can query Prometheus. The bridge between them is the
OpenTelemetry Collector ” a vendor-neutral pipeline that receives OTLP data and exports it to
any backend. This guide walks through a complete self-hosted setup.

## Architecture

\`\`\`
CupraFlow agent  â†’  OTel Collector (OTLP receiver)
                         â†“
                   Prometheus remote write
                         â†“
                      Prometheus
                         â†“
                       Grafana
\`\`\`

## Prerequisites

- A Linux server to run the collector and Prometheus (can be the same host)
- Docker and Docker Compose
- CupraFlow installed on the machine(s) you want to monitor

## 1. Docker Compose stack

Create a \`docker-compose.yml\`:

\`\`\`yaml
services:
  otelcol:
    image: otel/opentelemetry-collector-contrib:latest
    ports:
      - "4317:4317"   # OTLP gRPC
    volumes:
      - ./otelcol.yaml:/etc/otelcol-contrib/config.yaml

  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=changeme
    volumes:
      - grafana_data:/var/lib/grafana

volumes:
  prometheus_data:
  grafana_data:
\`\`\`

## 2. OpenTelemetry Collector config

Create \`otelcol.yaml\`:

\`\`\`yaml
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: "0.0.0.0:4317"

exporters:
  prometheusremotewrite:
    endpoint: "http://prometheus:9090/api/v1/write"

service:
  pipelines:
    metrics:
      receivers: [otlp]
      exporters: [prometheusremotewrite]
\`\`\`

## 3. Prometheus config

Create \`prometheus.yml\`:

\`\`\`yaml
global:
  scrape_interval: 15s

storage:
  tsdb:
    retention.time: 30d
\`\`\`

Enable remote write receiver by adding \`--web.enable-remote-write-receiver\` to the Prometheus
command args, or use the \`command\` key in Docker Compose:

\`\`\`yaml
  prometheus:
    command:
      - "--config.file=/etc/prometheus/prometheus.yml"
      - "--web.enable-remote-write-receiver"
\`\`\`

## 4. Start the stack

\`\`\`bash
docker compose up -d
\`\`\`

## 5. Point CupraFlow at the collector

Edit \`/etc/CupraFlow/config.toml\` on each monitored server:

\`\`\`toml
endpoint = "http://YOUR_COLLECTOR_IP:4317"
token    = "YOUR_TOKEN"
\`\`\`

\`\`\`bash
sudo systemctl restart CupraFlow
\`\`\`

## 6. Build a Grafana dashboard

Open Grafana at \`http://localhost:3000\`, add Prometheus as a data source
(\`http://prometheus:9090\`), and create panels with these queries:

| Panel | PromQL |
|---|---|
| CPU % | \`system_cpu_usage\` |
| RAM used % | \`system_memory_used / system_memory_total * 100\` |
| Disk used % | \`system_disk_used / system_disk_total * 100\` |
| Network in | \`rate(system_network_received_total[5m])\` |
| Network out | \`rate(system_network_transmitted_total[5m])\` |

Filter by agent using the \`service_instance_id\` label, which CupraFlow sets to the agent's
unique identifier.

## Using Grafana Cloud instead

If you prefer a managed backend, Grafana Cloud provides an OTLP endpoint you can point CupraFlow
at directly ” no collector or Prometheus required. Replace the endpoint in \`config.toml\` with
your Grafana Cloud OTLP URL and set the token to your Grafana Cloud API key.
`.trim(),
  },
  {
    slug: "what-is-otlp",
    title: "What is OTLP and why it matters for monitoring",
    date: "2025-05-10",
    author: "SecuryBlack",
    summary: "The OpenTelemetry Protocol is becoming the standard wire format for telemetry data. Here's what it is, how it works, and why CupraFlow uses it.",
    tags: ["observability", "opentelemetry"],
    content: `
If you've set up monitoring in the past few years you've probably seen "OTLP" in documentation.
It stands for **OpenTelemetry Protocol** ” a wire format for transmitting telemetry data (metrics,
traces, and logs) between agents, collectors, and backends.

## The problem OTLP solves

Before OpenTelemetry, every observability vendor had its own agent, its own protocol, and its own
data format. Switching from Datadog to Grafana meant ripping out one agent and installing another,
rewriting dashboards, and converting historical data.

OpenTelemetry is a CNCF project that standardises:

- **The data model** ” how metrics, traces and logs are structured
- **The wire protocol** ” how that data is transmitted (OTLP)
- **The SDK** ” how instrumentation is added to application code

If your agent speaks OTLP, it can send data to any backend that also speaks OTLP: Grafana,
Datadog, Honeycomb, Lightstep, Jaeger, your own self-hosted collector. One agent, any backend.

## How OTLP works

OTLP has two transport options:

**OTLP/gRPC** ” the default. Uses Protocol Buffers over HTTP/2 with TLS. Efficient binary
encoding, multiplexing, and bidirectional streaming. CupraFlow uses this transport.

**OTLP/HTTP** ” uses JSON or Protobuf over HTTP/1.1 or HTTP/2. Easier to debug with tools
like \`curl\`, but less efficient for high-frequency metric export.

A typical OTLP export looks like this:

\`\`\`
ExportMetricsServiceRequest
  â””â”€â”€ ResourceMetrics
        â”œâ”€â”€ Resource (attributes: service.name, service.version, host.name)
        â””â”€â”€ ScopeMetrics
              â””â”€â”€ Metric[]
                    â”œâ”€â”€ name: "system.cpu.usage"
                    â”œâ”€â”€ unit: "%"
                    â””â”€â”€ Gauge
                          â””â”€â”€ DataPoint { value: 12.4, timestamp: ... }
\`\`\`

The **Resource** section carries attributes that describe the source ” in CupraFlow's case,
the agent version and identifier. The **Metric** section carries the actual measurements.

## Resource attributes in CupraFlow

CupraFlow attaches the following resource attributes to every export:

| Attribute | Value |
|---|---|
| \`service.name\` | \`CupraFlow\` |
| \`service.version\` | e.g. \`0.1.10\` |

These attributes allow the ingestor to track which version of the agent is running on each host
without any additional configuration.

## The OpenTelemetry Collector

The OpenTelemetry Collector is a standalone process that receives OTLP data, applies transforms,
and exports to one or more backends. It acts as a fan-out router:

\`\`\`
CupraFlow â†’ Collector â†’ Prometheus
                     â†’ Datadog
                     â†’ S3 (for archiving)
\`\`\`

You don't need the Collector if your backend accepts OTLP directly (SecuryBlack's ingestor does,
as does Grafana Cloud).

## Why CupraFlow chose OTLP

We wanted CupraFlow to be genuinely vendor-neutral. If we had built a custom protocol, every
backend would need a custom integration and every user would be coupled to our infrastructure.

OTLP means that CupraFlow is useful even if you never create a SecuryBlack account. Point it at
your own OpenTelemetry Collector and use whatever storage and visualisation tools you already have.
`.trim(),
  },
  {
    slug: "CupraFlow-vs-netdata",
    title: "CupraFlow vs Netdata",
    date: "2025-04-20",
    author: "SecuryBlack",
    summary: "Netdata is feature-rich and ships with built-in dashboards. CupraFlow is minimal and sends data to your existing stack. Here's how to choose.",
    tags: ["comparison", "observability"],
    content: `
Netdata and CupraFlow take opposite approaches to monitoring. Netdata is a batteries-included
platform: it collects metrics, stores them locally, renders dashboards, and fires alerts ” all
from a single process. CupraFlow is deliberately narrow: it collects system metrics and ships
them to an OTLP backend. Nothing more.

## Resource usage

This is where the comparison is most stark.

| | CupraFlow | Netdata |
|---|---|---|
| RAM | < 8 MB | 100“350 MB |
| CPU (idle) | < 0.05% | 1“5% |
| Disk writes | None (in-memory buffer) | Continuous (local DB) |
| Binary size | ~10 MB | ~50 MB + dependencies |

Netdata's resource usage is higher because it does far more: it runs a local time-series
database, a web server, and an alert engine. On a server with 8+ GB of RAM this is invisible.
On a 512 MB VPS or a Raspberry Pi it is a meaningful overhead.

## Metrics collected

Both agents collect CPU, RAM, disk, and network. Netdata also collects hundreds of additional
metrics out of the box: per-process stats, systemd service states, network socket counts, NFS,
ZFS, Docker containers, database internals, and more. CupraFlow collects only the four core
system metrics.

## Storage model

Netdata stores metrics locally in a custom time-series database (dbengine). Dashboards are
served directly from the agent. There is no external storage requirement for basic use.

CupraFlow has no local storage. Metrics are exported immediately via OTLP. If the backend is
unreachable, they are buffered in memory for up to 24 hours.

## Dashboards and alerts

Netdata ships with hundreds of pre-built dashboards and alert rules. You get a working
monitoring setup with no additional infrastructure.

CupraFlow has no built-in dashboards. You visualise data in your existing stack ” Grafana,
the SecuryBlack dashboard, or whatever receives your OTLP data.

## When to choose Netdata

- You want a self-contained monitoring setup with no external dependencies
- You need per-process, per-container, or application-level metrics out of the box
- You have comfortable RAM headroom on the monitored host

## When to choose CupraFlow

- You already have an OTLP-compatible backend or are using SecuryBlack
- Resource overhead is a constraint (VPS, edge, embedded)
- You want metrics in the same pipeline as your application traces and logs
- You prefer a single binary with no daemon dependencies
`.trim(),
  },
  {
    slug: "monitor-linux-server",
    title: "Monitor a Linux server with CupraFlow",
    date: "2025-04-01",
    author: "SecuryBlack",
    summary: "A step-by-step guide to installing CupraFlow on any Linux distribution, configuring it, and verifying metrics are flowing.",
    tags: ["tutorial", "linux"],
    content: `
CupraFlow installs on any 64-bit Linux distribution with a single command. The binary is statically
linked ” no runtime dependencies, no package manager required after installation.

## Prerequisites

- A 64-bit Linux server (Debian, Ubuntu, RHEL, Alpine, or any systemd-based distro)
- \`curl\` installed
- An CupraFlow account at [app.securyblack.com](https://app.securyblack.com) ” or your own OTLP ingestor

## 1. Run the installer

\`\`\`bash
curl -fsSL https://install.cupraflow.dev | sudo bash
\`\`\`

The installer:
- Detects your architecture (x86_64 or ARM64)
- Downloads the correct static binary from GitHub Releases
- Installs it to \`/usr/local/bin/CupraFlow\`
- Creates the config directory at \`/etc/CupraFlow/\`
- Registers and starts the \`CupraFlow\` systemd service

<Callout type="info">
  To review the installer before running it, fetch it first:
  \`curl -fsSL https://install.cupraflow.dev -o install.sh && less install.sh\`
</Callout>

## 2. Create an agent in SecuryBlack

Log into [app.securyblack.com](https://app.securyblack.com), navigate to **Agents**, and click
**New agent**. Give it a descriptive name (e.g. \`web-prod-01\`) and copy the token shown.

<Callout type="warning">
  The token is shown only once. Copy it before closing the dialog.
</Callout>

## 3. Configure the agent

\`\`\`bash
sudo nano /etc/CupraFlow/config.toml
\`\`\`

\`\`\`toml
endpoint = "https://ingest.securyblack.com:4317"
token    = "YOUR_TOKEN_HERE"

# Optional
interval_secs   = 10    # collection interval in seconds (default: 10)
buffer_max_size = 8640  # offline buffer ” 24 h at 10 s (default)
\`\`\`

## 4. Restart the agent

\`\`\`bash
sudo systemctl restart CupraFlow
sudo systemctl status CupraFlow
\`\`\`

The output should show \`Active: active (running)\`.

## 5. Check the logs

\`\`\`bash
sudo journalctl -fu CupraFlow
\`\`\`

You should see lines like:

\`\`\`
INFO CupraFlow: CupraFlow v0.1.10 starting
INFO CupraFlow: config loaded endpoint=https://ingest.securyblack.com:4317 interval_secs=10
INFO CupraFlow: OTLP exporter initialised
INFO CupraFlow: metrics collected and recorded cpu=3.2% ram_used_mb=1024
\`\`\`

## 6. Verify in the dashboard

Open the agent detail page in SecuryBlack. Within 10“30 seconds you should see CPU, RAM, disk
and network charts populating with live data.

## Configuration via environment variables

If you prefer not to write a config file (useful in Docker or CI environments), all settings can
be passed as environment variables:

\`\`\`bash
CupraFlow_ENDPOINT="https://ingest.securyblack.com:4317" \\
CupraFlow_TOKEN="YOUR_TOKEN_HERE" \\
CupraFlow
\`\`\`

## Uninstalling

\`\`\`bash
sudo systemctl disable --now CupraFlow
sudo rm /usr/local/bin/CupraFlow
sudo rm -rf /etc/CupraFlow
\`\`\`
`.trim(),
  },
  {
    slug: "CupraFlow-vs-node-exporter",
    title: "CupraFlow vs Prometheus Node Exporter",
    date: "2025-03-15",
    author: "SecuryBlack",
    summary: "Node Exporter is the de-facto standard for Linux system metrics in Prometheus environments. CupraFlow takes a different approach. Here's when each makes sense.",
    tags: ["comparison", "prometheus", "observability"],
    content: `
Prometheus Node Exporter is installed on millions of Linux servers. If you run Prometheus, it is
the obvious choice for host metrics. CupraFlow takes a fundamentally different approach ” push
instead of pull, OTLP instead of Prometheus exposition format. Here's a direct comparison.

## Architecture: pull vs push

Node Exporter exposes a \`/metrics\` HTTP endpoint that Prometheus scrapes on a schedule. The flow is:

\`\`\`
Node Exporter (port 9100)  â†  Prometheus (scrapes every 15 s)  â†’  storage
\`\`\`

CupraFlow pushes metrics to the collector:

\`\`\`
CupraFlow  â†’  OTLP collector  â†’  storage
\`\`\`

Pull is simpler to reason about for Prometheus users. Push works better in environments where
agents are behind NAT, firewalls, or change IP frequently ” Prometheus can't scrape what it can't reach.

## Protocol and backend flexibility

Node Exporter outputs the Prometheus text exposition format. To use it with Grafana you need
Prometheus (or a compatible system like Mimir or Thanos) in the middle.

CupraFlow outputs OTLP/gRPC, which is accepted by Grafana Cloud, Datadog, Honeycomb,
OpenTelemetry Collector, and SecuryBlack's ingestor. No intermediate Prometheus is required.

## Metrics collected

| Metric | Node Exporter | CupraFlow |
|---|---|---|
| CPU usage | âœ“ (detailed per-mode) | âœ“ (overall %) |
| Memory | âœ“ (detailed: buffers, cache) | âœ“ (used / total) |
| Disk I/O | âœ“ | ” |
| Disk space | âœ“ | âœ“ |
| Network | âœ“ (per interface) | âœ“ (aggregate in/out) |
| Filesystem stats | âœ“ | ” |
| Hardware (temp, fans) | âœ“ (via collectors) | ” |
| Systemd units | âœ“ (via collector) | ” |

Node Exporter wins on depth. CupraFlow covers the four metrics that matter for most server
health checks without the complexity.

## Offline resilience

Node Exporter has no buffer ” if Prometheus can't scrape during an outage, data is lost.
CupraFlow stores up to 24 hours of metric snapshots in memory and flushes them on reconnect.

## Auto-update

Node Exporter is distributed as a binary you update manually or via a package manager. CupraFlow
checks GitHub Releases 5 minutes after startup and replaces itself automatically.

## When to choose Node Exporter

- You already run Prometheus and want the richest set of Linux metrics
- You need per-interface network stats, disk I/O, or hardware sensors
- Your team is deeply familiar with the Prometheus ecosystem

## When to choose CupraFlow

- You use an OTLP-compatible backend (Grafana Cloud, Datadog, SecuryBlack)
- You need push-based delivery (NAT, dynamic IPs, cloud-init environments)
- You want offline resilience and auto-update out of the box
- You monitor a mix of Linux and Windows servers and want one agent for both
`.trim(),
  },
  {
    slug: "why-we-built-CupraFlow",
    title: "Why we built CupraFlow",
    date: "2025-03-01",
    author: "SecuryBlack",
    summary:
      "Monitoring agents shouldn't cost more to run than the applications they monitor. Here's why we built CupraFlow.",
    tags: ["announcement", "rust", "observability"],
    content: `
Every time we set up monitoring on a server, we faced the same frustration: the agent consumed
more resources than most of the services we were trying to monitor.

Prometheus exporters need a Node.js or Python runtime. Commercial agents run with 200“400 MB of
RAM and 1“5% persistent CPU. On a small VPS or a constrained edge node, that overhead is not
acceptable.

## The requirements we set

We wanted an agent that:

- Compiles to a single static binary with no runtime dependencies
- Consumes under 0.1% CPU and under 10 MB of RAM
- Speaks a standard protocol so we're not locked into any vendor
- Handles network failures gracefully without losing data
- Updates itself without manual intervention

Rust was the obvious choice. No garbage collector, no runtime, direct OS API access, and a
compiler that catches entire classes of bugs before they reach production.

## Why OpenTelemetry

We could have built a custom protocol, but that would mean custom integrations on every backend.
OTLP (OpenTelemetry Protocol) over gRPC is becoming the standard for telemetry transport. Any
modern observability stack ” Grafana, Datadog, Honeycomb, your own collector ” can receive it.

Choosing OTLP means CupraFlow works with whatever you already have.

## Open source, no lock-in

The agent is Apache 2.0. You can point it at your own OTLP collector ” you don't need to use
SecuryBlack's infrastructure. We believe monitoring tooling should be transparent and auditable.

We're releasing CupraFlow as a standalone project because it solves a real problem, and because
we think the community can help make it better faster than we can alone.

## What's next

v0.1.0 covers the core: CPU, RAM, disk, and network metrics over gRPC. On the roadmap:

- Per-process metrics
- Custom metric labels
- Docker and Kubernetes integrations
- A public Prometheus-compatible endpoint as an alternative to OTLP

If you have a use case that isn't covered, [open an issue](https://github.com/sb-mcampoe/cupraflow/issues).
We read them all.
`.trim(),
  },
];
