import React from 'react';
import { render, screen } from '@testing-library/react';
import FormSection from '../src/components/forms/FormSection';

// Mock FormRenderer since it has complex dependencies (useForm hook)
jest.mock('../src/renderer/FormRenderer', () => {
  const React = require('react');
  return function MockFormRenderer(props) {
    return (
      <div data-testid="form-renderer">
        <span data-testid="form-id">{props.formId}</span>
        <span data-testid="submit-text">{props.submitButtonText}</span>
        <span data-testid="field-count">{props.fields?.length || 0}</span>
      </div>
    );
  };
});

describe('FormSection', () => {
  it('renders title and description', () => {
    render(<FormSection title="Contact Us" description="Fill out the form" fields={[]} />);
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('Fill out the form')).toBeInTheDocument();
  });

  it('renders FormRenderer component', () => {
    render(<FormSection fields={[]} />);
    expect(screen.getByTestId('form-renderer')).toBeInTheDocument();
  });

  it('passes formId to FormRenderer', () => {
    render(<FormSection formId="contact-form" fields={[]} />);
    expect(screen.getByTestId('form-id').textContent).toBe('contact-form');
  });

  it('passes submitButtonText to FormRenderer', () => {
    render(<FormSection submitButtonText="Send Message" fields={[]} />);
    expect(screen.getByTestId('submit-text').textContent).toBe('Send Message');
  });

  it('passes fields to FormRenderer', () => {
    const fields = [
      { name: 'email', type: 'email', label: 'Email' },
      { name: 'name', type: 'text', label: 'Name' },
    ];
    render(<FormSection fields={fields} />);
    expect(screen.getByTestId('field-count').textContent).toBe('2');
  });
});
