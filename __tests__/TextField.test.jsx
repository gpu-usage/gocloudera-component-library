import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextField from '../src/components/forms/TextField';

describe('TextField', () => {
  it('renders label', () => {
    render(<TextField name="email" label="Email" onChange={() => {}} />);
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders with correct type', () => {
    render(<TextField name="pw" label="Password" type="password" onChange={() => {}} />);
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
  });

  it('calls onChange with value', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<TextField name="name" label="Name" onChange={onChange} />);
    await user.type(screen.getByLabelText('Name'), 'A');
    expect(onChange).toHaveBeenCalledWith('A');
  });

  it('shows error message', () => {
    render(<TextField name="email" label="Email" error="Invalid email" onChange={() => {}} />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
  });

  it('renders as disabled', () => {
    render(<TextField name="email" label="Email" disabled onChange={() => {}} />);
    expect(screen.getByLabelText('Email')).toBeDisabled();
  });

  it('shows required asterisk', () => {
    render(<TextField name="email" label="Email" required onChange={() => {}} />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows help text', () => {
    render(<TextField name="email" label="Email" helpText="We won't share" onChange={() => {}} />);
    expect(screen.getByText("We won't share")).toBeInTheDocument();
  });
});
