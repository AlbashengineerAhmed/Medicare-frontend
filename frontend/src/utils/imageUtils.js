/**
 * Default avatar image URL
 * @type {string}
 */
import { API_SERVER_URL } from '../config/api';

export const DEFAULT_AVATAR = 'https://res.cloudinary.com/dotzclh4n/image/upload/v1746707126/users/default-user.jpg';

/**
 * Get image URL with fallback
 * @param {string} imageUrl - Image URL
 * @param {string} fallbackUrl - Fallback image URL
 * @returns {string} - Valid image URL
 */
export const getImageUrl = (imageUrl, fallbackUrl = DEFAULT_AVATAR) => {
  if (!imageUrl) return fallbackUrl;

  // Check if the image URL is a relative path
  if (imageUrl.startsWith('/uploads/')) {
    return `${API_SERVER_URL}${imageUrl}`;
  }

  return imageUrl;
};

/**
 * Compress an image file
 * @param {File} file - Image file
 * @param {Object} options - Compression options
 * @param {number} options.maxWidth - Maximum width
 * @param {number} options.maxHeight - Maximum height
 * @param {number} options.quality - Image quality (0-1)
 * @returns {Promise<File>} - Compressed image file
 */
export const compressImage = (file, { maxWidth = 800, maxHeight = 800, quality = 0.8 } = {}) => {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Invalid file type. Only images are supported.'));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;

      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        // Draw image on canvas
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to blob
        canvas.toBlob((blob) => {
          // Create new file from blob
          const compressedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });

          resolve(compressedFile);
        }, file.type, quality);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image.'));
      };
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file.'));
    };
  });
};

/**
 * Convert a file to base64
 * @param {File} file - File to convert
 * @returns {Promise<string>} - Base64 string
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      resolve(reader.result);
    };

    reader.onerror = (error) => {
      reject(error);
    };
  });
};
