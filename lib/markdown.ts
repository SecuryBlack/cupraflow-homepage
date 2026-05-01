import { marked, Renderer } from "marked";

// ─── Callout pre-processor ────────────────────────────────────────────────────
// Converts <Callout type="info|warning|success">…</Callout> to styled HTML
// before the markdown parser runs.

const CALLOUT_STYLES: Record<string, string> = {
  info: [
    "background:rgba(23,37,84,0.3)",
    "border:1px solid rgba(30,58,138,0.5)",
    "color:rgb(147,197,253)",
  ].join(";"),
  warning: [
    "background:rgba(69,26,3,0.3)",
    "border:1px solid rgba(180,83,9,0.5)",
    "color:rgb(252,211,77)",
  ].join(";"),
  success: [
    "background:rgba(2,44,34,0.3)",
    "border:1px solid rgba(6,78,59,0.5)",
    "color:rgb(110,231,183)",
  ].join(";"),
};

const CALLOUT_BASE =
  "display:flex;gap:0.75rem;padding:1rem;border-radius:0.5rem;font-size:0.875rem;line-height:1.625;margin-bottom:1rem";

function processCallouts(src: string): string {
  return src.replace(
    /<Callout type="(info|warning|success)">([\s\S]*?)<\/Callout>/g,
    (_, type: string, children: string) => {
      const color = CALLOUT_STYLES[type] ?? CALLOUT_STYLES.info;
      return `<div style="${CALLOUT_BASE};${color}">${children.trim()}</div>`;
    }
  );
}

// ─── Custom marked renderer ───────────────────────────────────────────────────

const renderer = new Renderer();

renderer.code = function ({ text, lang }) {
  const language = lang ?? "";
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  return `<pre data-lang="${language}"><code class="language-${language} font-mono">${escaped}</code></pre>`;
};

marked.use({ renderer, gfm: true });

// ─── Public API ───────────────────────────────────────────────────────────────

export function renderMarkdown(content: string): string {
  return marked.parse(processCallouts(content)) as string;
}
