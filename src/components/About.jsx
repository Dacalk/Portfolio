import React from 'react';

export default function About({ profile }) {
  return (
    <section id="about" className="about-section reveal">
      <div className="container about-container">
        {/* Left Side: About Image */}
        <div className="about-image-wrapper">
          <div className="about-img-container">
            <img src={profile.aboutPic} alt="About Me Portrait" className="about-img" />
          </div>
        </div>

        {/* Right Side: About Info */}
        <div className="about-content">
          <div className="section-title">
            <h2 className="title-text">About Me</h2>
          </div>
          
          <p className="about-desc">{profile.aboutText}</p>

          <ul className="about-info-list">
            {profile.personalInfo && Object.entries(profile.personalInfo).map(([key, value]) => (
              <li key={key} className="about-info-item">
                <span className="info-label">{key}:</span>
                <span className="info-value">{value}</span>
              </li>
            ))}
          </ul>

          <div className="about-actions">
            <a href={profile.cvUrl} download className="btn btn-primary btn-cv-download">
              DOWNLOAD CV
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
