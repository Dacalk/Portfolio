import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function Experience({ skills }) {
  return (
    <section id="experience" className="experience-section reveal">
      <div className="container">
        <div className="section-title text-center">
          <span className="subtitle">Explore My Skills</span>
          <h2 className="title-text">My Technical Stack</h2>
        </div>

        <div className="skills-container-grid">
          {/* Frontend Category Card */}
          <div className="skills-card reveal-stagger delay-1">
            <h3 className="skills-subtitle">Frontend Development</h3>
            <div className="skills-list">
              {skills.frontend && skills.frontend.map((skill, index) => (
                <article key={index} className="skill-item">
                  <CheckCircle2 size={18} className="skill-check-icon" />
                  <div className="skill-info">
                    <h4>{skill.name}</h4>
                    <p>{skill.level}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Backend / Database / Tools Category Card */}
          <div className="skills-card reveal-stagger delay-2">
            <h3 className="skills-subtitle">Backend & Version Control</h3>
            <div className="skills-list">
              {skills.backend && skills.backend.map((skill, index) => (
                <article key={index} className="skill-item">
                  <CheckCircle2 size={18} className="skill-check-icon" />
                  <div className="skill-info">
                    <h4>{skill.name}</h4>
                    <p>{skill.level}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
