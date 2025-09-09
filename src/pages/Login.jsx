import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, BookOpen, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ROUTES, APP_NAME } from '../utils/constants';
import { authValidationSchemas } from '../utils/validators';
import { validateFormData } from '../utils/validators';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { login, isLoading, error, clearError } = useAuthStore();

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  // Clear errors when component mounts or when user starts typing
  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    if (Object.keys(formErrors).length > 0) {
      validateForm();
    }
  }, [formData]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear global error when user modifies form
    if (error) {
      clearError();
    }
  };

  // Validate form
  const validateForm = async () => {
    const validation = await validateFormData(authValidationSchemas.login, formData);
    setFormErrors(validation.errors);
    return validation.isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAttemptedSubmit(true);

    // Validate form
    const isValid = await validateForm();
    if (!isValid) {
      return;
    }

    // Attempt login
    const result = await login(formData);
    
    if (result.success) {
      // Redirect to intended page or dashboard
      const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
      navigate(from, { replace: true });
    }
  };

  // Handle demo login (for testing purposes)
  const handleDemoLogin = async (userType) => {
    const demoCredentials = {
      author: {
        email: 'author@example.com',
        password: 'password123'
      },
      admin: {
        email: 'admin@example.com',
        password: 'password123'
      }
    };

    const credentials = demoCredentials[userType];
    if (credentials) {
      setFormData(credentials);
      const result = await login(credentials);
      
      if (result.success) {
        const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
        navigate(from, { replace: true });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link 
            to={ROUTES.HOME}
            className="inline-flex items-center space-x-2 text-2xl font-bold text-primary-600 hover:text-primary-700 transition-colors mb-4"
          >
            <BookOpen className="w-8 h-8" />
            <span>{APP_NAME}</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account to continue writing and reading amazing stories.</p>
        </div>

        {/* Login Form */}
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Sign In</h2>
            <p className="text-sm text-gray-600 mt-1">
              Enter your credentials to access your account
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Global Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Login Failed</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Email Field */}
              <div>
                <Input
                  type="email"
                  name="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={formErrors.email}
                  disabled={isLoading}
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>

              {/* Password Field */}
              <div>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={formErrors.password}
                    disabled={isLoading}
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-700 hover:underline transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? (
                  'Signing In...'
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="my-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>
            </div>

            {/* Demo Login Buttons */}
            <div className="space-y-3">
              <p className="text-xs text-center text-gray-500 mb-3">
                Demo accounts for testing (remove in production)
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin('author')}
                  disabled={isLoading}
                  className="text-xs"
                >
                  Demo Author
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleDemoLogin('admin')}
                  disabled={isLoading}
                  className="text-xs"
                >
                  Demo Admin
                </Button>
              </div>
            </div>

            {/* Sign Up Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  to={ROUTES.REGISTER}
                  className="text-primary-600 hover:text-primary-700 font-medium hover:underline transition-colors"
                >
                  Sign up for free
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-primary-600 hover:underline">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-primary-600 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;