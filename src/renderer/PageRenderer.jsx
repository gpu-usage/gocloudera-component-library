import React, { useEffect } from 'react';
import ComponentRenderer from './ComponentRenderer';

/**
 * PageRenderer - Renders a complete page from Strapi page data.
 *
 * Works with both Strapi data shapes:
 *   - { attributes: { title, layout: [...] } }   (Strapi v5 REST)
 *   - { title, layout: [...] }                    (flat / pre-extracted)
 *   - { attributes: { title, sections: [...] } }  (legacy)
 */
export const PageRenderer = ({
  page,
  componentOverrides = {},
  onFormSubmit,
  layout: LayoutComponent,
  loading = false,
  error = null,
  notFound = null,
  loadingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  scrollToTop = true,
  className = '',
}) => {
  // Scroll to top when page changes
  useEffect(() => {
    if (scrollToTop && page) {
      window.scrollTo(0, 0);
    }
  }, [page, scrollToTop]);

  // Handle loading state
  if (loading) {
    if (LoadingComponent) {
      return <LoadingComponent />;
    }
    return (
      <div className="page-loading" style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh'
      }}>
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    if (ErrorComponent) {
      return <ErrorComponent error={error} />;
    }
    return (
      <div className="page-error" style={{
        padding: '2rem',
        textAlign: 'center',
        minHeight: '50vh'
      }}>
        <h2>Error Loading Page</h2>
        <p>{error.message || 'An unexpected error occurred'}</p>
      </div>
    );
  }

  // Handle not found
  if (!page) {
    if (notFound) {
      return notFound;
    }
    return (
      <div className="page-not-found" style={{
        padding: '2rem',
        textAlign: 'center',
        minHeight: '50vh'
      }}>
        <h1>404</h1>
        <p>Page not found</p>
      </div>
    );
  }

  const attributes = page.attributes || page;
  // Support both "layout" (current Strapi schema) and "sections" (legacy)
  const sections = attributes.layout || attributes.sections || [];
  const { title, metadata, metaTitle, metaDescription } = attributes;

  // Build page content
  const pageContent = (
    <div
      className={`page-content ${className}`}
      data-page-id={page.id || page.documentId}
    >
      <main className="page-sections">
        {sections.map((section, index) => (
          <ComponentRenderer
            key={section.id || index}
            component={section}
            componentOverrides={componentOverrides}
            onFormSubmit={onFormSubmit}
            sectionIndex={index}
          />
        ))}
      </main>
    </div>
  );

  // Wrap in layout if provided
  if (LayoutComponent) {
    return (
      <LayoutComponent
        page={page}
        title={metaTitle || metadata?.title || title}
        description={metaDescription || metadata?.description}
      >
        {pageContent}
      </LayoutComponent>
    );
  }

  return pageContent;
};

/**
 * Helper to get page meta data
 */
export const getPageMeta = (page) => {
  if (!page) return null;

  const attrs = page.attributes || page;
  const meta = attrs.metadata || {};
  return {
    title: meta.title || attrs.metaTitle || attrs.title,
    description: meta.description || attrs.metaDescription,
    keywords: meta.keywords || attrs.metaKeywords,
    ogImage: attrs.ogImage?.data?.attributes?.url,
  };
};

export default PageRenderer;
