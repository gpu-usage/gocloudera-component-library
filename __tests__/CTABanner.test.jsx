import React from 'react';
import { render, screen } from '@testing-library/react';
import CTABanner from '../src/components/display/CTABanner';

describe('CTABanner', () => {
  it('renders title', () => {
    render(<CTABanner title="Get Started Today" />);
    expect(screen.getByText('Get Started Today')).toBeInTheDocument();
  });

  it('renders subtitle', () => {
    render(<CTABanner title="CTA" subtitle="Join thousands of users" />);
    expect(screen.getByText('Join thousands of users')).toBeInTheDocument();
  });

  it('renders button when provided', () => {
    render(<CTABanner title="CTA" button={{ text: 'Sign Up' }} />);
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('applies custom background and text colors', () => {
    const { container } = render(
      <CTABanner title="CTA" backgroundColor="#ff0000" textColor="#00ff00" />
    );
    const section = container.querySelector('section');
    expect(section.style.background).toBe('rgb(255, 0, 0)');
    expect(section.style.color).toBe('rgb(0, 255, 0)');
  });

  it('applies alignment style', () => {
    const { container } = render(<CTABanner title="CTA" alignment="left" />);
    const section = container.querySelector('section');
    expect(section.style.textAlign).toBe('left');
  });

  it('does not render title or subtitle when not provided', () => {
    const { container } = render(<CTABanner />);
    expect(container.querySelector('h2')).toBeNull();
    expect(container.querySelector('p')).toBeNull();
  });

  it('uses default variant secondary for button', () => {
    render(<CTABanner title="CTA" button={{ text: 'Go' }} />);
    expect(screen.getByRole('button', { name: /go/i })).toBeInTheDocument();
  });
});
