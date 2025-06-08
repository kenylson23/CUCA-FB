import { useEffect, useRef, useState } from 'react';

interface UseLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
}

export function useLazyLoad(options: UseLazyLoadOptions = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || hasLoaded) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          observer.disconnect();
        }
      },
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || '50px',
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [hasLoaded, options.threshold, options.rootMargin]);

  return { elementRef, isVisible, hasLoaded };
}