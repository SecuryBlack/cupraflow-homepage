export interface NavItem {
  title: string;
  href: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const docsNav: NavGroup[] = [
  {
    label: "Getting Started",
    items: [
      { title: "Introduction",  href: "/docs" },
      { title: "Quick Start",   href: "/docs/quick-start" },
    ],
  },
  {
    label: "Configuration",
    items: [
      { title: "Configuration reference", href: "/docs/configuration" },
    ],
  },
  {
    label: "Agent",
    items: [
      { title: "Metrics",        href: "/docs/metrics" },
      { title: "Offline buffer", href: "/docs/offline-buffer" },
      { title: "Auto-update",    href: "/docs/auto-update" },
    ],
  },
  {
    label: "Community",
    items: [
      { title: "Contributing", href: "/docs/contributing" },
    ],
  },
];
