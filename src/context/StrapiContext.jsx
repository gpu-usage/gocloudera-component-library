import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Strapi Context - Provides Strapi configuration and data fetching
 */
const StrapiContext = createContext(null);

export const StrapiProvider = ({ 
  children, 
  apiUrl, 
  apiToken = null,
  cacheTime = 60000 // 1 minute default cache
}) => {
  const [cache, setCache] = useState({});

  /**
   * Fetch data from Strapi API with caching
   */
  const fetchFromStrapi = useCallback(async (endpoint, options = {}) => {
    const cacheKey = `${endpoint}:${JSON.stringify(options)}`;
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
  }, [apiUrl, apiToken, cacheTime, cache]);

  /**
   * Fetch a page by slug
   */
  const fetchPage = useCallback(async (slug) => {
    const data = await fetchFromStrapi(
      `public-pages?filters[slug][$eq]=${slug}&populate[sections][populate]=*&populate[ogImage]=*`
    );
    return data?.data?.[0] || null;
  }, [fetchFromStrapi]);

  /**
   * Fetch all pages (for navigation/sitemap)
   */
  const fetchAllPages = useCallback(async () => {
    const data = await fetchFromStrapi(
      'public-pages?fields[0]=title&fields[1]=slug&fields[2]=order&populate[parentPage][fields][0]=slug&sort=order:asc'
    );
    return data?.data || [];
  }, [fetchFromStrapi]);

  /**
   * Clear cache
   */
  const clearCache = useCallback((endpoint = null) => {
    if (endpoint) {
      setCache(prev => {
        const newCache = { ...prev };
        Object.keys(newCache).forEach(key => {
          if (key.startsWith(endpoint)) {
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
    fetchFromStrapi,
    fetchPage,
    fetchAllPages,
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

