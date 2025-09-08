import api, { apiHelpers } from './api';
import { API_ENDPOINTS, TOAST_MESSAGES } from '../utils/constants';

export const authService = {
  // Login user
  login: async (credentials) => {
    try {
      const response = await api.post(API_ENDPOINTS.LOGIN, credentials);
      const { token, username, role } = response.data;
      
      if (token && username && role) {
        const userData = {
          name: username,
          email: credentials.email, // Store email from credentials
          role: role
        };
        
        // Save to localStorage
        apiHelpers.setAuthData(token, userData);
        
        return {
          success: true,
          data: { token, user: userData }
        };
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      return {
        success: false,
        error: apiHelpers.handleError(error, TOAST_MESSAGES.ERROR.LOGIN_FAILED)
      };
    }
  },

  // Register user
  register: async (userData) => {
    try {
      const response = await api.post(API_ENDPOINTS.REGISTER, userData);
      
      return {
        success: true,
        message: response.data || TOAST_MESSAGES.SUCCESS.REGISTER
      };
    } catch (error) {
      return {
        success: false,
        error: apiHelpers.handleError(error, TOAST_MESSAGES.ERROR.REGISTER_FAILED)
      };
    }
  },

  // Logout user
  logout: () => {
    apiHelpers.clearAuthData();
    return {
      success: true,
      message: TOAST_MESSAGES.SUCCESS.LOGOUT
    };
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return apiHelpers.isAuthenticated();
  },

  // Get current user
  getCurrentUser: () => {
    return apiHelpers.getCurrentUser();
  },

  // Check if user has specific role
  hasRole: (role) => {
    const user = apiHelpers.getCurrentUser();
    return user?.role === role;
  },

  // Check if user is admin
  isAdmin: () => {
    return authService.hasRole('ADMIN');
  },

  // Check if user is author
  isAuthor: () => {
    return authService.hasRole('AUTHOR');
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem('blog_token');
  },

  // Validate token (basic client-side check)
  validateToken: (token) => {
    if (!token) return false;
    
    try {
      // Basic JWT structure check
      const parts = token.split('.');
      if (parts.length !== 3) return false;
      
      // Decode payload (without verification - server will verify)
      const payload = JSON.parse(atob(parts[1]));
      
      // Check expiration
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        return false;
      }
      
      return true;
    } catch {
      return false;
    }
  },

  // Refresh user data (if needed)
  refreshUserData: () => {
    const token = authService.getToken();
    
    if (!token || !authService.validateToken(token)) {
      authService.logout();
      return null;
    }
    
    return apiHelpers.getCurrentUser();
  }
};