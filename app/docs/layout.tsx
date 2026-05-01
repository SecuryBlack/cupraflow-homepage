import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DocsSidebar } from "@/components/layout/DocsSidebar";
import { DocsMobileNav } from "@/components/layout/DocsMobileNav";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="flex gap-12">
          {/* Sidebar — desktop */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24">
              <DocsSidebar />
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">
            <DocsMobileNav />
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
