import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import LoadingSpinner from '../ui/LoadingSpinner';
import { ROUTES } from '../../utils/constants';

const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  requiredRole = null, 
  redirectTo = ROUTES.LOGIN 
}) => {
  const { isAuthenticated, user, isLoading } = useAuthStore();
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If user is authenticated but this route is for guests only (like login/register)
  if (!requireAuth && isAuthenticated) {
    const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
    return <Navigate to={from} replace />;
  }

  // If specific role is required
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;