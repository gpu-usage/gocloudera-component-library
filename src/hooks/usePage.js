import { useState, useEffect } from 'react';
import { useStrapi } from '../context/StrapiContext';

/**
 * Hook to fetch and manage a single page by slug
 */
export const usePage = (slug) => {
  const { fetchPage } = useStrapi();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const loadPage = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPage(slug);
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
  }, [slug, fetchPage]);

  return { page, loading, error };
};

export default usePage;

