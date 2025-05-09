import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { appointmentService } from '../services/api';
import { toast } from 'react-toastify';

// Initial state
const initialState = {
  appointments: [],
  currentAppointment: null,
  isLoading: false,
  error: null,
};

// Create context
export const AppointmentContext = createContext(initialState);

// Appointment reducer
const appointmentReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_APPOINTMENTS_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case 'FETCH_APPOINTMENTS_SUCCESS':
      return {
        ...state,
        appointments: action.payload,
        isLoading: false,
        error: null,
      };
    
    case 'FETCH_APPOINTMENTS_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    
    case 'CREATE_APPOINTMENT_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case 'CREATE_APPOINTMENT_SUCCESS':
      return {
        ...state,
        appointments: [...state.appointments, action.payload],
        currentAppointment: action.payload,
        isLoading: false,
        error: null,
      };
    
    case 'CREATE_APPOINTMENT_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    
    case 'UPDATE_APPOINTMENT_STATUS_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case 'UPDATE_APPOINTMENT_STATUS_SUCCESS':
      return {
        ...state,
        appointments: state.appointments.map(appointment => 
          appointment._id === action.payload._id ? action.payload : appointment
        ),
        isLoading: false,
        error: null,
      };
    
    case 'UPDATE_APPOINTMENT_STATUS_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    
    case 'DELETE_APPOINTMENT_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case 'DELETE_APPOINTMENT_SUCCESS':
      return {
        ...state,
        appointments: state.appointments.filter(appointment => 
          appointment._id !== action.payload
        ),
        isLoading: false,
        error: null,
      };
    
    case 'DELETE_APPOINTMENT_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    
    case 'SET_CURRENT_APPOINTMENT':
      return {
        ...state,
        currentAppointment: action.payload,
      };
    
    case 'CLEAR_CURRENT_APPOINTMENT':
      return {
        ...state,
        currentAppointment: null,
      };
    
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    
    default:
      return state;
  }
};

