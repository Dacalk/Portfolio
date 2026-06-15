import React, { useState, useEffect } from 'react';
import { X, ZoomIn, Camera, ArrowLeft } from 'lucide-react';

export default function PhotographyPage({ photography, onBack }) {
  const [activePhoto, setActivePhoto] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

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

  // Extract dynamic categories list
  const categories = ['All', ...new Set(photography.map(item => item.category))];

  // Filter photos
  const filteredPhotos = selectedCategory === 'All'
    ? photography
    : photography.filter(photo => photo.category === selectedCategory);

  return (
    <section className="photography-page-section">
      <div className="container">
        {/* Back Link Header */}
        <div className="page-back-header">
          <span onClick={onBack} className="back-link">
            <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Back to Portfolio
          </span>
        </div>

        <div className="section-title text-center">
          <span className="subtitle">Captured Moments</span>
          <h1 className="title-text">My Photography Gallery</h1>
        </div>

        {/* Dynamic Category Filters */}
        <div className="gallery-filter-bar page-filter-bar revealed">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Full Gallery Grid */}
        <div className="photography-masonry-grid">
          {filteredPhotos.map((photo, index) => (
            <div
              key={photo.id}
              className={`photo-card ${photo.orientation || 'landscape'} revealed`} // Bypasses intersection observer for instant rendering
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
