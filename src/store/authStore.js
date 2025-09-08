import { create } from 'zustand';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

export const useAuthStore = create((set, get) => ({
  // State
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  // Initialize auth state from localStorage
  initializeAuth: () => {
    try {
      const token = authService.getToken();
      const user = authService.getCurrentUser();
      
      if (token && user && authService.validateToken(token)) {
        set({
          user,
          token,
          isAuthenticated: true,
          error: null
        });
      } else {
        // Clear invalid data
        authService.logout();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null
        });
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: 'Failed to initialize authentication'
      });
    }
  },

  // Login action
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await authService.login(credentials);
      
      if (result.success) {
        const { token, user } = result.data;
        
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        toast.success('Successfully logged in!');
        return { success: true };
      } else {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: result.error
        });
        
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Login failed. Please try again.';
      
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: errorMessage
      });
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Register action
  register: async (userData) => {
    set({ isLoading: true, error: null });
    
    try {
      const result = await authService.register(userData);
      
      if (result.success) {
        set({
          isLoading: false,
          error: null
        });
        
        toast.success(result.message);
        return { success: true };
      } else {
        set({
          isLoading: false,
          error: result.error
        });
        
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Registration failed. Please try again.';
      
      set({
        isLoading: false,
        error: errorMessage
      });
      
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Logout action
  logout: () => {
    authService.logout();
    
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
    
    toast.success('Logged out successfully!');
  },

  // Clear error
  clearError: () => {
    set({ error: null });
  },

  // Update user profile
  updateUser: (userData) => {
    const currentUser = get().user;
    if (currentUser) {
      const updatedUser = { ...currentUser, ...userData };
      
      // Update localStorage
      authService.setAuthData(get().token, updatedUser);
      
      set({ user: updatedUser });
    }
  },

  // Check if user has specific role
  hasRole: (role) => {
    const { user } = get();
    return user?.role === role;
  },

  // Check if user is admin
  isAdmin: () => {
    return get().hasRole('ADMIN');
  },

  // Check if user is author
  isAuthor: () => {
    return get().hasRole('AUTHOR');
  },

  // Check if current user can edit/delete a post
  canModifyPost: (post) => {
    const { user, isAdmin } = get();
    
    if (!user || !post) return false;
    
    // Admin can modify any post
    if (isAdmin()) return true;
    
    // Author can modify their own posts
    return post.authorId === user.email;
  },

  // Refresh auth state
  refreshAuth: () => {
    const refreshedUser = authService.refreshUserData();
    
    if (refreshedUser) {
      set({
        user: refreshedUser,
        isAuthenticated: true,
        error: null
      });
    } else {
      // Clear invalid auth
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        error: 'Session expired'
      });
    }
  }
}));