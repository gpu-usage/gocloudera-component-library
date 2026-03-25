import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button from '../src/components/forms/Button';

describe('Button', () => {
  it('renders native button with text', () => {
    render(<Button text="Click me" />);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<Button text="Go" onClick={onClick} />);
    await user.click(screen.getByRole('button', { name: /go/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders anchor when type is link and url is set', () => {
    render(
      <Button text="Docs" type="link" url="https://example.com/docs" />
    );
    const link = screen.getByRole('link', { name: /docs/i });
    expect(link).toHaveAttribute('href', 'https://example.com/docs');
  });

  it('sets target and rel for external links', () => {
    render(
      <Button
        text="Out"
        type="link"
        url="https://x.com"
        openInNewTab
      />
    );
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('disables button and blocks interaction', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<Button text="Nope" disabled onClick={onClick} />);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('uses submit type for form submit', () => {
    render(<Button text="Send" type="submit" />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('scrolls to target element when type is scroll', async () => {
    const user = userEvent.setup();
    const scrollIntoView = jest.fn();
    const target = document.createElement('div');
    target.id = 'section-b';
    target.scrollIntoView = scrollIntoView;
    document.body.appendChild(target);

    render(
      <Button text="Jump" type="scroll" scrollTarget="#section-b" />
    );
    await user.click(screen.getByRole('button'));
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });

    target.remove();
  });
});
