import React from 'react';

/**
 * Loader component
 * @param {Object} props - Component props
 * @param {string} props.size - Loader size (sm, md, lg)
 * @param {string} props.color - Loader color
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Loader component
 */
const Loader = ({
  size = 'md',
  color = 'primaryColor',
  className = '',
}) => {
  // Size classes
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };
  
  // Color classes
  const colorClasses = {
    primaryColor: 'border-primaryColor',
    white: 'border-white',
    gray: 'border-gray-300',
  };
  
  // Combine all classes
  const loaderClasses = `
    inline-block rounded-full border-4 border-t-transparent animate-spin
    ${sizeClasses[size]} ${colorClasses[color]} ${className}
  `;
  
  return (
    <div className="flex items-center justify-center">
      <div className={loaderClasses}></div>
    </div>
  );
};

export default Loader;
