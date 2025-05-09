/**
 * HTTP Client for making API requests
 * This module provides a consistent interface for making HTTP requests to the API
 * using a functional approach
 */

// Helper function to get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Common headers for API requests
const getHeaders = (includeToken = true, isFormData = false) => {
  const headers = {};

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  if (includeToken) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
};

/**
 * Handle API response
 * @param {Response} response - Fetch API response
 * @returns {Promise<any>} - Response data
 */
const handleResponse = async (response) => {
  // Check if the response is valid JSON
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'An error occurred',
        status: response.status,
        data: null
      };
    }

    return data;
  } else {
    // If not JSON, get the text
    const text = await response.text();

    if (!response.ok) {
      return {
        success: false,
        message: text || 'An error occurred',
        status: response.status,
        data: null
      };
    }

    try {
      return JSON.parse(text);
    } catch (e) {
      return {
        success: true,
        message: text,
        status: response.status,
        data: text
      };
    }
  }
};

/**
 * Handle API error
 * @param {Error} error - Error object
 * @returns {object} - Error response
 */
const handleError = (error) => {
  // Silent error handling for production
  return {
    success: false,
    message: error.message || 'An error occurred',
    status: 500,
    data: null
  };
};

/**
 * Create an HTTP client for making API requests
 * @param {string} baseUrl - Base URL for API requests
 * @returns {object} - HTTP client object with methods for making requests
 */
const HttpClient = function(baseUrl) {
  /**
   * Make a GET request
   * @param {string} endpoint - API endpoint
   * @param {boolean} requiresAuth - Whether the request requires authentication
   * @returns {Promise<any>} - Response data
   */
  const get = async (endpoint, requiresAuth = true) => {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'GET',
        headers: getHeaders(requiresAuth),
      });

      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  };

  /**
   * Make a POST request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request data
   * @param {boolean} requiresAuth - Whether the request requires authentication
   * @param {boolean} isFormData - Whether the request data is FormData
   * @returns {Promise<any>} - Response data
   */
  const post = async (endpoint, data, requiresAuth = true, isFormData = false) => {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(requiresAuth, isFormData),
        body: isFormData ? data : JSON.stringify(data),
      });

      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  };

  /**
   * Make a PUT request
   * @param {string} endpoint - API endpoint
   * @param {object} data - Request data
   * @param {boolean} requiresAuth - Whether the request requires authentication
   * @param {boolean} isFormData - Whether the request data is FormData
   * @returns {Promise<any>} - Response data
   */
  const put = async (endpoint, data, requiresAuth = true, isFormData = false) => {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: getHeaders(requiresAuth, isFormData),
        body: isFormData ? data : JSON.stringify(data),
      });

      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  };

  /**
   * Make a DELETE request
   * @param {string} endpoint - API endpoint
   * @param {boolean} requiresAuth - Whether the request requires authentication
   * @returns {Promise<any>} - Response data
   */
  const deleteRequest = async (endpoint, requiresAuth = true) => {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: getHeaders(requiresAuth),
      });

      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  };

  // Return the client object with methods
  return {
    get,
    post,
    put,
    delete: deleteRequest
  };
};

export default HttpClient;
