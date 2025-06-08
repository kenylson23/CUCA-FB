import { lazy } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import LazySection from "@/components/LazySection";

// Lazy loading para componentes que aparecem após scroll
const ProductShowcase = lazy(() => import("@/components/ProductShowcase"));
const HeritageSection = lazy(() => import("@/components/HeritageSection"));
const TestimonialsSection = lazy(() => import("@/components/TestimonialsSection"));
const CTASection = lazy(() => import("@/components/CTASection"));
const ContactSection = lazy(() => import("@/components/ContactSection"));
const Footer = lazy(() => import("@/components/Footer"));

export default function Home() {
  return (
    <div className="min-h-screen bg-background dark:bg-background overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <LazySection threshold={0.2} rootMargin="150px">
        <ProductShowcase />
      </LazySection>
      <LazySection threshold={0.1} rootMargin="100px">
        <HeritageSection />
      </LazySection>
      <LazySection threshold={0.1} rootMargin="100px">
        <TestimonialsSection />
      </LazySection>
      <LazySection threshold={0.1} rootMargin="100px">
        <CTASection />
      </LazySection>
      <LazySection threshold={0.1} rootMargin="100px">
        <ContactSection />
      </LazySection>
      <LazySection threshold={0.1} rootMargin="50px">
        <Footer />
      </LazySection>
    </div>
  );
}
