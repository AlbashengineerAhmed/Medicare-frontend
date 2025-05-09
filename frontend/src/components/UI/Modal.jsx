import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';

/**
 * Modal component
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Close handler
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.title - Modal title
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.closeOnOverlayClick - Whether to close the modal when clicking the overlay
 * @returns {JSX.Element|null} - Modal component
 */
const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  className = '',
  closeOnOverlayClick = true,
}) => {
  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);
  
  // Handle overlay click
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };
  
  // Don't render anything if the modal is not open
  if (!isOpen) return null;
  
  // Base classes
  const baseClasses = 'bg-white rounded-lg overflow-hidden shadow-lg max-w-md w-full mx-auto';
  
  // Combine all classes
  const modalClasses = `${baseClasses} ${className}`;
  
  // Create portal to render the modal outside the normal DOM hierarchy
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className={modalClasses}>
        <div className="px-6 py-4 border-b border-solid border-[#eee] flex justify-between items-center">
          {title && <h3 className="text-lg font-semibold text-headingColor">{title}</h3>}
          <button
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
            onClick={onClose}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>
        
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
