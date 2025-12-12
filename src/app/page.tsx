import { Navbar } from "@/components/navbar";
import { HeroTerminal } from "@/components/hero-terminal";
import { KillFeed } from "@/components/kill-feed";
import { GlassCannon } from "@/components/glass-cannon";
import { Protocol } from "@/components/protocol";
import { PricingRansom } from "@/components/pricing-ransom";
import { Footer } from "@/components/footer";
import { CustomCursor } from "@/components/custom-cursor";

export default function Home() {
  return (
    <>
      <div className="bg-noise"></div>
      <CustomCursor />

      <Navbar />

      <div className="bg-grid min-h-screen">
        <HeroTerminal />
        <KillFeed />
        <GlassCannon />
        <Protocol />
        <PricingRansom />
        <Footer />
      </div>
    </>
  );
}
