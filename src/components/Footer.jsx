import React from 'react';

export default function Footer({ name }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-area">
      <div className="container footer-container">
        <div className="footer-links">
          <a href="#about">About</a>
          <a href="#services">Services</a>
          <a href="#experience">Experience</a>
          <a href="#education">Education</a>
          <a href="#projects">Projects</a>
          <a href="#photography">Photography</a>
          <a href="#achievements">Achievements</a>
          <a href="#contact">Contact</a>
        </div>
        <p className="copyright-text">
          Copyright &copy; {currentYear} <span className="highlight">{name}</span>. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
