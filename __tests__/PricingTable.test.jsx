import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PricingTable from '../src/components/display/PricingTable';

const plans = [
  {
    name: 'Basic',
    description: 'For individuals',
    monthlyPrice: '9',
    yearlyPrice: '89',
    features: [
      { text: '10 users', included: true },
      { text: 'API access', included: false },
    ],
    ctaButton: { text: 'Get Basic' },
  },
  {
    name: 'Pro',
    description: 'For teams',
    monthlyPrice: '29',
    yearlyPrice: '289',
    features: [{ text: 'Unlimited users', included: true }],
    highlighted: true,
    badge: 'Popular',
    ctaButton: { text: 'Get Pro' },
  },
];

describe('PricingTable', () => {
  it('renders title and subtitle', () => {
    render(<PricingTable title="Pricing" subtitle="Choose a plan" plans={plans} />);
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('Choose a plan')).toBeInTheDocument();
  });

  it('renders all plan names', () => {
    render(<PricingTable plans={plans} />);
    expect(screen.getByText('Basic')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
  });

  it('shows monthly prices by default', () => {
    render(<PricingTable plans={plans} />);
    expect(screen.getByText('$9')).toBeInTheDocument();
    expect(screen.getByText('$29')).toBeInTheDocument();
  });

  it('toggles to yearly prices', async () => {
    const user = userEvent.setup();
    render(<PricingTable plans={plans} />);
    // Find the toggle button (it's between Monthly and Yearly labels)
    const toggleButtons = screen.getAllByRole('button');
    // The toggle is the first non-CTA button
    const toggle = toggleButtons.find(
      (b) => !b.textContent.includes('Get')
    );
    await user.click(toggle);
    expect(screen.getByText('$89')).toBeInTheDocument();
    expect(screen.getByText('$289')).toBeInTheDocument();
  });

  it('renders feature list with included/excluded indicators', () => {
    render(<PricingTable plans={plans} />);
    expect(screen.getByText('10 users')).toBeInTheDocument();
    expect(screen.getByText('API access')).toBeInTheDocument();
  });

  it('renders badge on highlighted plan', () => {
    render(<PricingTable plans={plans} />);
    expect(screen.getByText('Popular')).toBeInTheDocument();
  });

  it('renders CTA buttons', () => {
    render(<PricingTable plans={plans} />);
    expect(screen.getByRole('button', { name: /get basic/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get pro/i })).toBeInTheDocument();
  });

  it('hides toggle when showToggle is false', () => {
    render(<PricingTable plans={plans} showToggle={false} />);
    expect(screen.queryByText('Monthly')).toBeNull();
    expect(screen.queryByText('Yearly')).toBeNull();
  });

  it('renders plan description', () => {
    render(<PricingTable plans={plans} />);
    expect(screen.getByText('For individuals')).toBeInTheDocument();
    expect(screen.getByText('For teams')).toBeInTheDocument();
  });
});
