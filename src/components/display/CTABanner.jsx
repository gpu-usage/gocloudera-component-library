import React from 'react';
import clsx from 'clsx';
import Button from '../forms/Button';

/**
 * CTA Banner Section Component
 */
const CTABanner = ({
  title,
  subtitle,
  backgroundColor = '#4f46e5',
  gradientFrom,
  gradientTo,
  textColor = '#ffffff',
  button,
  alignment = 'center',
  className = '',
}) => {
  const containerStyle = {
    ...(gradientFrom && gradientTo
      ? { backgroundImage: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }
      : { backgroundColor }),
    color: textColor,
    padding: '4rem 2rem',
    textAlign: alignment,
  };

  const contentStyle = {
    maxWidth: '800px',
    margin: alignment === 'center' ? '0 auto' : undefined,
  };

  return (
    <section className={clsx('cta-banner-section', className)} style={containerStyle}>
      <div style={contentStyle}>
        {title && (
          <h2 style={{ 
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            fontWeight: 700,
            marginBottom: '0.5rem',
          }}>
            {title}
          </h2>
        )}

        {subtitle && (
          <p style={{ 
            fontSize: '1.2rem',
            opacity: 0.9,
            marginBottom: '2rem',
          }}>
            {subtitle}
          </p>
        )}

        {button && (
          <Button
            text={button.text}
            link={button.link}
            variant={button.style || button.variant || 'secondary'}
          />
        )}
      </div>
    </section>
  );
};

export default CTABanner;

