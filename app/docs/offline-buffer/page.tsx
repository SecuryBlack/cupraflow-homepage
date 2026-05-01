import type { Metadata } from "next";
import { Prose } from "@/components/ui/Prose";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { Callout } from "@/components/ui/Callout";

export const metadata: Metadata = {
  title: "Offline Buffer",
  description: "How OxiPulse handles connectivity loss without dropping metrics.",
};

export default function OfflineBufferPage() {
  return (
    <Prose>
      <h1>Offline buffer</h1>
      <p>
        OxiPulse is designed to never lose metrics due to temporary network failures. When the
        OTLP endpoint is unreachable, the agent automatically switches to a local disk buffer
        and replays accumulated data once connectivity is restored.
      </p>

      <h2>How it works</h2>
      <ol>
        <li>
          On each collection tick, the agent attempts to send the metrics batch to the configured
          endpoint.
        </li>
        <li>
          If the send fails (connection refused, timeout, DNS failure), the batch is written to a
          local buffer file on disk instead of being discarded.
        </li>
        <li>
          On the next successful connection, the agent replays all buffered batches in order before
          resuming normal operation.
        </li>
        <li>
          If the buffer reaches the configured maximum size (<code>OXIPULSE_BUFFER_MAX_MB</code>,
          default 100 MB), the oldest batches are dropped to make room for new ones.
        </li>
      </ol>

      <Callout variant="info">
        Metrics in the buffer retain their original timestamps, so your time-series data remains
        accurate even after a long offline period.
      </Callout>

      <h2>Buffer location</h2>
      <p>Default locations by platform:</p>
      <ul>
        <li>Linux: <code>/var/lib/oxipulse/buffer/</code></li>
        <li>Windows: <code>C:\ProgramData\OxiPulse\buffer\</code></li>
      </ul>
      <p>Override with the <code>OXIPULSE_BUFFER_PATH</code> environment variable:</p>
      <CodeBlock
        code={`OXIPULSE_BUFFER_PATH=/data/oxipulse/buffer`}
        language="bash"
      />

      <h2>Monitoring buffer state</h2>
      <p>The agent logs buffer activity at <code>info</code> level:</p>
      <CodeBlock
        code={`INFO oxipulse: endpoint unreachable, buffering metrics (buffer: 12 MB / 100 MB)
INFO oxipulse: connection restored, replaying 47 buffered batches
INFO oxipulse: buffer drained, resuming normal operation`}
        language="bash"
        filename="Log output"
        showCopy={false}
      />

      <h2>Disk space considerations</h2>
      <p>
        At the default 10-second interval, one batch is approximately <strong>1–3 KB</strong>.
        The default 100 MB buffer can hold roughly <strong>8–24 hours</strong> of metrics before
        the oldest data starts being dropped.
      </p>

      <Callout variant="warning">
        Ensure the buffer directory is on a partition with sufficient free space, especially for
        servers that may experience extended offline periods.
      </Callout>
    </Prose>
  );
}
