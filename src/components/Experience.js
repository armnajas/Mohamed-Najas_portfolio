import { useRef, useEffect, useState } from 'react';
import { workExperience } from '../data/portfolioData';
import AppleTextReveal from './AppleTextReveal';
import ParallaxContainer from './ParallaxContainer';
import ExperienceCard from './ExperienceCard';

const Experience = () => {
  const containerRef = useRef(null);
  const [visibleCards, setVisibleCards] = useState(new Set());

  // Intersection Observer for card animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cardId = entry.target.getAttribute('data-card-id');
          if (cardId) {
            if (entry.isIntersecting) {
              setVisibleCards(prev => new Set([...prev, parseInt(cardId)]));
            } else {
              setVisibleCards(prev => {
                const newSet = new Set(prev);
                newSet.delete(parseInt(cardId));
                return newSet;
              });
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    const setupObserver = () => {
      const cardElements = document.querySelectorAll('.experience-card-wrapper');
      if (cardElements.length > 0) {
        cardElements.forEach((item) => observer.observe(item));
      } else {
        setTimeout(setupObserver, 100);
      }
    };

    setTimeout(setupObserver, 100);

    return () => {
      const cardElements = document.querySelectorAll('.experience-card-wrapper');
      cardElements.forEach(item => observer.unobserve(item));
    };
  }, []);

  return (
    <section id="experience" className="experience-section">
      <ParallaxContainer speed={0.2}>
        <AppleTextReveal
          className="section-title"
          animationType="words"
          stagger={0.1}
        >
          &lt;Work Experience /&gt;
        </AppleTextReveal>
      </ParallaxContainer>
      
      <div className="experience-container" ref={containerRef}>
        <div className="experience-cards-grid">
          {workExperience.map((job, index) => {
            const isVisible = visibleCards.has(job.id);
            
            return (
              <div
                key={job.id}
                className={`experience-card-wrapper ${isVisible ? 'card-visible' : 'card-hidden'}`}
                data-card-id={job.id}
                style={{ 
                  '--delay': `${index * 0.2}s`,
                  '--index': index 
                }}
              >
                <ExperienceCard experience={job} index={index} />
              </div>
            );
          })}
        </div>
        
        {/* Background decorative elements */}
        <div className="experience-bg-elements">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-particle"
              style={{
                '--delay': `${i * 0.8}s`,
                '--duration': `${4 + i * 0.3}s`
              }}
            ></div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
