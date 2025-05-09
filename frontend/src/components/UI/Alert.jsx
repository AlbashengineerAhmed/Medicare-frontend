import React from 'react';
import { FaInfoCircle, FaCheckCircle, FaExclamationTriangle, FaTimesCircle } from 'react-icons/fa';

/**
 * Alert component
 * @param {Object} props - Component props
 * @param {string} props.type - Alert type (info, success, warning, error)
 * @param {string} props.message - Alert message
 * @param {boolean} props.showIcon - Whether to show an icon
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.closable - Whether the alert is closable
 * @param {Function} props.onClose - Close handler
 * @returns {JSX.Element} - Alert component
 */
const Alert = ({
  type = 'info',
  message,
  showIcon = true,
  className = '',
  closable = false,
  onClose,
}) => {
  // Type classes
  const typeClasses = {
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    success: 'bg-green-50 text-green-700 border-green-200',
    warning: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    error: 'bg-red-50 text-red-700 border-red-200',
  };
  
  // Icon components
  const icons = {
    info: <FaInfoCircle />,
    success: <FaCheckCircle />,
    warning: <FaExclamationTriangle />,
    error: <FaTimesCircle />,
  };
  
  // Base classes
  const baseClasses = 'p-4 rounded-md border';
  
  // Combine all classes
  const alertClasses = `${baseClasses} ${typeClasses[type]} ${className}`;
  
  return (
    <div className={alertClasses} role="alert">
      <div className="flex items-start">
        {showIcon && (
          <div className="flex-shrink-0 mr-3">
            {icons[type]}
          </div>
        )}
        
        <div className="flex-grow">
          {message}
        </div>
        
        {closable && (
          <div className="flex-shrink-0 ml-3">
            <button
              type="button"
              className="text-current hover:opacity-75 focus:outline-none"
              onClick={onClose}
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alert;
