import React from 'react';
import clsx from 'clsx';

/**
 * Radio Group Component
 */
const RadioGroup = ({
  name,
  label,
  helpText,
  required = false,
  disabled = false,
  value,
  error,
  options = [],
  onChange,
  onBlur,
  className = '',
}) => {
  const handleChange = (optionValue) => {
    if (!disabled) {
      onChange?.(optionValue);
    }
  };

  return (
    <div className={clsx('form-field radio-group', className)}>
      {label && (
        <p style={{
          marginBottom: '0.75rem',
          fontWeight: 500,
          color: '#374151',
        }}>
          {label}
          {required && <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>}
        </p>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {options.map((option, index) => {
          const isSelected = value === option.value;
          
          return (
            <label
              key={option.value || index}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                cursor: disabled || option.disabled ? 'not-allowed' : 'pointer',
                opacity: disabled || option.disabled ? 0.6 : 1,
              }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <input
                  type="radio"
                  name={name}
                  value={option.value}
                  checked={isSelected}
                  disabled={disabled || option.disabled}
                  onChange={() => handleChange(option.value)}
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
                    borderRadius: '50%',
                    border: `2px solid ${error ? '#ef4444' : isSelected ? '#4f46e5' : '#d1d5db'}`,
                    background: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  {isSelected && (
                    <div
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: '#4f46e5',
                      }}
                    />
                  )}
                </div>
              </div>

              <span style={{ color: '#374151' }}>{option.label}</span>
            </label>
          );
        })}
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

export default RadioGroup;

