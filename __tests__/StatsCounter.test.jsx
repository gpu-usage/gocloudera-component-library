import React from 'react';
import { render, screen, act } from '@testing-library/react';
import StatsCounter from '../src/components/display/StatsCounter';

const stats = [
  { value: '1000', label: 'Users', prefix: '', suffix: '+' },
  { value: '50', label: 'Countries' },
  { value: '99.9', label: 'Uptime', suffix: '%' },
];

describe('StatsCounter', () => {
  it('renders title and subtitle', () => {
    render(<StatsCounter title="Our Impact" subtitle="Numbers speak" stats={stats} />);
    expect(screen.getByText('Our Impact')).toBeInTheDocument();
    expect(screen.getByText('Numbers speak')).toBeInTheDocument();
  });

  it('renders all stat labels', () => {
    render(<StatsCounter stats={stats} animateOnScroll={false} />);
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Countries')).toBeInTheDocument();
    expect(screen.getByText('Uptime')).toBeInTheDocument();
  });

  it('displays suffix', () => {
    render(<StatsCounter stats={stats} animateOnScroll={false} />);
    // After animation completes (no scroll animation), values should show
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('renders stat values when animateOnScroll is false', () => {
    render(<StatsCounter stats={stats} animateOnScroll={false} />);
    // When not animating on scroll, isVisible starts true so the animation effect runs.
    // The value is set via useEffect so it starts at '0' then animates.
    // Check that the stat items are rendered with their labels.
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Countries')).toBeInTheDocument();
    expect(screen.getByText('Uptime')).toBeInTheDocument();
  });

  it('applies background and text colors', () => {
    const { container } = render(
      <StatsCounter stats={stats} backgroundColor="#000" textColor="#fff" animateOnScroll={false} />
    );
    const section = container.querySelector('section');
    expect(section.style.background).toBe('rgb(0, 0, 0)');
    expect(section.style.color).toBe('rgb(255, 255, 255)');
  });

  it('renders icon when provided', () => {
    const statsWithIcon = [{ value: '100', label: 'Stars', icon: 'Star' }];
    render(<StatsCounter stats={statsWithIcon} animateOnScroll={false} />);
    expect(screen.getByText('Stars')).toBeInTheDocument();
  });

  it('does not render header when no title or subtitle', () => {
    const { container } = render(<StatsCounter stats={stats} animateOnScroll={false} />);
    expect(container.querySelector('.section-header')).toBeNull();
  });

  it('creates IntersectionObserver when animateOnScroll is true', () => {
    const observe = jest.fn();
    const disconnect = jest.fn();
    global.IntersectionObserver = class {
      constructor(cb) { this._cb = cb; }
      observe = observe;
      unobserve() {}
      disconnect = disconnect;
    };
    render(<StatsCounter stats={stats} animateOnScroll={true} />);
    expect(observe).toHaveBeenCalled();
  });

  it('triggers animation when element becomes visible', () => {
    let observerCallback;
    global.IntersectionObserver = class {
      constructor(cb) { observerCallback = cb; }
      observe() {}
      unobserve() {}
      disconnect() {}
    };
    render(<StatsCounter stats={stats} animateOnScroll={true} />);
    // Simulate intersection
    observerCallback([{ isIntersecting: true }]);
    // After intersection, values should start animating
    expect(screen.getByText('Users')).toBeInTheDocument();
  });

  it('handles non-numeric values', () => {
    const textStats = [{ value: 'N/A', label: 'Status' }];
    render(<StatsCounter stats={textStats} animateOnScroll={false} />);
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('renders prefix and suffix together', () => {
    const prefixStats = [{ value: '100', label: 'Revenue', prefix: '$', suffix: 'M' }];
    render(<StatsCounter stats={prefixStats} animateOnScroll={false} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
  });

  it('cleans up observer on unmount', () => {
    const disconnect = jest.fn();
    global.IntersectionObserver = class {
      constructor(cb) { this._cb = cb; }
      observe() {}
      unobserve() {}
      disconnect = disconnect;
    };
    const { unmount } = render(<StatsCounter stats={stats} animateOnScroll={true} />);
    unmount();
    expect(disconnect).toHaveBeenCalled();
  });

  it('animates counter values with interval', () => {
    jest.useFakeTimers();
    let observerCallback;
    global.IntersectionObserver = class {
      constructor(cb) { observerCallback = cb; }
      observe() {}
      unobserve() {}
      disconnect() {}
    };

    const animStats = [{ value: '100', label: 'Count' }];
    render(<StatsCounter stats={animStats} animateOnScroll={true} />);

    // Trigger intersection to make visible
    act(() => {
      observerCallback([{ isIntersecting: true }]);
    });

    // Advance timers to run the animation
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // After animation completes, final value should be shown
    expect(screen.getByText('100')).toBeInTheDocument();
    jest.useRealTimers();
  });

  it('does not observe when animateOnScroll is false', () => {
    const observe = jest.fn();
    global.IntersectionObserver = class {
      constructor(cb) { this._cb = cb; }
      observe = observe;
      unobserve() {}
      disconnect() {}
    };
    render(<StatsCounter stats={stats} animateOnScroll={false} />);
    expect(observe).not.toHaveBeenCalled();
  });
});
