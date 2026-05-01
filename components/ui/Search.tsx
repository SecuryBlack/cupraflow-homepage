"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Search as SearchIcon, X, FileText, ArrowRight } from "lucide-react";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    PagefindUI: new (opts: Record<string, unknown>) => void;
  }
}

export function SearchButton() {
  const [open, setOpen] = useState(false);

  // Cmd+K / Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[var(--color-muted)] bg-[var(--color-surface-2)] border border-[var(--color-border)] rounded-[var(--radius-md)] hover:border-[var(--color-primary-dim)] hover:text-[var(--color-text)] transition-all duration-150 cursor-pointer"
        aria-label="Search docs"
      >
        <SearchIcon size={14} />
        <span className="flex-1 text-left">Search docs...</span>
        <kbd className="hidden sm:inline-flex items-center gap-0.5 text-[10px] text-[var(--color-muted-2)] bg-[var(--color-surface)] border border-[var(--color-border)] rounded px-1.5 py-0.5 font-mono">
          ⌘K
        </kbd>
      </button>

      {open && <SearchModal onClose={() => setOpen(false)} />}
    </>
  );
}

function SearchModal({ onClose }: { onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [results, setResults] = useState<PagefindResult[]>([]);
  const [query, setQuery] = useState("");

  // Load Pagefind via script tag (avoids static import resolution)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.__pagefind__) { setLoaded(true); return; }

    const script = document.createElement("script");
    script.type = "module";
    script.textContent = `
      import * as pf from "/pagefind/pagefind.js";
      await pf.init();
      window.__pagefind__ = pf;
      window.dispatchEvent(new Event("pagefind:ready"));
    `;
    document.head.appendChild(script);

    const onReady = () => setLoaded(true);
    window.addEventListener("pagefind:ready", onReady, { once: true });
    return () => window.removeEventListener("pagefind:ready", onReady);
  }, []);

  // Search
  const search = useCallback(async (q: string) => {
    setQuery(q);
    if (!q.trim() || !window.__pagefind__) {
      setResults([]);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const res = await window.__pagefind__.search(q) as { results: { data: () => Promise<PagefindResult> }[] };
    const data = await Promise.all(
      res.results.slice(0, 8).map((r) => r.data())
    );
    setResults(data);
  }, []);

  // Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  // Focus input
  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={containerRef}
        className="relative w-full max-w-xl bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)] shadow-2xl overflow-hidden"
      >
        {/* Input row */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--color-border)]">
          <SearchIcon size={16} className="text-[var(--color-muted)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search docs..."
            onChange={(e) => search(e.target.value)}
            className="flex-1 bg-transparent text-[var(--color-text)] placeholder-[var(--color-muted)] text-sm outline-none"
          />
          <button
            onClick={onClose}
            className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[420px] overflow-y-auto">
          {!loaded && (
            <div className="px-4 py-8 text-center text-sm text-[var(--color-muted)]">
              Search is available after build.{" "}
              <span className="text-xs opacity-60">Run <code className="font-mono">npm run build</code> first.</span>
            </div>
          )}

          {loaded && !query && (
            <div className="px-4 py-8 text-center text-sm text-[var(--color-muted)]">
              Type to search docs...
            </div>
          )}

          {loaded && query && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-[var(--color-muted)]">
              No results for <strong className="text-[var(--color-text)]">&ldquo;{query}&rdquo;</strong>
            </div>
          )}

          {results.map((result, i) => (
            <a
              key={i}
              href={result.url}
              onClick={onClose}
              className="flex items-start gap-3 px-4 py-3.5 border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface-2)] transition-colors group"
            >
              <div className="mt-0.5 w-7 h-7 rounded-[var(--radius-sm)] bg-[var(--color-surface-2)] border border-[var(--color-border)] flex items-center justify-center shrink-0">
                <FileText size={13} className="text-[var(--color-primary)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors truncate">
                  {result.meta?.title ?? result.url}
                </p>
                {result.excerpt && (
                  <p
                    className="text-xs text-[var(--color-muted)] mt-0.5 line-clamp-2 leading-relaxed [&_mark]:bg-[var(--color-primary-glow)] [&_mark]:text-[var(--color-primary)] [&_mark]:rounded-sm [&_mark]:px-0.5"
                    dangerouslySetInnerHTML={{ __html: result.excerpt }}
                  />
                )}
              </div>
              <ArrowRight size={14} className="text-[var(--color-muted)] shrink-0 mt-1 group-hover:text-[var(--color-primary)] transition-colors" />
            </a>
          ))}
        </div>

        {/* Footer hint */}
        {loaded && (
          <div className="px-4 py-2.5 border-t border-[var(--color-border)] flex items-center gap-3 text-[10px] text-[var(--color-muted)]">
            <span><kbd className="font-mono">↑↓</kbd> navigate</span>
            <span><kbd className="font-mono">↵</kbd> open</span>
            <span><kbd className="font-mono">Esc</kbd> close</span>
            <span className="ml-auto">Powered by Pagefind</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Type for Pagefind result data
interface PagefindResult {
  url: string;
  excerpt: string;
  meta?: { title?: string };
}

// Extend window
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    __pagefind__: any;
  }
}
