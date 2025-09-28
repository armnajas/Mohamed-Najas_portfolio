import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ParallaxContainer = ({ 
  children, 
  className = '',
  speed = 0.5,
  direction = 'vertical', // 'vertical', 'horizontal'
  scale = false,
  rotate = false,
  opacity = false,
  ...props 
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const animations = {};

    // Parallax movement
    if (direction === 'vertical') {
      animations.yPercent = -50 * speed;
    } else if (direction === 'horizontal') {
      animations.xPercent = -50 * speed;
    }

    // Scale effect
    if (scale) {
      animations.scale = 1 + (speed * 0.2);
    }

    // Rotation effect
    if (rotate) {
      animations.rotation = 360 * speed;
    }

    // Opacity effect
    if (opacity) {
      animations.opacity = Math.max(0.3, 1 - speed);
    }

    const animation = gsap.to(element, {
      ...animations,
      ease: "none",
      scrollTrigger: {
        trigger: element,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });

    return () => {
      animation.kill();
    };
  }, [speed, direction, scale, rotate, opacity]);

  return (
    <div
      ref={containerRef}
      className={`parallax-container ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default ParallaxContainer;
