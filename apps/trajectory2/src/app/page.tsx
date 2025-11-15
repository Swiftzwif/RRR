"use client";

import KillTheBoyLoader from "@/components/KillTheBoyLoader";
import { HeroSection } from "@/components/home/HeroSection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { TransparencySection } from "@/components/home/TransparencySection";
import { CTASection } from "@/components/home/CTASection";
import { usePageLoader } from "@/hooks/usePageLoader";
import { motion } from "framer-motion";

export default function Home() {
  const { isLoading, showContent, handleLoaderComplete } = usePageLoader();

  return (
    <>
      {/* Loading Screen */}
      <KillTheBoyLoader isLoading={isLoading} onComplete={handleLoaderComplete} />

      {/* Main Content */}
      {showContent && (
        <motion.div
          className="min-h-screen bg-base text-white pt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <HeroSection />
          <ProductsSection />
          <TransparencySection />
          <CTASection />
        </motion.div>
      )}
    </>
  );
}
