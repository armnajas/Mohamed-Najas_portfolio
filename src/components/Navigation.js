import React, { useState, useEffect } from 'react';
import { navigation } from '../data/portfolioData';
import { useAnimation } from '../context/AnimationContext';

const Navigation = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollTo } = useAnimation();

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPos = window.scrollY + 100;

      // Update scroll state for navbar styling
      setIsScrolled(window.scrollY > 50);

      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          setActiveSection(sectionId);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, href) => {
    e.preventDefault();
    const targetId = href.substring(1);

    // Close mobile menu
    setMobileMenuOpen(false);

    if (targetId === 'home') {
      scrollTo(0);
    } else {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        let extraPadding = 80;
        if (targetId === 'projects') extraPadding = 100;
        if (targetId === 'certificates') extraPadding = 80;
        if (targetId === 'qualifications') extraPadding = 80;

        scrollTo(targetElement, {
          offset: -extraPadding,
          duration: 1.5
        });
      }
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className={`top-navigation ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        <div className="nav-brand">
          <span className="brand-text">MN</span>
        </div>
        <ul className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          {navigation.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                className={`nav-item ${activeSection === item.href.substring(1) ? 'active' : ''}`}
                onClick={(e) => handleNavClick(e, item.href)}
              >
                <i className={item.icon}></i>
                <span>{item.name}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          <div className={`nav-toggle ${mobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
