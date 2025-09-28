import React, { useState } from 'react';
import './ExperienceCard.css';

const ExperienceCard = ({ experience, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`experience-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="card-header" onClick={toggleExpanded}>
        <div className="card-main-info">
          <div className="job-title-section">
            <h3 className="job-title">{experience.title}</h3>
            <span className={`status-badge ${experience.status.toLowerCase().replace(' ', '-')}`}>
              {experience.status}
            </span>
          </div>
          <div className="company-info">
            <h4 className="company-name">{experience.company}</h4>
            <div className="duration-info">
              <span className="duration">{experience.duration}</span>
              <span className="period">{experience.period}</span>
            </div>
          </div>
        </div>
        <div className="expand-icon">
          <i className={`fas ${isExpanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
        </div>
      </div>
      
      <div className={`card-details ${isExpanded ? 'show' : ''}`}>
        <div className="responsibilities-section">
          <h5 className="responsibilities-title">Key Responsibilities</h5>
          <ul className="responsibilities-list">
            {experience.responsibilities.map((responsibility, idx) => (
              <li key={idx} className="responsibility-item">
                <i className="fas fa-check-circle responsibility-icon"></i>
                <span>{responsibility}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;