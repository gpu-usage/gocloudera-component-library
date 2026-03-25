import React from 'react';
import { useForm } from '../hooks/useForm';
import clsx from 'clsx';

// Import form field components
import TextField from '../components/forms/TextField';
import TextArea from '../components/forms/TextArea';
import Select from '../components/forms/Select';
import Checkbox from '../components/forms/Checkbox';
import RadioGroup from '../components/forms/RadioGroup';
import DatePicker from '../components/forms/DatePicker';
import FileUpload from '../components/forms/FileUpload';
import Button from '../components/forms/Button';

/**
 * Field Registry - Maps Strapi field types to React components
 */
const FIELD_REGISTRY = {
  text: TextField,
  email: TextField,
  password: TextField,
  number: TextField,
  tel: TextField,
  url: TextField,
  textarea: TextArea,
  select: Select,
  multiselect: Select,
  checkbox: Checkbox,
  radio: RadioGroup,
  date: DatePicker,
  time: DatePicker,
  datetime: DatePicker,
  file: FileUpload,
  hidden: ({ name, value }) => <input type="hidden" name={name} value={value} />,
};

/**
 * FormRenderer - Renders a dynamic form from Strapi form definition
 */
export const FormRenderer = ({
  formId,
  fields,
  submitButtonText = 'Submit',
  successMessage = 'Thank you for your submission!',
  errorMessage = 'Something went wrong. Please try again.',
  onSubmit,
  submitAction,
  webhookUrl,
  emailTo,
  className = '',
  fieldOverrides = {},
}) => {
  const {
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
  } = useForm(fields, {
    onSubmit: async (formValues) => {
      // Handle different submit actions
      switch (submitAction) {
        case 'webhook':
          await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formValues),
          });
          break;
        case 'email':
          // Would typically call a backend endpoint
          console.log('Email submission to:', emailTo, formValues);
          break;
        case 'api':
          if (onSubmit) {
            await onSubmit(formValues);
          }
          break;
        default:
          // Store locally or call custom handler
          if (onSubmit) {
            await onSubmit(formValues);
          }
      }
    },
    validateOnChange: true,
  });

  if (submitted) {
    return (
      <div className="form-success" style={{
        padding: '2rem',
        textAlign: 'center',
        background: '#d4edda',
        borderRadius: '8px',
        color: '#155724',
      }}>
        <p>{successMessage}</p>
        <button 
          onClick={reset}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
          }}
        >
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form 
      id={formId}
      className={clsx('dynamic-form', className)}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="form-fields" style={{
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: 'repeat(12, 1fr)',
      }}>
        {fields.map((field) => {
          if (!isFieldVisible(field)) return null;

          const FieldComponent = fieldOverrides[field.type] || FIELD_REGISTRY[field.type] || TextField;
          
          // Calculate grid column span
          const widthMap = {
            full: 12,
            half: 6,
            third: 4,
            quarter: 3,
          };
          const colSpan = widthMap[field.width] || 12;

          return (
            <div 
              key={field.name}
              className={clsx('form-field', `field-${field.type}`)}
              style={{ gridColumn: `span ${colSpan}` }}
            >
              <FieldComponent
                {...field}
                value={values[field.name]}
                error={touched[field.name] ? errors[field.name] : null}
                onChange={(value) => handleChange(field.name, value)}
                onBlur={() => handleBlur(field.name)}
              />
            </div>
          );
        })}
      </div>

      <div className="form-actions" style={{ marginTop: '1.5rem' }}>
        <Button
          type="submit"
          variant="primary"
          size="large"
          disabled={submitting}
          text={submitting ? 'Submitting...' : submitButtonText}
        />
      </div>
    </form>
  );
};

/**
 * Register a custom field component
 */
export const registerField = (type, component) => {
  FIELD_REGISTRY[type] = component;
};

export default FormRenderer;

