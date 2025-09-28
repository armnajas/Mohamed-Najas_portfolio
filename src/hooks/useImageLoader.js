import { useState, useEffect } from 'react';

const useImageLoader = (src) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (!src) {
      setImageError(true);
      return;
    }

    // Reset states when src changes
    setImageLoaded(false);
    setImageError(false);

    const img = new Image();
    
    img.onload = () => {
      setImageLoaded(true);
      setImageError(false);
    };
    
    img.onerror = () => {
      console.warn(`Failed to load image: ${src}`);
      setImageLoaded(false);
      setImageError(true);
    };

    // Handle path resolution for development vs production
    let imageSrc = src;
    
    // If in development and src starts with /, use process.env.PUBLIC_URL
    if (process.env.NODE_ENV === 'development' && src.startsWith('/')) {
      imageSrc = process.env.PUBLIC_URL + src;
    }
    
    img.src = imageSrc;
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { imageLoaded, imageError };
};

export default useImageLoader;
