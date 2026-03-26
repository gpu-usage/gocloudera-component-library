import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DatePicker from '../src/components/forms/DatePicker';

describe('DatePicker', () => {
  it('renders label', () => {
    render(<DatePicker name="dob" label="Date of Birth" onChange={() => {}} />);
    expect(screen.getByText('Date of Birth')).toBeInTheDocument();
  });

  it('renders date input by default', () => {
    render(<DatePicker name="dob" label="DOB" onChange={() => {}} />);
    const input = screen.getByLabelText('DOB');
    expect(input).toHaveAttribute('type', 'date');
  });

  it('renders datetime-local input when type is datetime', () => {
    render(<DatePicker name="dt" label="DateTime" type="datetime" onChange={() => {}} />);
    const input = screen.getByLabelText('DateTime');
    expect(input).toHaveAttribute('type', 'datetime-local');
  });

  it('calls onChange with value', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<DatePicker name="dob" label="DOB" onChange={onChange} />);
    const input = screen.getByLabelText('DOB');
    await user.type(input, '2024-01-15');
    expect(onChange).toHaveBeenCalled();
  });

  it('shows error message', () => {
    render(<DatePicker name="dob" label="DOB" error="Required" onChange={() => {}} />);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('applies min and max attributes', () => {
    render(
      <DatePicker name="dob" label="DOB" min="2020-01-01" max="2025-12-31" onChange={() => {}} />
    );
    const input = screen.getByLabelText('DOB');
    expect(input).toHaveAttribute('min', '2020-01-01');
    expect(input).toHaveAttribute('max', '2025-12-31');
  });

  it('shows required asterisk', () => {
    render(<DatePicker name="dob" label="DOB" required onChange={() => {}} />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('shows help text when no error', () => {
    render(<DatePicker name="dob" label="DOB" helpText="Enter your birthday" onChange={() => {}} />);
    expect(screen.getByText('Enter your birthday')).toBeInTheDocument();
  });

  it('renders time input type', () => {
    render(<DatePicker name="t" label="Time" type="time" onChange={() => {}} />);
    expect(screen.getByLabelText('Time')).toHaveAttribute('type', 'time');
  });

  it('handles focus and blur events', async () => {
    const user = userEvent.setup();
    const onBlur = jest.fn();
    render(<DatePicker name="dob" label="DOB" onBlur={onBlur} onChange={() => {}} />);
    const input = screen.getByLabelText('DOB');
    await user.click(input);
    await user.tab();
    expect(onBlur).toHaveBeenCalled();
  });
});
