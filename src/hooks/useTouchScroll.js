import { useRef, useCallback, useEffect } from 'react';

const useTouchScroll = (options = {}) => {
  const {
    autoPlay = true, // eslint-disable-line no-unused-vars
    direction = 'right', // eslint-disable-line no-unused-vars
    speed = 1,
    pauseOnHover = true,
    pauseOnTouch = true
  } = options;

  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const isTouchingRef = useRef(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const lastTouchX = useRef(0);
  const velocityRef = useRef(0);
  const lastTimeRef = useRef(0);
  const isPausedRef = useRef(false);
  const manualOffsetRef = useRef(0);

  const startAnimation = useCallback(() => {
    if (!containerRef.current || isPausedRef.current) return;

    const container = containerRef.current;
    const track = container.querySelector('.certificates-track, .certificates-track-reverse');
    if (!track) return;

    // Only disable CSS animations if we're manually controlling
    if (isTouchingRef.current || Math.abs(velocityRef.current) > 0.1) {
      track.style.animation = 'none';
      track.style.animationPlayState = 'paused';
    } else {
      // Re-enable CSS animations for automatic movement
      track.style.animation = '';
      track.style.animationPlayState = 'running';
      return; // Let CSS handle the animation
    }

    const trackWidth = track.scrollWidth;
    const containerWidth = container.offsetWidth;
    const maxScroll = trackWidth - containerWidth;

    let currentPosition = manualOffsetRef.current;

    const animate = () => {
      if (isPausedRef.current || isTouchingRef.current) {
        animationRef.current = requestAnimationFrame(animate);
        return;
      }

      // Apply velocity-based movement
      const velocity = velocityRef.current;
      if (Math.abs(velocity) > 0.1) {
        currentPosition += velocity * 0.5; // Adjust multiplier for sensitivity
        velocityRef.current *= 0.95; // Decay velocity
      } else {
        // Switch back to CSS animation
        track.style.animation = '';
        track.style.animationPlayState = 'running';
        track.style.transform = '';
        return;
      }

      // Handle wrapping
      if (currentPosition > maxScroll) {
        currentPosition = 0;
      } else if (currentPosition < 0) {
        currentPosition = maxScroll;
      }

      track.style.transform = `translateX(-${currentPosition}px)`;
      manualOffsetRef.current = currentPosition;

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
  }, [direction, speed]);

  const stopAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const pauseAnimation = useCallback(() => {
    isPausedRef.current = true;
    const container = containerRef.current;
    const track = container?.querySelector('.certificates-track, .certificates-track-reverse');
    if (track) {
      track.style.animationPlayState = 'paused';
    }
  }, []);

  const resumeAnimation = useCallback(() => {
    isPausedRef.current = false;
    const container = containerRef.current;
    const track = container?.querySelector('.certificates-track, .certificates-track-reverse');
    if (track) {
      track.style.animationPlayState = 'running';
    }
    if (!animationRef.current) {
      startAnimation();
    }
  }, [startAnimation]);

  const handleTouchStart = useCallback((e) => {
    if (!pauseOnTouch) return;

    isTouchingRef.current = true;
    pauseAnimation();

    const touch = e.touches[0];
    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
    lastTouchX.current = touch.clientX;
    lastTimeRef.current = Date.now();
    velocityRef.current = 0;
  }, [pauseOnTouch, pauseAnimation]);

  const handleTouchMove = useCallback((e) => {
    if (!isTouchingRef.current || !pauseOnTouch) return;

    e.preventDefault();

    const touch = e.touches[0];
    const currentX = touch.clientX;
    const currentTime = Date.now();
    const deltaX = currentX - lastTouchX.current;
    const deltaTime = currentTime - lastTimeRef.current;

    // Calculate velocity
    if (deltaTime > 0) {
      const velocity = deltaX / deltaTime;
      velocityRef.current = velocity * 2000; // Scale for better sensitivity
    }

    // Apply immediate movement
    const container = containerRef.current;
    const track = container?.querySelector('.certificates-track, .certificates-track-reverse');
    if (track) {
      // Disable CSS animation during touch
      track.style.animation = 'none';
      track.style.animationPlayState = 'paused';
      
      const currentTransform = track.style.transform;
      const currentTranslate = currentTransform.includes('translateX') 
        ? parseFloat(currentTransform.match(/translateX\(-?(\d+\.?\d*)px\)/)?.[1] || 0)
        : manualOffsetRef.current;
      
      const newPosition = currentTranslate - deltaX;
      track.style.transform = `translateX(-${newPosition}px)`;
      manualOffsetRef.current = newPosition;
    }

    lastTouchX.current = currentX;
    lastTimeRef.current = currentTime;
  }, [pauseOnTouch]);

  const handleTouchEnd = useCallback(() => {
    if (!isTouchingRef.current || !pauseOnTouch) return;

    isTouchingRef.current = false;
    
    // Resume animation after a short delay
    setTimeout(() => {
      const container = containerRef.current;
      const track = container?.querySelector('.certificates-track, .certificates-track-reverse');
      if (track) {
        // Re-enable CSS animation if not manually controlled
        if (Math.abs(velocityRef.current) < 0.1) {
          track.style.animation = '';
          track.style.animationPlayState = 'running';
          track.style.transform = '';
        }
      }
      resumeAnimation();
    }, 100);
  }, [pauseOnTouch, resumeAnimation]);

  const handleMouseDown = useCallback((e) => { // eslint-disable-line no-unused-vars
    if (e.button !== 0) return; // Only left mouse button
    
    isTouchingRef.current = true;
    pauseAnimation();

    touchStartX.current = e.clientX;
    touchStartY.current = e.clientY;
    lastTouchX.current = e.clientX;
    lastTimeRef.current = Date.now();
    velocityRef.current = 0;
  }, [pauseAnimation]);

  const handleMouseMove = useCallback((e) => { // eslint-disable-line no-unused-vars
    if (!isTouchingRef.current) return;

    e.preventDefault();

    const currentX = e.clientX;
    const currentTime = Date.now();
    const deltaX = currentX - lastTouchX.current;
    const deltaTime = currentTime - lastTimeRef.current;

    // Calculate velocity
    if (deltaTime > 0) {
      const velocity = deltaX / deltaTime;
      velocityRef.current = velocity * 2000; // Scale for better sensitivity
    }

    // Apply immediate movement
    const container = containerRef.current;
    const track = container?.querySelector('.certificates-track, .certificates-track-reverse');
    if (track) {
      // Disable CSS animation during drag
      track.style.animation = 'none';
      track.style.animationPlayState = 'paused';
      
      const currentTransform = track.style.transform;
      const currentTranslate = currentTransform.includes('translateX') 
        ? parseFloat(currentTransform.match(/translateX\(-?(\d+\.?\d*)px\)/)?.[1] || 0)
        : manualOffsetRef.current;
      
      const newPosition = currentTranslate - deltaX;
      track.style.transform = `translateX(-${newPosition}px)`;
      manualOffsetRef.current = newPosition;
    }

    lastTouchX.current = currentX;
    lastTimeRef.current = currentTime;
  }, []);

  const handleMouseUp = useCallback(() => { // eslint-disable-line no-unused-vars
    if (!isTouchingRef.current) return;

    isTouchingRef.current = false;
    
    // Resume animation after a short delay
    setTimeout(() => {
      const container = containerRef.current;
      const track = container?.querySelector('.certificates-track, .certificates-track-reverse');
      if (track) {
        // Re-enable CSS animation if not manually controlled
        if (Math.abs(velocityRef.current) < 0.1) {
          track.style.animation = '';
          track.style.animationPlayState = 'running';
          track.style.transform = '';
        }
      }
      resumeAnimation();
    }, 100);
  }, [resumeAnimation]);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) {
      pauseAnimation();
    }
  }, [pauseOnHover, pauseAnimation]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) {
      resumeAnimation();
    }
  }, [pauseOnHover, resumeAnimation]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Add event listeners
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Add global mouse up listener to handle mouse release outside container
    const handleGlobalMouseUp = () => {
      if (isTouchingRef.current) {
        handleMouseUp();
      }
    };

    document.addEventListener('mouseup', handleGlobalMouseUp);

    // Start animation if autoPlay is enabled
    if (autoPlay) {
      startAnimation();
    }

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      stopAnimation();
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, handleMouseDown, handleMouseMove, handleMouseUp, handleMouseEnter, handleMouseLeave, autoPlay, startAnimation, stopAnimation]);

  return {
    containerRef,
    startAnimation,
    stopAnimation,
    pauseAnimation,
    resumeAnimation
  };
};

export default useTouchScroll;
