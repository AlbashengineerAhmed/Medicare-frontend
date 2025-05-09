import HttpClient from './httpClient';

// API base URL
const BASE_URL = 'http://localhost:8000/api/v1';

// Create HTTP client instance
const client = new HttpClient(BASE_URL);

/**
 * Deletion Request service
 * This service handles deletion request-related API requests
 */

/**
 * Create a deletion request
 * @param {object} requestData - Request data including reason
 * @returns {Promise<object>} - Response data
 */
const createDeletionRequest = async (requestData) => {
  try {
    return await client.post('/deletion-requests', requestData);
  } catch (error) {
    return {
      success: false,
      message: 'Failed to submit deletion request. Please try again.',
      data: null
    };
  }
};

/**
 * Get deletion request status for current user
 * @returns {Promise<object>} - Response data
 */
const getDeletionRequestStatus = async () => {
  try {
    return await client.get('/deletion-requests/status');
  } catch (error) {
    return {
      success: false,
      message: 'Failed to get deletion request status. Please try again.',
      data: null
    };
  }
};

/**
 * Get all deletion requests (admin only)
 * @returns {Promise<object>} - Response data
 */
const getAllDeletionRequests = async () => {
  try {
    return await client.get('/deletion-requests');
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch deletion requests. Please try again.',
      data: null
    };
  }
};

/**
 * Process a deletion request (admin only)
 * @param {string} requestId - Request ID
 * @param {object} data - Status data (status, adminNotes)
 * @returns {Promise<object>} - Response data
 */
const processDeletionRequest = async (requestId, data) => {
  try {
    return await client.put(`/deletion-requests/${requestId}`, data);
  } catch (error) {
    return {
      success: false,
      message: 'Failed to process deletion request. Please try again.',
      data: null
    };
  }
};

// Export all functions as a service object
const deletionRequestService = {
  createDeletionRequest,
  getDeletionRequestStatus,
  getAllDeletionRequests,
  processDeletionRequest
};

export default deletionRequestService;
