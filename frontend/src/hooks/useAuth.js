import { useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../services/api';
import { toast } from 'react-toastify';

/**
 * Custom hook for authentication
 * @returns {Object} - Authentication state and methods
 */
const useAuth = () => {
  const { user, role, token, isLoading, error, dispatch } = useContext(AuthContext);

  /**
   * Login a user
   * @param {Object} credentials - User login credentials
   * @returns {Promise<Object>} - Login result
   */
  const login = useCallback(async (credentials) => {
    try {
      dispatch({ type: 'LOGIN_START' });
      
      const result = await authService.login(credentials);
      
      if (result.success || result.status) {
        dispatch({
          type: 'LOGIN_SUCCESS',
          payload: {
            user: result.data,
            role: result.role,
            token: result.token
          }
        });
        
        toast.success(result.message || 'Login successful');
        return { success: true };
      } else {
        dispatch({
          type: 'LOGIN_FAILURE',
          payload: result.message || 'Login failed'
        });
        
        toast.error(result.message || 'Login failed');
        return { success: false, message: result.message };
      }
    } catch (error) {
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: error.message || 'Login failed'
      });
      
      toast.error(error.message || 'Login failed');
      return { success: false, message: error.message };
    }
  }, [dispatch]);

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} - Registration result
   */
  const register = useCallback(async (userData) => {
    try {
      dispatch({ type: 'REGISTER_START' });
      
      const result = await authService.register(userData);
      
      if (result.success) {
        dispatch({ type: 'REGISTER_SUCCESS' });
        
        toast.success(result.message || 'Registration successful');
        return { success: true };
      } else {
        dispatch({
          type: 'REGISTER_FAILURE',
          payload: result.message || 'Registration failed'
        });
        
        toast.error(result.message || 'Registration failed');
        return { success: false, message: result.message };
      }
    } catch (error) {
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: error.message || 'Registration failed'
      });
      
      toast.error(error.message || 'Registration failed');
      return { success: false, message: error.message };
    }
  }, [dispatch]);

  /**
   * Logout a user
   */
  const logout = useCallback(() => {
    authService.logout();
    dispatch({ type: 'LOGOUT' });
    toast.success('Logout successful');
  }, [dispatch]);

  /**
   * Update user data
   * @param {Object} userData - Updated user data
   */
  const updateUser = useCallback((userData) => {
    dispatch({
      type: 'UPDATE_USER',
      payload: userData
    });
  }, [dispatch]);

  /**
   * Clear authentication error
   */
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, [dispatch]);

  return {
    user,
    role,
    token,
    isLoading,
    error,
    login,
    register,
    logout,
    updateUser,
    clearError,
    isAuthenticated: !!token
  };
};

export default useAuth;
