import HttpClient from './httpClient';

// API base URL
const BASE_URL = 'http://localhost:8000/api/v1';

// Create HTTP client instance
const client = new HttpClient(BASE_URL);

/**
 * Appointment service
 * This service handles appointment-related API requests using functional approach
 */

/**
 * Create an appointment
 * @param {object} appointmentData - Appointment data
 * @returns {Promise<object>} - Response data
 */
const createAppointment = async (appointmentData) => {
  try {
    return await client.post('/appointments', appointmentData);
  } catch (error) {
    return {
      success: false,
      message: 'Failed to create appointment. Please try again.',
      data: null
    };
  }
};

/**
 * Get all appointments for a patient
 * @returns {Promise<object>} - Response data
 */
const getPatientAppointments = async () => {
  try {
    return await client.get('/appointments/patient');
  } catch (error) {
    return {
      success: false,
      message: 'Failed to fetch appointments. Please try again.',
      data: null
    };
  }
};

/**
 * Get all appointments for a doctor
 * @param {string} doctorId - Doctor ID
 * @returns {Promise<object>} - Response data
 */
const getDoctorAppointments = async (doctorId) => {
  try {
    return await client.get(`/appointments/doctor/${doctorId}`);
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
 * @param {object} statusData - Status data
 * @returns {Promise<object>} - Response data
 */
const updateAppointmentStatus = async (appointmentId, statusData) => {
  try {
    return await client.put(`/appointments/${appointmentId}/status`, statusData);
  } catch (error) {
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
    return await client.delete(`/appointments/${appointmentId}`);
  } catch (error) {
    return {
      success: false,
      message: 'Failed to delete appointment. Please try again.',
      data: null
    };
  }
};

// Export all functions as a service object
const appointmentService = {
  createAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
  deleteAppointment
};

export default appointmentService;
