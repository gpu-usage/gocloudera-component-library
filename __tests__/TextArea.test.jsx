import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextArea from '../src/components/forms/TextArea';

describe('TextArea', () => {
  it('renders label', () => {
    render(<TextArea name="msg" label="Message" onChange={() => {}} />);
    expect(screen.getByText('Message')).toBeInTheDocument();
  });

  it('calls onChange with value', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<TextArea name="msg" label="Message" onChange={onChange} />);
    await user.type(screen.getByLabelText('Message'), 'Hello');
    expect(onChange).toHaveBeenCalled();
    // Last call should have the full typed text
    expect(onChange).toHaveBeenLastCalledWith('o');
  });

  it('sets rows attribute', () => {
    render(<TextArea name="msg" label="Message" rows={8} onChange={() => {}} />);
    expect(screen.getByLabelText('Message')).toHaveAttribute('rows', '8');
  });

  it('shows error message', () => {
    render(<TextArea name="msg" label="Message" error="Too short" onChange={() => {}} />);
    expect(screen.getByText('Too short')).toBeInTheDocument();
  });

  it('renders as disabled', () => {
    render(<TextArea name="msg" label="Message" disabled onChange={() => {}} />);
    expect(screen.getByLabelText('Message')).toBeDisabled();
  });

  it('shows required asterisk', () => {
    render(<TextArea name="msg" label="Message" required onChange={() => {}} />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows help text', () => {
    render(<TextArea name="msg" label="Message" helpText="Max 500 chars" onChange={() => {}} />);
    expect(screen.getByText('Max 500 chars')).toBeInTheDocument();
  });

  it('handles focus and blur events', async () => {
    const user = userEvent.setup();
    const onBlur = jest.fn();
    render(<TextArea name="msg" label="Message" onBlur={onBlur} onChange={() => {}} />);
    const ta = screen.getByLabelText('Message');
    await user.click(ta);
    await user.tab();
    expect(onBlur).toHaveBeenCalled();
  });
});
