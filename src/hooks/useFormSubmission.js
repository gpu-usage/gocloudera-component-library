import { useState, useCallback } from 'react';
import { useStrapi } from '../context/StrapiContext';

/**
 * Hook for submitting forms to Strapi.
 *
 * Handles loading state, validation, and error handling.
 * The form data is stored in Strapi's FormSubmission collection
 * and an email notification is sent if the site has emailConfig.
 *
 * Usage:
 *   const { submit, loading, error, success } = useFormSubmission();
 *
 *   const handleSubmit = (e) => {
 *     e.preventDefault();
 *     submit({
 *       formType: 'contact',
 *       name: 'John Doe',
 *       email: 'john@example.com',
 *       message: 'Hello!',
 *     });
 *   };
 */
export const useFormSubmission = () => {
  const { submitForm } = useStrapi();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [submissionId, setSubmissionId] = useState(null);

  const submit = useCallback(async (formData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const result = await submitForm(formData);

      setSubmissionId(result?.data?.id || null);
      setSuccess(true);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [submitForm]);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
    setSubmissionId(null);
  }, []);

  return { submit, loading, error, success, submissionId, reset };
};

export default useFormSubmission;
