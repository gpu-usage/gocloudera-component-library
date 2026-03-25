import React from 'react';
import clsx from 'clsx';
import { Calendar } from 'lucide-react';

/**
 * Date Picker Component
 */
const DatePicker = ({
  name,
  label,
  type = 'date', // date, time, datetime
  placeholder,
  helpText,
  required = false,
  disabled = false,
  value,
  error,
  onChange,
  onBlur,
  min,
  max,
  className = '',
}) => {
  const handleChange = (e) => {
    onChange?.(e.target.value);
  };

  const inputType = type === 'datetime' ? 'datetime-local' : type;

  const inputStyle = {
    width: '100%',
    padding: '0.75rem 2.5rem 0.75rem 1rem',
    fontSize: '1rem',
    border: `2px solid ${error ? '#ef4444' : '#e5e7eb'}`,
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
    background: disabled ? '#f9fafb' : '#fff',
  };

  return (
    <div className={clsx('form-field date-field', className)}>
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
        <input
          id={name}
          name={name}
          type={inputType}
          value={value || ''}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          min={min}
          max={max}
          onChange={handleChange}
          onBlur={onBlur}
          style={inputStyle}
          onFocus={(e) => {
            e.target.style.borderColor = '#4f46e5';
          }}
          onBlurCapture={(e) => {
            e.target.style.borderColor = error ? '#ef4444' : '#e5e7eb';
          }}
        />

        <Calendar
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

export default DatePicker;

