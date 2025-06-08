import { useEffect, useState } from 'react';

interface UseImagePreloadOptions {
  priority?: boolean;
  preloadOnHover?: boolean;
}

export function useImagePreload(src: string, options: UseImagePreloadOptions = {}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!src || !options.priority) return;

    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setError('Failed to load image');
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, options.priority]);

  const preloadImage = () => {
    if (isLoaded || !src) return;

    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.onerror = () => setError('Failed to load image');
    img.src = src;
  };

  return { isLoaded, error, preloadImage };
}

export function preloadImages(urls: string[]) {
  urls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}

// Hook para preload de recursos críticos
export function useCriticalResourcePreload() {
  useEffect(() => {
    // Preload de imagens críticas
    const criticalImages = [
      '/images/cuca-hero.jpg',
      '/images/cuca-logo.png'
    ];

    preloadImages(criticalImages);

    // Preload de fonts críticas
    const fontLinks = [
      'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;600;700;800&family=Open+Sans:wght@300;400;600;700&display=swap'
    ];

    fontLinks.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      link.onload = () => {
        link.rel = 'stylesheet';
      };
      document.head.appendChild(link);
    });
  }, []);
}