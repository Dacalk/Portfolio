import React, { useState } from 'react';
import { Mail, MapPin, Send, CheckCircle } from 'lucide-react';

const LinkedinIcon = ({ size = 20, className = '' }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function Contact({ contact }) {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    let tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Please provide a valid email';
    }
    if (!formData.subject.trim()) tempErrors.subject = 'Subject is required';
    if (!formData.message.trim()) tempErrors.message = 'Message is required';
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      // Simulate static backend API submission
      setTimeout(() => {
        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
        // Reset success state after a delay
        setTimeout(() => setSubmitted(false), 5000);
      }, 1500);
    }
  };

  return (
    <section id="contact" className="contact-section reveal">
      <div className="container">
        <div className="section-title text-center">
          <span className="subtitle">Get in Touch</span>
          <h2 className="title-text">Contact Me</h2>
        </div>

        <div className="contact-grid">
          {/* Left: Contact Info Info Cards */}
          <div className="contact-info-wrapper reveal-stagger delay-1">
            <h3 className="contact-subtitle">Let's discuss your project</h3>
            <p className="contact-info-desc">
              Have an idea or need an IT Specialist? Reach out via email or connect with me on LinkedIn. I am always open to discussing new opportunities or design systems.
            </p>

            <div className="contact-cards">
              <a href={`mailto:${contact.email}`} className="contact-info-card">
                <div className="contact-card-icon-box">
                  <Mail size={22} />
                </div>
                <div className="contact-card-details">
                  <h4>Email Me</h4>
                  <p>{contact.email}</p>
                </div>
              </a>

              <a href={contact.linkedin} target="_blank" rel="noreferrer" className="contact-info-card">
                <div className="contact-card-icon-box">
                  <LinkedinIcon size={22} />
                </div>
                <div className="contact-card-details">
                  <h4>LinkedIn</h4>
                  <p>Connect with me</p>
                </div>
              </a>

              <div className="contact-info-card">
                <div className="contact-card-icon-box">
                  <MapPin size={22} />
                </div>
                <div className="contact-card-details">
                  <h4>Location</h4>
                  <p>{contact.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="contact-form-wrapper reveal-stagger delay-2">
            {submitted ? (
              <div className="form-success-message">
                <CheckCircle size={48} className="success-check-icon" />
                <h3>Message Sent Successfully!</h3>
                <p>Thank you for reaching out. I will get back to you as soon as possible.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-row-2">
                  <div className="form-group">
                    <label htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={errors.name ? 'input-error' : ''}
                      placeholder="John Doe"
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Your Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={errors.email ? 'input-error' : ''}
                      placeholder="john@example.com"
                    />
                    {errors.email && <span className="error-text">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={errors.subject ? 'input-error' : ''}
                    placeholder="Project Inquiry"
                  />
                  {errors.subject && <span className="error-text">{errors.subject}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    className={errors.message ? 'input-error' : ''}
                    placeholder="Hi Charitha, I'd like to work with you on..."
                  ></textarea>
                  {errors.message && <span className="error-text">{errors.message}</span>}
                </div>

                <button type="submit" className="btn btn-primary btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Sending...' : (
                    <>
                      Send Message <Send size={16} className="btn-icon-right" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
