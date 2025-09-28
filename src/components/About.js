import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { aboutInfo } from '../data/portfolioData';
import AppleTextReveal from './AppleTextReveal';
import ParallaxContainer from './ParallaxContainer';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef(null);
  const profileRef = useRef(null);
  const languagesRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Apple-style section reveal
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        end: "bottom 30%",
        toggleActions: "play none none reverse"
      }
    });

    // Profile section animation - "appearing from shadow" effect
    if (profileRef.current) {
      tl.fromTo(profileRef.current,
        {
          y: 80,
          opacity: 0,
          rotationX: 20,
          scale: 0.9,
          filter: "blur(10px)",
          boxShadow: "0 0 0 rgba(0, 0, 0, 0)"
        },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          scale: 1,
          filter: "blur(0px)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4), 0 8px 32px rgba(66, 133, 244, 0.1), 0 0 0 1px rgba(66, 133, 244, 0.2)",
          duration: 1.2,
          ease: "power3.out",
          clearProps: "transform,filter" // Clear transform to allow CSS hover effects
        }
      );
    }

    // Languages section animation - identical "appearing from shadow" effect
    if (languagesRef.current) {
      tl.fromTo(languagesRef.current,
        {
          y: 80,
          opacity: 0,
          rotationX: 20,
          scale: 0.9,
          filter: "blur(10px)",
          boxShadow: "0 0 0 rgba(0, 0, 0, 0)"
        },
        {
          y: 0,
          opacity: 1,
          rotationX: 0,
          scale: 1,
          filter: "blur(0px)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4), 0 8px 32px rgba(66, 133, 244, 0.1), 0 0 0 1px rgba(66, 133, 244, 0.2)",
          duration: 1.2,
          ease: "power3.out",
          clearProps: "transform,filter" // Clear transform to allow CSS hover effects
        },
        "-=0.8" // Slight overlap with profile animation for staggered effect
      );
    }

    // Add hover effect handlers for both cards
    if (profileRef.current && languagesRef.current) {
      const profileCard = profileRef.current;
      const languagesCard = languagesRef.current;

      // Profile card hover
      profileCard.addEventListener('mouseenter', () => {
        gsap.to(profileCard, {
          y: -12,
          scale: 1.015,
          rotationX: 2,
          borderColor: "rgba(66, 133, 244, 0.7)",
          backgroundColor: "rgba(13, 17, 23, 0.9)",
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.5), 0 12px 40px rgba(66, 133, 244, 0.2), 0 0 0 1px rgba(66, 133, 244, 0.5), 0 0 40px rgba(66, 133, 244, 0.15), inset 0 1px 0 rgba(240, 246, 252, 0.15), inset 0 -1px 0 rgba(0, 0, 0, 0.25)",
          duration: 0.6,
          ease: "cubic-bezier(0.23, 1, 0.32, 1)"
        });
      });

      profileCard.addEventListener('mouseleave', () => {
        gsap.to(profileCard, {
          y: 0,
          scale: 1,
          rotationX: 0,
          borderColor: "rgba(66, 133, 244, 0.4)",
          backgroundColor: "rgba(13, 17, 23, 0.85)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4), 0 8px 32px rgba(66, 133, 244, 0.1), 0 0 0 1px rgba(66, 133, 244, 0.2), inset 0 1px 0 rgba(240, 246, 252, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.2)",
          duration: 0.6,
          ease: "cubic-bezier(0.23, 1, 0.32, 1)"
        });
      });

      // Languages card hover - identical to profile card
      languagesCard.addEventListener('mouseenter', () => {
        gsap.to(languagesCard, {
          y: -12,
          scale: 1.015,
          rotationX: 2,
          borderColor: "rgba(66, 133, 244, 0.7)",
          backgroundColor: "rgba(13, 17, 23, 0.9)",
          boxShadow: "0 30px 80px rgba(0, 0, 0, 0.5), 0 12px 40px rgba(66, 133, 244, 0.2), 0 0 0 1px rgba(66, 133, 244, 0.5), 0 0 40px rgba(66, 133, 244, 0.15), inset 0 1px 0 rgba(240, 246, 252, 0.15), inset 0 -1px 0 rgba(0, 0, 0, 0.25)",
          duration: 0.6,
          ease: "cubic-bezier(0.23, 1, 0.32, 1)"
        });
      });

      languagesCard.addEventListener('mouseleave', () => {
        gsap.to(languagesCard, {
          y: 0,
          scale: 1,
          rotationX: 0,
          borderColor: "rgba(66, 133, 244, 0.4)",
          backgroundColor: "rgba(13, 17, 23, 0.85)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.4), 0 8px 32px rgba(66, 133, 244, 0.1), 0 0 0 1px rgba(66, 133, 244, 0.2), inset 0 1px 0 rgba(240, 246, 252, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.2)",
          duration: 0.6,
          ease: "cubic-bezier(0.23, 1, 0.32, 1)"
        });
      });
    }

    // Animate language content after the card intro
    if (languagesRef.current) {
      const langBars = languagesRef.current.querySelectorAll('.lang-item');

      // Animate the title
      tl.fromTo(languagesRef.current.querySelector('h3'),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.3"
      );

      // Animate language bars with stagger
      langBars.forEach((bar, index) => {
        const fill = bar.querySelector('.lang-fill');
        const span = bar.querySelector('.lang-name');

        if (span) {
          tl.fromTo(span,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out"
            }, `-=${0.6 - index * 0.1}`
          );
        }

        if (fill) {
          tl.fromTo(fill,
            { width: 0, scaleX: 0 },
            {
              width: `${aboutInfo.languages[index].level}%`,
              scaleX: 1,
              duration: 1.2,
              ease: "power2.out"
            }, `-=${0.4}`
          );
        }
      });
    }

    return () => {
      tl.kill();
    };
  }, []);



  return (
    <section
      ref={sectionRef}
      id="about"
      className="about-section"
    >
      <ParallaxContainer speed={0.2}>
        <AppleTextReveal
          className="section-title"
          animationType="words"
          stagger={0.1}
        >
          &lt;About Me /&gt;
        </AppleTextReveal>
      </ParallaxContainer>

      <div className="about-content">
        <div ref={profileRef} className="profile-card">
          <div className="profile-section">
            <h3 className="brand-green">Profile</h3>
            <div className="profile-text-container">
              <AppleTextReveal
                animationType="words"
                stagger={0.03}
                duration={0.8}
                className="profile-text-reveal"
              >
                {aboutInfo.profile}
              </AppleTextReveal>
            </div>
          </div>
        </div>

        <div ref={languagesRef} className="languages-card">
          <div className="languages-section">
            <h3 className="brand-green">Languages</h3>
            {aboutInfo.languages.map((lang) => (
              <div key={lang.name} className="lang-item">
                <div className="lang-name">{lang.name}</div>
                <div className="lang-progress">
                  <div
                    className="lang-fill"
                    style={{ width: `${lang.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
