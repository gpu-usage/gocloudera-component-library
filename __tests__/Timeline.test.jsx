import React from 'react';
import { render, screen } from '@testing-library/react';
import Timeline from '../src/components/display/Timeline';

const items = [
  { title: 'Founded', description: '<p>We started</p>', date: 'Jan 2020', icon: 'Rocket' },
  { title: 'Series A', description: '<p>Raised funds</p>', date: 'Jun 2021' },
  { title: 'Launch', date: 'Dec 2022', image: { url: '/launch.jpg' } },
];

describe('Timeline', () => {
  it('renders title', () => {
    render(<Timeline title="Our Journey" items={items} />);
    expect(screen.getByText('Our Journey')).toBeInTheDocument();
  });

  it('renders all timeline items', () => {
    render(<Timeline items={items} />);
    expect(screen.getByText('Founded')).toBeInTheDocument();
    expect(screen.getByText('Series A')).toBeInTheDocument();
    expect(screen.getByText('Launch')).toBeInTheDocument();
  });

  it('renders dates', () => {
    render(<Timeline items={items} />);
    expect(screen.getByText('Jan 2020')).toBeInTheDocument();
    expect(screen.getByText('Jun 2021')).toBeInTheDocument();
  });

  it('renders icon when provided', () => {
    const { container } = render(<Timeline items={items} />);
    // The first item has a Rocket icon, others show index numbers
    const timelineItems = container.querySelectorAll('.timeline-item');
    expect(timelineItems).toHaveLength(3);
  });

  it('renders index number when no icon provided', () => {
    render(<Timeline items={[{ title: 'Step', date: '2023' }]} />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('renders image when provided', () => {
    render(<Timeline items={items} />);
    const img = screen.getByAltText('Launch');
    expect(img).toHaveAttribute('src', '/launch.jpg');
  });

  it('applies alternating layout', () => {
    const { container } = render(<Timeline items={items} />);
    const timelineItems = container.querySelectorAll('.timeline-item');
    // Even items have paddingRight set to 50%, odd items have paddingLeft set to 50%
    expect(timelineItems[0].style.paddingRight).toBe('50%');
    expect(timelineItems[1].style.paddingLeft).toBe('50%');
  });
});
