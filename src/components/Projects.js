import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { projects } from '../data/portfolioData';
import OptimizedImage from './OptimizedImage';
import AppleTextReveal from './AppleTextReveal';
import ParallaxContainer from './ParallaxContainer';

const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showSamples, setShowSamples] = useState(false);
  const [visibleCards, setVisibleCards] = useState(new Set());
  const sectionRef = useRef(null);
  const gridRef = useRef(null);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      // Get current scroll position
      const scrollY = window.scrollY;

      // Store scroll position for restoration
      document.body.setAttribute('data-scroll-y', scrollY.toString());

      // Add modal-open class and apply styles
      document.body.classList.add('modal-open');
      document.body.style.top = `-${scrollY}px`;

      // Prevent touch scrolling on mobile but allow modal scrolling
      const preventTouchMove = (e) => {
        if (e.target.closest('.project-modal')) {
          return;
        }
        e.preventDefault();
      };

      const preventWheel = (e) => {
        if (e.target.closest('.project-modal')) {
          return;
        }
        e.preventDefault();
      };

      document.addEventListener('touchmove', preventTouchMove, { passive: false });
      document.addEventListener('wheel', preventWheel, { passive: false });

      return () => {
        document.removeEventListener('touchmove', preventTouchMove);
        document.removeEventListener('wheel', preventWheel);
      };
    }

    // Modal is closing - restore scroll position
    const savedScrollY = document.body.getAttribute('data-scroll-y');
    document.body.classList.remove('modal-open');
    document.body.style.top = '';

    if (savedScrollY) {
      const scrollPosition = parseInt(savedScrollY, 10);
      window.scrollTo({
        top: scrollPosition,
        behavior: 'instant'
      });
      document.body.removeAttribute('data-scroll-y');
    }

    return undefined;
  }, [selectedProject]);

  // Intersection Observer for repeating intro animations - triggers every time
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

    // Observe all project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card) => observer.observe(card));

    return () => {
      projectCards.forEach(card => observer.unobserve(card));
    };
  }, []);

  const openModal = (project) => {
    setSelectedProject(project);

    // Ensure modal centers properly by scrolling to top of modal overlay
    setTimeout(() => {
      const modalOverlay = document.querySelector('.project-modal-overlay');
      if (modalOverlay) {
        modalOverlay.scrollTop = 0;
      }
    }, 50);
  };

  const closeModal = () => {
    // Close modal smoothly
    setSelectedProject(null);
    setShowSamples(false);
  };

  const openSamples = (e) => {
    e.preventDefault();
    setShowSamples(true);
  };

  const closeSamples = () => {
    setShowSamples(false);
  };

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
      }
    };

    if (selectedProject) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [selectedProject]);

  return (
    <section id="projects" className="projects-section" ref={sectionRef}>
      <ParallaxContainer speed={0.2}>
        <AppleTextReveal
          className="section-title"
          animationType="words"
          stagger={0.1}
        >
          &lt;project and experiences/&gt;
        </AppleTextReveal>
      </ParallaxContainer>
      <div className="projects-grid" ref={gridRef}>
        {projects.map((project) => {
          const isVisible = visibleCards.has(project.id);

          return (
            <div
              key={project.id}
              className={`project-card ${isVisible ? 'intro-visible' : 'intro-hidden'}`}
              data-project={project.id}
              data-card-id={project.id}
              onClick={() => openModal(project)}
            >
            <div className="project-image">
              <OptimizedImage
                src={project.image}
                alt={project.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className="project-preview">
              <h3>{project.title}</h3>
              <span className={`badge ${project.statusType}`}>{project.status}</span>
            </div>
          </div>
          );
        })}
      </div>

      {/* Project Modal - Rendered using Portal */}
      {selectedProject && ReactDOM.createPortal(
        <div className="project-modal-overlay" onClick={closeModal}>
          <div className={`project-modal ${showSamples ? 'with-samples' : ''}`} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>
              <i className="fas fa-times"></i>
            </button>

            <div className="modal-main-content">
              <div className="modal-header">
                <div className="modal-title-section">
                  <h2>{selectedProject.title}</h2>
                  <span className={`badge ${selectedProject.statusType}`}>
                    {selectedProject.status}
                  </span>
                </div>
              </div>

              <div className="modal-content">
                <div className="modal-description">
                  <p>{selectedProject.description}</p>
                </div>

                <div className="modal-meta">
                  <div className="meta-item">
                    <i className="fas fa-calendar"></i>
                    <span>{selectedProject.date}</span>
                  </div>
                  <div className="meta-item">
                    <i className="fas fa-users"></i>
                    <span>{selectedProject.team}</span>
                  </div>
                </div>

                <div className="modal-actions">
                  <button
                    onClick={openSamples}
                    className={`btn btn-primary ${showSamples ? 'active' : ''}`}
                  >
                    SAMPLES
                  </button>
                </div>
              </div>
            </div>

            {/* Samples Side Panel */}
            {showSamples && (
              <div className="samples-side-panel">
                <div className="samples-header">
                  <h3>Project Samples</h3>
                  <button className="samples-close" onClick={closeSamples}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>

                <div className="samples-content">
                  <div className="samples-grid">
                    {selectedProject.samples?.images?.map((image, index) => (
                      <div key={`img-${index}`} className="sample-item image-item">
                        <OptimizedImage
                          src={image.src}
                          alt={image.alt || `${selectedProject.title} sample ${index + 1}`}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        {image.caption && (
                          <div className="sample-caption">{image.caption}</div>
                        )}
                      </div>
                    ))}

                    {selectedProject.samples?.videos?.map((video, index) => (
                      <div key={`vid-${index}`} className="sample-item video-item">
                        <video
                          src={video.src}
                          controls
                          poster={video.poster}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        >
                          Your browser does not support the video tag.
                        </video>
                        {video.caption && (
                          <div className="sample-caption">{video.caption}</div>
                        )}
                      </div>
                    ))}
                  </div>

                  {(!selectedProject.samples?.images?.length && !selectedProject.samples?.videos?.length) && (
                    <div className="no-samples">
                      <i className="fas fa-images"></i>
                      <p>No samples available for this project yet.</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}


    </section>
  );
};

export default Projects;
