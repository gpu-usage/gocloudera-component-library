import React from 'react';
import clsx from 'clsx';
import FormRenderer from '../../renderer/FormRenderer';

/**
 * Form Section Component - Wrapper for dynamic forms from Strapi
 */
const FormSection = ({
  title,
  description,
  formId,
  submitButtonText = 'Submit',
  successMessage,
  errorMessage,
  fields = [],
  submitAction = 'store',
  webhookUrl,
  emailTo,
  backgroundColor = '#ffffff',
  onFormSubmit,
  className = '',
}) => {
  const containerStyle = {
    background: backgroundColor,
    padding: '4rem 2rem',
  };

  return (
    <section className={clsx('form-section', className)} style={containerStyle}>
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {(title || description) && (
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            {title && <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{title}</h2>}
            {description && <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>{description}</p>}
          </div>
        )}

        <FormRenderer
          formId={formId}
          fields={fields}
          submitButtonText={submitButtonText}
          successMessage={successMessage}
          errorMessage={errorMessage}
          submitAction={submitAction}
          webhookUrl={webhookUrl}
          emailTo={emailTo}
          onSubmit={onFormSubmit}
        />
      </div>
    </section>
  );
};

export default FormSection;

