import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RadioGroup from '../src/components/forms/RadioGroup';

const options = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c', disabled: true },
];

describe('RadioGroup', () => {
  it('renders label', () => {
    render(<RadioGroup name="choice" label="Choose one" options={options} onChange={() => {}} />);
    expect(screen.getByText('Choose one')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<RadioGroup name="choice" options={options} onChange={() => {}} />);
    expect(screen.getByText('Option A')).toBeInTheDocument();
    expect(screen.getByText('Option B')).toBeInTheDocument();
    expect(screen.getByText('Option C')).toBeInTheDocument();
  });

  it('selects the correct value', () => {
    render(<RadioGroup name="choice" options={options} value="b" onChange={() => {}} />);
    const radios = screen.getAllByRole('radio');
    expect(radios[1]).toBeChecked();
  });

  it('calls onChange on selection', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<RadioGroup name="choice" options={options} onChange={onChange} />);
    await user.click(screen.getByText('Option A'));
    expect(onChange).toHaveBeenCalledWith('a');
  });

  it('disables individual option', () => {
    render(<RadioGroup name="choice" options={options} onChange={() => {}} />);
    const radios = screen.getAllByRole('radio');
    expect(radios[2]).toBeDisabled();
  });

  it('disables all options when disabled prop is true', () => {
    render(<RadioGroup name="choice" options={options} disabled onChange={() => {}} />);
    const radios = screen.getAllByRole('radio');
    radios.forEach((r) => expect(r).toBeDisabled());
  });

  it('does not call onChange when disabled', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<RadioGroup name="choice" options={options} disabled onChange={onChange} />);
    await user.click(screen.getByText('Option A'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('shows error message', () => {
    render(<RadioGroup name="choice" options={options} error="Select one" onChange={() => {}} />);
    expect(screen.getByText('Select one')).toBeInTheDocument();
  });
});
