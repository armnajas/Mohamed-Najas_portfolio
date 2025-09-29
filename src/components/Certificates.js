import React, { useRef, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { certificates, secondRowImages } from '../data/portfolioData';
import AppleTextReveal from './AppleTextReveal';
import ParallaxContainer from './ParallaxContainer';
import OptimizedImage from './OptimizedImage';
import useTouchScroll from '../hooks/useTouchScroll';

gsap.registerPlugin(ScrollTrigger);

const Certificates = () => {
  const sectionRef = useRef(null);
  const firstRowRef = useRef(null);
  const badgesRowRef = useRef(null);
  const [selectedCertificate, setSelectedCertificate] = useState(null);

  // Touch scroll functionality for certificates
  const certificatesTouchScroll = useTouchScroll({
    autoPlay: true,
    direction: 'right',
    speed: 0.2,
    pauseOnHover: true,
    pauseOnTouch: true
  });

  // Touch scroll functionality for badges
  const badgesTouchScroll = useTouchScroll({
    autoPlay: true,
    direction: 'left',
    speed: 0.15,
    pauseOnHover: true,
    pauseOnTouch: true
  });

  const openModal = (certificate) => {
    // Store current scroll position
    const scrollY = window.scrollY;

    // Store scroll position for restoration
    document.body.setAttribute('data-scroll-y', scrollY.toString());

    setSelectedCertificate(certificate);

    // Add modal-open class and apply styles
    document.body.classList.add('modal-open');
    document.body.style.top = `-${scrollY}px`;

    // Ensure modal centers properly by scrolling to top of modal overlay
    setTimeout(() => {
      const modalOverlay = document.querySelector('.certificate-modal-overlay');
      if (modalOverlay) {
        modalOverlay.scrollTop = 0;
      }
    }, 50);
  };

  const closeModal = () => {
    // Get the saved scroll position
    const savedScrollY = document.body.getAttribute('data-scroll-y');

    setSelectedCertificate(null);

    // Remove modal-open class and styles
    document.body.classList.remove('modal-open');
    document.body.style.top = '';

    // Restore scroll position smoothly
    if (savedScrollY) {
      const scrollPosition = parseInt(savedScrollY);
      window.scrollTo({
        top: scrollPosition,
        behavior: 'instant'
      });
      document.body.removeAttribute('data-scroll-y');
    }
  };



  // Increase duplications to ensure smooth scrolling
  const duplicatedCertificates = [...certificates, ...certificates, ...certificates, ...certificates];

  // Increase second row duplications to ensure smooth scrolling
  const secondRowDuplicationCount = secondRowImages.length < 5 ? 6 : 4;
  const duplicatedSecondRowImages = Array(secondRowDuplicationCount).fill(secondRowImages).flat();

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedCertificate) {
      // Prevent touch scrolling on mobile but allow modal scrolling
      const preventTouchMove = (e) => {
        // Allow scrolling within modal
        if (e.target.closest('.certificate-modal')) {
          return;
        }
        e.preventDefault();
      };

      const preventWheel = (e) => {
        // Allow scrolling within modal
        if (e.target.closest('.certificate-modal')) {
          return;
        }
        e.preventDefault();
      };

      document.addEventListener('touchmove', preventTouchMove, { passive: false });
      document.addEventListener('wheel', preventWheel, { passive: false });

      // Cleanup function only for removing event listeners when component unmounts
      return () => {
        document.removeEventListener('touchmove', preventTouchMove);
        document.removeEventListener('wheel', preventWheel);
      };
    }
  }, [selectedCertificate]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (selectedCertificate) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [selectedCertificate]);

  // Cleanup effect for modal
  useEffect(() => {
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, []);

  // Ensure animations are always running
  useEffect(() => {
    if (firstRowRef.current && badgesRowRef.current) {
      const firstTrack = firstRowRef.current;
      const badgesTrack = badgesRowRef.current;
      
      // Ensure animations are always running
      firstTrack.style.animationPlayState = 'running';
      badgesTrack.style.animationPlayState = 'running';
    }
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    // Apple-style section reveal animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        refreshPriority: -1
      }
    });

    // First row animation
    if (firstRowRef.current) {
      const firstRowCards = firstRowRef.current.querySelectorAll('.certificate-item');
      firstRowCards.forEach((card, index) => {
        tl.fromTo(card,
          {
            y: 60,
            opacity: 0,
            scale: 0.9,
            rotationY: 15
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotationY: 0,
            duration: 0.8,
            ease: "power3.out"
          }, index * 0.05
        );
      });
    }

    // Badge items animation - simplified movement only
    const badgeItems = badgesRowRef.current?.querySelectorAll('.second-row-image-item');
    if (badgeItems && badgeItems.length > 0) {
      gsap.set(badgeItems, {
        y: 10
      });

      ScrollTrigger.create({
        trigger: badgesRowRef.current,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => {
          gsap.to(badgeItems, {
            y: 0,
            duration: 0.3,
            ease: "power1.out",
            stagger: 0.02
          });
        },
        onLeave: () => {
          gsap.to(badgeItems, {
            y: 10,
            duration: 0.2,
            ease: "power1.in",
            stagger: 0.01
          });
        },
        onEnterBack: () => {
          gsap.to(badgeItems, {
            y: 0,
            duration: 0.3,
            ease: "power1.out",
            stagger: 0.02
          });
        },
        onLeaveBack: () => {
          gsap.to(badgeItems, {
            y: 10,
            duration: 0.2,
            ease: "power1.in",
            stagger: 0.01
          });
        }
      });
    } else {
      // Fallback: Set items to visible if no animation is needed
      if (badgeItems && badgeItems.length > 0) {
        gsap.set(badgeItems, {
          y: 0,
          opacity: 1,
          scale: 1
        });
      }
    }

    // Refresh ScrollTrigger on resize for responsiveness
    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      tl.kill();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section ref={sectionRef} id="certificates" className="certificates-section">
      <ParallaxContainer speed={0.2}>
        <AppleTextReveal
          className="section-title"
          animationType="words"
          stagger={0.1}
        >
          &lt;Certificates &amp; Badges /&gt;
        </AppleTextReveal>
      </ParallaxContainer>

      {/* First Row - Right to Left with Text */}
      <div className="certificates-wrapper">
        <div className="certificates-container">
          <div ref={firstRowRef} className="certificates-track">
            {duplicatedCertificates.map((cert, index) => (
              <div
                key={`${cert.id}-${index}`}
                className="certificate-item"
                onClick={() => openModal(cert)}
              >
                <OptimizedImage
                  src={cert.logo}
                  alt={`${cert.title} Certificate`}
                  className="certificate-logo"
                  loading="lazy"
                />
                <div className="certificate-info">
                  <h4>{cert.title}</h4>
                  <p>{cert.issuer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges Row - Left to Right with Different PNG Images */}
      <div className="badges-section">
        <ParallaxContainer speed={0.2}>
          <AppleTextReveal
            className="section-subtitle"
            animationType="words"
            stagger={0.1}
          >
            &lt;Badges /&gt;
          </AppleTextReveal>
        </ParallaxContainer>

        <div className="certificates-wrapper certificates-wrapper-reverse">
          <div className="certificates-container">
            <div ref={badgesRowRef} className="certificates-track certificates-track-reverse">
              {duplicatedSecondRowImages.map((item, index) => (
                <div key={`badge-${item.id}-${index}`} className="second-row-image-item">
                  <div className="second-row-image-container">
                    <OptimizedImage
                      src={item.image}
                      alt={item.alt}
                      className="second-row-image"
                      title={item.name}
                      loading="lazy"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>


      {/* Certificate Modal - Rendered using Portal */}
      {selectedCertificate && ReactDOM.createPortal(
        <div className="certificate-modal-overlay" onClick={closeModal}>
          <div className="certificate-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              <i className="fas fa-times"></i>
            </button>
            <div className="modal-content">
              <OptimizedImage
                src={selectedCertificate.logo}
                alt={`${selectedCertificate.title} Certificate`}
                className="modal-certificate-image"
              />
              <div className="modal-certificate-info">
                <h3>{selectedCertificate.title}</h3>
                <p>{selectedCertificate.issuer}</p>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};

export default Certificates;
