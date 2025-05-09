import HttpClient from './httpClient';
import { API_BASE_URL } from '../../config/api';

// Create HTTP client instance
const client = new HttpClient(API_BASE_URL);

/**
 * Doctor service
 * This service handles doctor-related API requests using functional approach
 */

/**
 * Get all doctors
 * @param {string} query - Search query
 * @returns {Promise<object>} - Response data
 */
const getAllDoctors = async (query = '') => {
  try {
    const endpoint = query ? `/doctors?query=${query}` : '/doctors';
    return await client.get(endpoint, false);
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch doctors. Please try again.',
      data: null
    };
  }
};

/**
 * Get a doctor by ID
 * @param {string} doctorId - Doctor ID
 * @returns {Promise<object>} - Response data
 */
const getDoctorById = async (doctorId) => {
  try {
    return await client.get(`/doctors/${doctorId}`, false);
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch doctor. Please try again.',
      data: null
    };
  }
};

/**
 * Update a doctor
 * @param {string} doctorId - Doctor ID
 * @param {object} doctorData - Doctor data
 * @returns {Promise<object>} - Response data
 */
const updateDoctor = async (doctorId, doctorData) => {
  try {
    const formData = new FormData();

    // Append doctor data to FormData
    Object.keys(doctorData).forEach(key => {
      if (key === 'photo' && doctorData[key] instanceof File) {
        formData.append(key, doctorData[key]);
      } else if (Array.isArray(doctorData[key])) {
        // Convert arrays to JSON strings
        formData.append(key, JSON.stringify(doctorData[key]));
      } else {
        formData.append(key, doctorData[key]);
      }
    });

    return await client.put(`/doctors/${doctorId}`, formData, true, true);
  } catch (error) {
    return {
      success: false,
      message: 'Failed to update doctor. Please try again.',
      data: null
    };
  }
};

/**
 * Get top rated doctors
 * @param {number} limit - Number of doctors to return
 * @returns {Promise<object>} - Response data
 */
const getTopRatedDoctors = async (limit = 6) => {
  try {
    const response = await client.get('/doctors?sort=-averageRating&limit=' + limit, false);
    return response;
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch top rated doctors. Please try again.',
      data: null
    };
  }
};

/**
 * Delete a doctor account
 * @param {string} doctorId - Doctor ID
 * @returns {Promise<object>} - Response data
 */
const deleteDoctor = async (doctorId) => {
  try {
    const response = await client.delete(`/doctors/${doctorId}`);
    return {
      ...response,
      requiresApproval: true // This indicates that deletion requires approval
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to delete doctor account. Please try again.',
      data: null
    };
  }
};

// Export all functions as a service object
const doctorService = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  getTopRatedDoctors,
  deleteDoctor
};

export default doctorService;
