import { useState, useCallback } from 'react';

/**
 * Custom hook for form handling
 * @param {Object} initialValues - Initial form values
 * @param {Function} onSubmit - Function to handle form submission
 * @param {Function} validate - Function to validate form values
 * @returns {Object} - Form values, errors, handlers, and submission state
 */
const useForm = (initialValues = {}, onSubmit = () => {}, validate = () => ({})) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});

  /**
   * Handle input change
   * @param {Event} e - Input change event
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      setValues(prevValues => ({
        ...prevValues,
        [name]: files[0]
      }));
    } else if (type === 'checkbox') {
      setValues(prevValues => ({
        ...prevValues,
        [name]: checked
      }));
    } else {
      setValues(prevValues => ({
        ...prevValues,
        [name]: value
      }));
    }
    
    // Mark field as touched
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true
    }));
  }, []);

  /**
   * Handle input blur
   * @param {Event} e - Input blur event
   */
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    
    // Mark field as touched
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true
    }));
    
    // Validate field
    const validationErrors = validate(values);
    setErrors(validationErrors);
  }, [values, validate]);

  /**
   * Handle form submission
   * @param {Event} e - Form submission event
   */
  const handleSubmit = useCallback(async (e) => {
    if (e) e.preventDefault();
    
    // Validate form
    const validationErrors = validate(values);
    setErrors(validationErrors);
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    // Check if there are any errors
    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, validate, onSubmit]);

  /**
   * Reset form
   * @param {Object} newValues - New form values
   */
  const resetForm = useCallback((newValues = initialValues) => {
    setValues(newValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  /**
   * Set a specific form value
   * @param {string} name - Field name
   * @param {any} value - Field value
   */
  const setFieldValue = useCallback((name, value) => {
    setValues(prevValues => ({
      ...prevValues,
      [name]: value
    }));
  }, []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue
  };
};

export default useForm;
