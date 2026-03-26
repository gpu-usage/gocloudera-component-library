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

  it('validates minLength', () => {
    const minFields = [
      { name: 'pw', label: 'Password', validation: { minLength: 8 } },
    ];
    const { result } = renderHook(() => useForm(minFields));
    act(() => {
      result.current.handleChange('pw', 'short');
      result.current.handleBlur('pw');
    });
    expect(result.current.errors.pw).toMatch(/at least 8 characters/);
  });

  it('validates maxLength', () => {
    const maxFields = [
      { name: 'name', label: 'Name', validation: { maxLength: 3 } },
    ];
    const { result } = renderHook(() => useForm(maxFields));
    act(() => {
      result.current.handleChange('name', 'toolong');
    });
    act(() => {
      result.current.handleBlur('name');
    });
    expect(result.current.errors.name).toMatch(/at most 3 characters/);
  });

  it('validates min number', () => {
    const minFields = [
      { name: 'age', label: 'Age', validation: { min: 18 } },
    ];
    const { result } = renderHook(() => useForm(minFields));
    act(() => {
      result.current.handleChange('age', '10');
      result.current.handleBlur('age');
    });
    expect(result.current.errors.age).toMatch(/at least 18/);
  });

  it('validates max number', () => {
    const maxFields = [
      { name: 'age', label: 'Age', validation: { max: 100 } },
    ];
    const { result } = renderHook(() => useForm(maxFields));
    act(() => {
      result.current.handleChange('age', '150');
    });
    act(() => {
      result.current.handleBlur('age');
    });
    expect(result.current.errors.age).toMatch(/at most 100/);
  });

  it('validates pattern', () => {
    const patternFields = [
      { name: 'zip', label: 'ZIP', validation: { pattern: '^\\d{5}$' } },
    ];
    const { result } = renderHook(() => useForm(patternFields));
    act(() => {
      result.current.handleChange('zip', 'abc');
      result.current.handleBlur('zip');
    });
    expect(result.current.errors.zip).toMatch(/format is invalid/);
  });

  it('uses customMessage for validation errors', () => {
    const customFields = [
      { name: 'x', label: 'X', validation: { minLength: 5, customMessage: 'Too short!' } },
    ];
    const { result } = renderHook(() => useForm(customFields));
    act(() => {
      result.current.handleChange('x', 'ab');
      result.current.handleBlur('x');
    });
    expect(result.current.errors.x).toBe('Too short!');
  });

  it('validates on change when validateOnChange is true and field is touched', () => {
    const { result } = renderHook(() =>
      useForm(fields, { validateOnChange: true })
    );
    // Touch the bio field first
    act(() => {
      result.current.handleBlur('bio');
    });
    // Now change triggers validation
    act(() => {
      result.current.handleChange('bio', '');
    });
    expect(result.current.errors.bio).toMatch(/required/i);
  });

  it('handleSubmit catches onSubmit errors', async () => {
    const onSubmit = jest.fn().mockRejectedValue(new Error('fail'));
    const { result } = renderHook(() => useForm(fields, { onSubmit }));

    act(() => {
      result.current.handleChange('email', 'a@b.co');
      result.current.handleChange('bio', 'ok');
    });

    let submitResult;
    await act(async () => {
      submitResult = await result.current.handleSubmit({ preventDefault: jest.fn() });
    });

    expect(submitResult.success).toBe(false);
    expect(submitResult.error).toBeTruthy();
    expect(result.current.submitting).toBe(false);
  });

  it('isFieldVisible handles notEquals operator', () => {
    const conditionalFields = [
      { name: 'choice', label: 'C', defaultValue: 'a' },
      {
        name: 'extra',
        label: 'E',
        conditionalDisplay: { field: 'choice', operator: 'notEquals', value: 'a', action: 'show' },
      },
    ];
    const { result } = renderHook(() => useForm(conditionalFields));
    expect(result.current.isFieldVisible(conditionalFields[1])).toBe(false);
    act(() => { result.current.handleChange('choice', 'b'); });
    expect(result.current.isFieldVisible(conditionalFields[1])).toBe(true);
  });

  it('isFieldVisible handles contains operator', () => {
    const conditionalFields = [
      { name: 'text', label: 'T', defaultValue: 'hello world' },
      {
        name: 'extra',
        label: 'E',
        conditionalDisplay: { field: 'text', operator: 'contains', value: 'world', action: 'show' },
      },
    ];
    const { result } = renderHook(() => useForm(conditionalFields));
    expect(result.current.isFieldVisible(conditionalFields[1])).toBe(true);
  });

  it('isFieldVisible handles isEmpty operator', () => {
    const conditionalFields = [
      { name: 'text', label: 'T', defaultValue: '' },
      {
        name: 'extra',
        label: 'E',
        conditionalDisplay: { field: 'text', operator: 'isEmpty', value: '', action: 'show' },
      },
    ];
    const { result } = renderHook(() => useForm(conditionalFields));
    expect(result.current.isFieldVisible(conditionalFields[1])).toBe(true);
  });

  it('isFieldVisible handles isNotEmpty operator', () => {
    const conditionalFields = [
      { name: 'text', label: 'T', defaultValue: 'val' },
      {
        name: 'extra',
        label: 'E',
        conditionalDisplay: { field: 'text', operator: 'isNotEmpty', value: '', action: 'show' },
      },
    ];
    const { result } = renderHook(() => useForm(conditionalFields));
    expect(result.current.isFieldVisible(conditionalFields[1])).toBe(true);
  });

  it('isFieldVisible defaults to true for unknown operator', () => {
    const conditionalFields = [
      { name: 'text', label: 'T', defaultValue: 'val' },
      {
        name: 'extra',
        label: 'E',
        conditionalDisplay: { field: 'text', operator: 'unknown', value: '', action: 'show' },
      },
    ];
    const { result } = renderHook(() => useForm(conditionalFields));
    expect(result.current.isFieldVisible(conditionalFields[1])).toBe(true);
  });
});
