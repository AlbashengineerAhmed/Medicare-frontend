import React from 'react';

/**
 * Input component
 * @param {Object} props - Component props
 * @param {string} props.type - Input type
 * @param {string} props.name - Input name
 * @param {string} props.id - Input ID
 * @param {string} props.placeholder - Input placeholder
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {Function} props.onBlur - Blur handler
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.required - Whether the input is required
 * @param {boolean} props.disabled - Whether the input is disabled
 * @param {string} props.label - Input label
 * @param {string} props.error - Error message
 * @param {boolean} props.touched - Whether the input has been touched
 * @returns {JSX.Element} - Input component
 */
const Input = ({
  type = 'text',
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
}) => {
  // Generate ID if not provided
  const inputId = id || name;
  
  // Base classes
  const baseClasses = 'w-full px-4 py-3 border border-solid rounded-md focus:outline-none focus:border-primaryColor';
  
  // Error classes
  const errorClasses = touched && error ? 'border-red-500' : 'border-[#0066ff34]';
  
  // Disabled classes
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent';
  
  // Combine all classes
  const inputClasses = `${baseClasses} ${errorClasses} ${disabledClasses} ${className}`;
  
  return (
    <div className="mb-5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-textColor font-semibold text-[16px] leading-7 mb-2 block"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <input
        type={type}
        name={name}
        id={inputId}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={inputClasses}
        required={required}
        disabled={disabled}
      />
      
      {touched && error && (
        <div className="text-red-500 text-sm mt-1">{error}</div>
      )}
    </div>
  );
};

export default Input;
