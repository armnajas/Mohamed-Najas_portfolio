import React, { useState, useEffect, useRef } from 'react';
import { navigation } from '../data/portfolioData';
import { useAnimation } from '../context/AnimationContext';

const Navigation = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollTo } = useAnimation();
  const sectionsRef = useRef([]);
  const activeSectionRef = useRef('home');

  useEffect(() => {
    sectionsRef.current = Array.from(document.querySelectorAll('section[id]'));

    const updateScrollState = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const scrollPos = scrollY + 120;

      setIsScrolled(scrollY > 50);

      let nextActive = activeSectionRef.current;

      for (const section of sectionsRef.current) {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
          nextActive = section.getAttribute('id');
          break;
        }
      }

      if (!nextActive && sectionsRef.current.length > 0) {
        nextActive = sectionsRef.current[0].getAttribute('id');
      }

      if (nextActive && nextActive !== activeSectionRef.current) {
        activeSectionRef.current = nextActive;
        setActiveSection(nextActive);
      }
    };

    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          updateScrollState();
          ticking = false;
        });
        ticking = true;
      }
    };

    const handleResize = () => {
      sectionsRef.current = Array.from(document.querySelectorAll('section[id]'));
      updateScrollState();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    updateScrollState();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
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

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuOpen && !event.target.closest('.nav-menu') && !event.target.closest('.nav-toggle')) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

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
