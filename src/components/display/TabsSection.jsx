import React, { useState } from 'react';
import clsx from 'clsx';
import * as Icons from 'lucide-react';

/**
 * Tabs Section Component
 */
const TabsSection = ({
  title,
  tabs = [],
  tabStyle = 'underline',
  defaultTab = 0,
  backgroundColor = '#ffffff',
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const containerStyle = {
    background: backgroundColor,
    padding: '4rem 2rem',
  };

  const getTabStyle = (index) => {
    const isActive = index === activeTab;
    const baseStyle = {
      padding: '0.75rem 1.5rem',
      border: 'none',
      background: 'none',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: isActive ? 600 : 400,
      color: isActive ? '#4f46e5' : '#6b7280',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'all 0.2s',
    };

    switch (tabStyle) {
      case 'pills':
        return {
          ...baseStyle,
          borderRadius: '9999px',
          background: isActive ? '#4f46e5' : 'transparent',
          color: isActive ? '#fff' : '#6b7280',
        };
      case 'boxed':
        return {
          ...baseStyle,
          borderRadius: '8px 8px 0 0',
          background: isActive ? '#fff' : '#f3f4f6',
          borderBottom: isActive ? '2px solid #fff' : '2px solid transparent',
          marginBottom: '-2px',
        };
      case 'underline':
      default:
        return {
          ...baseStyle,
          borderBottom: isActive ? '2px solid #4f46e5' : '2px solid transparent',
        };
    }
  };

  return (
    <section className={clsx('tabs-section', className)} style={containerStyle}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {title && (
          <h2 style={{ 
            textAlign: 'center', 
            fontSize: '2.5rem', 
            marginBottom: '2rem',
          }}>
            {title}
          </h2>
        )}

        {/* Tab Headers */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: tabStyle === 'pills' ? '0.5rem' : '0',
            borderBottom: tabStyle === 'underline' ? '1px solid #e5e7eb' : 
                          tabStyle === 'boxed' ? '2px solid #e5e7eb' : 'none',
            marginBottom: '2rem',
          }}
        >
          {tabs.map((tab, index) => {
            const IconComponent = tab.icon && Icons[tab.icon];
            return (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                style={getTabStyle(index)}
              >
                {IconComponent && <IconComponent size={18} />}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {tabs[activeTab] && (
            <div
              style={{
                lineHeight: 1.8,
                color: '#374151',
              }}
              dangerouslySetInnerHTML={{ __html: tabs[activeTab].content }}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default TabsSection;

