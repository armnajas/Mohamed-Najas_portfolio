import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skills } from '../data/portfolioData';
import AppleTextReveal from './AppleTextReveal';
import ParallaxContainer from './ParallaxContainer';

gsap.registerPlugin(ScrollTrigger);

const Skills = () => {
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || !gridRef.current) return;

    const cards = gridRef.current.querySelectorAll('.skill-card');

    // Apple-style staggered card animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 60%",
        end: "bottom 40%",
        toggleActions: "play none none reverse"
      }
    });

    cards.forEach((card, index) => {
      // Card entrance animation
      tl.fromTo(card,
        {
          y: 15,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.3,
          ease: "power1.out"
        }, index * 0.03
      );

      // No individual skill item animations - only main card animation

      // Enhanced hover effect setup
      const handleMouseEnter = () => {
        gsap.to(card, {
          y: -16,
          scale: 1.03,
          rotationY: -2,
          rotationX: 3,
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.6), 0 0 60px rgba(66, 133, 244, 0.4)",
          duration: 0.4,
          ease: "power3.out"
        });

        // Animate list items on card hover
        const listItems = card.querySelectorAll('li');
        gsap.to(listItems, {
          x: 8,
          stagger: 0.05,
          duration: 0.3,
          ease: "power2.out"
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          rotationY: 0,
          rotationX: 0,
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(66, 133, 244, 0.1)",
          duration: 0.4,
          ease: "power3.out"
        });

        // Reset list items
        const listItems = card.querySelectorAll('li');
        gsap.to(listItems, {
          x: 0,
          stagger: 0.03,
          duration: 0.3,
          ease: "power2.out"
        });
      };

      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      tl.kill();
      cards.forEach(card => {
        card.removeEventListener('mouseenter', () => {});
        card.removeEventListener('mouseleave', () => {});
      });
    };
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="skills-section">
      <ParallaxContainer speed={0.3}>
        <AppleTextReveal
          className="section-title"
          animationType="words"
          stagger={0.1}
        >
          &lt;Technical Skills /&gt;
        </AppleTextReveal>
      </ParallaxContainer>

      <div ref={gridRef} className="skills-grid">
        {skills.map((skillGroup, index) => (
          <div key={skillGroup.category} className="skill-card" data-card-index={index}>
            <h4>
              <span className="category-title">{skillGroup.category}</span>
            </h4>
            <ul className="skill-list">
              {skillGroup.items.map((item, itemIndex) => (
                <li key={item} className="skill-item" data-skill-index={itemIndex}>
                  <span className="skill-name">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
