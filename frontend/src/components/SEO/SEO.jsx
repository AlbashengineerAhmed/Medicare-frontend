import { useEffect } from 'react';
import { updateSEO } from '../../utils/seo';

/**
 * SEO component for managing document head
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.keywords - Page keywords
 * @param {string} props.ogImage - Open Graph image URL
 * @param {string} props.ogUrl - Open Graph URL
 * @returns {null} - This component doesn't render anything
 */
const SEO = ({
  title,
  description,
  keywords,
  ogImage,
  ogUrl
}) => {
  useEffect(() => {
    updateSEO({
      title,
      description,
      keywords,
      ogImage,
      ogUrl
    });
    
    // Cleanup function to reset title when component unmounts
    return () => {
      document.title = 'Medicare - Doctor Appointment Booking';
    };
  }, [title, description, keywords, ogImage, ogUrl]);
  
  return null;
};

export default SEO;
