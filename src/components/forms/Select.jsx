import React from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

/**
 * Select/Dropdown Component
 */
const Select = ({
  name,
  label,
  placeholder = 'Select an option',
  helpText,
  required = false,
  disabled = false,
  value,
  error,
  options = [],
  multiple = false,
  onChange,
  onBlur,
  className = '',
}) => {
  const handleChange = (e) => {
    if (multiple) {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      onChange?.(selectedOptions);
    } else {
      onChange?.(e.target.value);
    }
  };

  const selectStyle = {
    width: '100%',
    padding: '0.75rem 2.5rem 0.75rem 1rem',
    fontSize: '1rem',
    border: `2px solid ${error ? '#ef4444' : '#e5e7eb'}`,
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
    background: disabled ? '#f9fafb' : '#fff',
    appearance: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
  };

  return (
    <div className={clsx('form-field select-field', className)}>
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

      <div style={{ position: 'relative' }}>
        <select
          id={name}
          name={name}
          value={value || (multiple ? [] : '')}
          required={required}
          disabled={disabled}
          multiple={multiple}
          onChange={handleChange}
          onBlur={onBlur}
          style={selectStyle}
          onFocus={(e) => {
            e.target.style.borderColor = '#4f46e5';
          }}
          onBlurCapture={(e) => {
            e.target.style.borderColor = error ? '#ef4444' : '#e5e7eb';
          }}
        >
          {!multiple && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option, index) => (
            <option 
              key={option.value || index} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {!multiple && (
          <ChevronDown
            size={20}
            style={{
              position: 'absolute',
              right: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              pointerEvents: 'none',
              color: '#6b7280',
            }}
          />
        )}
      </div>

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

export default Select;

