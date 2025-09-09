import { useContext } from 'react';
import { useAuthStore } from '../store/useAuthStore';

/**
 * Custom hook for authentication
 * Provides easy access to auth state and methods
 */
export const useAuth = () => {
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    isAdmin,
    canModifyPost
  } = useAuthStore();

  return {
    // State
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    clearError,
    
    // Computed
    isAdmin: isAdmin(),
    canModifyPost,
    
    // Utilities
    hasRole: (role) => user?.role === role,
    hasAnyRole: (roles) => roles.includes(user?.role),
    getUserInitials: () => {
      if (!user?.name) return '?';
      return user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
  };
};