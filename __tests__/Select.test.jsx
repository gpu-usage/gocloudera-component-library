import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Select from '../src/components/forms/Select';

const options = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry', disabled: true },
];

describe('Select', () => {
  it('renders label', () => {
    render(<Select name="fruit" label="Fruit" options={options} onChange={() => {}} />);
    expect(screen.getByText('Fruit')).toBeInTheDocument();
  });

  it('renders all options', () => {
    render(<Select name="fruit" label="Fruit" options={options} onChange={() => {}} />);
    expect(screen.getByText('Apple')).toBeInTheDocument();
    expect(screen.getByText('Banana')).toBeInTheDocument();
    expect(screen.getByText('Cherry')).toBeInTheDocument();
  });

  it('calls onChange with selected value', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<Select name="fruit" label="Fruit" options={options} onChange={onChange} />);
    await user.selectOptions(screen.getByLabelText('Fruit'), 'banana');
    expect(onChange).toHaveBeenCalledWith('banana');
  });

  it('shows placeholder as default option', () => {
    render(
      <Select name="fruit" label="Fruit" placeholder="Pick a fruit" options={options} onChange={() => {}} />
    );
    expect(screen.getByText('Pick a fruit')).toBeInTheDocument();
  });

  it('renders as disabled', () => {
    render(<Select name="fruit" label="Fruit" options={options} disabled onChange={() => {}} />);
    expect(screen.getByLabelText('Fruit')).toBeDisabled();
  });

  it('supports multiple selection', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <Select name="fruit" label="Fruit" options={options} multiple onChange={onChange} />
    );
    await user.selectOptions(screen.getByLabelText('Fruit'), ['apple', 'banana']);
    // Each selection triggers onChange; the last call should include both selected options
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall).toContain('banana');
  });

  it('shows error message', () => {
    render(
      <Select name="fruit" label="Fruit" options={options} error="Required" onChange={() => {}} />
    );
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('shows help text', () => {
    render(
      <Select name="fruit" label="Fruit" options={options} helpText="Choose wisely" onChange={() => {}} />
    );
    expect(screen.getByText('Choose wisely')).toBeInTheDocument();
  });

  it('handles focus and blur events', async () => {
    const user = userEvent.setup();
    const onBlur = jest.fn();
    render(<Select name="fruit" label="Fruit" options={options} onBlur={onBlur} onChange={() => {}} />);
    const select = screen.getByLabelText('Fruit');
    await user.click(select);
    await user.tab();
    expect(onBlur).toHaveBeenCalled();
  });

  it('renders required asterisk', () => {
    render(<Select name="fruit" label="Fruit" options={options} required onChange={() => {}} />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });
});
