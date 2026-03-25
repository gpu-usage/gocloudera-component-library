import { useState, useCallback } from 'react';

/**
 * Hook for managing dynamic form state
 */
export const useForm = (fields, options = {}) => {
  const { onSubmit, validateOnChange = false } = options;
  
  // Initialize form values from field defaults
  const initialValues = fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue || '';
    return acc;
  }, {});

  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /**
   * Validate a single field
   */
  const validateField = useCallback((field, value) => {
    if (field.required && !value) {
      return `${field.label} is required`;
    }

    if (field.validation) {
      const { minLength, maxLength, min, max, pattern, customMessage } = field.validation;

      if (minLength && value.length < minLength) {
        return customMessage || `${field.label} must be at least ${minLength} characters`;
      }
      if (maxLength && value.length > maxLength) {
        return customMessage || `${field.label} must be at most ${maxLength} characters`;
      }
      if (min !== undefined && Number(value) < min) {
        return customMessage || `${field.label} must be at least ${min}`;
      }
      if (max !== undefined && Number(value) > max) {
        return customMessage || `${field.label} must be at most ${max}`;
      }
      if (pattern && !new RegExp(pattern).test(value)) {
        return customMessage || `${field.label} format is invalid`;
      }
    }

    // Type-specific validation
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        return 'Please enter a valid email address';
      }
    }

    return null;
  }, []);

  /**
   * Validate all fields
   */
  const validateAll = useCallback(() => {
    const newErrors = {};
    fields.forEach(field => {
      const error = validateField(field, values[field.name]);
      if (error) {
        newErrors[field.name] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [fields, values, validateField]);

  /**
   * Handle field change
   */
  const handleChange = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (validateOnChange && touched[name]) {
      const field = fields.find(f => f.name === name);
      if (field) {
        const error = validateField(field, value);
        setErrors(prev => ({ ...prev, [name]: error }));
      }
    }
  }, [fields, touched, validateOnChange, validateField]);

  /**
   * Handle field blur
   */
  const handleBlur = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const field = fields.find(f => f.name === name);
    if (field) {
      const error = validateField(field, values[name]);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [fields, values, validateField]);

  /**
   * Handle form submit
   */
  const handleSubmit = useCallback(async (e) => {
    e?.preventDefault();
    
    setTouched(fields.reduce((acc, f) => ({ ...acc, [f.name]: true }), {}));
    
    if (!validateAll()) {
      return { success: false, errors };
    }

    setSubmitting(true);
    
    try {
      if (onSubmit) {
        await onSubmit(values);
      }
      setSubmitted(true);
      return { success: true, data: values };
    } catch (error) {
      return { success: false, error };
    } finally {
      setSubmitting(false);
    }
  }, [fields, values, errors, onSubmit, validateAll]);

  /**
   * Reset form
   */
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setSubmitted(false);
  }, [initialValues]);

  /**
   * Check if field should be visible (conditional display)
   */
  const isFieldVisible = useCallback((field) => {
    if (!field.conditionalDisplay) return true;

    const { field: condField, operator, value: condValue, action } = field.conditionalDisplay;
    const fieldValue = values[condField];

    let conditionMet = false;
    switch (operator) {
      case 'equals':
        conditionMet = fieldValue === condValue;
        break;
      case 'notEquals':
        conditionMet = fieldValue !== condValue;
        break;
      case 'contains':
        conditionMet = String(fieldValue).includes(condValue);
        break;
      case 'isEmpty':
        conditionMet = !fieldValue;
        break;
      case 'isNotEmpty':
        conditionMet = !!fieldValue;
        break;
      default:
        conditionMet = true;
    }

    if (action === 'hide') return !conditionMet;
    return conditionMet;
  }, [values]);

  return {
    values,
    errors,
    touched,
    submitting,
    submitted,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    isFieldVisible,
    setValues,
  };
};

export default useForm;

