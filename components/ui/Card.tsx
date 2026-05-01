interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, className = "", hover, glow }: CardProps) {
  return (
    <div
      className={[
        "bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-lg)] p-6",
        hover &&
          "transition-all duration-200 hover:border-[var(--color-primary-dim)] hover:bg-[var(--color-surface-2)]",
        glow && "hover:shadow-[0_0_30px_var(--color-primary-glow)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
