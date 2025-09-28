import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { skills } from '../data/portfolioData';
import AppleTextReveal from './AppleTextReveal';
import ParallaxContainer from './ParallaxContainer';

gsap.registerPlugin(ScrollTrigger);

const Skills = () => {
  const sectionRef = useRef(null);
  const skillsContainerRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || !skillsContainerRef.current) return;

    const categories = skillsContainerRef.current.querySelectorAll('.skill-category');
    const skillTags = skillsContainerRef.current.querySelectorAll('.skill-tag');

    // Apple-style staggered animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 60%",
        end: "bottom 40%",
        toggleActions: "play none none reverse"
      }
    });

    // Animate categories first
    categories.forEach((category, index) => {
      tl.fromTo(category,
        {
          y: 20,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out"
        }, index * 0.1
      );
    });

    // Then animate skill tags with stagger
    tl.fromTo(skillTags,
      {
        y: 15,
        opacity: 0,
        scale: 0.9
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "power2.out",
        stagger: 0.02
      }, "-=0.2"
    );

    // Enhanced hover effects for skill tags
    skillTags.forEach(tag => {
      const handleMouseEnter = () => {
        gsap.to(tag, {
          scale: 1.05,
          y: -3,
          boxShadow: "0 8px 25px rgba(66, 133, 244, 0.4), 0 0 20px rgba(66, 133, 244, 0.2)",
          duration: 0.3,
          ease: "power2.out"
        });
      };

      const handleMouseLeave = () => {
        gsap.to(tag, {
          scale: 1,
          y: 0,
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2), 0 0 10px rgba(66, 133, 244, 0.1)",
          duration: 0.3,
          ease: "power2.out"
        });
      };

      tag.addEventListener('mouseenter', handleMouseEnter);
      tag.addEventListener('mouseleave', handleMouseLeave);
    });

    return () => {
      tl.kill();
      skillTags.forEach(tag => {
        tag.removeEventListener('mouseenter', () => {});
        tag.removeEventListener('mouseleave', () => {});
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

      <div ref={skillsContainerRef} className="skills-container">
        {skills.map((skillGroup, groupIndex) => (
          <div key={skillGroup.category} className="skill-category" data-category-index={groupIndex}>
            <h4 className="category-title">
              <span className="category-icon">
                {groupIndex === 0 && <i className="fas fa-code"></i>}
                {groupIndex === 1 && <i className="fas fa-shield-alt"></i>}
                {groupIndex === 2 && <i className="fas fa-tools"></i>}
              </span>
              {skillGroup.category}
            </h4>
            <div className="skills-tags">
              {skillGroup.items.map((skill, skillIndex) => (
                <span 
                  key={skill} 
                  className="skill-tag" 
                  data-skill-index={skillIndex}
                  data-category={groupIndex}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
