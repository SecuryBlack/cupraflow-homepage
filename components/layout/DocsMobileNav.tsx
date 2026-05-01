"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { DocsSidebar } from "./DocsSidebar";

export function DocsMobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden flex items-center gap-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors mb-6"
        aria-label="Open docs navigation"
      >
        <Menu size={16} />
        Navigation
      </button>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          {/* Drawer */}
          <div className="absolute left-0 top-0 bottom-0 w-72 bg-[var(--color-surface)] border-r border-[var(--color-border)] p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-semibold text-[var(--color-text)]">Docs</span>
              <button
                onClick={() => setOpen(false)}
                className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <DocsSidebar />
          </div>
        </div>
      )}
    </>
  );
}
