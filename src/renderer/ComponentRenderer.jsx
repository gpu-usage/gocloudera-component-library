import React from 'react';

// Import all section components
import Hero from '../components/display/Hero';
import ContentBlock from '../components/content/ContentBlock';
import FeatureGrid from '../components/display/FeatureGrid';
import FormSection from '../components/forms/FormSection';
import CTABanner from '../components/display/CTABanner';
import Testimonials from '../components/display/Testimonials';
import PricingTable from '../components/display/PricingTable';
import FAQAccordion from '../components/display/FAQAccordion';
import ImageGallery from '../components/display/ImageGallery';
import VideoEmbed from '../components/display/VideoEmbed';
import DataTable from '../components/data/DataTable';
import StatsCounter from '../components/display/StatsCounter';
import Timeline from '../components/display/Timeline';
import TabsSection from '../components/display/TabsSection';
import CustomHTML from '../components/content/CustomHTML';

/**
 * Component Registry - Maps Strapi component names to React components
 */
const COMPONENT_REGISTRY = {
  'sections.hero': Hero,
  'sections.content-block': ContentBlock,
  'sections.feature-grid': FeatureGrid,
  'sections.form-section': FormSection,
  'sections.cta-banner': CTABanner,
  'sections.testimonials': Testimonials,
  'sections.pricing-table': PricingTable,
  'sections.faq-accordion': FAQAccordion,
  'sections.image-gallery': ImageGallery,
  'sections.video-embed': VideoEmbed,
  'sections.data-table': DataTable,
  'sections.stats-counter': StatsCounter,
  'sections.timeline': Timeline,
  'sections.tabs-section': TabsSection,
  'sections.custom-html': CustomHTML,
};

/**
 * ComponentRenderer - Renders a single Strapi component
 */
export const ComponentRenderer = ({ 
  component, 
  componentOverrides = {},
  onFormSubmit,
  className = '' 
}) => {
  if (!component) return null;

  const componentType = component.__component;
  
  // Check for custom override first
  const Component = componentOverrides[componentType] || COMPONENT_REGISTRY[componentType];

  if (!Component) {
    console.warn(`Unknown component type: ${componentType}`);
    return (
      <div className="component-unknown" style={{ 
        padding: '2rem', 
        background: '#fee', 
        border: '1px solid #f00',
        margin: '1rem 0'
      }}>
        Unknown component: {componentType}
      </div>
    );
  }

  // Pass component data as props, excluding __component
  const { __component, id, ...props } = component;

  return (
    <div 
      className={`component-section component-${componentType.replace('sections.', '')} ${className}`}
      data-component-id={id}
      data-component-type={componentType}
    >
      <Component {...props} onFormSubmit={onFormSubmit} />
    </div>
  );
};

/**
 * Register a custom component
 */
export const registerComponent = (name, component) => {
  COMPONENT_REGISTRY[name] = component;
};

/**
 * Get all registered components
 */
export const getRegisteredComponents = () => {
  return { ...COMPONENT_REGISTRY };
};

export default ComponentRenderer;

