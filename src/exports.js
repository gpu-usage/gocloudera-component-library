/**
 * Source entry point for local development.
 * Re-exports all components from their actual source files.
 */

// Display components
export { default as Hero } from './components/display/Hero';
export { default as CTABanner } from './components/display/CTABanner';
export { default as FAQAccordion } from './components/display/FAQAccordion';
export { default as FeatureGrid } from './components/display/FeatureGrid';
export { default as ImageGallery } from './components/display/ImageGallery';
export { default as PricingTable } from './components/display/PricingTable';
export { default as StatsCounter } from './components/display/StatsCounter';
export { default as TabsSection } from './components/display/TabsSection';
export { default as Testimonials } from './components/display/Testimonials';
export { default as Timeline } from './components/display/Timeline';
export { default as VideoEmbed } from './components/display/VideoEmbed';

// Content components
export { default as ContentBlock } from './components/content/ContentBlock';
export { default as CustomHTML } from './components/content/CustomHTML';

// Data components
export { default as DataTable } from './components/data/DataTable';

// Form components
export { default as Button } from './components/forms/Button';
export { default as Checkbox } from './components/forms/Checkbox';
export { default as DatePicker } from './components/forms/DatePicker';
export { default as FileUpload } from './components/forms/FileUpload';
export { default as FormSection } from './components/forms/FormSection';
export { default as RadioGroup } from './components/forms/RadioGroup';
export { default as Select } from './components/forms/Select';
export { default as TextArea } from './components/forms/TextArea';
export { default as TextField } from './components/forms/TextField';

// Context
export { StrapiProvider, useStrapi } from './context/StrapiContext';

// Hooks
export { default as useForm } from './hooks/useForm';
export { default as useNavigation } from './hooks/useNavigation';
export { default as usePage, resolvePageType, getPagePath } from './hooks/usePage';
export { default as useSiteConfig } from './hooks/useSiteConfig';
export { default as useFormSubmission } from './hooks/useFormSubmission';
export { default as useAnalytics } from './hooks/useAnalytics';

// Renderers
export { default as ComponentRenderer, registerComponent, getRegisteredComponents } from './renderer/ComponentRenderer';
export { default as FormRenderer, registerField } from './renderer/FormRenderer';
export { default as PageRenderer, getPageMeta } from './renderer/PageRenderer';
