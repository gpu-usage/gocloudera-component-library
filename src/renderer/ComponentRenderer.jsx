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
 * Component Registry - Maps Strapi component names to React components.
 *
 * Supports both naming conventions:
 *   - layout.*  (Strapi actual component category — from dynamic zone)
 *   - sections.* (legacy naming — for backward compatibility)
 *
 * This means the same library works regardless of how the Strapi
 * schema names its component categories.
 */
const COMPONENT_REGISTRY = {
  // Primary: layout.* — matches Strapi schema
  'layout.hero': Hero,
  'layout.content': ContentBlock,
  'layout.feature-grid': FeatureGrid,
  'layout.form': FormSection,
  'layout.cta-banner': CTABanner,
  'layout.testimonials': Testimonials,
  'layout.pricing-table': PricingTable,
  'layout.faq-accordion': FAQAccordion,
  'layout.image-gallery': ImageGallery,
  'layout.video-embed': VideoEmbed,
  'layout.data-table': DataTable,
  'layout.stats-counter': StatsCounter,
  'layout.timeline': Timeline,
  'layout.tabs-section': TabsSection,
  'layout.custom-html': CustomHTML,

  // Legacy: sections.* — backward compatibility
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
 * Normalize a component type string for CSS class naming.
 * Strips any category prefix (layout., sections., etc.)
 */
const normalizeType = (type) => {
  if (!type) return 'unknown';
  const parts = type.split('.');
  return parts[parts.length - 1];
};

/**
 * ComponentRenderer - Renders a single Strapi component
 */
export const ComponentRenderer = ({
  component,
  componentOverrides = {},
  onFormSubmit,
  sectionIndex = 0,
  className = ''
}) => {
  if (!component) return null;

  const componentType = component.__component;

  // Check for custom override first, then registry
  const Component = componentOverrides[componentType] || COMPONENT_REGISTRY[componentType];

  if (!Component) {
    if (process.env.NODE_ENV === 'development') {
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
    return null;
  }

  // Pass component data as props, excluding __component and id
  const { __component, id, ...props } = component;

  return (
    <div
      className={`component-section component-${normalizeType(componentType)} ${className}`}
      data-component-id={id}
      data-component-type={componentType}
      data-section-index={sectionIndex}
    >
      <Component {...props} sectionIndex={sectionIndex} onFormSubmit={onFormSubmit} />
    </div>
  );
};

/**
 * Register a custom component (supports both naming conventions)
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
