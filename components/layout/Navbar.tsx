"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Github, Activity } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SearchButton } from "@/components/ui/Search";

const navLinks = [
  { label: "Docs",      href: "/docs" },
  { label: "Install",   href: "/install" },
  { label: "Changelog", href: "/changelog" },
  { label: "Blog",      href: "/blog" },
  { label: "Community", href: "/community" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-[var(--color-bg)]/90 backdrop-blur-md border-b border-[var(--color-border)]"
          : "bg-transparent",
      ].join(" ")}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="text-[var(--color-primary)] group-hover:opacity-80 transition-opacity">
              <Activity size={22} strokeWidth={2.5} />
            </span>
            <span className="font-semibold text-[var(--color-text)] text-lg tracking-tight">
              OxiPulse
            </span>
          </Link>
          <a
            href="https://securyblack.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1 text-xs text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors border-l border-[var(--color-border)] pl-3"
          >
            by SecuryBlack
          </a>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] rounded-[var(--radius-sm)] transition-colors duration-[var(--transition-fast)]"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop search */}
        <div className="hidden lg:block w-48">
          <SearchButton />
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            href="https://github.com/securyblack/oxi-pulse"
            variant="ghost"
            size="sm"
            external
          >
            <Github size={16} />
            GitHub
          </Button>
          <Button href="/install" variant="primary" size="sm">
            Get Started
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen((v) => !v)}
          className="md:hidden p-2 text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[var(--color-surface)] border-b border-[var(--color-border)] px-4 pb-4 pt-2 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="px-3 py-2 text-sm text-[var(--color-muted)] hover:text-[var(--color-text)] rounded-[var(--radius-sm)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-2 mt-2">
            <Button
              href="https://github.com/securyblack/oxi-pulse"
              variant="ghost"
              size="sm"
              external
              className="flex-1 justify-center"
            >
              <Github size={16} />
              GitHub
            </Button>
            <Button href="/install" variant="primary" size="sm" className="flex-1 justify-center">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
