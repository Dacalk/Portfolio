import React from 'react';
import * as Icons from 'lucide-react';

export default function Services({ services }) {
  if (!services) return null;
  
  return (
    <section id="services" className="services-section reveal">
      <div className="container">
        <div className="section-title text-center">
          <span className="subtitle">What I Do</span>
          <h2 className="title-text">My Services</h2>
        </div>

        <div className="services-grid">
          {services.map((service, index) => {
            const IconComponent = Icons[service.icon] || Icons.Settings;
            return (
              <div key={service.id} className={`service-card reveal-stagger delay-${index + 1}`}>
                <div className="service-icon-wrapper">
                  <IconComponent size={32} />
                </div>
                <h3 className="service-title">{service.title}</h3>
                <p className="service-desc">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
