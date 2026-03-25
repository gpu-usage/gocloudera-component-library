import React, { useState } from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

/**
 * FAQ Accordion Section Component
 */
const FAQAccordion = ({
  title,
  subtitle,
  items = [],
  allowMultipleOpen = false,
  backgroundColor = '#ffffff',
  className = '',
}) => {
  const [openItems, setOpenItems] = useState(new Set());

  const toggleItem = (index) => {
    setOpenItems(prev => {
      const newSet = new Set(allowMultipleOpen ? prev : []);
      if (prev.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const containerStyle = {
    background: backgroundColor,
    padding: '4rem 2rem',
  };

  return (
    <section className={clsx('faq-accordion-section', className)} style={containerStyle}>
      {(title || subtitle) && (
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px', margin: '0 auto 3rem' }}>
          {title && <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{title}</h2>}
          {subtitle && <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>{subtitle}</p>}
        </div>
      )}

      <div className="faq-list" style={{ maxWidth: '800px', margin: '0 auto' }}>
        {items.map((item, index) => (
          <FAQItem
            key={item.id || index}
            question={item.question}
            answer={item.answer}
            isOpen={openItems.has(index)}
            onToggle={() => toggleItem(index)}
          />
        ))}
      </div>
    </section>
  );
};

/**
 * FAQ Item Component
 */
const FAQItem = ({ question, answer, isOpen, onToggle }) => {
  return (
    <div 
      className="faq-item"
      style={{
        borderBottom: '1px solid #e5e7eb',
        marginBottom: '0.5rem',
      }}
    >
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem 0',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
          fontSize: '1.1rem',
          fontWeight: 600,
          color: '#1f2937',
        }}
      >
        <span>{question}</span>
        <ChevronDown 
          size={20}
          style={{
            transition: 'transform 0.2s',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            flexShrink: 0,
            marginLeft: '1rem',
          }}
        />
      </button>
      
      <div
        style={{
          overflow: 'hidden',
          maxHeight: isOpen ? '1000px' : '0',
          transition: 'max-height 0.3s ease-out',
        }}
      >
        <div 
          style={{ 
            paddingBottom: '1.5rem',
            color: '#4b5563',
            lineHeight: 1.7,
          }}
          dangerouslySetInnerHTML={{ __html: answer }}
        />
      </div>
    </div>
  );
};

export default FAQAccordion;

