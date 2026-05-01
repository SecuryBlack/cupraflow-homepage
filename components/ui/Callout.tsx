import { Info, AlertTriangle, CheckCircle } from "lucide-react";

type CalloutVariant = "info" | "warning" | "success";

const config: Record<CalloutVariant, { icon: React.ElementType; classes: string }> = {
  info: {
    icon: Info,
    classes: "bg-blue-950/30 border-blue-800/50 text-blue-300",
  },
  warning: {
    icon: AlertTriangle,
    classes: "bg-amber-950/30 border-amber-800/50 text-amber-300",
  },
  success: {
    icon: CheckCircle,
    classes: "bg-emerald-950/30 border-emerald-800/50 text-emerald-300",
  },
};

export function Callout({
  variant = "info",
  children,
}: {
  variant?: CalloutVariant;
  children: React.ReactNode;
}) {
  const { icon: Icon, classes } = config[variant];
  return (
    <div className={`flex gap-3 p-4 rounded-[var(--radius-md)] border text-sm leading-relaxed ${classes}`}>
      <Icon size={16} className="shrink-0 mt-0.5" />
      <div>{children}</div>
    </div>
  );
}
