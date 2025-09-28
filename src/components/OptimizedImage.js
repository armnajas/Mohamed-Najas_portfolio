import React from 'react';
import { motion } from 'framer-motion';
import useImageLoader from '../hooks/useImageLoader';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  fallbackSrc = '/placeholder.jpg',
  loading = 'lazy',
  ...props 
}) => {
  const { imageLoaded, imageError } = useImageLoader(src);

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

  if (imageError) {
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
          fontSize: '0.9rem'
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
      
      <motion.img
        src={src}
        alt={alt}
        className={className}
        loading={loading}
        variants={imageVariants}
        initial="hidden"
        animate={imageLoaded ? "visible" : "hidden"}
        style={{ display: imageLoaded ? 'block' : 'none' }}
        {...props}
      />
      
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
