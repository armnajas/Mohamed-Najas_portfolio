import { useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const useSmoothScroll = () => {
  const lenisRef = useRef(null);
  const rafIdRef = useRef(null);
  const [isLenisEnabled, setIsLenisEnabled] = useState(false);

  useEffect(() => {
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const coarsePointerQuery = window.matchMedia('(pointer: coarse)');

    const evaluateShouldEnable = () => {
      const prefersReducedMotion = reducedMotionQuery.matches;
      const isCoarsePointer = coarsePointerQuery.matches;
      const isSmallViewport = window.innerWidth < 1024;

      // Disable Lenis on touch devices, small screens, or when reduced motion is preferred
      const shouldEnable = !prefersReducedMotion && !isCoarsePointer && !isSmallViewport;

      setIsLenisEnabled(shouldEnable);
    };

    evaluateShouldEnable();

    reducedMotionQuery.addEventListener('change', evaluateShouldEnable);
    coarsePointerQuery.addEventListener('change', evaluateShouldEnable);
    window.addEventListener('resize', evaluateShouldEnable);

    return () => {
      reducedMotionQuery.removeEventListener('change', evaluateShouldEnable);
      coarsePointerQuery.removeEventListener('change', evaluateShouldEnable);
      window.removeEventListener('resize', evaluateShouldEnable);
    };
  }, []);

  useEffect(() => {
    if (!isLenisEnabled) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      if (rafIdRef.current) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      return;
    }

    // Initialize Lenis smooth scroll
    const lenis = new Lenis({
      duration: 0.8, // Faster duration for better performance
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)), // Simplified easing
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 0.8, // Reduced mouse sensitivity
      smoothTouch: false, // Disable smooth touch for mobile performance
      touchMultiplier: 1, // Reduced touch multiplier
      infinite: false,
    });

    lenisRef.current = lenis;

    // Connect Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // Optimized GSAP integration
    const tick = (time) => {
      lenis.raf(time);
      rafIdRef.current = window.requestAnimationFrame(tick);
    };

    rafIdRef.current = window.requestAnimationFrame(tick);

    // Cleanup
    return () => {
      lenis.destroy();
      if (rafIdRef.current) {
        window.cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [isLenisEnabled]);

  const scrollTo = (target, options = {}) => {
    if (lenisRef.current) {
      if (!isLenisEnabled) {
        // If Lenis is disabled after initialization, fall back to native scroll
        if (typeof target === 'object' && target instanceof HTMLElement) {
          const offset = options.offset || 0;
          const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition + offset,
            behavior: options.immediate ? 'auto' : 'smooth'
          });
        } else if (typeof target === 'number') {
          window.scrollTo({
            top: target,
            behavior: options.immediate ? 'auto' : 'smooth'
          });
        }
        return;
      }
      
      // Handle different target types
      if (typeof target === 'object' && target instanceof HTMLElement) {
        // If target is an element, let Lenis handle it directly
        try {
          lenisRef.current.scrollTo(target, {
            duration: options.duration || 1.2,
            offset: options.offset || 0,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
            ...options
          });
        } catch (error) {
          console.error('Lenis scrollTo error:', error);
          // Fallback to native scroll
          const offset = options.offset || 0;
          const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition + offset,
            behavior: 'smooth'
          });
        }
      } else if (typeof target === 'number') {
        // If target is a number, use it directly
        try {
          lenisRef.current.scrollTo(target, {
            duration: options.duration || 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
            ...options
          });
        } catch (error) {
          console.error('Lenis scrollTo error:', error);
          // Fallback to native scroll
          window.scrollTo({
            top: target,
            behavior: 'smooth'
          });
        }
      } else if (target === 0) {
        // Scroll to top
        try {
          lenisRef.current.scrollTo(0, {
            duration: options.duration || 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -8 * t)),
            ...options
          });
        } catch (error) {
          console.error('Lenis scrollTo error:', error);
          // Fallback to native scroll
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      }
    } else {
      // Fallback to native scroll if Lenis isn't ready
      if (typeof target === 'object' && target instanceof HTMLElement) {
        const offset = options.offset || 0;
        const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({
          top: elementPosition + offset,
          behavior: 'smooth'
        });
      } else if (typeof target === 'number') {
        window.scrollTo({
          top: target,
          behavior: 'smooth'
        });
      }
    }
  };

  const scrollToTop = () => {
    scrollTo(0, { duration: 2 });
  };

  return { scrollTo, scrollToTop, lenis: lenisRef };
};

export default useSmoothScroll;
