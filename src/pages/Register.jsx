import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Lock, BookOpen, ArrowRight, AlertCircle, CheckCircle, Shield, Users } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardContent, CardHeader } from '../components/ui/Card';
import { ROUTES, APP_NAME, USER_ROLES } from '../utils/constants';
import { authValidationSchemas } from '../utils/validators';
import { validateFormData } from '../utils/validators';

const Register = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, clearError } = useAuthStore();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'AUTHOR'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
  });

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Validate form when data changes (if user has attempted submit)
  useEffect(() => {
    if (attemptedSubmit && Object.keys(formErrors).length > 0) {
      validateForm();
    }
  }, [formData, attemptedSubmit]);

  // Check password strength
  useEffect(() => {
    const password = formData.password;
    setPasswordStrength({
      minLength: password.length >= 6,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, [formData.password]);

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
    const validation = await validateFormData(authValidationSchemas.register, formData);
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

    // Attempt registration
    const result = await register(formData);
    
    if (result.success) {
      setRegistrationSuccess(true);
      // Redirect to login page after a delay
      setTimeout(() => {
        navigate(ROUTES.LOGIN, { 
          state: { 
            message: 'Registration successful! Please sign in with your credentials.' 
          }
        });
      }, 2000);
    }
  };

  // Get password strength score
  const getPasswordScore = () => {
    return Object.values(passwordStrength).filter(Boolean).length;
  };

  const getPasswordStrengthLabel = (score) => {
    if (score < 2) return { label: 'Weak', color: 'text-red-600', bgColor: 'bg-red-500' };
    if (score < 4) return { label: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-500' };
    if (score < 5) return { label: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-500' };
    return { label: 'Strong', color: 'text-green-600', bgColor: 'bg-green-500' };
  };

  // Registration success view
  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-xl text-center">
            <CardContent className="py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to {APP_NAME}!</h1>
              <p className="text-gray-600 mb-6">
                Your account has been created successfully. You will be redirected to the login page shortly.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="ml-2">Redirecting...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const passwordScore = getPasswordScore();
  const strengthInfo = getPasswordStrengthLabel(passwordScore);

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Our Community</h1>
          <p className="text-gray-600">Create your account and start sharing your stories with the world.</p>
        </div>

        {/* Registration Form */}
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Create Account</h2>
            <p className="text-sm text-gray-600 mt-1">
              Fill in your details to get started
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Global Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Registration Failed</h3>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Name Field */}
              <div>
                <Input
                  type="text"
                  name="name"
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleInputChange}
                  error={formErrors.name}
                  disabled={isLoading}
                  required
                  autoComplete="name"
                  autoFocus
                />
              </div>

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
                />
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 gap-3">
                  <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.role === USER_ROLES.AUTHOR 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="role"
                      value={USER_ROLES.AUTHOR}
                      checked={formData.role === USER_ROLES.AUTHOR}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-primary-600" />
                      <div>
                        <div className="font-medium text-gray-900">Author</div>
                        <div className="text-sm text-gray-500">Write and publish blog posts</div>
                      </div>
                    </div>
                    {formData.role === USER_ROLES.AUTHOR && (
                      <CheckCircle className="w-5 h-5 text-primary-600 ml-auto" />
                    )}
                  </label>

                  <label className={`relative flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.role === USER_ROLES.ADMIN 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}>
                    <input
                      type="radio"
                      name="role"
                      value={USER_ROLES.ADMIN}
                      checked={formData.role === USER_ROLES.ADMIN}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <Shield className="w-5 h-5 text-primary-600" />
                      <div>
                        <div className="font-medium text-gray-900">Admin</div>
                        <div className="text-sm text-gray-500">Manage posts and users</div>
                      </div>
                    </div>
                    {formData.role === USER_ROLES.ADMIN && (
                      <CheckCircle className="w-5 h-5 text-primary-600 ml-auto" />
                    )}
                  </label>
                </div>
                {formErrors.role && (
                  <p className="text-sm text-red-600 mt-1">{formErrors.role}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    label="Password"
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleInputChange}
                    error={formErrors.password}
                    disabled={isLoading}
                    required
                    autoComplete="new-password"
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

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Password strength:</span>
                      <span className={`text-sm font-medium ${strengthInfo.color}`}>
                        {strengthInfo.label}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${strengthInfo.bgColor}`}
                        style={{ width: `${(passwordScore / 5) * 100}%` }}
                      />
                    </div>
                    <ul className="mt-2 space-y-1 text-xs">
                      {[
                        { key: 'minLength', label: 'At least 6 characters' },
                        { key: 'hasUppercase', label: 'One uppercase letter' },
                        { key: 'hasLowercase', label: 'One lowercase letter' },
                        { key: 'hasNumber', label: 'One number' }
                      ].map(({ key, label }) => (
                        <li key={key} className={`flex items-center space-x-2 ${
                          passwordStrength[key] ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          <CheckCircle className="w-3 h-3" />
                          <span>{label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    label="Confirm Password"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    error={formErrors.confirmPassword}
                    disabled={isLoading}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="text-xs text-gray-600">
                By creating an account, you agree to our{' '}
                <Link to="/terms" className="text-primary-600 hover:underline">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary-600 hover:underline">
                  Privacy Policy
                </Link>
                .
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
                  'Creating Account...'
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link
                  to={ROUTES.LOGIN}
                  className="text-primary-600 hover:text-primary-700 font-medium hover:underline transition-colors"
                >
                  Sign in instead
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

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

export default Register;