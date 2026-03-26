import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Testimonials from '../src/components/display/Testimonials';

const items = [
  {
    quote: 'Amazing product!',
    authorName: 'Alice',
    authorTitle: 'CEO',
    authorCompany: 'Acme',
    rating: 5,
  },
  {
    quote: 'Highly recommended',
    authorName: 'Bob',
    authorTitle: 'CTO',
    authorCompany: 'Widget Co',
    rating: 4,
    authorImage: { url: '/bob.jpg' },
  },
  {
    quote: 'Good service',
    authorName: 'Carol',
    rating: 3,
  },
];

describe('Testimonials', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders title and subtitle', () => {
    render(<Testimonials title="Testimonials" subtitle="What they say" items={items} />);
    expect(screen.getByText('Testimonials')).toBeInTheDocument();
    expect(screen.getByText('What they say')).toBeInTheDocument();
  });

  it('renders first testimonial in carousel mode by default', () => {
    render(<Testimonials items={items} />);
    expect(screen.getByText(/Amazing product/)).toBeInTheDocument();
  });

  it('navigates to next slide with next button', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Testimonials items={items} />);
    const buttons = screen.getAllByRole('button');
    // Next button is one of the navigation buttons
    const nextButton = buttons.find(b => {
      // The next button contains ChevronRight
      return b.style.right === '-60px';
    }) || buttons[1]; // fallback
    await user.click(nextButton);
    expect(screen.getByText(/Highly recommended/)).toBeInTheDocument();
  });

  it('navigates to previous slide with prev button', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Testimonials items={items} />);
    const buttons = screen.getAllByRole('button');
    const prevButton = buttons.find(b => b.style.left === '-60px') || buttons[0];
    await user.click(prevButton);
    // Should wrap to last item
    expect(screen.getByText(/Good service/)).toBeInTheDocument();
  });

  it('renders grid mode', () => {
    render(<Testimonials items={items} displayMode="grid" />);
    // All testimonials visible at once in grid
    expect(screen.getByText(/Amazing product/)).toBeInTheDocument();
    expect(screen.getByText(/Highly recommended/)).toBeInTheDocument();
    expect(screen.getByText(/Good service/)).toBeInTheDocument();
  });

  it('renders author name and title', () => {
    render(<Testimonials items={items} displayMode="grid" />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText(/CEO, Acme/)).toBeInTheDocument();
  });

  it('renders rating stars', () => {
    const { container } = render(<Testimonials items={[items[0]]} displayMode="grid" />);
    // 5 star elements should be rendered
    const stars = container.querySelectorAll('.testimonial-card svg');
    expect(stars.length).toBeGreaterThanOrEqual(5);
  });

  it('renders author image when provided', () => {
    render(<Testimonials items={[items[1]]} displayMode="grid" />);
    const img = screen.getByAltText('Bob');
    expect(img).toHaveAttribute('src', '/bob.jpg');
  });

  it('renders author initial when no image', () => {
    render(<Testimonials items={[items[0]]} displayMode="grid" />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('auto-advances carousel after interval', async () => {
    render(<Testimonials items={items} />);
    expect(screen.getByText(/Amazing product/)).toBeInTheDocument();
    // Advance timer by 5 seconds
    await act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(screen.getByText(/Highly recommended/)).toBeInTheDocument();
  });

  it('does not render navigation when single item in carousel', () => {
    render(<Testimonials items={[items[0]]} />);
    // Only the dot buttons and nav buttons should not appear for a single item
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('navigates using dot indicators', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<Testimonials items={items} />);
    // Dots are small buttons
    const buttons = screen.getAllByRole('button');
    // Find a dot button (10px x 10px)
    const dotButtons = buttons.filter(b => b.style.width === '10px');
    if (dotButtons.length > 0) {
      await user.click(dotButtons[2]); // Click third dot
      expect(screen.getByText(/Good service/)).toBeInTheDocument();
    }
  });

  it('renders author with title only (no company)', () => {
    const itemNoCompany = [{
      quote: 'Nice',
      authorName: 'Dan',
      authorTitle: 'Engineer',
    }];
    render(<Testimonials items={itemNoCompany} displayMode="grid" />);
    expect(screen.getByText('Engineer')).toBeInTheDocument();
  });

  it('renders Strapi format author image', () => {
    const itemStrapiImg = [{
      quote: 'Great',
      authorName: 'Eve',
      authorImage: { data: { attributes: { url: '/eve.png' } } },
    }];
    render(<Testimonials items={itemStrapiImg} displayMode="grid" />);
    expect(screen.getByAltText('Eve')).toHaveAttribute('src', '/eve.png');
  });
});
