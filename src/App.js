import React, { useEffect } from 'react';
import { AnimationProvider } from './context/AnimationContext';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Certificates from './components/Certificates';
import About from './components/About';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Qualifications from './components/Qualifications';
import Projects from './components/Projects';
import Contact from './components/Contact';
import ScrollToTop from './components/ScrollToTop';
import StarryBackground from './components/StarryBackground';
import './App.css';

function App() {
  useEffect(() => {
    // Add loaded class to body for animations
    document.body.classList.add('loaded');

    // Set dark mode theme permanently
    const root = document.documentElement;
    root.style.setProperty('--bg', '#0d1117');
    root.style.setProperty('--bg-alt', '#161b22');
    root.style.setProperty('--bg-card', '#21262d');
    root.style.setProperty('--bg-elevated', '#30363d');
    root.style.setProperty('--text', '#f0f6fc');
    root.style.setProperty('--text-primary', '#ffffff');
    root.style.setProperty('--text-secondary', '#8b949e');
    root.style.setProperty('--text-muted', '#656d76');
    root.style.setProperty('--primary', '#00d4ff');
    root.style.setProperty('--accent', '#8b5cf6');
    root.style.setProperty('--border', '#30363d');
    root.style.setProperty('--border-muted', '#21262d');

    // Dark mode gradients
    root.style.setProperty('--gradient-primary', 'linear-gradient(135deg, #00d4ff 0%, #8b5cf6 100%)');
    root.style.setProperty('--gradient-dark', 'linear-gradient(135deg, #161b22 0%, #21262d 100%)');
    root.style.setProperty('--gradient-card', 'linear-gradient(135deg, rgba(66, 133, 244, 0.1) 0%, rgba(26, 115, 232, 0.05) 100%)');

    // Dark mode shadows
    root.style.setProperty('--shadow-card', '0 8px 32px rgba(0, 0, 0, 0.3)');
    root.style.setProperty('--shadow-hover', '0 12px 40px rgba(0, 0, 0, 0.4)');
    root.style.setProperty('--shadow-glow', '0 0 20px rgba(0, 212, 255, 0.3)');

    root.setAttribute('data-theme', 'dark');

    // Performance optimization: Reduce animation complexity
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      document.body.classList.add('reduced-motion');
    }
  }, []);

  return (
    <AnimationProvider>
      <div className="global-background">
        {!window.matchMedia('(prefers-reduced-motion: reduce)').matches && (
          <StarryBackground />
        )}
        <Navigation />
        <main>
          <Hero />
          <Certificates />
          <About />
          <Skills />
          <Experience />
          <Qualifications />
          <Projects />
          <Contact />
        </main>
        <ScrollToTop />
      </div>
    </AnimationProvider>
  );
}

export default App;
