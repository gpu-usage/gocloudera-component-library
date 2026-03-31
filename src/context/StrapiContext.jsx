import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Strapi Context - Provides Strapi configuration and site-scoped data fetching.
 *
 * siteSlug scopes ALL queries to a specific site. This is what makes the same
 * component library work for multiple websites — each site sets its own slug
 * and only sees its own content from a shared Strapi instance.
 */
const StrapiContext = createContext(null);

export const StrapiProvider = ({
  children,
  apiUrl,
  apiToken = null,
  siteSlug = null,
  cacheTime = 60000 // 1 minute default cache
}) => {
  const [cache, setCache] = useState({});

  /**
   * Fetch data from Strapi API with caching
   */
  const fetchFromStrapi = useCallback(async (endpoint, options = {}) => {
    const cacheKey = `${siteSlug || ''}:${endpoint}:${JSON.stringify(options)}`;
    const now = Date.now();

    // Check cache
    if (cache[cacheKey] && (now - cache[cacheKey].timestamp) < cacheTime) {
      return cache[cacheKey].data;
    }

    const headers = {
      'Content-Type': 'application/json',
    };

    if (apiToken) {
      headers['Authorization'] = `Bearer ${apiToken}`;
    }

    const response = await fetch(`${apiUrl}/api/${endpoint}`, {
      headers,
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Strapi API error: ${response.status}`);
    }

    const data = await response.json();

    // Update cache
    setCache(prev => ({
      ...prev,
      [cacheKey]: { data, timestamp: now }
    }));

    return data;
  }, [apiUrl, apiToken, siteSlug, cacheTime, cache]);

  /**
   * Fetch a page by its pageType enum, scoped to the current site.
   *
   * Query:
   *   GET /api/pages?filters[pageType][$eq]=home&filters[site][slug][$eq]=gocloudera
   *       &populate[layout][populate]=*&populate[metadata]=*
   */
  const fetchPage = useCallback(async (pageType) => {
    let endpoint = `pages?filters[pageType][$eq]=${pageType}`;

    if (siteSlug) {
      endpoint += `&filters[site][slug][$eq]=${siteSlug}`;
    }

    endpoint += '&populate[layout][populate]=*&populate[metadata]=*';

    const data = await fetchFromStrapi(endpoint);
    return data?.data?.[0] || null;
  }, [fetchFromStrapi, siteSlug]);

  /**
   * Fetch a custom page by its customSlug, scoped to the current site.
   */
  const fetchCustomPage = useCallback(async (slug) => {
    let endpoint = `pages?filters[pageType][$eq]=custom&filters[customSlug][$eq]=${slug}`;

    if (siteSlug) {
      endpoint += `&filters[site][slug][$eq]=${siteSlug}`;
    }

    endpoint += '&populate[layout][populate]=*&populate[metadata]=*';

    const data = await fetchFromStrapi(endpoint);
    return data?.data?.[0] || null;
  }, [fetchFromStrapi, siteSlug]);

  /**
   * Fetch all pages for the current site (navigation/sitemap).
   */
  const fetchAllPages = useCallback(async () => {
    let endpoint = 'pages?fields[0]=title&fields[1]=pageType&fields[2]=customSlug&fields[3]=isActive&sort=title:asc';

    if (siteSlug) {
      endpoint += `&filters[site][slug][$eq]=${siteSlug}`;
    }

    const data = await fetchFromStrapi(endpoint);
    return data?.data || [];
  }, [fetchFromStrapi, siteSlug]);

  /**
   * Fetch site configuration (branding, navigation, footer, integrations, emailConfig).
   */
  const fetchSiteConfig = useCallback(async () => {
    if (!siteSlug) return null;

    const endpoint = `sites?filters[slug][$eq]=${siteSlug}`
      + '&populate[brandColors]=*'
      + '&populate[navigation]=*'
      + '&populate[footer][populate]=columns.links'
      + '&populate[integrations]=*'
      + '&populate[emailConfig]=*';

    const data = await fetchFromStrapi(endpoint);
    return data?.data?.[0] || null;
  }, [fetchFromStrapi, siteSlug]);

  /**
   * Submit a form (contact, lead, demo, newsletter, support).
   *
   * Uses the custom public endpoint:
   *   POST /api/form-submissions/submit
   */
  const submitForm = useCallback(async (formData) => {
    const response = await fetch(`${apiUrl}/api/form-submissions/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        siteSlug,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error?.error?.message || `Submission failed: ${response.status}`);
    }

    return response.json();
  }, [apiUrl, siteSlug]);

  /**
   * Clear cache
   */
  const clearCache = useCallback((endpoint = null) => {
    if (endpoint) {
      setCache(prev => {
        const newCache = { ...prev };
        Object.keys(newCache).forEach(key => {
          if (key.includes(endpoint)) {
            delete newCache[key];
          }
        });
        return newCache;
      });
    } else {
      setCache({});
    }
  }, []);

  const value = {
    apiUrl,
    siteSlug,
    fetchFromStrapi,
    fetchPage,
    fetchCustomPage,
    fetchAllPages,
    fetchSiteConfig,
    submitForm,
    clearCache,
  };

  return (
    <StrapiContext.Provider value={value}>
      {children}
    </StrapiContext.Provider>
  );
};

export const useStrapi = () => {
  const context = useContext(StrapiContext);
  if (!context) {
    throw new Error('useStrapi must be used within a StrapiProvider');
  }
  return context;
};

export default StrapiContext;
