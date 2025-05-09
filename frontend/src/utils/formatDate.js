/**
 * Format a date string to a more readable format
 * @param {string} date - The date string to format
 * @param {object} config - Optional configuration for date formatting
 * @returns {string} - The formatted date string
 */
export const formatDate = (date, config) => {
    const defaultOptions = { day: 'numeric', month: 'short', year: 'numeric' };
    const options = config ? config : defaultOptions;

    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
        // If the date is invalid, try parsing it differently
        const parts = date.split('-');
        if (parts.length === 3) {
            // Try MM-DD-YYYY format
            const month = parseInt(parts[0], 10);
            const day = parseInt(parts[1], 10);
            const year = parseInt(parts[2], 10);

            if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
                return new Date(year, month - 1, day).toLocaleDateString('en-US', options);
            }
        }

        return date; // Return the original string if we can't parse it
    }

    return dateObj.toLocaleDateString('en-US', options);
};