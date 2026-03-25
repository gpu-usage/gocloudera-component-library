import React from 'react';
import { render, screen } from '@testing-library/react';
import { PageRenderer, getPageMeta } from '../src/renderer/PageRenderer';

describe('PageRenderer', () => {
  it('shows default loading UI', () => {
    render(<PageRenderer loading />);
    expect(document.querySelector('.page-loading')).toBeInTheDocument();
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('uses custom loading component', () => {
    const Loading = () => <div>Custom wait</div>;
    render(<PageRenderer loading loadingComponent={Loading} />);
    expect(screen.getByText('Custom wait')).toBeInTheDocument();
  });

  it('shows default error UI with message', () => {
    render(<PageRenderer error={new Error('Boom')} />);
    expect(screen.getByText('Error Loading Page')).toBeInTheDocument();
    expect(screen.getByText('Boom')).toBeInTheDocument();
  });

  it('uses custom error component', () => {
    const Err = ({ error }) => <div>E:{error.message}</div>;
    render(<PageRenderer error={new Error('x')} errorComponent={Err} />);
    expect(screen.getByText('E:x')).toBeInTheDocument();
  });

  it('shows 404 when page is null', () => {
    render(<PageRenderer page={null} />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
  });

  it('renders sections inside main', () => {
    const page = {
      id: 7,
      attributes: {
        title: 'About',
        layout: 'wide',
        sections: [
          {
            id: 1,
            __component: 'sections.hero',
            title: 'Hi',
          },
        ],
      },
    };
    render(<PageRenderer page={page} />);
    expect(document.querySelector('.page-content')).toHaveAttribute(
      'data-page-id',
      '7'
    );
    expect(document.querySelector('main.page-sections')).toBeInTheDocument();
    expect(screen.getByText('Hi')).toBeInTheDocument();
  });

  it('wraps content with layout when provided', () => {
    const page = {
      id: 1,
      attributes: { title: 'T', sections: [] },
    };
    const Layout = ({ children, title, description }) => (
      <div data-testid="layout">
        <span data-testid="layout-title">{title}</span>
        <span data-testid="layout-desc">{description || 'none'}</span>
        {children}
      </div>
    );
    render(
      <PageRenderer
        page={{
          ...page,
          attributes: {
            ...page.attributes,
            metaTitle: 'SEO Title',
            metaDescription: 'SEO Desc',
          },
        }}
        layout={Layout}
      />
    );
    expect(screen.getByTestId('layout')).toBeInTheDocument();
    expect(screen.getByTestId('layout-title')).toHaveTextContent('SEO Title');
    expect(screen.getByTestId('layout-desc')).toHaveTextContent('SEO Desc');
  });
});

describe('getPageMeta', () => {
  it('returns null for missing page', () => {
    expect(getPageMeta(null)).toBeNull();
  });

  it('reads meta from attributes wrapper or flat shape', () => {
    expect(
      getPageMeta({
        attributes: {
          title: 'A',
          metaTitle: 'Meta A',
          metaDescription: 'D',
          metaKeywords: 'k1,k2',
        },
      })
    ).toEqual({
      title: 'Meta A',
      description: 'D',
      keywords: 'k1,k2',
      ogImage: undefined,
    });

    expect(
      getPageMeta({
        title: 'Flat',
        description: 'Body',
      })
    ).toEqual({
      title: 'Flat',
      description: 'Body',
      keywords: undefined,
      ogImage: undefined,
    });
  });

  it('resolves og image url', () => {
    const meta = getPageMeta({
      attributes: {
        title: 'x',
        ogImage: { data: { attributes: { url: 'https://cdn/img.png' } } },
      },
    });
    expect(meta.ogImage).toBe('https://cdn/img.png');
  });
});
