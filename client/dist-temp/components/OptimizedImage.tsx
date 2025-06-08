import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export function OptimizedImage({ 
  src, 
  alt, 
  className = "", 
  sizes = "100vw",
  priority = false 
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false);
  
  // Gerar nomes de arquivos otimizados
  const webpSrc = src.replace(/\.(jpg|jpeg|png)$/, '.webp');
  const optimizedSrc = src.replace(/\.(jpg|jpeg|png)$/, '-optimized.$1');
  const smallSrc = src.replace(/\.(jpg|jpeg|png)$/, '-small.$1');
  
  const handleError = () => {
    setImageError(true);
  };
  
  if (imageError) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
        onError={handleError}
      />
    );
  }
  
  return (
    <picture>
      {/* WebP para navegadores modernos */}
      <source 
        srcSet={`${webpSrc} 800w, ${webpSrc} 400w`}
        sizes={sizes}
        type="image/webp"
      />
      
      {/* JPEG otimizado como fallback */}
      <source 
        srcSet={`${optimizedSrc} 800w, ${smallSrc} 400w`}
        sizes={sizes}
        type="image/jpeg"
      />
      
      {/* Imagem padrão */}
      <img
        src={optimizedSrc}
        alt={alt}
        className={className}
        loading={priority ? "eager" : "lazy"}
        onError={handleError}
      />
    </picture>
  );
}