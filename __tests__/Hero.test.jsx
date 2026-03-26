import React from 'react';
import { render, screen } from '@testing-library/react';
import Hero from '../src/components/display/Hero';

describe('Hero', () => {
  it('renders title', () => {
    render(<Hero title="Welcome to Our Platform" />);
    expect(screen.getByText('Welcome to Our Platform')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<Hero title="Hello" subtitle="Build amazing things" />);
    expect(screen.getByText('Build amazing things')).toBeInTheDocument();
  });

  it('renders primary button', () => {
    render(<Hero title="Hello" primaryButton={{ text: 'Get Started' }} />);
    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
  });

  it('renders secondary button', () => {
    render(<Hero title="Hello" secondaryButton={{ text: 'Learn More' }} />);
    expect(screen.getByRole('button', { name: /learn more/i })).toBeInTheDocument();
  });

  it('renders overlay div by default', () => {
    const { container } = render(<Hero title="Hello" />);
    expect(container.querySelector('.hero-overlay')).toBeTruthy();
  });

  it('does not render overlay when overlay is false', () => {
    const { container } = render(<Hero title="Hello" overlay={false} />);
    expect(container.querySelector('.hero-overlay')).toBeNull();
  });

  it('applies correct height from height prop', () => {
    const { container } = render(<Hero title="Hello" height="small" />);
    const section = container.querySelector('section');
    expect(section.style.minHeight).toBe('40vh');
  });

  it('renders background video when provided', () => {
    const { container } = render(<Hero title="Hello" backgroundVideo="/bg.mp4" />);
    const video = container.querySelector('video');
    expect(video).toBeTruthy();
    const source = video.querySelector('source');
    expect(source).toHaveAttribute('src', '/bg.mp4');
  });

  it('applies background image from Strapi format', () => {
    const { container } = render(
      <Hero title="Hello" backgroundImage={{ data: { attributes: { url: '/hero.jpg' } } }} />
    );
    const section = container.querySelector('section');
    expect(section.style.backgroundImage).toContain('/hero.jpg');
  });
});
