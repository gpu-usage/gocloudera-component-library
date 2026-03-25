import React from 'react';
import clsx from 'clsx';
import Button from '../forms/Button';

/**
 * Hero Section Component
 */
const Hero = ({
  title,
  subtitle,
  backgroundImage,
  backgroundVideo,
  alignment = 'center',
  height = 'large',
  overlay = true,
  overlayColor = 'rgba(0,0,0,0.5)',
  textColor = '#ffffff',
  primaryButton,
  secondaryButton,
  className = '',
}) => {
  const heightMap = {
    small: '40vh',
    medium: '60vh',
    large: '80vh',
    fullScreen: '100vh',
  };

  const bgImageUrl = backgroundImage?.data?.attributes?.url || backgroundImage?.url;

  const containerStyle = {
    position: 'relative',
    minHeight: heightMap[height],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: bgImageUrl ? `url(${bgImageUrl})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: textColor,
  };

  const overlayStyle = overlay ? {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: overlayColor,
  } : {};

  const contentStyle = {
    position: 'relative',
    zIndex: 1,
    textAlign: alignment,
    maxWidth: '900px',
    padding: '2rem',
  };

  return (
    <section className={clsx('hero-section', className)} style={containerStyle}>
      {/* Background Video */}
      {backgroundVideo && (
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        >
          <source src={backgroundVideo} type="video/mp4" />
        </video>
      )}

      {/* Overlay */}
      {overlay && <div className="hero-overlay" style={overlayStyle} />}

      {/* Content */}
      <div className="hero-content" style={contentStyle}>
        {title && (
          <h1 style={{ 
            fontSize: 'clamp(2rem, 5vw, 4rem)',
            fontWeight: 700,
            marginBottom: '1rem',
            lineHeight: 1.2,
          }}>
            {title}
          </h1>
        )}
        
        {subtitle && (
          <p style={{ 
            fontSize: 'clamp(1rem, 2vw, 1.5rem)',
            opacity: 0.9,
            marginBottom: '2rem',
            lineHeight: 1.6,
          }}>
            {subtitle}
          </p>
        )}

        {(primaryButton || secondaryButton) && (
          <div className="hero-buttons" style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: alignment,
            flexWrap: 'wrap',
          }}>
            {primaryButton && <Button {...primaryButton} />}
            {secondaryButton && <Button {...secondaryButton} variant="outline" />}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;

