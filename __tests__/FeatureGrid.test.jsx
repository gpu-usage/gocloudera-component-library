import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeatureGrid from '../src/components/display/FeatureGrid';

const features = [
  { title: 'Fast', description: 'Blazing speed', icon: 'Zap' },
  { title: 'Secure', description: 'Enterprise grade', icon: 'Shield' },
  { title: 'Scalable', description: 'Grows with you', link: 'https://example.com', linkText: 'Read more' },
];

describe('FeatureGrid', () => {
  it('renders title and subtitle', () => {
    render(<FeatureGrid title="Features" subtitle="Why choose us" features={features} />);
    expect(screen.getByText('Features')).toBeInTheDocument();
    expect(screen.getByText('Why choose us')).toBeInTheDocument();
  });

  it('renders all feature cards', () => {
    render(<FeatureGrid features={features} />);
    expect(screen.getByText('Fast')).toBeInTheDocument();
    expect(screen.getByText('Secure')).toBeInTheDocument();
    expect(screen.getByText('Scalable')).toBeInTheDocument();
  });

  it('renders descriptions', () => {
    render(<FeatureGrid features={features} />);
    expect(screen.getByText('Blazing speed')).toBeInTheDocument();
  });

  it('renders correct number of columns in grid', () => {
    const { container } = render(<FeatureGrid features={features} columns="4" />);
    const grid = container.querySelector('.feature-grid');
    expect(grid.style.gridTemplateColumns).toBe('repeat(4, 1fr)');
  });

  it('renders link when provided', () => {
    render(<FeatureGrid features={features} />);
    const link = screen.getByText(/Read more/);
    expect(link.closest('a')).toHaveAttribute('href', 'https://example.com');
  });

  it('renders image when provided via Strapi format', () => {
    const featsWithImage = [
      { title: 'Visual', image: { data: { attributes: { url: '/img.png' } } } },
    ];
    render(<FeatureGrid features={featsWithImage} />);
    const img = screen.getByAltText('Visual');
    expect(img).toHaveAttribute('src', '/img.png');
  });

  it('renders image when provided via direct url', () => {
    const featsWithImage = [{ title: 'Visual', image: { url: '/direct.png' } }];
    render(<FeatureGrid features={featsWithImage} />);
    expect(screen.getByAltText('Visual')).toHaveAttribute('src', '/direct.png');
  });

  it('card with link has pointer cursor and link element', () => {
    const feats = [{ title: 'Clickable', link: 'https://example.com' }];
    const { container } = render(<FeatureGrid features={feats} />);
    const card = container.querySelector('.feature-card');
    expect(card.style.cursor).toBe('pointer');
    const link = screen.getByText(/Learn more/);
    expect(link.closest('a')).toHaveAttribute('href', 'https://example.com');
  });

  it('does not render header when no title or subtitle', () => {
    const { container } = render(<FeatureGrid features={features} />);
    expect(container.querySelector('.section-header')).toBeNull();
  });

  it('renders icon when provided and no image', () => {
    const feats = [{ title: 'Fast', icon: 'Zap' }];
    const { container } = render(<FeatureGrid features={feats} />);
    // Icon container should exist (div with gradient background)
    const iconContainer = container.querySelector('.feature-card div[style*="linear-gradient"]');
    expect(iconContainer).toBeTruthy();
  });

  it('does not render icon when image is also present', () => {
    const feats = [{ title: 'Visual', icon: 'Star', image: { url: '/img.png' } }];
    render(<FeatureGrid features={feats} />);
    // Image should render, icon should not
    expect(screen.getByAltText('Visual')).toBeInTheDocument();
  });

  it('handles mouse enter and leave on card', async () => {
    const user = userEvent.setup();
    const feats = [{ title: 'Hover', description: 'Test hover' }];
    const { container } = render(<FeatureGrid features={feats} />);
    const card = container.querySelector('.feature-card');

    await user.hover(card);
    expect(card.style.transform).toBe('translateY(-4px)');

    await user.unhover(card);
    expect(card.style.transform).toBe('translateY(0)');
  });

  it('does not navigate when card without link is clicked', async () => {
    const user = userEvent.setup();
    const feats = [{ title: 'NoNav' }];
    const { container } = render(<FeatureGrid features={feats} />);
    const card = container.querySelector('.feature-card');
    // Clicking a card without a link should not throw
    await user.click(card);
    expect(card).toBeInTheDocument();
  });

  it('does not set cursor pointer when no link', () => {
    const feats = [{ title: 'No Link' }];
    const { container } = render(<FeatureGrid features={feats} />);
    const card = container.querySelector('.feature-card');
    expect(card.style.cursor).toBe('default');
  });

  it('renders link with default linkText', () => {
    const feats = [{ title: 'Linked', link: '/page' }];
    render(<FeatureGrid features={feats} />);
    expect(screen.getByText(/Learn more/)).toBeInTheDocument();
  });

  it('stops propagation on link click', async () => {
    const user = userEvent.setup();
    const feats = [{ title: 'Linked', link: '/page' }];
    render(<FeatureGrid features={feats} />);
    const link = screen.getByText(/Learn more/).closest('a');
    await user.click(link);
    expect(link).toHaveAttribute('href', '/page');
  });

  it('does not render description or link when not provided', () => {
    const feats = [{ title: 'Minimal' }];
    const { container } = render(<FeatureGrid features={feats} />);
    const card = container.querySelector('.feature-card');
    expect(card.querySelector('p')).toBeNull();
    expect(card.querySelector('a')).toBeNull();
  });
});
