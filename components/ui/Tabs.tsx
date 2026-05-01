"use client";

import { useState, createContext, useContext } from "react";

interface TabsContextValue {
  active: string;
  setActive: (id: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used inside <Tabs>");
  return ctx;
}

export function Tabs({
  defaultValue,
  children,
}: {
  defaultValue: string;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(defaultValue);
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`flex gap-1 p-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] w-fit max-w-full overflow-x-auto ${className}`}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  const { active, setActive } = useTabs();
  const isActive = active === value;
  return (
    <button
      onClick={() => setActive(value)}
      className={[
        "flex items-center gap-2 px-4 py-2 text-sm rounded-[var(--radius-md)] transition-all duration-200 cursor-pointer",
        isActive
          ? "bg-[var(--color-primary)] text-[var(--color-bg)] font-semibold"
          : "text-[var(--color-muted)] hover:text-[var(--color-text)]",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children }: { value: string; children: React.ReactNode }) {
  const { active } = useTabs();
  if (active !== value) return null;
  return <div className="mt-6">{children}</div>;
}
