import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

/**
 * Testimonials Section Component
 */
const Testimonials = ({
  title,
  subtitle,
  displayMode = 'carousel',
  items = [],
  backgroundColor = '#f8f9fa',
  className = '',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const containerStyle = {
    background: backgroundColor,
    padding: '4rem 2rem',
  };

  // Auto-advance carousel
  useEffect(() => {
    if (displayMode === 'carousel' && items.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % items.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [displayMode, items.length]);

  const nextSlide = () => setCurrentIndex(prev => (prev + 1) % items.length);
  const prevSlide = () => setCurrentIndex(prev => (prev - 1 + items.length) % items.length);

  return (
    <section className={clsx('testimonials-section', className)} style={containerStyle}>
      {(title || subtitle) && (
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          {title && <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{title}</h2>}
          {subtitle && <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>{subtitle}</p>}
        </div>
      )}

      {displayMode === 'carousel' ? (
        <div className="testimonials-carousel" style={{ 
          position: 'relative', 
          maxWidth: '800px', 
          margin: '0 auto',
        }}>
          <TestimonialCard {...items[currentIndex]} />
          
          {items.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                style={{
                  position: 'absolute',
                  left: '-60px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '50%',
                  width: '44px',
                  height: '44px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                style={{
                  position: 'absolute',
                  right: '-60px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '50%',
                  width: '44px',
                  height: '44px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ChevronRight size={20} />
              </button>

              {/* Dots */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                gap: '0.5rem',
                marginTop: '2rem',
              }}>
                {items.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      border: 'none',
                      background: idx === currentIndex ? '#4f46e5' : '#d1d5db',
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div 
          className="testimonials-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            maxWidth: '1200px',
            margin: '0 auto',
          }}
        >
          {items.map((item, idx) => (
            <TestimonialCard key={item.id || idx} {...item} />
          ))}
        </div>
      )}
    </section>
  );
};

/**
 * Testimonial Card Component
 */
const TestimonialCard = ({
  quote,
  authorName,
  authorTitle,
  authorCompany,
  authorImage,
  rating,
}) => {
  const imageUrl = authorImage?.data?.attributes?.url || authorImage?.url;

  return (
    <div 
      className="testimonial-card"
      style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '2rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      }}
    >
      {rating && (
        <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '1rem' }}>
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i}
              size={18}
              fill={i < rating ? '#f59e0b' : 'none'}
              color={i < rating ? '#f59e0b' : '#d1d5db'}
            />
          ))}
        </div>
      )}

      <p style={{ 
        fontSize: '1.1rem',
        lineHeight: 1.7,
        color: '#374151',
        marginBottom: '1.5rem',
        fontStyle: 'italic',
      }}>
        "{quote}"
      </p>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {imageUrl ? (
          <img 
            src={imageUrl}
            alt={authorName}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 600,
          }}>
            {authorName?.[0]?.toUpperCase()}
          </div>
        )}
        
        <div>
          <div style={{ fontWeight: 600, color: '#1f2937' }}>{authorName}</div>
          {(authorTitle || authorCompany) && (
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              {authorTitle}{authorTitle && authorCompany && ', '}{authorCompany}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Testimonials;

