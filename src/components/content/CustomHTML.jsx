import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

/**
 * Custom HTML Section Component
 * Renders raw HTML/CSS/JS - use with caution in production!
 */
const CustomHTML = ({
  html,
  css,
  javascript,
  containerClass = '',
  sandboxed = true,
  className = '',
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Inject CSS
    if (css) {
      const styleElement = document.createElement('style');
      styleElement.textContent = css;
      containerRef.current.appendChild(styleElement);
    }

    // Execute JavaScript (only if not sandboxed)
    if (javascript && !sandboxed) {
      try {
        const scriptElement = document.createElement('script');
        scriptElement.textContent = javascript;
        containerRef.current.appendChild(scriptElement);
      } catch (error) {
        console.error('Error executing custom JavaScript:', error);
      }
    }

    return () => {
      // Cleanup
      if (containerRef.current) {
        const styles = containerRef.current.querySelectorAll('style');
        const scripts = containerRef.current.querySelectorAll('script');
        styles.forEach(s => s.remove());
        scripts.forEach(s => s.remove());
      }
    };
  }, [css, javascript, sandboxed]);

  if (sandboxed) {
    // Render in an iframe for sandboxing
    const iframeContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>${css || ''}</style>
        </head>
        <body>
          ${html || ''}
          <script>${javascript || ''}</script>
        </body>
      </html>
    `;

    return (
      <section className={clsx('custom-html-section', containerClass, className)}>
        <iframe
          srcDoc={iframeContent}
          sandbox="allow-scripts"
          style={{
            width: '100%',
            border: 'none',
            minHeight: '200px',
          }}
          title="Custom Content"
        />
      </section>
    );
  }

  return (
    <section 
      ref={containerRef}
      className={clsx('custom-html-section', containerClass, className)}
      dangerouslySetInnerHTML={{ __html: html || '' }}
    />
  );
};

export default CustomHTML;

