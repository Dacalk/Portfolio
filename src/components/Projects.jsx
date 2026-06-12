import React from 'react';
import { ExternalLink } from 'lucide-react';

const GithubIcon = ({ size = 20, className = '' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
    <path d="M9 18c-4.51 2-5-2-7-2"></path>
  </svg>
);

export default function Projects({ projects }) {
  return (
    <section id="projects" className="projects-section reveal">
      <div className="container">
        <div className="section-title text-center">
          <h2 className="title-text">Our Projects</h2>
          <span className="subtitle-desc">Far far away, behind the word mountains, far from the countries Vokalia and Consonantia</span>
        </div>

        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={project.id} className={`project-card reveal-stagger delay-${index + 1}`}>
              <div className="project-img-wrapper">
                <img src={project.image} alt={project.title} className="project-img" />
                <div className="project-overlay">
                  <div className="project-overlay-content">
                    <h3 className="overlay-title">{project.title}</h3>
                    <p className="overlay-desc">{project.description}</p>
                    <div className="overlay-links">
                      <a href={project.github} target="_blank" rel="noreferrer" className="overlay-link-btn" aria-label="GitHub Repository">
                        <GithubIcon size={22} />
                      </a>
                      <a href={project.demo} target="_blank" rel="noreferrer" className="overlay-link-btn" aria-label="Live Demo">
                        <ExternalLink size={22} />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
