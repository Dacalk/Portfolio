import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ArrowLeft, Images } from 'lucide-react';

export default function AchievementsPage({ achievements, onBack }) {
  const [selectedAchievement, setSelectedAchievement] = useState(null);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setSelectedAchievement(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!achievements || achievements.length === 0) return null;

  const handleCardClick = (item) => {
    setSelectedAchievement(item);
    setCurrentImgIndex(0);
  };

  const handleCloseModal = () => {
    setSelectedAchievement(null);
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    if (!selectedAchievement) return;
    setCurrentImgIndex((prev) => 
      (prev + 1) % selectedAchievement.images.length
    );
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    if (!selectedAchievement) return;
    setCurrentImgIndex((prev) => 
      (prev - 1 + selectedAchievement.images.length) % selectedAchievement.images.length
    );
  };

  return (
    <section className="achievements-page-section">
      <div className="container">
        {/* Back Link Header */}
        <div className="page-back-header">
          <span onClick={onBack} className="back-link">
            <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Back to Portfolio
          </span>
        </div>

        <div className="section-title text-center">
          <span className="subtitle">All badging ceremonies, credentials & press news</span>
          <h1 className="title-text">All Achievements & News</h1>
        </div>

        <div className="achievements-grid page-grid">
          {achievements.map((item, index) => {
            const coverImage = item.images && item.images.length > 0 ? item.images[0] : '';
            return (
              <div
                key={item.id}
                className="achievement-card revealed" // revealed class to bypass observer
                onClick={() => handleCardClick(item)}
              >
                <div className="achievement-post-cover">
                  <img
                    src={coverImage}
                    alt={item.title}
                    className="achievement-cover-img"
                  />
                  <span className="achievement-post-category">{item.category}</span>
                  {item.images && item.images.length > 1 && (
                    <span className="achievement-post-images-count">
                      <Images size={12} /> {item.images.length}
                    </span>
                  )}
                </div>
                <div className="achievement-post-content">
                  <span className="achievement-post-meta">
                    {item.issuer} &bull; {item.date}
                  </span>
                  <h3 className="achievement-post-title">{item.title}</h3>
                  <p className="achievement-post-desc">{item.description}</p>
                  <span className="achievement-read-more">Read Full Post &rarr;</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Achievement Detail Modal Pop-up */}
      {selectedAchievement && (
        <div
          className="achievement-modal-overlay"
          onClick={handleCloseModal}
        >
          <div
            className="achievement-modal-content"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside content
          >
            <button
              className="achievement-modal-close"
              onClick={handleCloseModal}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div className="achievement-modal-grid">
              <div className="achievement-modal-image-side">
                <div className="achievement-slider-container">
                  <div className="achievement-image-wrapper-floating">
                    <img
                      key={currentImgIndex}
                      src={selectedAchievement.images[currentImgIndex]}
                      alt={`${selectedAchievement.title} - view ${currentImgIndex + 1}`}
                      className="achievement-modal-image"
                    />
                  </div>
                  
                  {/* Slider Navigation Chevrons if multi-image */}
                  {selectedAchievement.images.length > 1 && (
                    <>
                      <button 
                        className="slider-nav-btn prev" 
                        onClick={handlePrevImage}
                        aria-label="Previous image"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <button 
                        className="slider-nav-btn next" 
                        onClick={handleNextImage}
                        aria-label="Next image"
                      >
                        <ChevronRight size={20} />
                      </button>
                      
                      {/* Indicator Dots */}
                      <div className="slider-dots">
                        {selectedAchievement.images.map((_, idx) => (
                          <span
                            key={idx}
                            className={`slider-dot ${idx === currentImgIndex ? 'active' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCurrentImgIndex(idx);
                            }}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Thumbnails if multi-image */}
                {selectedAchievement.images.length > 1 && (
                  <div className="achievement-modal-thumbnails">
                    {selectedAchievement.images.map((img, idx) => (
                      <div
                        key={idx}
                        className={`achievement-modal-thumbnail-wrapper ${idx === currentImgIndex ? 'active' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentImgIndex(idx);
                        }}
                      >
                        <img
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          className="achievement-modal-thumbnail"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="achievement-modal-info-side">
                <span className="achievement-modal-issuer">
                  {selectedAchievement.issuer} &bull; {selectedAchievement.category}
                </span>
                <h3 className="achievement-modal-title">
                  {selectedAchievement.title}
                </h3>
                <span className="achievement-modal-date">
                  {selectedAchievement.date}
                </span>
                <p className="achievement-modal-desc">
                  {selectedAchievement.fullText || selectedAchievement.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
