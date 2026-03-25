import React from 'react';
import clsx from 'clsx';
import { Check } from 'lucide-react';

/**
 * Checkbox Component
 */
const Checkbox = ({
  name,
  label,
  helpText,
  required = false,
  disabled = false,
  value,
  error,
  onChange,
  onBlur,
  className = '',
}) => {
  const isChecked = value === true || value === 'true' || value === 'on';

  const handleChange = (e) => {
    onChange?.(e.target.checked);
  };

  return (
    <div className={clsx('form-field checkbox-field', className)}>
      <label
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <div
          style={{
            position: 'relative',
            flexShrink: 0,
            marginTop: '0.125rem',
          }}
        >
          <input
            type="checkbox"
            id={name}
            name={name}
            checked={isChecked}
            required={required}
            disabled={disabled}
            onChange={handleChange}
            onBlur={onBlur}
            style={{
              position: 'absolute',
              opacity: 0,
              width: '20px',
              height: '20px',
              cursor: 'pointer',
            }}
          />
          <div
            style={{
              width: '20px',
              height: '20px',
              borderRadius: '4px',
              border: `2px solid ${error ? '#ef4444' : isChecked ? '#4f46e5' : '#d1d5db'}`,
              background: isChecked ? '#4f46e5' : '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
          >
            {isChecked && <Check size={14} color="#fff" strokeWidth={3} />}
          </div>
        </div>

        <div>
          <span style={{ color: '#374151' }}>
            {label}
            {required && <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>}
          </span>
          
          {helpText && (
            <p style={{
              marginTop: '0.25rem',
              fontSize: '0.875rem',
              color: '#6b7280',
            }}>
              {helpText}
            </p>
          )}
        </div>
      </label>

      {error && (
        <p style={{
          marginTop: '0.5rem',
          fontSize: '0.875rem',
          color: '#ef4444',
        }}>
          {error}
        </p>
      )}
    </div>
  );
};

export default Checkbox;

