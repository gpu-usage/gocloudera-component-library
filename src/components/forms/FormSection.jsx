import React, { useState } from 'react';
import clsx from 'clsx';
import Button from './Button';

/**
 * Form Section Component - Renders CMS-driven forms and submits to Strapi.
 *
 * The `formType` field from Strapi (contact, lead, demo) determines
 * which type of form submission is created. The Strapi backend handles
 * storage and email notifications.
 *
 * Fields are defined in Strapi as a repeatable component (shared.form-field)
 * with name, label, type, and required attributes.
 */
const FormSection = ({
  title,
  description,
  formType = 'contact',
  fields = [],
  submitButtonText = 'Submit',
  successMessage = 'Thank you! We\'ll be in touch soon.',
  errorMessage = 'Something went wrong. Please try again.',
  backgroundColor = '#ffffff',
  onFormSubmit,
  className = '',
}) => {
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Extract known fields, put the rest in extraData
      const { name, email, company, phone, message, ...extraFields } = formData;

      const payload = {
        formType,
        name: name || null,
        email: email || formData.work_email || formData.workEmail,
        company: company || null,
        phone: phone || null,
        message: message || null,
        extraData: Object.keys(extraFields).length > 0 ? extraFields : null,
        source: window.location.href,
      };

      if (onFormSubmit) {
        await onFormSubmit(payload);
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message || errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const containerStyle = {
    background: backgroundColor,
    padding: '4rem 2rem',
  };

  if (submitted) {
    return (
      <section className={clsx('form-section', className)} style={containerStyle}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '12px',
            padding: '2rem',
          }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" style={{ margin: '0 auto 1rem' }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p style={{ fontSize: '1.2rem', color: '#166534', fontWeight: 500 }}>{successMessage}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={clsx('form-section', className)} style={containerStyle}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {(title || description) && (
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            {title && <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{title}</h2>}
            {description && <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>{description}</p>}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {fields.map((field, idx) => (
            <div key={field.name || idx} style={{ marginBottom: '1.25rem' }}>
              {field.label && (
                <label
                  htmlFor={field.name}
                  style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, color: '#374151' }}
                >
                  {field.label}
                  {field.required && <span style={{ color: '#ef4444', marginLeft: '0.25rem' }}>*</span>}
                </label>
              )}

              {field.type === 'textarea' ? (
                <textarea
                  id={field.name}
                  name={field.name}
                  required={field.required}
                  rows={4}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              ) : field.type === 'select' && field.options ? (
                <select
                  id={field.name}
                  name={field.name}
                  required={field.required}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                    background: '#fff',
                  }}
                >
                  <option value="">Select...</option>
                  {(Array.isArray(field.options) ? field.options : []).map((opt, i) => (
                    <option key={i} value={opt.value || opt}>{opt.label || opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  id={field.name}
                  name={field.name}
                  type={field.type || 'text'}
                  required={field.required}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '1rem',
                  }}
                />
              )}
            </div>
          ))}

          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              color: '#991b1b',
              fontSize: '0.9rem',
            }}>
              {error}
            </div>
          )}

          <Button
            text={submitting ? 'Submitting...' : submitButtonText}
            type="submit"
            variant="primary"
            disabled={submitting}
          />
        </form>
      </div>
    </section>
  );
};

export default FormSection;
