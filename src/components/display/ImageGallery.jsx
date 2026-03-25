import React, { useState } from 'react';
import clsx from 'clsx';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Image Gallery Section Component
 */
const ImageGallery = ({
  title,
  images = [],
  columns = '3',
  enableLightbox = true,
  aspectRatio = 'square',
  className = '',
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const colCount = parseInt(columns, 10);
  
  const aspectRatioMap = {
    square: '1 / 1',
    portrait: '3 / 4',
    landscape: '16 / 9',
    auto: 'auto',
  };

  // Handle both array of media objects and direct URLs
  const imageList = images?.data?.map(img => ({
    url: img.attributes?.url || img.url,
    alt: img.attributes?.alternativeText || img.alternativeText || '',
  })) || images.map?.(img => ({
    url: img.url || img,
    alt: img.alt || '',
  })) || [];

  const openLightbox = (index) => {
    if (enableLightbox) {
      setCurrentIndex(index);
      setLightboxOpen(true);
    }
  };

  const closeLightbox = () => setLightboxOpen(false);
  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % imageList.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + imageList.length) % imageList.length);

  return (
    <section className={clsx('image-gallery-section', className)} style={{ padding: '4rem 2rem' }}>
      {title && (
        <h2 style={{ 
          textAlign: 'center', 
          fontSize: '2.5rem', 
          marginBottom: '2rem',
        }}>
          {title}
        </h2>
      )}

      <div 
        className="gallery-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${colCount}, 1fr)`,
          gap: '1rem',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {imageList.map((image, index) => (
          <div
            key={index}
            onClick={() => openLightbox(index)}
            style={{
              aspectRatio: aspectRatioMap[aspectRatio],
              overflow: 'hidden',
              borderRadius: '8px',
              cursor: enableLightbox ? 'pointer' : 'default',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={(e) => {
              if (enableLightbox) e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <img
              src={image.url}
              alt={image.alt}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.95)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'transparent',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              padding: '0.5rem',
            }}
          >
            <X size={32} />
          </button>

          {imageList.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  padding: '1rem',
                }}
              >
                <ChevronLeft size={40} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  background: 'transparent',
                  border: 'none',
                  color: '#fff',
                  cursor: 'pointer',
                  padding: '1rem',
                }}
              >
                <ChevronRight size={40} />
              </button>
            </>
          )}

          <img
            src={imageList[currentIndex]?.url}
            alt={imageList[currentIndex]?.alt}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90vw',
              maxHeight: '90vh',
              objectFit: 'contain',
            }}
          />
        </div>
      )}
    </section>
  );
};

export default ImageGallery;

