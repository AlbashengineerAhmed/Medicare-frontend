import HttpClient from './httpClient';
import { API_BASE_URL } from '../../config/api';

// Create HTTP client instance
const client = new HttpClient(API_BASE_URL);

/**
 * Authentication service
 * This service handles authentication-related API requests using functional approach
 */

/**
 * Register a new user
 * @param {object} userData - User registration data
 * @returns {Promise<object>} - Response data
 */
const register = async (userData) => {
  try {
    // If there's no photo or it's null, proceed without it
    if (!userData.photo) {
      // Create a copy of userData without the photo field
      const { photo, ...userDataWithoutPhoto } = userData;
      return await client.post('/auth/register', userDataWithoutPhoto, false);
    }

    // If there is a photo, use FormData
    const formData = new FormData();

    // Append user data to FormData
    Object.keys(userData).forEach(key => {
      if (key === 'photo' && userData[key] instanceof File) {
        formData.append(key, userData[key]);
      } else {
        formData.append(key, userData[key]);
      }
    });

    return await client.post('/auth/register', formData, false, true);
  } catch (error) {
    return {
      success: false,
      message: 'Registration failed. Please try again.',
      data: null
    };
  }
};

/**
 * Login a user
 * @param {object} credentials - User login credentials
 * @returns {Promise<object>} - Response data
 */
const login = async (credentials) => {
  try {
    const response = await client.post('/auth/login', credentials, false);

    if (response.success || response.status) {
      // Store user data in localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
      }

      if (response.role) {
        localStorage.setItem('role', response.role);
      }

      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
    }

    return response;
  } catch (error) {
    return {
      success: false,
      message: 'Login failed. Please try again.',
      data: null
    };
  }
};

/**
 * Logout a user
 * @returns {object} - Response data
 */
const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  localStorage.removeItem('user');

  return {
    success: true,
    message: 'Logout successful',
    data: null
  };
};

/**
 * Check if a user is authenticated
 * @returns {boolean} - Whether the user is authenticated
 */
const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

/**
 * Get the current user
 * @returns {object|null} - Current user data
 */
const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

/**
 * Get the current user role
 * @returns {string|null} - Current user role
 */
const getCurrentRole = () => {
  return localStorage.getItem('role');
};

// Export all functions as a service object
const authService = {
  register,
  login,
  logout,
  isAuthenticated,
  getCurrentUser,
  getCurrentRole
};

export default authService;
