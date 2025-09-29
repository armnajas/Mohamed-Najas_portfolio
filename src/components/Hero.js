import React, { useRef, useState } from 'react';
import { personalInfo, socialLinks } from '../data/portfolioData';
import OptimizedImage from './OptimizedImage';

const Hero = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const descRef = useRef(null);
  const imageRef = useRef(null);
  const buttonRef = useRef(null);
  const backgroundRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState('');

  // Function to handle CV download
  const handleCVDownload = async (e) => {
    e.preventDefault();
    setIsDownloading(true);
    
    try {
      console.log('Starting CV download...');
      console.log('Resume path:', personalInfo.resume);
      console.log('Current origin:', window.location.origin);
      
      // Construct the full URL - handle both local and GitHub Pages
      let cvUrl;
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        // Local development
        cvUrl = window.location.origin + personalInfo.resume;
      } else {
        // Production (GitHub Pages) - use relative path
        cvUrl = personalInfo.resume;
      }
      
      console.log('Full CV URL:', cvUrl);
      
      // Method 1: Try fetch + blob approach first (most reliable for GitHub Pages)
      try {
        console.log('Trying fetch + blob method...');
        const response = await fetch(cvUrl);
        console.log('Fetch response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        console.log('Blob size:', blob.size, 'bytes');
        
        if (blob.size === 0) {
          throw new Error('Downloaded file is empty');
        }
        
        const blobUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = 'Mohamed_Najas_CV.pdf';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(blobUrl);
        
        console.log('Fetch + blob download successful');
        setDownloadStatus('Download completed successfully!');
        setTimeout(() => setDownloadStatus(''), 3000);
        
      } catch (fetchError) {
        console.error('Fetch method failed:', fetchError);
        setDownloadStatus('Trying direct download...');
        
        // Method 2: Direct download fallback
        try {
          const link = document.createElement('a');
          link.href = cvUrl;
          link.download = 'Mohamed_Najas_CV.pdf';
          link.target = '_blank';
          link.style.display = 'none';
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          console.log('Direct download initiated');
          setDownloadStatus('Download started via direct method!');
          setTimeout(() => setDownloadStatus(''), 3000);
          
        } catch (directError) {
          console.error('Direct download failed:', directError);
          setDownloadStatus('Opening CV in new tab...');
          
          // Method 3: Final fallback - open in new tab
          window.open(cvUrl, '_blank');
          console.log('Opened CV in new tab as final fallback');
          setTimeout(() => setDownloadStatus(''), 3000);
        }
      }
      
    } catch (error) {
      console.error('Unexpected error:', error);
      setDownloadStatus('Error occurred, trying fallback...');
      
      // Ultimate fallback
      try {
        window.open(personalInfo.resume, '_blank');
        console.log('Opened CV in new tab as ultimate fallback');
        setTimeout(() => setDownloadStatus(''), 3000);
      } catch (finalError) {
        console.error('All methods failed:', finalError);
        setDownloadStatus('Unable to download CV. Please try again.');
        setTimeout(() => setDownloadStatus(''), 5000);
      }
    } finally {
      setIsDownloading(false);
    }
  };



  return (
    <section
      ref={heroRef}
      id="home"
      className="hero-section"
    >
      {/* Left Side - Background Elements & Social Media */}
      <div className="hero-left">
        <div ref={backgroundRef} className="hero-background-elements">
          {/* Floating Orbs Background */}
          <div className="social-orbs">
            <div className="orb orb-1"></div>
            <div className="orb orb-2"></div>
            <div className="orb orb-3"></div>
            <div className="orb orb-4"></div>
            <div className="orb orb-5"></div>
          </div>

          {/* Interactive Social Constellation */}
          <div className="social-constellation">
            <div className="constellation-line line-1"></div>
            <div className="constellation-line line-2"></div>
            <div className="constellation-line line-3"></div>
            <div className="constellation-line line-4"></div>
          </div>

          {/* Particle System */}
          <div className="particle-system">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
              <div key={num} className={`particle particle-${num}`}></div>
            ))}
          </div>
        </div>

        {/* Creative Orbital Social Media System */}
        <div className="hero-social-orbit">
          <div className="orbit-system">
            <div className="orbit-center">
              <div className="center-icon">⚡</div>
            </div>

            <div className="orbit-ring orbit-ring-1"></div>
            <div className="orbit-ring orbit-ring-2"></div>
            <div className="orbit-ring orbit-ring-3"></div>

            <div className="social-planets">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className={`social-planet ${social.icon}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.name}
                >
                  <div className="planet-core">
                    <i className={social.platform}></i>
                  </div>
                  <div className="planet-glow"></div>
                  <div className="planet-trail"></div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Main Content */}
      <div className="hero-right">
        <div className="hero-content">
          <div className="hero-profile-section">
            <div className="hero-img-glow">
              <OptimizedImage
                ref={imageRef}
                src={personalInfo.profileImage}
                alt="Profile"
                className="hero-img"
                loading="eager"
              />
            </div>
            <div className="hero-text-content">
              <h1 ref={titleRef} className="hero-title" data-text={personalInfo.name}>
                {personalInfo.name}
              </h1>
              <h3 ref={subtitleRef} className="hero-role">
                <span className="brand-green">{personalInfo.title}</span>
                <span className="subtitle-role">{personalInfo.subtitle}</span>
              </h3>
            </div>
          </div>

          <p ref={descRef} className="hero-desc">
            {personalInfo.description}
          </p>

          {/* Hero Action Buttons */}
          <div className="hero-action-buttons">
            <button
              ref={buttonRef}
              onClick={handleCVDownload}
              className={`action-btn primary-action magnetic-btn ${isDownloading ? 'downloading' : ''}`}
              type="button"
              disabled={isDownloading}
            >
              <div className="btn-icon">
                {isDownloading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-download"></i>
                )}
              </div>
              <div className="btn-content">
                <span className="btn-title">
                  {isDownloading ? 'Downloading...' : 'View Resume'}
                </span>
                <span className="btn-subtitle">
                  {isDownloading ? 'Please wait' : 'Download PDF'}
                </span>
              </div>
            </button>
            
            {/* Download Status Message */}
            {downloadStatus && (
              <div className="download-status">
                <i className="fas fa-info-circle"></i>
                <span>{downloadStatus}</span>
              </div>
            )}

            <a
              href="#contact"
              className="action-btn glass-effect magnetic-btn"
            >
              <div className="btn-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <div className="btn-content">
                <span className="btn-title">Contact Me</span>
                <span className="btn-subtitle">Let's Connect</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
