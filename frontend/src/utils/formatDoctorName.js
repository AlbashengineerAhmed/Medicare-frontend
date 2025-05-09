/**
 * Formats a doctor's name to include "Dr." prefix if not already present
 * @param {string} name - The doctor's name
 * @returns {string} - The formatted doctor name
 */
export const formatDoctorName = (name) => {
  if (!name) return '';
  
  // Check if name already starts with "Dr." or "dr." (case insensitive)
  if (name.toLowerCase().startsWith('dr.')) {
    return name;
  }
  
  // Add "Dr." prefix
  return `Dr. ${name}`;
};
