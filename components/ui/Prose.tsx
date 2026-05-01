export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={[
        "max-w-3xl",
        // headings
        "[&_h1]:text-4xl [&_h1]:font-bold [&_h1]:text-[var(--color-text)] [&_h1]:mb-4 [&_h1]:leading-tight",
        "[&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-[var(--color-text)] [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:pt-8 [&_h2]:border-t [&_h2]:border-[var(--color-border)]",
        "[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-[var(--color-text)] [&_h3]:mt-8 [&_h3]:mb-3",
        // paragraphs & lists
        "[&_p]:text-[var(--color-muted)] [&_p]:leading-relaxed [&_p]:mb-4",
        "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5",
        "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:flex [&_ol]:flex-col [&_ol]:gap-1.5",
        "[&_li]:text-[var(--color-muted)] [&_li]:leading-relaxed",
        // inline code
        "[&_code]:font-mono [&_code]:text-[var(--color-primary)] [&_code]:bg-[var(--color-surface-2)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-sm [&_code]:text-sm",
        // links
        "[&_a]:text-[var(--color-primary)] [&_a]:underline-offset-4 [&_a:hover]:underline",
        // strong
        "[&_strong]:text-[var(--color-text)] [&_strong]:font-semibold",
        // hr
        "[&_hr]:border-[var(--color-border)] [&_hr]:my-8",
      ].join(" ")}
    >
      {children}
    </div>
  );
}
