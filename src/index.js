// Context
export { StrapiProvider, useStrapi } from './context/StrapiContext';

// Hooks
export { usePage } from './hooks/usePage';
export { useNavigation } from './hooks/useNavigation';
export { useForm } from './hooks/useForm';

// Renderers
export { 
  ComponentRenderer, 
  registerComponent, 
  getRegisteredComponents 
} from './renderer/ComponentRenderer';
export { PageRenderer, getPageMeta } from './renderer/PageRenderer';
export { FormRenderer, registerField } from './renderer/FormRenderer';

// Display Components
export { default as Hero } from './components/display/Hero';
export { default as FeatureGrid } from './components/display/FeatureGrid';
export { default as CTABanner } from './components/display/CTABanner';
export { default as FAQAccordion } from './components/display/FAQAccordion';
export { default as Testimonials } from './components/display/Testimonials';
export { default as StatsCounter } from './components/display/StatsCounter';
export { default as PricingTable } from './components/display/PricingTable';
export { default as ImageGallery } from './components/display/ImageGallery';
export { default as VideoEmbed } from './components/display/VideoEmbed';
export { default as Timeline } from './components/display/Timeline';
export { default as TabsSection } from './components/display/TabsSection';

// Content Components
export { default as ContentBlock } from './components/content/ContentBlock';
export { default as CustomHTML } from './components/content/CustomHTML';

// Form Components
export { default as Button } from './components/forms/Button';
export { default as TextField } from './components/forms/TextField';
export { default as TextArea } from './components/forms/TextArea';
export { default as Select } from './components/forms/Select';
export { default as Checkbox } from './components/forms/Checkbox';
export { default as RadioGroup } from './components/forms/RadioGroup';
export { default as DatePicker } from './components/forms/DatePicker';
export { default as FileUpload } from './components/forms/FileUpload';
export { default as FormSection } from './components/forms/FormSection';

// Data Components
export { default as DataTable } from './components/data/DataTable';

