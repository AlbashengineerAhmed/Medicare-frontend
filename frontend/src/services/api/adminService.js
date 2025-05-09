import HttpClient from './httpClient';
import { API_BASE_URL } from '../../config/api';

// Create HTTP client instance
const client = new HttpClient(API_BASE_URL);

/**
 * Admin service
 * This service handles admin-related API requests using functional approach
 */

/**
 * Get dashboard statistics
 * @returns {Promise<object>} - Response data
 */
const getDashboardStats = async () => {
  try {
    return await client.get('/admin/dashboard');
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch dashboard statistics. Please try again.',
      data: null
    };
  }
};

/**
 * Get all doctors (including pending)
 * @returns {Promise<object>} - Response data
 */
const getAllDoctors = async () => {
  try {
    return await client.get('/admin/doctors');
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch doctors. Please try again.',
      data: null
    };
  }
};

/**
 * Update doctor approval status
 * @param {string} doctorId - Doctor ID
 * @param {object} statusData - Status data
 * @returns {Promise<object>} - Response data
 */
const updateDoctorStatus = async (doctorId, statusData) => {
  try {
    return await client.put(`/admin/doctors/${doctorId}/status`, statusData);
  } catch (error) {
    return {
      success: false,
      message: 'Failed to update doctor status. Please try again.',
      data: null
    };
  }
};

/**
 * Get all users
 * @returns {Promise<object>} - Response data
 */
const getAllUsers = async () => {
  try {
    return await client.get('/admin/users');
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch users. Please try again.',
      data: null
    };
  }
};

/**
 * Delete a user
 * @param {string} userId - User ID
 * @returns {Promise<object>} - Response data
 */
const deleteUser = async (userId) => {
  try {
    return await client.delete(`/admin/users/${userId}`);
  } catch (error) {
    return {
      success: false,
      message: 'Failed to delete user. Please try again.',
      data: null
    };
  }
};

/**
 * Delete a doctor
 * @param {string} doctorId - Doctor ID
 * @returns {Promise<object>} - Response data
 */
const deleteDoctor = async (doctorId) => {
  try {
    return await client.delete(`/admin/doctors/${doctorId}`);
  } catch (error) {
    return {
      success: false,
      message: 'Failed to delete doctor. Please try again.',
      data: null
    };
  }
};

/**
 * Get all appointments
 * @returns {Promise<object>} - Response data
 */
const getAllAppointments = async () => {
  try {
    return await client.get('/admin/appointments');
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch appointments. Please try again.',
      data: null
    };
  }
};

/**
 * Update appointment status
 * @param {string} appointmentId - Appointment ID
 * @param {string} status - New status (confirmed, cancelled, completed)
 * @returns {Promise<object>} - Response data
 */
const updateAppointmentStatus = async (appointmentId, status) => {
  try {
    // Make sure we're sending the status as an object with a status property
    return await client.put(`/admin/appointments/${appointmentId}/status`, { status });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    return {
      success: false,
      message: 'Failed to update appointment status. Please try again.',
      data: null
    };
  }
};

/**
 * Delete an appointment
 * @param {string} appointmentId - Appointment ID
 * @returns {Promise<object>} - Response data
 */
const deleteAppointment = async (appointmentId) => {
  try {
    return await client.delete(`/admin/appointments/${appointmentId}`);
  } catch (error) {
    return {
      success: false,
      message: 'Failed to delete appointment. Please try again.',
      data: null
    };
  }
};

// Export all functions as a service object
const adminService = {
  getDashboardStats,
  getAllDoctors,
  updateDoctorStatus,
  deleteDoctor,
  getAllUsers,
  deleteUser,
  getAllAppointments,
  updateAppointmentStatus,
  deleteAppointment
};

export default adminService;
