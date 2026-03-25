import React from 'react';
import clsx from 'clsx';
import * as Icons from 'lucide-react';

/**
 * Timeline Section Component
 */
const Timeline = ({
  title,
  orientation = 'vertical',
  items = [],
  accentColor = '#4f46e5',
  backgroundColor = '#ffffff',
  className = '',
}) => {
  const containerStyle = {
    background: backgroundColor,
    padding: '4rem 2rem',
  };

  return (
    <section className={clsx('timeline-section', className)} style={containerStyle}>
      {title && (
        <h2 style={{ 
          textAlign: 'center', 
          fontSize: '2.5rem', 
          marginBottom: '3rem',
        }}>
          {title}
        </h2>
      )}

      <div 
        className="timeline"
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          position: 'relative',
        }}
      >
        {/* Vertical Line */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '2px',
            height: '100%',
            background: '#e5e7eb',
          }}
        />

        {items.map((item, index) => (
          <TimelineItem 
            key={item.id || index}
            {...item}
            index={index}
            accentColor={accentColor}
          />
        ))}
      </div>
    </section>
  );
};

/**
 * Timeline Item Component
 */
const TimelineItem = ({
  title,
  description,
  date,
  icon,
  image,
  index,
  accentColor,
}) => {
  const isEven = index % 2 === 0;
  const IconComponent = icon && Icons[icon];
  const imageUrl = image?.data?.attributes?.url || image?.url;

  return (
    <div
      className="timeline-item"
      style={{
        display: 'flex',
        justifyContent: isEven ? 'flex-start' : 'flex-end',
        paddingLeft: isEven ? 0 : '50%',
        paddingRight: isEven ? '50%' : 0,
        marginBottom: '3rem',
        position: 'relative',
      }}
    >
      {/* Dot */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          background: accentColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          zIndex: 1,
        }}
      >
        {IconComponent ? (
          <IconComponent size={20} />
        ) : (
          <span style={{ fontWeight: 600 }}>{index + 1}</span>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          background: '#fff',
          borderRadius: '12px',
          padding: '1.5rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          marginLeft: isEven ? 0 : '2rem',
          marginRight: isEven ? '2rem' : 0,
          maxWidth: 'calc(50% - 40px)',
          width: '100%',
        }}
      >
        {date && (
          <div style={{ 
            color: accentColor, 
            fontWeight: 600, 
            fontSize: '0.9rem',
            marginBottom: '0.5rem',
          }}>
            {date}
          </div>
        )}

        <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', fontWeight: 600 }}>
          {title}
        </h3>

        {imageUrl && (
          <img
            src={imageUrl}
            alt={title}
            style={{
              width: '100%',
              borderRadius: '8px',
              marginBottom: '0.75rem',
            }}
          />
        )}

        {description && (
          <div 
            style={{ color: '#4b5563', lineHeight: 1.6 }}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </div>
    </div>
  );
};

export default Timeline;

