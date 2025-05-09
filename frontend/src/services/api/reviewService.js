import HttpClient from './httpClient';
import { API_BASE_URL } from '../../config/api';

// Create HTTP client instance
const client = new HttpClient(API_BASE_URL);

/**
 * Review service
 * This service handles review-related API requests using functional approach
 */

/**
 * Create a review
 * @param {object} reviewData - Review data
 * @returns {Promise<object>} - Response data
 */
const createReview = async (reviewData) => {
  try {
    return await client.post('/reviews', reviewData);
  } catch (error) {
    return {
      success: false,
      message: 'Failed to create review. Please try again.',
      data: null
    };
  }
};

/**
 * Get all reviews for a doctor
 * @param {string} doctorId - Doctor ID
 * @returns {Promise<object>} - Response data
 */
const getDoctorReviews = async (doctorId) => {
  try {
    return await client.get(`/doctors/${doctorId}/reviews`, false);
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch reviews. Please try again.',
      data: null
    };
  }
};

/**
 * Update a review
 * @param {string} reviewId - Review ID
 * @param {object} reviewData - Review data
 * @returns {Promise<object>} - Response data
 */
const updateReview = async (reviewId, reviewData) => {
  try {
    return await client.put(`/reviews/${reviewId}`, reviewData);
  } catch (error) {
    return {
      success: false,
      message: 'Failed to update review. Please try again.',
      data: null
    };
  }
};

/**
 * Delete a review
 * @param {string} reviewId - Review ID
 * @returns {Promise<object>} - Response data
 */
const deleteReview = async (reviewId) => {
  try {
    return await client.delete(`/reviews/${reviewId}`);
  } catch (error) {
    return {
      success: false,
      message: 'Failed to delete review. Please try again.',
      data: null
    };
  }
};

// Export all functions as a service object
const reviewService = {
  createReview,
  getDoctorReviews,
  updateReview,
  deleteReview
};

export default reviewService;
