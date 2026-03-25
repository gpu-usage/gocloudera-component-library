import { useState, useEffect } from 'react';
import { useStrapi } from '../context/StrapiContext';

/**
 * Hook to fetch navigation/page structure
 */
export const useNavigation = () => {
  const { fetchAllPages } = useStrapi();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const loadPages = async () => {
      try {
        setLoading(true);
        const data = await fetchAllPages();
        if (mounted) {
          // Build navigation tree
          const tree = buildNavigationTree(data);
          setPages(tree);
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

    loadPages();

    return () => {
      mounted = false;
    };
  }, [fetchAllPages]);

  return { pages, loading, error };
};

/**
 * Build a tree structure from flat page list
 */
const buildNavigationTree = (pages) => {
  const tree = [];
  const map = {};

  // First pass: create map
  pages.forEach(page => {
    const attrs = page.attributes || page;
    map[page.id] = {
      id: page.id,
      title: attrs.title,
      slug: attrs.slug,
      order: attrs.order,
      children: [],
    };
  });

  // Second pass: build tree
  pages.forEach(page => {
    const attrs = page.attributes || page;
    const parentSlug = attrs.parentPage?.data?.attributes?.slug;
    
    if (parentSlug) {
      const parent = Object.values(map).find(p => p.slug === parentSlug);
      if (parent) {
        parent.children.push(map[page.id]);
      }
    } else {
      tree.push(map[page.id]);
    }
  });

  // Sort by order
  const sortByOrder = (items) => {
    items.sort((a, b) => a.order - b.order);
    items.forEach(item => {
      if (item.children.length > 0) {
        sortByOrder(item.children);
      }
    });
  };

  sortByOrder(tree);

  return tree;
};

export default useNavigation;

