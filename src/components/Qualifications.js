import React, { useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { qualifications } from '../data/portfolioData';
import AppleTextReveal from './AppleTextReveal';
import ParallaxContainer from './ParallaxContainer';

gsap.registerPlugin(ScrollTrigger);

const Qualifications = () => {
  const sectionRef = useRef(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [visibleCards, setVisibleCards] = useState(new Set());

  // Helper function to check if qualification is professional
  const isProfessionalQualification = (qualification) => {
    // Find the index of the professional qualifications divider
    const professionalDividerIndex = qualifications.findIndex(
      item => item.type === 'divider' && item.title === 'Professional Qualifications'
    );
    
    // Find the index of the current qualification
    const qualificationIndex = qualifications.findIndex(
      item => item.id === qualification.id
    );
    
    // Return true if qualification comes after the professional divider
    return professionalDividerIndex !== -1 && qualificationIndex > professionalDividerIndex;
  };

  const openModal = (item) => {
    // Store current scroll position
    const scrollY = window.scrollY;
    document.body.setAttribute('data-scroll-y', scrollY.toString());

    setSelectedItem(item);

    // Add modal-open class and apply styles
    document.body.classList.add('modal-open');
    document.body.style.top = `-${scrollY}px`;

    // Ensure modal centers properly
    setTimeout(() => {
      const modalOverlay = document.querySelector('.qualifications-modal-overlay');
      if (modalOverlay) {
        modalOverlay.scrollTop = 0;
      }
    }, 50);
  };

  const closeModal = () => {
    // Get the saved scroll position
    const savedScrollY = document.body.getAttribute('data-scroll-y');

    setSelectedItem(null);

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

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedItem) {
        closeModal();
      }
    };

    if (selectedItem) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [selectedItem]);

  // Removed custom title animation - using AppleTextReveal instead

  // Intersection Observer for intro animations - triggers every time
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const cardId = entry.target.getAttribute('data-card-id');
          if (cardId) {
            if (entry.isIntersecting) {
              // Add card to visible set to trigger animation
              setVisibleCards(prev => new Set([...prev, cardId]));
            } else {
              // Remove card from visible set when out of view to allow re-triggering
              setVisibleCards(prev => {
                const newSet = new Set(prev);
                newSet.delete(cardId);
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

    // Observe all qualifications cards
    const cards = document.querySelectorAll('.qualifications-card, .qualifications-divider-card');
    cards.forEach(card => observer.observe(card));

    return () => {
      cards.forEach(card => observer.unobserve(card));
    };
  }, []);

  // Removed custom title animation - using AppleTextReveal instead

  return (
    <section ref={sectionRef} id="qualifications" className="qualifications-section">
      <div className="container">
        <ParallaxContainer speed={0.2}>
          <AppleTextReveal
            className="section-title"
            animationType="words"
            stagger={0.1}
          >
            &lt;Qualifications /&gt;
          </AppleTextReveal>
        </ParallaxContainer>

        <div className="qualifications-grid">
          {qualifications.map((item) => {
            // Skip divider items in card layout
            if (item.type === 'divider') {
              const isVisible = visibleCards.has(item.id);
              return (
                <div
                  key={item.id}
                  className={`qualifications-divider-card ${isVisible ? 'intro-visible' : 'intro-hidden'}`}
                  data-card-id={item.id}
                >
                  <h3 className="divider-card-title">{item.title}</h3>
                </div>
              );
            }

            const isVisible = visibleCards.has(item.id.toString());
            const animationSide = item.side === 'left' ? 'intro-from-left' : 'intro-from-right';

            return (
              <div
                key={item.id}
                className={`qualifications-card clickable ${item.largeLogo ? 'qualifications-card-campus' : ''} ${isVisible ? 'intro-visible' : 'intro-hidden'} ${animationSide}`}
                data-card-id={item.id}
                onClick={() => openModal(item)}
              >
                <div className="qualifications-header">
                  <div className="qualifications-title-row">
                    {/* Inline Campus Logo (Left side of title) */}
                    {item.provider && item.campusLogo && item.inlineLogoPosition === "left" && (
                      <div className="campus-logo-inline campus-logo-left">
                        <img
                          src={item.provider.logo}
                          alt={item.provider.name}
                          title={item.provider.name}
                        />
                      </div>
                    )}
                    <h3 className="qualifications-title">{item.title}</h3>
                    {/* Inline Campus Logo (Right side of title) */}
                    {item.provider && item.campusLogo && item.inlineLogoPosition === "right" && (
                      <div className="campus-logo-inline campus-logo-right">
                        <img
                          src={item.provider.logo}
                          alt={item.provider.name}
                          title={item.provider.name}
                        />
                      </div>
                    )}
                  </div>
                  <span className={`qualifications-date ${item.date === 'Reading' ? 'reading-badge' : ''} ${item.date === 'Present' ? 'present-badge' : ''}`}>
                    {item.date === 'Reading' ? (
                      <>
                        <i className="fas fa-book-open"></i>
                        <span>Currently Reading</span>
                      </>
                    ) : item.date === 'Present' ? (
                      <>
                        <div className="pulse-indicator">
                          <div className="pulse-dot"></div>
                        </div>
                        <i className="fas fa-graduation-cap"></i>
                        <span>Present</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-calendar-alt"></i>
                        <span>{item.date}</span>
                      </>
                    )}
                  </span>
                  <div className="qualifications-tags">
                    {item.tags && item.tags.slice(0, 2).map((tag, tagIndex) => (
                      <span key={tag} className="qualifications-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Campus Logo (Over Top Border) - Only if not inline */}
                {item.provider && item.campusLogo && !item.inlineLogoPosition && (
                  <div className="campus-logo-top">
                    <img
                      src={item.provider.logo}
                      alt={item.provider.name}
                      title={item.provider.name}
                    />
                  </div>
                )}

                {/* Regular Provider Logo */}
                {item.provider && !item.campusLogo && (
                  <div className="provider-logo">
                    <img
                      src={item.provider.logo}
                      alt={item.provider.name}
                      title={item.provider.name}
                    />
                  </div>
                )}

                <div className="click-hint">
                  <i className="fas fa-eye"></i>
                  <span>Click to view details</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Qualifications Modal - Rendered using Portal */}
      {selectedItem && ReactDOM.createPortal(
        <div className="qualifications-modal-overlay" onClick={closeModal}>
          <div className="qualifications-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={closeModal}>
              <i className="fas fa-times"></i>
            </button>

            <div className="modal-header">
              <div className="modal-title-section">
                <h3 className="modal-qualifications-title">{selectedItem.title}</h3>
                <div className="modal-qualifications-meta">
                  <span className={`modal-qualifications-date ${selectedItem.date === 'Reading' ? 'reading-badge' : ''} ${selectedItem.date === 'Present' ? 'present-badge' : ''}`}>
                    {selectedItem.date === 'Reading' ? (
                      <>
                        <i className="fas fa-book-open"></i>
                        Currently Reading
                      </>
                    ) : selectedItem.date === 'Present' ? (
                      <>
                        <div className="pulse-indicator">
                          <div className="pulse-dot"></div>
                        </div>
                        <i className="fas fa-graduation-cap"></i>
                        Present
                      </>
                    ) : (
                      <>
                        <i className="fas fa-calendar-alt"></i>
                        {selectedItem.date}
                      </>
                    )}
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-content">
              <div className="modal-description">
                <p>{selectedItem.description}</p>
              </div>

              {/* Certificate Image */}
              {selectedItem.certificateImage && (
                <div className="modal-certificate">
                  <div className="certificate-container">
                    <img
                      src={selectedItem.certificateImage}
                      alt={`${selectedItem.title} Certificate`}
                      className="certificate-image"
                      onClick={() => window.open(selectedItem.certificateImage, '_blank')}
                    />
                  </div>
                </div>
              )}

              {selectedItem.tags && !isProfessionalQualification(selectedItem) && (
                <div className="modal-tags">
                  <div className="tags-container">
                    {selectedItem.tags.map((tag, idx) => (
                      <span key={idx} className="modal-tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </section>
  );
};

export default Qualifications;
