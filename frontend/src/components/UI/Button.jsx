import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Button component
 * @param {Object} props - Component props
 * @param {string} props.children - Button text
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {boolean} props.loading - Whether the button is in loading state
 * @param {string} props.to - Link destination (if button should be a link)
 * @param {string} props.variant - Button variant (primary, secondary, outline, danger)
 * @returns {JSX.Element} - Button component
 */
const Button = ({
  children,
  type = 'button',
  className = '',
  onClick,
  disabled = false,
  loading = false,
  to,
  variant = 'primary',
}) => {
  // Base classes
  const baseClasses = 'rounded-[50px] font-[600] transition-all duration-300 flex items-center justify-center';
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-primaryColor text-white hover:bg-primaryDarkColor',
    secondary: 'bg-secondaryColor text-white hover:bg-secondaryDarkColor',
    outline: 'bg-transparent border border-primaryColor text-primaryColor hover:bg-primaryColor hover:text-white',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  
  // Size classes
  const sizeClasses = 'py-[15px] px-[35px]';
  
  // Disabled classes
  const disabledClasses = disabled || loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer';
  
  // Combine all classes
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses} ${disabledClasses} ${className}`;
  
  // If to prop is provided, render a Link
  if (to) {
    return (
      <Link to={to} className={buttonClasses}>
        {loading ? (
          <>
            <span className="mr-2">Loading</span>
            <span className="animate-spin">&#8635;</span>
          </>
        ) : (
          children
        )}
      </Link>
    );
  }
  
  // Otherwise, render a button
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <>
          <span className="mr-2">Loading</span>
          <span className="animate-spin">&#8635;</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
