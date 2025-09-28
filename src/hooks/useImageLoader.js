import { useState, useEffect } from 'react';

const useImageLoader = (src) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [processedSrc, setProcessedSrc] = useState('');

  useEffect(() => {
    if (!src) {
      setImageError(true);
      return;
    }

    // Reset states when src changes
    setImageLoaded(false);
    setImageError(false);
    setProcessedSrc('');

    const img = new Image();

    // Handle path resolution for development vs production
    let imageSrc = src;
    
    // For GitHub Pages deployment, prepend PUBLIC_URL for relative paths
    if (src.startsWith('/')) {
      // In development, PUBLIC_URL might be set but we want to use the dev server path
      if (process.env.NODE_ENV === 'development') {
        // Use the current origin + PUBLIC_URL for development
        imageSrc = window.location.origin + (process.env.PUBLIC_URL || '') + src;
      } else {
        // In production, use PUBLIC_URL
        imageSrc = (process.env.PUBLIC_URL || '') + src;
      }
    }
    
    console.log('🖼️ Loading image:', {
      originalSrc: src,
      finalSrc: imageSrc,
      PUBLIC_URL: process.env.PUBLIC_URL,
      NODE_ENV: process.env.NODE_ENV,
      origin: window.location.origin,
      startsWithSlash: src.startsWith('/'),
      isDevelopment: process.env.NODE_ENV === 'development'
    });
    
    // Set event handlers before setting src
    img.onload = () => {
      console.log('✅ Image loaded successfully:', imageSrc);
      setImageLoaded(true);
      setImageError(false);
    };

    img.onerror = () => {
      console.error('❌ Failed to load image:', imageSrc);
      setImageLoaded(false);
      setImageError(true);
    };
    
    img.src = imageSrc;
    setProcessedSrc(imageSrc);
    
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return { imageLoaded, imageError, imageSrc: processedSrc };
};

export default useImageLoader;
