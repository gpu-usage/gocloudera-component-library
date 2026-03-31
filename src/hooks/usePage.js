import { useState, useEffect } from 'react';
import { useStrapi } from '../context/StrapiContext';

/**
 * Page type enum values that map to URL paths.
 * "home" maps to "/", everything else maps to "/{pageType}".
 */
const PAGE_TYPE_ROUTES = {
  home: '/',
  pricing: '/pricing',
  about: '/about',
  contact: '/contact',
  solutions: '/solutions',
  products: '/products',
  blog: '/blog',
  careers: '/careers',
  terms: '/terms',
  privacy: '/privacy',
};

/**
 * Resolve a URL path to a pageType enum value.
 *
 * "/" or "" → "home"
 * "/pricing" → "pricing"
 * "/anything-else" → treated as a customSlug
 */
export const resolvePageType = (path) => {
  const clean = (path || '/').replace(/^\/+|\/+$/g, '') || 'home';

  // Check if it's a known page type
  if (PAGE_TYPE_ROUTES[clean] !== undefined) {
    return { pageType: clean, isCustom: false };
  }

  // Otherwise it's a custom slug
  return { pageType: 'custom', isCustom: true, customSlug: clean };
};

/**
 * Get the URL path for a pageType.
 */
export const getPagePath = (pageType, customSlug) => {
  if (pageType === 'custom' && customSlug) {
    return `/${customSlug}`;
  }
  return PAGE_TYPE_ROUTES[pageType] || `/${pageType}`;
};

/**
 * Hook to fetch a page by its type or custom slug.
 *
 * Usage:
 *   const { page, loading, error } = usePage('pricing');
 *   const { page, loading, error } = usePage('home');
 *   const { page, loading, error } = usePage('custom', 'my-landing-page');
 */
export const usePage = (pageType, customSlug) => {
  const { fetchPage, fetchCustomPage } = useStrapi();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!pageType) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const loadPage = async () => {
      try {
        setLoading(true);
        setError(null);

        let data;
        if (pageType === 'custom' && customSlug) {
          data = await fetchCustomPage(customSlug);
        } else {
          data = await fetchPage(pageType);
        }

        if (mounted) {
          setPage(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadPage();

    return () => {
      mounted = false;
    };
  }, [pageType, customSlug, fetchPage, fetchCustomPage]);

  return { page, loading, error };
};

export default usePage;
