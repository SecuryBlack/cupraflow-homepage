"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showCopy?: boolean;
}

export function CodeBlock({
  code,
  language = "bash",
  filename,
  showCopy = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-[var(--radius-lg)] overflow-hidden border border-[var(--color-border)] bg-[#0A0A0A]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="flex items-center gap-3">
          {/* traffic lights */}
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
            <span className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
            <span className="w-3 h-3 rounded-full bg-[#28C840]" />
          </div>
          {filename && (
            <span className="text-xs text-[var(--color-muted)] font-mono">{filename}</span>
          )}
          {!filename && (
            <span className="text-xs text-[var(--color-muted)] font-mono">{language}</span>
          )}
        </div>

        {showCopy && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors duration-[var(--transition-fast)] cursor-pointer"
            aria-label="Copy code"
          >
            {copied ? (
              <>
                <Check size={13} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Code */}
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code className={`language-${language} font-mono text-[var(--color-text)]`}>
          {code}
        </code>
      </pre>
    </div>
  );
}
