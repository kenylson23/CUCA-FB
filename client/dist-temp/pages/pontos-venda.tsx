import { lazy } from 'react';
import Navigation from '@/components/Navigation';
import LazySection from '@/components/LazySection';

// Lazy loading para componentes pesados
const PontosVendaSection = lazy(() => import('@/components/PontosVendaSection'));
const Footer = lazy(() => import('@/components/Footer'));

export default function PontosVenda() {
  return (
    <>
      <Navigation />
      <main className="pt-16 bg-background dark:bg-background min-h-screen">
        <LazySection threshold={0.1} rootMargin="50px">
          <PontosVendaSection />
        </LazySection>
        <LazySection threshold={0.1} rootMargin="50px">
          <Footer />
        </LazySection>
      </main>
    </>
  );
}