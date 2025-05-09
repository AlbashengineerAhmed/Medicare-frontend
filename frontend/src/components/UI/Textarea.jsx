import React from 'react';

/**
 * Textarea component
 * @param {Object} props - Component props
 * @param {string} props.name - Textarea name
 * @param {string} props.id - Textarea ID
 * @param {string} props.placeholder - Textarea placeholder
 * @param {string} props.value - Textarea value
 * @param {Function} props.onChange - Change handler
 * @param {Function} props.onBlur - Blur handler
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.required - Whether the textarea is required
 * @param {boolean} props.disabled - Whether the textarea is disabled
 * @param {string} props.label - Textarea label
 * @param {string} props.error - Error message
 * @param {boolean} props.touched - Whether the textarea has been touched
 * @param {number} props.rows - Number of rows
 * @returns {JSX.Element} - Textarea component
 */
const Textarea = ({
  name,
  id,
  placeholder,
  value,
  onChange,
  onBlur,
  className = '',
  required = false,
  disabled = false,
  label,
  error,
  touched,
  rows = 4,
}) => {
  // Generate ID if not provided
  const textareaId = id || name;
  
  // Base classes
  const baseClasses = 'w-full px-4 py-3 border border-solid rounded-md focus:outline-none focus:border-primaryColor';
  
  // Error classes
  const errorClasses = touched && error ? 'border-red-500' : 'border-[#0066ff34]';
  
  // Disabled classes
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent';
  
  // Combine all classes
  const textareaClasses = `${baseClasses} ${errorClasses} ${disabledClasses} ${className}`;
  
  return (
    <div className="mb-5">
      {label && (
        <label
          htmlFor={textareaId}
          className="text-textColor font-semibold text-[16px] leading-7 mb-2 block"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <textarea
        name={name}
        id={textareaId}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={textareaClasses}
        required={required}
        disabled={disabled}
        rows={rows}
      />
      
      {touched && error && (
        <div className="text-red-500 text-sm mt-1">{error}</div>
      )}
    </div>
  );
};

export default Textarea;
