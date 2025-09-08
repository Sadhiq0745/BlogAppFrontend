import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL, STORAGE_KEYS, HTTP_STATUS, TOAST_MESSAGES } from '../utils/constants';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Don't set Content-Type for FormData (multipart uploads)
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    // Handle network errors
    if (!response) {
      toast.error(TOAST_MESSAGES.ERROR.NETWORK_ERROR);
      return Promise.reject(error);
    }
    
    const { status, data } = response;
    
    switch (status) {
      case HTTP_STATUS.UNAUTHORIZED:
        // Clear token and redirect to login
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        
        // Only show toast if not on login page
        if (!window.location.pathname.includes('/login')) {
          toast.error(TOAST_MESSAGES.ERROR.UNAUTHORIZED);
          window.location.href = '/login';
        }
        break;
        
      case HTTP_STATUS.FORBIDDEN:
        toast.error(TOAST_MESSAGES.ERROR.UNAUTHORIZED);
        break;
        
      case HTTP_STATUS.NOT_FOUND:
        toast.error('Resource not found');
        break;
        
      case HTTP_STATUS.BAD_REQUEST:
        const message = data?.message || data?.error || 'Bad request';
        toast.error(message);
        break;
        
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        toast.error(TOAST_MESSAGES.ERROR.SOMETHING_WENT_WRONG);
        break;
        
      default:
        const errorMessage = data?.message || data?.error || TOAST_MESSAGES.ERROR.SOMETHING_WENT_WRONG;
        toast.error(errorMessage);
    }
    
    return Promise.reject(error);
  }
);

// API helper functions
export const apiHelpers = {
  // Handle API errors
  handleError: (error, defaultMessage = TOAST_MESSAGES.ERROR.SOMETHING_WENT_WRONG) => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    
    if (error.message) {
      return error.message;
    }
    
    return defaultMessage;
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    return !!token;
  },
  
  // Get current user from storage
  getCurrentUser: () => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    try {
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },
  
  // Set auth data
  setAuthData: (token, user) => {
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },
  
  // Clear auth data
  clearAuthData: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  }
};

export default api;