import React from 'react';
import { GraduationCap, Calendar, MapPin } from 'lucide-react';

export default function Education() {
  const educationData = [
    {
      id: 1,
      degree: "B.Sc (Hons) in Computer Science",
      institution: "NSBM Green University",
      period: "2022 - Present",
      location: "Homagama, Sri Lanka",
      description: "Focusing on advanced computer science principles, software architecture, data structures, algorithms, and honors research projects."
    },
    {
      id: 2,
      degree: "Higher Diploma in Software Engineering",
      institution: "Wayamba University",
      period: "Enrolled",
      location: "Kuliyapitiya, Sri Lanka",
      description: "Specializing in software engineering disciplines, object-oriented systems development, databases, and secure programming practices."
    }
  ];

  return (
    <section id="education" className="education-section reveal">
      <div className="container">
        <div className="section-title text-center">
          <span className="subtitle">My Academic Journey</span>
          <h2 className="title-text">Education</h2>
        </div>

        <div className="education-timeline">
          {educationData.map((edu, index) => (
            <div key={edu.id} className={`education-card reveal-stagger delay-${index + 1}`}>
              <div className="edu-icon-box">
                <GraduationCap size={28} />
              </div>
              <div className="edu-content">
                <div className="edu-header">
                  <h3 className="edu-degree">{edu.degree}</h3>
                  <span className="edu-period">
                    <Calendar size={14} className="edu-meta-icon" /> {edu.period}
                  </span>
                </div>
                <h4 className="edu-institution">{edu.institution}</h4>
                <div className="edu-location">
                  <MapPin size={14} className="edu-meta-icon" /> {edu.location}
                </div>
                <p className="edu-desc">{edu.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
