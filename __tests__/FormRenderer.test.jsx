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

  it('renders hidden field type', () => {
    render(
      <FormRenderer
        formId="f3"
        fields={[{ name: 'token', type: 'hidden', defaultValue: 'xyz' }]}
        onSubmit={jest.fn().mockResolvedValue(undefined)}
      />
    );
    const hidden = document.querySelector('input[type="hidden"]');
    expect(hidden).toBeTruthy();
    expect(hidden).toHaveAttribute('name', 'token');
  });

  it('renders fields with different widths', () => {
    const { container } = render(
      <FormRenderer
        formId="f4"
        fields={[
          { name: 'a', label: 'A', type: 'text', width: 'half' },
          { name: 'b', label: 'B', type: 'text', width: 'third' },
          { name: 'c', label: 'C', type: 'text', width: 'quarter' },
        ]}
        onSubmit={jest.fn().mockResolvedValue(undefined)}
      />
    );
    const fieldDivs = container.querySelectorAll('.field-text');
    expect(fieldDivs[0].style.gridColumn).toBe('span 6');
    expect(fieldDivs[1].style.gridColumn).toBe('span 4');
    expect(fieldDivs[2].style.gridColumn).toBe('span 3');
  });

  it('shows success message and reset button after submit', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    render(
      <FormRenderer
        formId="f5"
        fields={baseFields}
        submitAction="api"
        onSubmit={onSubmit}
        successMessage="Done!"
      />
    );

    await user.type(screen.getByLabelText(/name/i), 'Test');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText('Done!')).toBeInTheDocument();
    });

    // Click reset
    await user.click(screen.getByText(/submit another/i));
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  });

  it('handles webhook submit action', async () => {
    const user = userEvent.setup();
    global.fetch = jest.fn().mockResolvedValue({ ok: true });

    render(
      <FormRenderer
        formId="f6"
        fields={baseFields}
        submitAction="webhook"
        webhookUrl="https://hook.test"
      />
    );

    await user.type(screen.getByLabelText(/name/i), 'Hook');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'https://hook.test',
        expect.objectContaining({ method: 'POST' })
      );
    });

    delete global.fetch;
  });

  it('handles email submit action', async () => {
    const user = userEvent.setup();
    const logSpy = jest.spyOn(console, 'log').mockImplementation();

    render(
      <FormRenderer
        formId="f7"
        fields={baseFields}
        submitAction="email"
        emailTo="test@example.com"
      />
    );

    await user.type(screen.getByLabelText(/name/i), 'Email');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(logSpy).toHaveBeenCalledWith(
        'Email submission to:',
        'test@example.com',
        expect.any(Object)
      );
    });

    logSpy.mockRestore();
  });

  it('handles default submit action with onSubmit', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn().mockResolvedValue(undefined);

    render(
      <FormRenderer
        formId="f8"
        fields={baseFields}
        submitAction="store"
        onSubmit={onSubmit}
      />
    );

    await user.type(screen.getByLabelText(/name/i), 'Store');
    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({ name: 'Store' });
    });
  });

  it('hides field when conditionalDisplay hides it', () => {
    const condFields = [
      { name: 'toggle', label: 'Toggle', type: 'text', defaultValue: 'yes' },
      {
        name: 'secret',
        label: 'Secret',
        type: 'text',
        conditionalDisplay: { field: 'toggle', operator: 'equals', value: 'yes', action: 'hide' },
      },
    ];
    render(
      <FormRenderer formId="f9" fields={condFields} onSubmit={jest.fn()} />
    );
    expect(screen.queryByLabelText('Secret')).toBeNull();
  });
});
