import { useState, useEffect } from 'react';
import { useStrapi } from '../context/StrapiContext';

/**
 * Hook to fetch and manage site configuration.
 *
 * Returns branding, navigation, footer, analytics integrations,
 * and email config for the current site.
 *
 * Usage:
 *   const { navigation, footer, brandColors, integrations, loading } = useSiteConfig();
 */
export const useSiteConfig = () => {
  const { fetchSiteConfig, siteSlug } = useStrapi();
  const [site, setSite] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!siteSlug) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const loadConfig = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchSiteConfig();
        if (mounted) {
          setSite(data);
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

    loadConfig();

    return () => {
      mounted = false;
    };
  }, [siteSlug, fetchSiteConfig]);

  const attrs = site?.attributes || site || {};

  return {
    site,
    navigation: attrs.navigation || [],
    footer: attrs.footer || null,
    brandColors: attrs.brandColors || null,
    integrations: attrs.integrations || null,
    emailConfig: attrs.emailConfig || null,
    logo: attrs.logo || null,
    logoHeight: attrs.logoHeight || 36,
    favicon: attrs.favicon || null,
    siteName: attrs.name || '',
    tagline: attrs.tagline || '',
    domain: attrs.domain || '',
    loading,
    error,
  };
};

export default useSiteConfig;
