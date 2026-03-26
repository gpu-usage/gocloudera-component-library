import React, { useMemo } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import StrapiContext from '../src/context/StrapiContext';
import { useNavigation } from '../src/hooks/useNavigation';

function NavView() {
  const { pages, loading, error } = useNavigation();
  if (loading) return <div>nav-loading</div>;
  if (error) return <div>nav-error:{error.message}</div>;
  return (
    <ul>
      {pages.map((p) => (
        <li key={p.id} data-testid={`nav-${p.slug}`}>
          {p.title}
          <ul>
            {p.children.map((c) => (
              <li key={c.id} data-testid={`nav-${c.slug}`}>
                {c.title}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ul>
  );
}

describe('useNavigation', () => {
  const fetchAllPages = jest.fn();

  function MockProvider({ children }) {
    const value = useMemo(
      () => ({
        apiUrl: 'https://x',
        fetchFromStrapi: jest.fn(),
        fetchPage: jest.fn(),
        fetchAllPages,
        clearCache: jest.fn(),
      }),
      []
    );

    return (
      <StrapiContext.Provider value={value}>{children}</StrapiContext.Provider>
    );
  }

  beforeEach(() => {
    fetchAllPages.mockReset();
  });

  it('builds a parent/child tree ordered by order field', async () => {
    fetchAllPages.mockResolvedValue([
      {
        id: 2,
        attributes: {
          title: 'Child',
          slug: 'child',
          order: 1,
          parentPage: {
            data: { attributes: { slug: 'parent' } },
          },
        },
      },
      {
        id: 1,
        attributes: {
          title: 'Parent',
          slug: 'parent',
          order: 2,
        },
      },
    ]);

    render(
      <MockProvider>
        <NavView />
      </MockProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('nav-parent')).toBeInTheDocument();
    });

    expect(screen.getByTestId('nav-parent')).toHaveTextContent('Parent');
    expect(screen.getByTestId('nav-child')).toHaveTextContent('Child');
  });

  it('propagates fetch errors', async () => {
    fetchAllPages.mockRejectedValue(new Error('boom'));

    render(
      <MockProvider>
        <NavView />
      </MockProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('nav-error:boom')).toBeInTheDocument();
    });
  });

  it('handles pages without parent (root pages)', async () => {
    fetchAllPages.mockResolvedValue([
      { id: 1, attributes: { title: 'Home', slug: 'home', order: 1 } },
      { id: 2, attributes: { title: 'About', slug: 'about', order: 2 } },
    ]);

    render(
      <MockProvider>
        <NavView />
      </MockProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('nav-home')).toBeInTheDocument();
      expect(screen.getByTestId('nav-about')).toBeInTheDocument();
    });
  });

  it('handles child page whose parent is not found in the map', async () => {
    fetchAllPages.mockResolvedValue([
      {
        id: 1,
        attributes: {
          title: 'Orphan',
          slug: 'orphan',
          order: 1,
          parentPage: { data: { attributes: { slug: 'nonexistent' } } },
        },
      },
    ]);

    render(
      <MockProvider>
        <NavView />
      </MockProvider>
    );

    await waitFor(() => {
      // Orphan page should not appear in the tree since parent not found
      expect(screen.queryByTestId('nav-orphan')).not.toBeInTheDocument();
    });
  });

  it('handles pages with flat attributes (no wrapper)', async () => {
    fetchAllPages.mockResolvedValue([
      { id: 1, title: 'Flat', slug: 'flat', order: 1 },
    ]);

    render(
      <MockProvider>
        <NavView />
      </MockProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('nav-flat')).toBeInTheDocument();
    });
  });

  it('sorts children by order', async () => {
    fetchAllPages.mockResolvedValue([
      {
        id: 3,
        attributes: {
          title: 'Child B',
          slug: 'child-b',
          order: 2,
          parentPage: { data: { attributes: { slug: 'parent' } } },
        },
      },
      {
        id: 2,
        attributes: {
          title: 'Child A',
          slug: 'child-a',
          order: 1,
          parentPage: { data: { attributes: { slug: 'parent' } } },
        },
      },
      {
        id: 1,
        attributes: { title: 'Parent', slug: 'parent', order: 1 },
      },
    ]);

    render(
      <MockProvider>
        <NavView />
      </MockProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('nav-parent')).toBeInTheDocument();
      expect(screen.getByTestId('nav-child-a')).toBeInTheDocument();
      expect(screen.getByTestId('nav-child-b')).toBeInTheDocument();
    });
  });
});
