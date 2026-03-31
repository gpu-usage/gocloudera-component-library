import React, { useState } from 'react';
import clsx from 'clsx';
import * as Icons from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

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
          className="tabs-header"
          style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
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
              className="tab-content-body"
              style={{
                lineHeight: 1.8,
                color: '#374151',
              }}
            >
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                {tabs[activeTab].content || ''}
              </ReactMarkdown>
            </div>
          )}
        </div>
        <style>{`
          .tab-content-body h2 { font-size: 1.75rem; font-weight: 700; margin: 1.5rem 0 1rem; color: #111827; }
          .tab-content-body h3 { font-size: 1.25rem; font-weight: 600; margin: 1.25rem 0 0.75rem; color: #1f2937; }
          .tab-content-body p { margin: 0.75rem 0; }
          .tab-content-body ul, .tab-content-body ol { margin: 0.75rem 0; padding-left: 1.5rem; }
          .tab-content-body li { margin: 0.25rem 0; }
          .tab-content-body code { background: #f3f4f6; padding: 0.15rem 0.4rem; border-radius: 4px; font-size: 0.9em; color: #7c3aed; }
          .tab-content-body pre { background: #1e293b; color: #e2e8f0; padding: 1rem 1.25rem; border-radius: 8px; overflow-x: auto; margin: 1rem 0; }
          .tab-content-body pre code { background: none; color: inherit; padding: 0; }
          .tab-content-body strong { font-weight: 600; color: #111827; }
          .tab-content-body a { color: #7c3aed; text-decoration: underline; }
        `}</style>
      </div>
    </section>
  );
};

export default TabsSection;

