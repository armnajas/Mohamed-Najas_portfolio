import React from 'react';
import { motion } from 'framer-motion';
import useImageLoader from '../hooks/useImageLoader';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = null,
  loading = 'lazy',
  showPlaceholder = true,
  ...props 
}) => {
  const { imageLoaded, imageError, imageSrc } = useImageLoader(src);
  const { imageLoaded: fallbackLoaded, imageError: fallbackError, imageSrc: fallbackImageSrc } = useImageLoader(fallbackSrc);

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 }
    }
  };

  const placeholderVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  // If main image failed, try fallback
  if (imageError && fallbackSrc && !fallbackError && fallbackLoaded && fallbackImageSrc) {
    return (
      <motion.img
        src={fallbackImageSrc}
        alt={alt}
        className={className}
        loading={loading}
        variants={imageVariants}
        initial="hidden"
        animate="visible"
        {...props}
      />
    );
  }

  // If both main and fallback failed, show placeholder
  if (imageError && (!fallbackSrc || fallbackError) && showPlaceholder) {
    return (
      <motion.div 
        className={`image-placeholder ${className}`}
        variants={placeholderVariants}
        initial="hidden"
        animate="visible"
        style={{
          background: 'linear-gradient(135deg, #1a1f26 0%, #252b33 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#8b92a5',
          fontSize: '0.9rem',
          minHeight: '100px'
        }}
        {...props}
      >
        Image not available
      </motion.div>
    );
  }

  return (
    <>
      {!imageLoaded && (
        <motion.div 
          className={`image-loading ${className}`}
          variants={placeholderVariants}
          initial="hidden"
          animate="visible"
          style={{
            background: 'linear-gradient(135deg, #1a1f26 0%, #252b33 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          {...props}
        >
          <div className="loading-spinner" style={{
            width: '20px',
            height: '20px',
            border: '2px solid #252b33',
            borderTop: '2px solid #00d4ff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </motion.div>
      )}
      
      {imageSrc && (
        <motion.img
          src={imageSrc}
          alt={alt}
          className={className}
          loading={loading}
          variants={imageVariants}
          initial="hidden"
          animate={imageLoaded ? "visible" : "hidden"}
          style={{ display: imageLoaded ? 'block' : 'none' }}
          {...props}
        />
      )}
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default OptimizedImage;
