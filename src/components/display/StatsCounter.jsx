import React, { useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import * as Icons from 'lucide-react';

/**
 * Stats Counter Section Component
 */
const StatsCounter = ({
  title,
  subtitle,
  stats = [],
  backgroundColor = '#4f46e5',
  gradientFrom,
  gradientTo,
  textColor = '#ffffff',
  animateOnScroll = true,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(!animateOnScroll);
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!animateOnScroll) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [animateOnScroll]);

  const containerStyle = {
    ...(gradientFrom && gradientTo
      ? { backgroundImage: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }
      : { backgroundColor }),
    color: textColor,
    padding: '4rem 2rem',
  };

  return (
    <section 
      ref={sectionRef}
      className={clsx('stats-counter-section', className)} 
      style={containerStyle}
    >
      {(title || subtitle) && (
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          {title && <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{title}</h2>}
          {subtitle && <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>{subtitle}</p>}
        </div>
      )}

      <div 
        className="stats-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(stats.length, 4)}, 1fr)`,
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto',
          textAlign: 'center',
        }}
      >
        {stats.map((stat, index) => (
          <StatItem 
            key={stat.id || index} 
            {...stat} 
            isVisible={isVisible}
            delay={index * 100}
          />
        ))}
      </div>
    </section>
  );
};

/**
 * Stat Item Component with counter animation
 */
const StatItem = ({
  value,
  label,
  prefix = '',
  suffix = '',
  icon,
  isVisible,
  delay = 0,
}) => {
  const [displayValue, setDisplayValue] = useState('0');
  const IconComponent = icon && Icons[icon];
  
  // Parse numeric value for animation
  const numericValue = parseFloat(value?.replace(/[^0-9.]/g, '')) || 0;
  const isNumeric = !isNaN(numericValue) && numericValue > 0;

  useEffect(() => {
    if (!isVisible || !isNumeric) {
      setDisplayValue(value);
      return;
    }

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = numericValue / steps;
    
    let current = 0;
    
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setDisplayValue(value);
          clearInterval(interval);
        } else {
          setDisplayValue(Math.floor(current).toLocaleString());
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timer);
  }, [isVisible, value, numericValue, isNumeric, delay]);

  return (
    <div className="stat-item">
      {IconComponent && (
        <div style={{ marginBottom: '1rem' }}>
          <IconComponent size={40} strokeWidth={1.5} />
        </div>
      )}
      
      <div style={{ 
        fontSize: 'clamp(2rem, 5vw, 3.5rem)',
        fontWeight: 700,
        marginBottom: '0.5rem',
      }}>
        {prefix}{displayValue}{suffix}
      </div>
      
      <div style={{ 
        fontSize: '1rem',
        opacity: 0.9,
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
      }}>
        {label}
      </div>
    </div>
  );
};

export default StatsCounter;

