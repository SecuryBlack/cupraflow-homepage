import { type ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";

type Variant = "primary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
  external?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-[var(--color-primary)] text-[var(--color-bg)] font-semibold hover:opacity-90 active:scale-[0.98]",
  ghost:
    "bg-transparent text-[var(--color-text)] hover:bg-[var(--color-surface-2)] active:scale-[0.98]",
  outline:
    "bg-transparent border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] active:scale-[0.98]",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm rounded-[var(--radius-sm)]",
  md: "px-4 py-2 text-sm rounded-[var(--radius-md)]",
  lg: "px-6 py-3 text-base rounded-[var(--radius-md)]",
};

const base =
  "inline-flex items-center gap-2 transition-all duration-[var(--transition-fast)] cursor-pointer select-none whitespace-nowrap";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", href, external, className = "", children, ...props }, ref) => {
    const classes = `${base} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    if (href) {
      return (
        <Link
          href={href}
          className={classes}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
