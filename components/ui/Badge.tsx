type BadgeVariant = "primary" | "neutral" | "success" | "warning";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: "bg-[var(--color-primary-glow)] text-[var(--color-primary)] border-[var(--color-primary-dim)]",
  neutral: "bg-[var(--color-surface-2)] text-[var(--color-muted)] border-[var(--color-border)]",
  success: "bg-emerald-950/50 text-emerald-400 border-emerald-800/50",
  warning: "bg-amber-950/50 text-amber-400 border-amber-800/50",
};

const dotStyles: Record<BadgeVariant, string> = {
  primary: "bg-[var(--color-primary)]",
  neutral:  "bg-[var(--color-muted)]",
  success:  "bg-emerald-400",
  warning:  "bg-amber-400",
};

export function Badge({ children, variant = "neutral", className = "", dot }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${variantStyles[variant]} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotStyles[variant]}`} />
      )}
      {children}
    </span>
  );
}
