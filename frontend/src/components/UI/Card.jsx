import React from 'react';

/**
 * Card component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.hoverable - Whether the card should have hover effects
 * @param {boolean} props.bordered - Whether the card should have a border
 * @param {string} props.title - Card title
 * @param {React.ReactNode} props.extra - Extra content in the top-right corner
 * @returns {JSX.Element} - Card component
 */
const Card = ({
  children,
  className = '',
  hoverable = false,
  bordered = true,
  title,
  extra,
}) => {
  // Base classes
  const baseClasses = 'bg-white rounded-lg overflow-hidden';
  
  // Border classes
  const borderClasses = bordered ? 'border border-solid border-[#eee]' : '';
  
  // Hover classes
  const hoverClasses = hoverable ? 'transition-all duration-300 hover:shadow-lg' : '';
  
  // Shadow classes
  const shadowClasses = 'shadow-sm';
  
  // Combine all classes
  const cardClasses = `${baseClasses} ${borderClasses} ${hoverClasses} ${shadowClasses} ${className}`;
  
  return (
    <div className={cardClasses}>
      {(title || extra) && (
        <div className="px-6 py-4 border-b border-solid border-[#eee] flex justify-between items-center">
          {title && <h3 className="text-lg font-semibold text-headingColor">{title}</h3>}
          {extra && <div>{extra}</div>}
        </div>
      )}
      
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default Card;
