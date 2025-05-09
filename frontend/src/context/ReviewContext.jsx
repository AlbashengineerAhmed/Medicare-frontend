import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { reviewService } from '../services/api';
import { toast } from 'react-toastify';

// Initial state
const initialState = {
  reviews: [],
  currentReview: null,
  isLoading: false,
  error: null,
};

// Create context
export const ReviewContext = createContext(initialState);

// Review reducer
const reviewReducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REVIEWS_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case 'FETCH_REVIEWS_SUCCESS':
      return {
        ...state,
        reviews: action.payload,
        isLoading: false,
        error: null,
      };
    
    case 'FETCH_REVIEWS_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    
    case 'CREATE_REVIEW_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case 'CREATE_REVIEW_SUCCESS':
      return {
        ...state,
        reviews: [...state.reviews, action.payload],
        currentReview: action.payload,
        isLoading: false,
        error: null,
      };
    
    case 'CREATE_REVIEW_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    
    case 'UPDATE_REVIEW_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case 'UPDATE_REVIEW_SUCCESS':
      return {
        ...state,
        reviews: state.reviews.map(review => 
          review._id === action.payload._id ? action.payload : review
        ),
        currentReview: action.payload,
        isLoading: false,
        error: null,
      };
    
    case 'UPDATE_REVIEW_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    
    case 'DELETE_REVIEW_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case 'DELETE_REVIEW_SUCCESS':
      return {
        ...state,
        reviews: state.reviews.filter(review => 
          review._id !== action.payload
        ),
        currentReview: null,
        isLoading: false,
        error: null,
      };
    
    case 'DELETE_REVIEW_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    
    case 'SET_CURRENT_REVIEW':
      return {
        ...state,
        currentReview: action.payload,
      };
    
    case 'CLEAR_CURRENT_REVIEW':
      return {
        ...state,
        currentReview: null,
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

// Review provider component
export const ReviewProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reviewReducer, initialState);
  
  // Fetch doctor reviews
  const fetchDoctorReviews = useCallback(async (doctorId) => {
    try {
      dispatch({ type: 'FETCH_REVIEWS_START' });
      
      const response = await reviewService.getDoctorReviews(doctorId);
      
      if (response.success) {
        dispatch({
          type: 'FETCH_REVIEWS_SUCCESS',
          payload: response.data,
        });
      } else {
        dispatch({
          type: 'FETCH_REVIEWS_FAILURE',
          payload: response.message || 'Failed to fetch reviews',
        });
        
        toast.error(response.message || 'Failed to fetch reviews');
      }
    } catch (error) {
      dispatch({
        type: 'FETCH_REVIEWS_FAILURE',
        payload: error.message || 'Failed to fetch reviews',
      });
      
      toast.error(error.message || 'Failed to fetch reviews');
    }
  }, []);
  
  // Create review
  const createReview = useCallback(async (reviewData) => {
    try {
      dispatch({ type: 'CREATE_REVIEW_START' });
      
      const response = await reviewService.createReview(reviewData);
      
      if (response.success) {
        dispatch({
          type: 'CREATE_REVIEW_SUCCESS',
          payload: response.data,
        });
        
        toast.success(response.message || 'Review created successfully');
        return { success: true, data: response.data };
      } else {
        dispatch({
          type: 'CREATE_REVIEW_FAILURE',
          payload: response.message || 'Failed to create review',
        });
        
        toast.error(response.message || 'Failed to create review');
        return { success: false, message: response.message };
      }
    } catch (error) {
      dispatch({
        type: 'CREATE_REVIEW_FAILURE',
        payload: error.message || 'Failed to create review',
      });
      
      toast.error(error.message || 'Failed to create review');
      return { success: false, message: error.message };
    }
  }, []);
  
  // Update review
  const updateReview = useCallback(async (reviewId, reviewData) => {
    try {
      dispatch({ type: 'UPDATE_REVIEW_START' });
      
      const response = await reviewService.updateReview(reviewId, reviewData);
      
      if (response.success) {
        dispatch({
          type: 'UPDATE_REVIEW_SUCCESS',
          payload: response.data,
        });
        
        toast.success(response.message || 'Review updated successfully');
        return { success: true, data: response.data };
      } else {
        dispatch({
          type: 'UPDATE_REVIEW_FAILURE',
          payload: response.message || 'Failed to update review',
        });
        
        toast.error(response.message || 'Failed to update review');
        return { success: false, message: response.message };
      }
    } catch (error) {
      dispatch({
        type: 'UPDATE_REVIEW_FAILURE',
        payload: error.message || 'Failed to update review',
      });
      
      toast.error(error.message || 'Failed to update review');
      return { success: false, message: error.message };
    }
  }, []);
  
  // Delete review
  const deleteReview = useCallback(async (reviewId) => {
    try {
      dispatch({ type: 'DELETE_REVIEW_START' });
      
      const response = await reviewService.deleteReview(reviewId);
      
      if (response.success) {
        dispatch({
          type: 'DELETE_REVIEW_SUCCESS',
          payload: reviewId,
        });
        
        toast.success(response.message || 'Review deleted successfully');
        return { success: true };
      } else {
        dispatch({
          type: 'DELETE_REVIEW_FAILURE',
          payload: response.message || 'Failed to delete review',
        });
        
        toast.error(response.message || 'Failed to delete review');
        return { success: false, message: response.message };
      }
    } catch (error) {
      dispatch({
        type: 'DELETE_REVIEW_FAILURE',
        payload: error.message || 'Failed to delete review',
      });
      
      toast.error(error.message || 'Failed to delete review');
      return { success: false, message: error.message };
    }
  }, []);
  
  // Set current review
  const setCurrentReview = useCallback((review) => {
    dispatch({
      type: 'SET_CURRENT_REVIEW',
      payload: review,
    });
  }, []);
  
  // Clear current review
  const clearCurrentReview = useCallback(() => {
    dispatch({ type: 'CLEAR_CURRENT_REVIEW' });
  }, []);
  
  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'CLEAR_ERROR' });
  }, []);
  
  return (
    <ReviewContext.Provider
      value={{
        ...state,
        fetchDoctorReviews,
        createReview,
        updateReview,
        deleteReview,
        setCurrentReview,
        clearCurrentReview,
        clearError,
      }}
    >
      {children}
    </ReviewContext.Provider>
  );
};

// Custom hook to use review context
export const useReview = () => {
  const context = useContext(ReviewContext);
  
  if (!context) {
    throw new Error('useReview must be used within a ReviewProvider');
  }
  
  return context;
};
