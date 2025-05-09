import React from 'react';

/**
 * Select component
 * @param {Object} props - Component props
 * @param {string} props.name - Select name
 * @param {string} props.id - Select ID
 * @param {string} props.value - Select value
 * @param {Function} props.onChange - Change handler
 * @param {Function} props.onBlur - Blur handler
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.required - Whether the select is required
 * @param {boolean} props.disabled - Whether the select is disabled
 * @param {string} props.label - Select label
 * @param {string} props.error - Error message
 * @param {boolean} props.touched - Whether the select has been touched
 * @param {Array} props.options - Select options
 * @param {string} props.placeholder - Select placeholder
 * @returns {JSX.Element} - Select component
 */
const Select = ({
  name,
  id,
  value,
  onChange,
  onBlur,
  className = '',
  required = false,
  disabled = false,
  label,
  error,
  touched,
  options = [],
  placeholder = 'Select an option',
}) => {
  // Generate ID if not provided
  const selectId = id || name;
  
  // Base classes
  const baseClasses = 'w-full px-4 py-3 border border-solid rounded-md focus:outline-none focus:border-primaryColor';
  
  // Error classes
  const errorClasses = touched && error ? 'border-red-500' : 'border-[#0066ff34]';
  
  // Disabled classes
  const disabledClasses = disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-transparent';
  
  // Combine all classes
  const selectClasses = `${baseClasses} ${errorClasses} ${disabledClasses} ${className}`;
  
  return (
    <div className="mb-5">
      {label && (
        <label
          htmlFor={selectId}
          className="text-textColor font-semibold text-[16px] leading-7 mb-2 block"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      
      <select
        name={name}
        id={selectId}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={selectClasses}
        required={required}
        disabled={disabled}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {touched && error && (
        <div className="text-red-500 text-sm mt-1">{error}</div>
      )}
    </div>
  );
};

export default Select;
