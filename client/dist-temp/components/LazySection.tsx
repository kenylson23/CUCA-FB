import { Suspense, ComponentType, ReactNode } from 'react';
import { useLazyLoad } from '@/hooks/use-lazy-load';

interface LazySectionProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
}

function DefaultSkeleton() {
  return (
    <div className="py-12 sm:py-16 lg:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-6 sm:h-8 bg-muted rounded w-1/3 mx-auto mb-6 sm:mb-8"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-48 sm:h-56 lg:h-64 bg-muted rounded-lg"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LazySection({ 
  children, 
  fallback = <DefaultSkeleton />, 
  threshold = 0.1, 
  rootMargin = '100px' 
}: LazySectionProps) {
  const { elementRef, isVisible } = useLazyLoad({ threshold, rootMargin });

  return (
    <div ref={elementRef}>
      {isVisible ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}