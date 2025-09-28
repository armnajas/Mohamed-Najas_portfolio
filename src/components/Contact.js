import React from 'react';
import { socialLinks, contactInfo } from '../data/portfolioData';

const Contact = () => {
  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        {/* Main Contact Content */}
        <div className="contact-content">
          {/* Brand Section */}
          <div className="contact-brand">
            <h2 className="brand-name">{contactInfo.brand.name}</h2>
            <p className="brand-tagline">{contactInfo.brand.tagline}</p>

            {/* Social Links */}
            <div className="contact-social-links">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className={`social-link ${social.icon}-link`}
                  title={social.name === 'Email' ? `Email: ${social.url.replace('mailto:', '')}` : social.name}
                  target={social.name === 'Email' ? '_self' : '_blank'}
                  rel={social.name === 'Email' ? '' : 'noopener noreferrer'}
                >
                  <i className={social.platform}></i>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="contact-links-section">
            <h3 className="section-heading">Quick Links</h3>
            <ul className="quick-links">
              {contactInfo.quickLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="quick-link">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="contact-services-section">
            <h3 className="section-heading">Services</h3>
            <ul className="services-list">
              {contactInfo.services.map((service) => (
                <li key={service} className="service-item">
                  {service}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Combined Footer */}
        <div className="development-info">
          <div className="footer-left">
            <div className="copyright">
              <span>&copy; 2025 Mohamed Najas. All rights reserved.</span>
            </div>
            <div className="built-with">
              <span className="built-text">Built with:</span>
              <div className="tech-stack">
                {contactInfo.developmentInfo.builtWith.map((tech) => (
                  <div key={tech.name} className="tech-item" title={tech.name}>
                    <i className={tech.icon} style={{ color: tech.color }}></i>
                    <span>{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="update-info">
            <span className="last-updated">
              Last updated: {contactInfo.developmentInfo.lastUpdated}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
