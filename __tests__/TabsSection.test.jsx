import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TabsSection from '../src/components/display/TabsSection';

const tabs = [
  { label: 'Tab 1', content: '<p>Content 1</p>' },
  { label: 'Tab 2', content: '<p>Content 2</p>' },
  { label: 'Tab 3', content: '<p>Content 3</p>', icon: 'Star' },
];

describe('TabsSection', () => {
  it('renders title', () => {
    render(<TabsSection title="Features" tabs={tabs} />);
    expect(screen.getByText('Features')).toBeInTheDocument();
  });

  it('renders all tab labels', () => {
    render(<TabsSection tabs={tabs} />);
    expect(screen.getByText('Tab 1')).toBeInTheDocument();
    expect(screen.getByText('Tab 2')).toBeInTheDocument();
    expect(screen.getByText('Tab 3')).toBeInTheDocument();
  });

  it('shows first tab content by default', () => {
    render(<TabsSection tabs={tabs} />);
    expect(screen.getByText('Content 1')).toBeInTheDocument();
  });

  it('switches tab on click', async () => {
    const user = userEvent.setup();
    render(<TabsSection tabs={tabs} />);
    await user.click(screen.getByText('Tab 2'));
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('respects defaultTab prop', () => {
    render(<TabsSection tabs={tabs} defaultTab={1} />);
    expect(screen.getByText('Content 2')).toBeInTheDocument();
  });

  it('applies pill style when tabStyle is pills', () => {
    render(<TabsSection tabs={tabs} tabStyle="pills" />);
    const firstTab = screen.getByText('Tab 1').closest('button');
    expect(firstTab.style.borderRadius).toBe('9999px');
  });

  it('applies boxed style when tabStyle is boxed', () => {
    render(<TabsSection tabs={tabs} tabStyle="boxed" />);
    const firstTab = screen.getByText('Tab 1').closest('button');
    expect(firstTab.style.borderRadius).toBe('8px 8px 0 0');
  });
});
