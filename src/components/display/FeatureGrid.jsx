import React from 'react';
import clsx from 'clsx';
import { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';

/**
 * Feature Grid Section Component
 */
const FeatureGrid = ({
  title,
  subtitle,
  columns = '3',
  features = [],
  backgroundColor = '#f8f9fa',
  className = '',
}) => {
  const colCount = parseInt(columns, 10);

  const containerStyle = {
    background: backgroundColor,
    padding: '4rem 2rem',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${colCount}, 1fr)`,
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  return (
    <section className={clsx('feature-grid-section', className)} style={containerStyle}>
      {(title || subtitle) && (
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          {title && <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{title}</h2>}
          {subtitle && <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>{subtitle}</p>}
        </div>
      )}

      <div className="feature-grid" style={gridStyle}>
        {features.map((feature, index) => (
          <FeatureCard key={feature.id || index} {...feature} />
        ))}
      </div>
    </section>
  );
};

/**
 * Feature Card Component
 */
const FeatureCard = ({
  title,
  description,
  icon,
  image,
  link,
  linkText = 'Learn more',
}) => {
  const imageUrl = image?.data?.attributes?.url || image?.url;
  const IconComponent = icon && Icons[icon];

  const cardStyle = {
    background: '#ffffff',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: link ? 'pointer' : 'default',
  };

  const handleClick = () => {
    if (link) {
      window.location.href = link;
    }
  };

  return (
    <div 
      className="feature-card" 
      style={cardStyle}
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
      }}
    >
      {imageUrl && (
        <img 
          src={imageUrl} 
          alt={title}
          style={{ 
            width: '100%', 
            height: '150px', 
            objectFit: 'cover',
            borderRadius: '8px',
            marginBottom: '1rem',
          }}
        />
      )}

      {IconComponent && !imageUrl && (
        <div style={{ 
          width: '60px', 
          height: '60px', 
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1rem',
        }}>
          <IconComponent size={28} color="#fff" />
        </div>
      )}

      {title && (
        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 600 }}>
          {title}
        </h3>
      )}

      {description && (
        <p style={{ color: '#666', lineHeight: 1.6, marginBottom: link ? '1rem' : 0 }}>
          {description}
        </p>
      )}

      {link && (
        <a 
          href={link}
          style={{ 
            color: '#4f46e5', 
            textDecoration: 'none',
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {linkText} →
        </a>
      )}
    </div>
  );
};

export default FeatureGrid;

