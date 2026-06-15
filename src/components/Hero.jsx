import React, { useState, useEffect } from 'react';

const LinkedinIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

const GithubIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
    <path d="M9 18c-4.51 2-5-2-7-2"></path>
  </svg>
);

const FacebookIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const TwitterIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
  </svg>
);

const InstagramIcon = ({ size = 20 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function Hero({ profile }) {
  const [roleIndex, setRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const roles = profile.roles || ['Software Engineer', 'IT Specialist', 'Web Designer'];
  const typingSpeed = 150;
  const deletingSpeed = 75;
  const pauseTime = 1500;

  useEffect(() => {
    let timer;
    const currentFullText = roles[roleIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText(currentFullText.substring(0, displayText.length - 1));
      }, deletingSpeed);
    } else {
      timer = setTimeout(() => {
        setDisplayText(currentFullText.substring(0, displayText.length + 1));
      }, typingSpeed);
    }

    if (!isDeleting && displayText === currentFullText) {
      timer = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, roleIndex, roles]);

  return (
    <section id="home" className="hero-section">
      {/* Background Animated Parallax Floating Shapes */}
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
      <div className="shape shape-3"></div>
      <div className="shape shape-4"></div>

      <div className="container hero-container">
        <div className="hero-content">
          <p className="hero-sub">{profile.bioSummary}</p>
          <h1 className="hero-title">{profile.name}</h1>
          <h2 className="hero-typing">
            A Passionate <span className="highlight">{displayText}</span>
            <span className="cursor">|</span>
          </h2>
          <div className="hero-btns">
            <a href="#contact" className="btn btn-primary">Say Hello</a>
            <a href="#projects" className="btn btn-outline">My Works</a>
          </div>
        </div>

        <div className="hero-image-wrapper">
          <div className="hero-img-backdrop"></div>
          <div className="hero-img-circle">
            <img src={profile.profilePic} alt={profile.name} className="hero-img" />
          </div>
        </div>
      </div>

      {/* Floating social sidebar */}
      <div className="hero-social-sidebar">
        <ul className="social-links">
          {profile.socials.linkedin && (
            <li>
              <a href={profile.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <LinkedinIcon size={20} />
              </a>
            </li>
          )}
          {profile.socials.github && (
            <li>
              <a href={profile.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <GithubIcon size={20} />
              </a>
            </li>
          )}
          {profile.socials.facebook && (
            <li>
              <a href={profile.socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                <FacebookIcon size={20} />
              </a>
            </li>
          )}
          {profile.socials.twitter && (
            <li>
              <a href={profile.socials.twitter} target="_blank" rel="noreferrer" aria-label="Twitter">
                <TwitterIcon size={20} />
              </a>
            </li>
          )}
          {profile.socials.instagram && (
            <li>
              <a href={profile.socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                <InstagramIcon size={20} />
              </a>
            </li>
          )}
        </ul>
      </div>

      {/* Animated Scroll Down Indicator */}
      <a href="#about" className="scroll-down-indicator" aria-label="Scroll Down">
        <div className="mouse-icon">
          <div className="mouse-wheel"></div>
        </div>
        <div className="scroll-arrow"></div>
      </a>
    </section>
  );
}
