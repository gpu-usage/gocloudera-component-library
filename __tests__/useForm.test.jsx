import { renderHook, act } from '@testing-library/react';
import { useForm } from '../src/hooks/useForm';

const fields = [
  { name: 'email', label: 'Email', type: 'email' },
  { name: 'bio', label: 'Bio', required: true },
];

describe('useForm', () => {
  it('initializes values from defaultValue', () => {
    const { result } = renderHook(() =>
      useForm([{ name: 'x', label: 'X', defaultValue: 'start' }])
    );
    expect(result.current.values).toEqual({ x: 'start' });
  });

  it('validates required fields on blur', () => {
    const { result } = renderHook(() => useForm(fields));

    act(() => {
      result.current.handleBlur('bio');
    });

    expect(result.current.errors.bio).toMatch(/required/i);
  });

  it('validates email format', () => {
    const { result } = renderHook(() => useForm(fields));

    act(() => {
      result.current.handleChange('email', 'bad');
    });
    act(() => {
      result.current.handleBlur('email');
    });

    expect(result.current.errors.email).toMatch(/valid email/i);
  });

  it('handleSubmit fails when validation errors exist', async () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() => useForm(fields, { onSubmit }));

    let submitResult;
    await act(async () => {
      submitResult = await result.current.handleSubmit({
        preventDefault: jest.fn(),
      });
    });

    expect(submitResult.success).toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('handleSubmit invokes onSubmit when valid', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() => useForm(fields, { onSubmit }));

    act(() => {
      result.current.handleChange('email', 'a@b.co');
      result.current.handleChange('bio', 'ok');
    });

    let submitResult;
    await act(async () => {
      submitResult = await result.current.handleSubmit({
        preventDefault: jest.fn(),
      });
    });

    expect(submitResult.success).toBe(true);
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'a@b.co',
      bio: 'ok',
    });
    expect(result.current.submitted).toBe(true);
  });

  it('isFieldVisible respects conditionalDisplay hide', () => {
    const conditionalFields = [
      { name: 'toggle', label: 'T', defaultValue: '' },
      {
        name: 'secret',
        label: 'S',
        conditionalDisplay: {
          field: 'toggle',
          operator: 'equals',
          value: 'show',
          action: 'hide',
        },
      },
    ];
    const { result } = renderHook(() => useForm(conditionalFields));

    expect(result.current.isFieldVisible(conditionalFields[1])).toBe(true);

    act(() => {
      result.current.handleChange('toggle', 'show');
    });

    expect(result.current.isFieldVisible(conditionalFields[1])).toBe(false);
  });

  it('reset restores initial values and flags', () => {
    const { result } = renderHook(() => useForm(fields));

    act(() => {
      result.current.handleChange('bio', 'text');
      result.current.handleBlur('bio');
    });
    expect(result.current.values.bio).toBe('text');

    act(() => {
      result.current.reset();
    });

    expect(result.current.values.bio).toBe('');
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });
});
