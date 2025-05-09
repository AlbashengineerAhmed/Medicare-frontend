import React, { createContext, useContext, useEffect, useReducer } from 'react';

// Initial state
const initialState = {
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  role: localStorage.getItem('role') || null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,
};

// Create context
export const AuthContext = createContext(initialState);

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        role: action.payload.role,
        token: action.payload.token,
        isLoading: false,
        error: null,
      };
    
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        role: null,
        token: null,
        isLoading: false,
        error: action.payload,
      };
    
    case 'REGISTER_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        role: null,
        token: null,
        isLoading: false,
        error: null,
      };
    
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
        isLoading: false,
        error: null,
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

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  // Save user data to localStorage when state changes
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('user');
    }
    
    if (state.token) {
      localStorage.setItem('token', state.token);
    } else {
      localStorage.removeItem('token');
    }
    
    if (state.role) {
      localStorage.setItem('role', state.role);
    } else {
      localStorage.removeItem('role');
    }
  }, [state.user, state.token, state.role]);
  
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
