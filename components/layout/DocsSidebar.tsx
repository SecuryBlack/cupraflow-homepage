"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { docsNav } from "@/lib/docs-nav";
import { SearchButton } from "@/components/ui/Search";

export function DocsSidebar({ className = "" }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav className={`flex flex-col gap-6 ${className}`}>
      <SearchButton />
      {docsNav.map((group) => (
        <div key={group.label}>
          <p className="text-xs font-semibold text-[var(--color-text)] uppercase tracking-widest mb-2 px-3">
            {group.label}
          </p>
          <ul className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={[
                      "block px-3 py-1.5 text-sm rounded-[var(--radius-sm)] transition-colors duration-150",
                      isActive
                        ? "bg-[var(--color-primary-glow)] text-[var(--color-primary)] font-medium border-l-2 border-[var(--color-primary)]"
                        : "text-[var(--color-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-surface-2)]",
                    ].join(" ")}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
