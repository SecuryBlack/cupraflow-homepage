interface Step {
  title: string;
  children: React.ReactNode;
}

export function StepList({ steps }: { steps: Step[] }) {
  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-5">
          {/* Left rail */}
          <div className="flex flex-col items-center shrink-0">
            <div className="w-7 h-7 rounded-full bg-[var(--color-primary-glow)] border border-[var(--color-primary-dim)] flex items-center justify-center text-xs font-bold text-[var(--color-primary)] shrink-0">
              {i + 1}
            </div>
            {i < steps.length - 1 && (
              <div className="w-px flex-1 bg-[var(--color-border)] my-2 min-h-[20px]" />
            )}
          </div>
          {/* Content */}
          <div className="pb-8 flex-1 min-w-0">
            <p className="font-semibold text-[var(--color-text)] mb-3 pt-0.5">{step.title}</p>
            <div className="flex flex-col gap-3">{step.children}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
