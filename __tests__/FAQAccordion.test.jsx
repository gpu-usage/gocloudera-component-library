import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FAQAccordion from '../src/components/display/FAQAccordion';

const items = [
  { question: 'What is this?', answer: '<p>A component library</p>' },
  { question: 'How to install?', answer: '<p>npm install</p>' },
  { question: 'Is it free?', answer: '<p>Yes</p>' },
];

describe('FAQAccordion', () => {
  it('renders title and subtitle', () => {
    render(<FAQAccordion title="FAQ" subtitle="Common questions" items={items} />);
    expect(screen.getByText('FAQ')).toBeInTheDocument();
    expect(screen.getByText('Common questions')).toBeInTheDocument();
  });

  it('renders all questions', () => {
    render(<FAQAccordion items={items} />);
    expect(screen.getByText('What is this?')).toBeInTheDocument();
    expect(screen.getByText('How to install?')).toBeInTheDocument();
    expect(screen.getByText('Is it free?')).toBeInTheDocument();
  });

  it('expands an item on click', async () => {
    const user = userEvent.setup();
    const { container } = render(<FAQAccordion items={items} />);
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    // The answer div should have maxHeight set to a large value
    const answerDivs = container.querySelectorAll('.faq-item > div:last-child');
    expect(answerDivs[0].style.maxHeight).toBe('1000px');
  });

  it('collapses an open item on second click', async () => {
    const user = userEvent.setup();
    const { container } = render(<FAQAccordion items={items} />);
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    await user.click(buttons[0]);
    const answerDivs = container.querySelectorAll('.faq-item > div:last-child');
    expect(answerDivs[0].style.maxHeight).toBe('0');
  });

  it('allows only one open when allowMultipleOpen is false (default)', async () => {
    const user = userEvent.setup();
    const { container } = render(<FAQAccordion items={items} />);
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    await user.click(buttons[1]);
    const answerDivs = container.querySelectorAll('.faq-item > div:last-child');
    expect(answerDivs[0].style.maxHeight).toBe('0');
    expect(answerDivs[1].style.maxHeight).toBe('1000px');
  });

  it('allows multiple open when allowMultipleOpen is true', async () => {
    const user = userEvent.setup();
    const { container } = render(<FAQAccordion items={items} allowMultipleOpen />);
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    await user.click(buttons[1]);
    const answerDivs = container.querySelectorAll('.faq-item > div:last-child');
    expect(answerDivs[0].style.maxHeight).toBe('1000px');
    expect(answerDivs[1].style.maxHeight).toBe('1000px');
  });

  it('renders empty state with no items', () => {
    const { container } = render(<FAQAccordion items={[]} />);
    expect(container.querySelectorAll('.faq-item')).toHaveLength(0);
  });

  it('does not render header when no title or subtitle', () => {
    const { container } = render(<FAQAccordion items={items} />);
    expect(container.querySelector('.section-header')).toBeNull();
  });
});
