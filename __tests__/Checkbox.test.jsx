import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Checkbox from '../src/components/forms/Checkbox';

describe('Checkbox', () => {
  it('reflects checked state from boolean value', () => {
    render(
      <Checkbox name="agree" label="I agree" value onChange={() => {}} />
    );
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('treats string "true" as checked', () => {
    render(
      <Checkbox name="x" label="L" value="true" onChange={() => {}} />
    );
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('notifies onChange with boolean when toggled', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <Checkbox name="opt" label="Opt-in" value={false} onChange={onChange} />
    );
    await user.click(screen.getByRole('checkbox'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('shows error message', () => {
    render(
      <Checkbox
        name="c"
        label="C"
        value={false}
        error="Required field"
        onChange={() => {}}
      />
    );
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('shows help text', () => {
    render(
      <Checkbox
        name="h"
        label="H"
        helpText="Extra info"
        onChange={() => {}}
      />
    );
    expect(screen.getByText('Extra info')).toBeInTheDocument();
  });
});
