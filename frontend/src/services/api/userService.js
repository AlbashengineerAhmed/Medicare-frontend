import HttpClient from './httpClient';
import { API_BASE_URL } from '../../config/api';

// Create HTTP client instance
const client = new HttpClient(API_BASE_URL);

/**
 * User service
 * This service handles user-related API requests using functional approach
 */

/**
 * Get a user profile
 * @param {string} userId - User ID
 * @returns {Promise<object>} - Response data
 */
const getProfile = async (userId) => {
  try {
    return await client.get(`/users/${userId}`);
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch user profile. Please try again.',
      data: null
    };
  }
};

/**
 * Update a user profile
 * @param {string} userId - User ID
 * @param {object} userData - User data
 * @returns {Promise<object>} - Response data
 */
const updateProfile = async (userId, userData) => {
  try {
    const formData = new FormData();

    // Append user data to FormData
    Object.keys(userData).forEach(key => {
      if (key === 'photo' && userData[key] instanceof File) {
        formData.append(key, userData[key]);
      } else if (Array.isArray(userData[key])) {
        // Convert arrays to JSON strings
        formData.append(key, JSON.stringify(userData[key]));
      } else {
        formData.append(key, userData[key]);
      }
    });

    return await client.put(`/users/${userId}`, formData, true, true);
  } catch (error) {
    return {
      success: false,
      message: 'Failed to update user profile. Please try again.',
      data: null
    };
  }
};

/**
 * Delete a user profile
 * @param {string} userId - User ID
 * @returns {Promise<object>} - Response data
 */
const deleteProfile = async (userId) => {
  try {
    const response = await client.delete(`/users/${userId}`);
    return {
      ...response,
      requiresApproval: true // This indicates that deletion requires approval
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to delete user profile. Please try again.',
      data: null
    };
  }
};

/**
 * Update user password
 * @param {object} passwordData - Password data
 * @returns {Promise<object>} - Response data
 */
const updatePassword = async (passwordData) => {
  try {
    return await client.put('/password', passwordData);
  } catch (error) {
    return {
      success: false,
      message: 'Failed to update password. Please try again.',
      data: null
    };
  }
};

// Export all functions as a service object
const userService = {
  getProfile,
  updateProfile,
  deleteProfile,
  updatePassword
};

export default userService;
