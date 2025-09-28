import { useRef, useEffect, useState } from 'react';
import { workExperience } from '../data/portfolioData';
import AppleTextReveal from './AppleTextReveal';
import ParallaxContainer from './ParallaxContainer';

const Experience = () => {
  const roadmapRef = useRef(null);
  const [visibleCards, setVisibleCards] = useState(new Set());

  // Intersection Observer for repeating intro animations - triggers every time
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cardId = entry.target.getAttribute('data-card-id');
          if (cardId) {
            if (entry.isIntersecting) {
              // Add card to visible set to trigger animation
              setVisibleCards(prev => new Set([...prev, parseInt(cardId)]));
            } else {
              // Remove card from visible set when out of view to allow re-triggering
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
        threshold: 0.2,
        rootMargin: '50px'
      }
    );

    // Delay observer setup to ensure DOM elements are rendered
    const setupObserver = () => {
      const roadmapItems = document.querySelectorAll('.experience-roadmap-item');
      if (roadmapItems.length > 0) {
        roadmapItems.forEach((item) => observer.observe(item));
      } else {
        // Retry after a short delay if elements not found
        setTimeout(setupObserver, 100);
      }
    };

    // Setup observer after component renders
    setTimeout(setupObserver, 100);

    return () => {
      const roadmapItems = document.querySelectorAll('.experience-roadmap-item');
      roadmapItems.forEach(item => observer.unobserve(item));
    };
  }, []);

  return (
    <section id="experience" className="experience-journey-section">
      <ParallaxContainer speed={0.2}>
        <AppleTextReveal
          className="section-title"
          animationType="words"
          stagger={0.1}
        >
          &lt;Work Experience /&gt;
        </AppleTextReveal>
      </ParallaxContainer>
      <div className="journey-container">
        <div className="curved-roadmap" ref={roadmapRef}>
          {/* Clean Animated Vertical Line */}
          <div className="vertical-line"></div>

          {/* Experience Items */}
          <div className="roadmap-items">
            {workExperience.map((job, index) => {
              const isVisible = visibleCards.has(job.id);
              const animationSide = 'intro-from-right'; // All cards come from right

              return (
                <div
                  key={job.id}
                  className={`experience-roadmap-item roadmap-item right item-${index + 1} ${isVisible ? 'intro-visible' : 'intro-hidden'} ${animationSide}`}
                  data-card-id={job.id}
                  style={{ '--delay': `${index * 0.3}s` }}
                >
                <div className="roadmap-connector">
                  <div className="roadmap-node">
                    <div className="node-inner">
                      <i className="fas fa-briefcase"></i>
                    </div>
                    <div className="node-pulse"></div>
                  </div>
                </div>

                <div className="roadmap-content">
                  <div className="roadmap-card">
                    <div className="card-header">
                      <h3>{job.title}</h3>
                      <span className="roadmap-date">{job.period}</span>
                    </div>
                    <h4 className="company-name">{job.company}</h4>
                    <p className="card-description">
                      Duration: {job.duration} • Status: {job.status}
                    </p>
                    <div className="experience-responsibilities">
                      <ul>
                        {job.responsibilities.map((responsibility, idx) => (
                          <li key={idx}>{responsibility}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              );
            })}
          </div>

          {/* Floating Particles */}
          <div className="roadmap-particles">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="particle"
                style={{
                  '--delay': `${i * 0.5}s`,
                  '--duration': `${3 + i * 0.5}s`
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
