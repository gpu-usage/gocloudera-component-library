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
});
