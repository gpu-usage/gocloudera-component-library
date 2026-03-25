import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormRenderer, registerField } from '../src/renderer/FormRenderer';

describe('FormRenderer', () => {
  const baseFields = [
    {
      name: 'name',
      label: 'Name',
      type: 'text',
      required: true,
      width: 'full',
    },
  ];

  it('submits valid data through onSubmit', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    render(
      <FormRenderer
        formId="f1"
        fields={baseFields}
        submitAction="api"
        onSubmit={onSubmit}
      />
    );

    await user.type(screen.getByLabelText(/name/i), 'Ada');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ name: 'Ada' });
    });
    expect(screen.getByText(/thank you/i)).toBeInTheDocument();
  });

  it('registerField wires a custom field type', () => {
    const Custom = ({ label, value, onChange }) => (
      <input
        aria-label={label}
        data-testid="custom-field"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
      />
    );

    registerField('custom', Custom);

    render(
      <FormRenderer
        formId="f2"
        fields={[
          {
            name: 'c',
            label: 'Custom',
            type: 'custom',
            width: 'full',
          },
        ]}
        onSubmit={jest.fn().mockResolvedValue(undefined)}
      />
    );

    expect(screen.getByTestId('custom-field')).toBeInTheDocument();
  });
});
