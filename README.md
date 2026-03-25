# GoCloud.era Component Library

A dynamic, Strapi-powered React component library for building pages from CMS content.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           STRAPI CMS                                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │   Pages     │  │  Sections   │  │  Elements   │  │   Forms     │    │
│  │  (content)  │  │ (components)│  │  (atoms)    │  │  (inputs)   │    │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘    │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      COMPONENT LIBRARY                                   │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                     │
│  │ PageRenderer│  │ Component   │  │ Form        │                     │
│  │             │──│ Renderer    │──│ Renderer    │                     │
│  └─────────────┘  └─────────────┘  └─────────────┘                     │
│         │                │                │                             │
│         ▼                ▼                ▼                             │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │                    COMPONENT REGISTRY                            │   │
│  │  Hero | FeatureGrid | CTABanner | Testimonials | PricingTable   │   │
│  │  FAQAccordion | DataTable | FormSection | Timeline | ...        │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      YOUR REACT APP                                      │
│  ┌─────────────────────────────────────────────────────────────────┐   │
│  │  <StrapiProvider apiUrl="...">                                   │   │
│  │    <PageRenderer page={pageData} />                              │   │
│  │  </StrapiProvider>                                               │   │
│  └─────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
```

## Installation

```bash
npm install @gocloudera/component-library
```

## Quick Start

### 1. Wrap your app with StrapiProvider

```jsx
import { StrapiProvider } from '@gocloudera/component-library';

function App() {
  return (
    <StrapiProvider 
      apiUrl={process.env.REACT_APP_STRAPI_URL}
      apiToken={process.env.REACT_APP_STRAPI_TOKEN}
    >
      <YourApp />
    </StrapiProvider>
  );
}
```

### 2. Render dynamic pages

```jsx
import { usePage, PageRenderer } from '@gocloudera/component-library';

function DynamicPage({ slug }) {
  const { page, loading, error } = usePage(slug);

  return (
    <PageRenderer
      page={page}
      loading={loading}
      error={error}
    />
  );
}
```

### 3. Use individual components

```jsx
import { Hero, FeatureGrid, Button } from '@gocloudera/component-library';

function CustomPage() {
  return (
    <>
      <Hero
        title="Welcome"
        subtitle="Build amazing pages"
        primaryButton={{ text: 'Get Started', url: '/start' }}
      />
      <FeatureGrid
        title="Features"
        columns="3"
        features={[
          { title: 'Fast', description: 'Lightning fast pages' },
          { title: 'Dynamic', description: 'CMS-powered content' },
          { title: 'Flexible', description: 'Customize everything' },
        ]}
      />
    </>
  );
}
```

## Component Mapping

| Strapi Component | React Component |
|------------------|-----------------|
| `sections.hero` | `<Hero />` |
| `sections.content-block` | `<ContentBlock />` |
| `sections.feature-grid` | `<FeatureGrid />` |
| `sections.form-section` | `<FormSection />` |
| `sections.cta-banner` | `<CTABanner />` |
| `sections.testimonials` | `<Testimonials />` |
| `sections.pricing-table` | `<PricingTable />` |
| `sections.faq-accordion` | `<FAQAccordion />` |
| `sections.image-gallery` | `<ImageGallery />` |
| `sections.video-embed` | `<VideoEmbed />` |
| `sections.data-table` | `<DataTable />` |
| `sections.stats-counter` | `<StatsCounter />` |
| `sections.timeline` | `<Timeline />` |
| `sections.tabs-section` | `<TabsSection />` |
| `sections.custom-html` | `<CustomHTML />` |

## Form Field Mapping

| Strapi Field Type | React Component |
|-------------------|-----------------|
| `text`, `email`, `password`, `number` | `<TextField />` |
| `textarea` | `<TextArea />` |
| `select`, `multiselect` | `<Select />` |
| `checkbox` | `<Checkbox />` |
| `radio` | `<RadioGroup />` |
| `date`, `time`, `datetime` | `<DatePicker />` |
| `file` | `<FileUpload />` |

## Extending Components

### Register Custom Components

```jsx
import { registerComponent } from '@gocloudera/component-library';

// Register a custom component
registerComponent('sections.custom-widget', MyCustomWidget);
```

### Override Components

```jsx
import { PageRenderer } from '@gocloudera/component-library';
import MyCustomHero from './MyCustomHero';

function Page({ page }) {
  return (
    <PageRenderer
      page={page}
      componentOverrides={{
        'sections.hero': MyCustomHero,
      }}
    />
  );
}
```

### Register Custom Form Fields

```jsx
import { registerField } from '@gocloudera/component-library';

// Register a custom field type
registerField('color', ColorPickerField);
```

## Hooks

### usePage(slug)

Fetch a page by its slug.

```jsx
const { page, loading, error } = usePage('about-us');
```

### useNavigation()

Fetch navigation tree.

```jsx
const { pages, loading, error } = useNavigation();
```

### useForm(fields, options)

Manage dynamic form state.

```jsx
const { values, errors, handleChange, handleSubmit } = useForm(fields, {
  onSubmit: async (values) => { /* ... */ },
  validateOnChange: true,
});
```

### useStrapi()

Access Strapi context for custom queries.

```jsx
const { fetchFromStrapi, fetchPage, clearCache } = useStrapi();
```

## Available Components

### Display Components
- **Hero** - Full-width hero banner with CTA
- **FeatureGrid** - Grid of feature cards
- **CTABanner** - Call-to-action banner
- **Testimonials** - Customer testimonials (carousel/grid)
- **PricingTable** - Pricing plans comparison
- **FAQAccordion** - Collapsible FAQ section
- **StatsCounter** - Animated statistics
- **ImageGallery** - Image grid with lightbox
- **VideoEmbed** - YouTube/Vimeo/MP4 embed
- **Timeline** - Vertical timeline
- **TabsSection** - Tabbed content

### Content Components
- **ContentBlock** - Rich text content
- **CustomHTML** - Raw HTML/CSS/JS (sandboxed)

### Form Components
- **Button** - Action button
- **TextField** - Text input
- **TextArea** - Multi-line text
- **Select** - Dropdown/multiselect
- **Checkbox** - Boolean checkbox
- **RadioGroup** - Radio button group
- **DatePicker** - Date/time input
- **FileUpload** - File upload with drag & drop

### Data Components
- **DataTable** - Sortable, searchable, paginated table

## Theming

Components use CSS variables for easy theming. Override in your app:

```css
:root {
  --gc-primary: #4f46e5;
  --gc-primary-dark: #4338ca;
  --gc-text: #374151;
  --gc-text-light: #6b7280;
  --gc-border: #e5e7eb;
  --gc-background: #f9fafb;
}
```

## License

MIT - GoCloud.era

