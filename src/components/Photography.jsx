import React, { useState, useEffect } from 'react';
import { X, ZoomIn, Camera } from 'lucide-react';

export default function Photography({ photography, onSeeMore }) {
  const [activePhoto, setActivePhoto] = useState(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActivePhoto(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!photography || photography.length === 0) return null;

  // Show only first 3 photos
  const displayedPhotos = photography.slice(0, 3);

  return (
    <section id="photography" className="photography-section reveal">
      <div className="container">
        <div className="section-title text-center">
          <span className="subtitle">Through My Lens</span>
          <h2 className="title-text">My Photography</h2>
        </div>

        <div className="photography-home-grid">
          {displayedPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className={`photo-card ${photo.orientation || 'landscape'} reveal-stagger`}
              style={{ animationDelay: `${(index % 3 + 1) * 0.1}s` }}
              onClick={() => setActivePhoto(photo)}
            >
              <div className="photo-img-wrapper">
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="photo-img"
                  loading="lazy"
                />
                <div className="photo-overlay">
                  <div className="photo-overlay-content">
                    <span className="photo-category">{photo.category}</span>
                    <h3 className="photo-title">{photo.title}</h3>
                    <div className="photo-zoom-icon">
                      <ZoomIn size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* See More Button */}
        {photography.length > 3 && (
          <div className="photography-action">
            <button
              className="btn btn-outline"
              onClick={onSeeMore}
            >
              See more photos
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="photo-modal-overlay"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="photo-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="photo-modal-close"
              onClick={() => setActivePhoto(null)}
              aria-label="Close photo view"
            >
              <X size={20} />
            </button>

            <div className="photo-modal-body">
              <img
                src={activePhoto.src}
                alt={activePhoto.title}
                className="photo-modal-image"
              />
              <div className="photo-modal-details">
                <div className="photo-details-header">
                  <Camera size={18} className="camera-icon" />
                  <span className="photo-modal-category">{activePhoto.category}</span>
                </div>
                <h3 className="photo-modal-title">{activePhoto.title}</h3>
                <p className="photo-modal-desc">{activePhoto.desc}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