// Appointment provider component
export const AppointmentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appointmentReducer, initialState);
  
  // Fetch patient appointments
  const fetchPatientAppointments = useCallback(async () => {
    try {
      dispatch({ type: 'FETCH_APPOINTMENTS_START' });
      
      const response = await appointmentService.getPatientAppointments();
      
      if (response.success) {
        dispatch({
          type: 'FETCH_APPOINTMENTS_SUCCESS',
          payload: response.data,
        });
      } else {
        dispatch({
          type: 'FETCH_APPOINTMENTS_FAILURE',
          payload: response.message || 'Failed to fetch appointments',
        });
        
        toast.error(response.message || 'Failed to fetch appointments');
      }
    } catch (error) {
      dispatch({
        type: 'FETCH_APPOINTMENTS_FAILURE',
        payload: error.message || 'Failed to fetch appointments',
      });
      
      toast.error(error.message || 'Failed to fetch appointments');
    }
  }, []);
  
  // Fetch doctor appointments
  const fetchDoctorAppointments = useCallback(async (doctorId) => {
    try {
      dispatch({ type: 'FETCH_APPOINTMENTS_START' });
      
      const response = await appointmentService.getDoctorAppointments(doctorId);
      
      if (response.success) {
        dispatch({
          type: 'FETCH_APPOINTMENTS_SUCCESS',
          payload: response.data,
        });
      } else {
        dispatch({
          type: 'FETCH_APPOINTMENTS_FAILURE',
          payload: response.message || 'Failed to fetch appointments',
        });
        
        toast.error(response.message || 'Failed to fetch appointments');
      }
    } catch (error) {
      dispatch({
        type: 'FETCH_APPOINTMENTS_FAILURE',
        payload: error.message || 'Failed to fetch appointments',
      });
      
      toast.error(error.message || 'Failed to fetch appointments');
    }
  }, []);
  
  // Create appointment
  const createAppointment = useCallback(async (appointmentData) => {
    try {
      dispatch({ type: 'CREATE_APPOINTMENT_START' });
      
      const response = await appointmentService.createAppointment(appointmentData);
      
      if (response.success) {
        dispatch({
          type: 'CREATE_APPOINTMENT_SUCCESS',
          payload: response.data,
        });
        
        toast.success(response.message || 'Appointment created successfully');
        return { success: true, data: response.data };
      } else {
        dispatch({
          type: 'CREATE_APPOINTMENT_FAILURE',
          payload: response.message || 'Failed to create appointment',
        });
        
        toast.error(response.message || 'Failed to create appointment');
        return { success: false, message: response.message };
      }
    } catch (error) {
      dispatch({
        type: 'CREATE_APPOINTMENT_FAILURE',
        payload: error.message || 'Failed to create appointment',
      });
      
      toast.error(error.message || 'Failed to create appointment');
      return { success: false, message: error.message };
    }
  }, []);
  
  // Update appointment status
  const updateAppointmentStatus = useCallback(async (appointmentId, statusData) => {
    try {
      dispatch({ type: 'UPDATE_APPOINTMENT_STATUS_START' });
      
      const response = await appointmentService.updateAppointmentStatus(appointmentId, statusData);
      
      if (response.success) {
        dispatch({
          type: 'UPDATE_APPOINTMENT_STATUS_SUCCESS',
          payload: response.data,
        });
        
        toast.success(response.message || 'Appointment status updated successfully');
        return { success: true, data: response.data };
      } else {
        dispatch({
          type: 'UPDATE_APPOINTMENT_STATUS_FAILURE',
          payload: response.message || 'Failed to update appointment status',
        });
        
        toast.error(response.message || 'Failed to update appointment status');
        return { success: false, message: response.message };
      }
    } catch (error) {
      dispatch({
        type: 'UPDATE_APPOINTMENT_STATUS_FAILURE',
        payload: error.message || 'Failed to update appointment status',
      });
      
      toast.error(error.message || 'Failed to update appointment status');
      return { success: false, message: error.message };
    }
  }, []);
  
  // Delete appointment
  const deleteAppointment = useCallback(async (appointmentId) => {
    try {
      dispatch({ type: 'DELETE_APPOINTMENT_START' });
      
      const response = await appointmentService.deleteAppointment(appointmentId);
      
      if (response.success) {
        dispatch({
          type: 'DELETE_APPOINTMENT_SUCCESS',
          payload: appointmentId,
        });
        
        toast.success(response.message || 'Appointment deleted successfully');
        return { success: true };
      } else {
        dispatch({
          type: 'DELETE_APPOINTMENT_FAILURE',
          payload: response.message || 'Failed to delete appointment',
        });
        
        toast.error(response.message || 'Failed to delete appointment');
        return { success: false, message: response.message };
      }
    } catch (error) {
      dispatch({
        type: 'DELETE_APPOINTMENT_FAILURE',
        payload: error.message || 'Failed to delete appointment',
      });
      
      toast.error(error.message || 'Failed to delete appointment');
      return { success: false, message: error.message };
    }
  }, []);
  
  // Set current appointment
  const setCurrentAppointment = useCallback((appointment) => {
    dispatch({
      type: 'SET_CURRENT_APPOINTMENT',
      payload: appointment,
    });
  }, []);
  
  // Clear current appointment
  const clearCurrentAppointment = useCallback(() => {
    dispatch({ type: 'CLEAR_CURRENT_APPOINTMENT' });
  }, []);
  
  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);
  
  return (
    <AppointmentContext.Provider
      value={{
        ...state,
        fetchPatientAppointments,
        fetchDoctorAppointments,
        createAppointment,
        updateAppointmentStatus,
        deleteAppointment,
        setCurrentAppointment,
        clearCurrentAppointment,
        clearError,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

// Custom hook to use appointment context
export const useAppointment = () => {
  const context = useContext(AppointmentContext);
  
  if (!context) {
    throw new Error('useAppointment must be used within an AppointmentProvider');
  }
  
  return context;
};
