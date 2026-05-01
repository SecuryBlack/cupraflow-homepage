import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center gap-6">
        <div className="text-8xl font-bold text-[var(--color-border)]">404</div>
        <div>
          <h1 className="text-2xl font-semibold text-[var(--color-text)] mb-2">Page not found</h1>
          <p className="text-[var(--color-muted)]">
            This page doesn&apos;t exist yet — or has been moved.
          </p>
        </div>
        <Button href="/" variant="primary" size="md">
          Back to home
          <ArrowRight size={16} />
        </Button>
      </div>
    </Layout>
  );
}
