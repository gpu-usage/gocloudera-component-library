import React from 'react';
import clsx from 'clsx';

/**
 * Text Area Component
 */
const TextArea = ({
  name,
  label,
  placeholder,
  helpText,
  required = false,
  disabled = false,
  value,
  error,
  onChange,
  onBlur,
  rows = 4,
  className = '',
}) => {
  const handleChange = (e) => {
    onChange?.(e.target.value);
  };

  const textareaStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    border: `2px solid ${error ? '#ef4444' : '#e5e7eb'}`,
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
    resize: 'vertical',
    minHeight: '100px',
    background: disabled ? '#f9fafb' : '#fff',
    fontFamily: 'inherit',
  };

  return (
    <div className={clsx('form-field textarea-field', className)}>
      {label && (
        <label
          htmlFor={name}
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 500,
            color: '#374151',
          }}
        >
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>}
        </label>
      )}

      <textarea
        id={name}
        name={name}
        value={value || ''}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        onChange={handleChange}
        onBlur={onBlur}
        rows={rows}
        style={textareaStyle}
        onFocus={(e) => {
          e.target.style.borderColor = '#4f46e5';
        }}
        onBlurCapture={(e) => {
          e.target.style.borderColor = error ? '#ef4444' : '#e5e7eb';
        }}
      />

      {(error || helpText) && (
        <p style={{
          marginTop: '0.5rem',
          fontSize: '0.875rem',
          color: error ? '#ef4444' : '#6b7280',
        }}>
          {error || helpText}
        </p>
      )}
    </div>
  );
};

export default TextArea;

