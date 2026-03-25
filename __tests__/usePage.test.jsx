import React, { useMemo } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import StrapiContext from '../src/context/StrapiContext';
import { StrapiProvider } from '../src/context/StrapiContext';
import { usePage } from '../src/hooks/usePage';

function PageView({ slug }) {
  const { page, loading, error } = usePage(slug);
  if (loading) return <div>loading</div>;
  if (error) return <div>error:{error.message}</div>;
  if (!page) return <div>empty</div>;
  return <div data-testid="page">{page.attributes.title}</div>;
}

describe('usePage', () => {
  it('does not call Strapi when slug is missing', async () => {
    global.fetch = jest.fn();

    render(
      <StrapiProvider apiUrl="https://cms.test">
        <PageView slug={undefined} />
      </StrapiProvider>
    );

    await waitFor(() => expect(screen.getByText('empty')).toBeInTheDocument());
    expect(global.fetch).not.toHaveBeenCalled();
  });
});

describe('usePage with stubbed context', () => {
  const fetchPage = jest.fn();

  function MockProvider({ children }) {
    const value = useMemo(
      () => ({
        apiUrl: 'https://x',
        fetchFromStrapi: jest.fn(),
        fetchPage,
        fetchAllPages: jest.fn(),
        clearCache: jest.fn(),
      }),
      []
    );

    return (
      <StrapiContext.Provider value={value}>{children}</StrapiContext.Provider>
    );
  }

  it('loads page data for slug', async () => {
    fetchPage.mockResolvedValueOnce({
      attributes: { title: 'About Us' },
    });

    render(
      <MockProvider>
        <PageView slug="about" />
      </MockProvider>
    );

    expect(screen.getByText('loading')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId('page')).toHaveTextContent('About Us');
    });
    expect(fetchPage).toHaveBeenCalledWith('about');
  });

  it('surfaces errors', async () => {
    fetchPage.mockRejectedValueOnce(new Error('network'));

    render(
      <MockProvider>
        <PageView slug="bad" />
      </MockProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('error:network')).toBeInTheDocument();
    });
  });
});
