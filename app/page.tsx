import { Layout } from "@/components/layout";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { InstallSection } from "@/components/sections/InstallSection";
import { OpenSourceSection } from "@/components/sections/OpenSourceSection";
import { CTASection } from "@/components/sections/CTASection";

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Features />
      <HowItWorks />
      <InstallSection />
      <OpenSourceSection />
      <CTASection />
    </Layout>
  );
}
