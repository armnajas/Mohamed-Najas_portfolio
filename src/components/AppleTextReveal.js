import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AppleTextReveal = ({ 
  children, 
  className = '', 
  animationType = 'words', // 'words', 'chars', 'lines'
  stagger = 0.05,
  duration = 0.8,
  delay = 0,
  trigger,
  start = "top 85%",
  end = "bottom 15%",
  scrub = false,
  ...props 
}) => {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    const element = textRef.current;
    const text = element.textContent;
    
    // Clear the element
    element.innerHTML = '';

    let spans = [];

    if (animationType === 'words') {
      const words = text.split(' ').filter(word => word.trim() !== '');
      spans = words.map((word, index) => {
        const span = document.createElement('span');
        span.className = 'word-reveal';
        span.style.cssText = `
          display: inline-block;
          overflow: hidden;
          vertical-align: top;
        `;

        const innerSpan = document.createElement('span');
        innerSpan.textContent = word;
        innerSpan.style.cssText = `
          display: inline-block;
          transform: translateY(100%);
          opacity: 0;
        `;

        span.appendChild(innerSpan);
        element.appendChild(span);

        // Add space after each word except the last one
        if (index < words.length - 1) {
          const spaceNode = document.createTextNode(' ');
          element.appendChild(spaceNode);
        }

        return innerSpan;
      });
    } else if (animationType === 'chars') {
      const chars = text.split('');
      spans = chars.map(char => {
        const span = document.createElement('span');
        span.className = 'char-reveal';
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.cssText = `
          display: inline-block;
          transform: translateY(100%) rotateX(90deg);
          opacity: 0;
          transform-origin: center bottom;
        `;
        element.appendChild(span);
        return span;
      });
    } else if (animationType === 'lines') {
      const lines = text.split('\n');
      spans = lines.map((line, index) => {
        const span = document.createElement('span');
        span.className = 'line-reveal';
        span.textContent = line;
        span.style.cssText = `
          display: block;
          overflow: hidden;
          transform: translateY(100%);
          opacity: 0;
        `;
        element.appendChild(span);
        if (index < lines.length - 1) {
          element.appendChild(document.createElement('br'));
        }
        return span;
      });
    }

    // Apple-style animation
    const animation = gsap.to(spans, {
      y: 0,
      rotateX: 0,
      opacity: 1,
      duration,
      delay,
      stagger: {
        amount: stagger * spans.length,
        ease: "power2.out"
      },
      ease: "power3.out",
      scrollTrigger: {
        trigger: trigger || element,
        start,
        end,
        scrub,
        toggleActions: "restart none none reverse"
      }
    });

    return () => {
      animation.kill();
    };
  }, [children, animationType, stagger, duration, delay, trigger, start, end, scrub]);

  return (
    <div ref={textRef} className={className} {...props}>
      {children}
    </div>
  );
};

export default AppleTextReveal;
