import { useEffect, useCallback, useRef } from 'react';

/**
 * Hook that injects analytics scripts based on site integrations from Strapi.
 *
 * Supports:
 * - Google Analytics (GA4)
 * - Google Tag Manager
 * - Facebook Pixel
 * - Hotjar
 * - Custom head/body scripts
 *
 * Usage in App.js:
 *   const { integrations } = useSiteConfig();
 *   useAnalytics(integrations);
 */
export const useAnalytics = (integrations) => {
  const injectedRef = useRef(false);

  useEffect(() => {
    if (!integrations || injectedRef.current) return;
    injectedRef.current = true;

    // --- Google Analytics (GA4) ---
    if (integrations.googleAnalyticsId) {
      const gaId = integrations.googleAnalyticsId;
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
      document.head.appendChild(script);

      const inlineScript = document.createElement('script');
      inlineScript.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${gaId}');
      `;
      document.head.appendChild(inlineScript);
    }

    // --- Google Tag Manager ---
    if (integrations.googleTagManagerId) {
      const gtmId = integrations.googleTagManagerId;
      const script = document.createElement('script');
      script.textContent = `
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${gtmId}');
      `;
      document.head.appendChild(script);

      // GTM noscript fallback
      const noscript = document.createElement('noscript');
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.googletagmanager.com/ns.html?id=${gtmId}`;
      iframe.height = '0';
      iframe.width = '0';
      iframe.style.display = 'none';
      iframe.style.visibility = 'hidden';
      noscript.appendChild(iframe);
      document.body.prepend(noscript);
    }

    // --- Facebook Pixel ---
    if (integrations.facebookPixelId) {
      const fbId = integrations.facebookPixelId;
      const script = document.createElement('script');
      script.textContent = `
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${fbId}');
        fbq('track', 'PageView');
      `;
      document.head.appendChild(script);
    }

    // --- Hotjar ---
    if (integrations.hotjarId) {
      const hjId = integrations.hotjarId;
      const script = document.createElement('script');
      script.textContent = `
        (function(h,o,t,j,a,r){
          h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
          h._hjSettings={hjid:${hjId},hjsv:6};
          a=o.getElementsByTagName('head')[0];
          r=o.createElement('script');r.async=1;
          r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
          a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
      `;
      document.head.appendChild(script);
    }

    // --- Custom head scripts ---
    if (integrations.customHeadScripts) {
      const container = document.createElement('div');
      container.innerHTML = integrations.customHeadScripts;
      Array.from(container.children).forEach(child => {
        document.head.appendChild(child.cloneNode(true));
      });
    }

    // --- Custom body scripts ---
    if (integrations.customBodyScripts) {
      const container = document.createElement('div');
      container.innerHTML = integrations.customBodyScripts;
      Array.from(container.children).forEach(child => {
        document.body.appendChild(child.cloneNode(true));
      });
    }
  }, [integrations]);

  /**
   * Track a custom event (works with GA4 and Facebook Pixel).
   */
  const trackEvent = useCallback((eventName, params = {}) => {
    // GA4
    if (window.gtag) {
      window.gtag('event', eventName, params);
    }

    // Facebook Pixel
    if (window.fbq) {
      window.fbq('trackCustom', eventName, params);
    }

    // GTM dataLayer
    if (window.dataLayer) {
      window.dataLayer.push({
        event: eventName,
        ...params,
      });
    }
  }, []);

  /**
   * Track a page view (called on route change in SPA).
   */
  const trackPageView = useCallback((path, title) => {
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: path,
        page_title: title,
      });
    }
    if (window.fbq) {
      window.fbq('track', 'PageView');
    }
  }, []);

  return { trackEvent, trackPageView };
};

export default useAnalytics;
