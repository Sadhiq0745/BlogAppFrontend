import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Lock, 
  Save, 
  ArrowLeft, 
  Eye, 
  EyeOff,
  Shield,
  Users,
  CheckCircle,
  AlertCircle,
  Camera,
  Edit3
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ROUTES, USER_ROLES } from '../utils/constants';
import { authValidationSchemas } from '../utils/validators';
import { validateFormData } from '../utils/validators';
import { formatDate } from '../utils/formatters';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, changePassword, isLoading, error, clearError } = useAuthStore();

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    role: ''
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [formErrors, setFormErrors] = useState({});
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'security'
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [originalData, setOriginalData] = useState({});

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecial: false
  });

  // Initialize profile data
  useEffect(() => {
    if (user) {
      const userData = {
        name: user.name || '',
        email: user.email || '',
        role: user.role || ''
      };
      setProfileData(userData);
      setOriginalData(userData);
    }
  }, [user]);

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges = 
      profileData.name !== originalData.name || 
      profileData.email !== originalData.email;
    setHasUnsavedChanges(hasChanges);
  }, [profileData, originalData]);

  // Check password strength
  useEffect(() => {
    const password = passwordData.newPassword;
    setPasswordStrength({
      minLength: password.length >= 6,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    });
  }, [passwordData.newPassword]);

  // Clear errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Handle profile input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific field error
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear global error
    if (error) {
      clearError();
    }
  };

  // Handle password input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific field error
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear global error
    if (error) {
      clearError();
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Validate profile form
  const validateProfileForm = async () => {
    const validation = await validateFormData(authValidationSchemas.updateProfile, profileData);
    setFormErrors(validation.errors);
    return validation.isValid;
  };

  // Validate password form
  const validatePasswordForm = async () => {
    const validation = await validateFormData(authValidationSchemas.changePassword, passwordData);
    setFormErrors(validation.errors);
    return validation.isValid;
  };

  // Handle profile update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    const isValid = await validateProfileForm();
    if (!isValid) {
      return;
    }

    const result = await updateProfile(profileData);
    if (result.success) {
      setOriginalData({ ...profileData });
      setHasUnsavedChanges(false);
      setUpdateSuccess('Profile updated successfully!');
      setTimeout(() => setUpdateSuccess(''), 3000);
    }
  };

  // Handle password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const isValid = await validatePasswordForm();
    if (!isValid) {
      return;
    }

    const result = await changePassword(passwordData);
    if (result.success) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setUpdateSuccess('Password changed successfully!');
      setTimeout(() => setUpdateSuccess(''), 3000);
    }
  };

  // Handle back navigation with unsaved changes warning
  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  // Get password strength info
  const getPasswordStrengthInfo = () => {
    const score = Object.values(passwordStrength).filter(Boolean).length;
    if (score < 2) return { label: 'Weak', color: 'text-red-600', bgColor: 'bg-red-500' };
    if (score < 4) return { label: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-500' };
    if (score < 5) return { label: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-500' };
    return { label: 'Strong', color: 'text-green-600', bgColor: 'bg-green-500' };
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="page-container py-8">
          <LoadingSpinner size="lg" text="Loading profile..." fullScreen />
        </div>
      </div>
    );
  }

  const strengthInfo = getPasswordStrengthInfo();
  const strengthScore = Object.values(passwordStrength).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600">Manage your account settings and preferences</p>
            </div>

            {/* Unsaved changes indicator */}
            {hasUnsavedChanges && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-full">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                <span className="text-sm text-yellow-800 font-medium">Unsaved changes</span>
              </div>
            )}
          </div>
        </div>

        {/* Success Message */}
        {updateSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-green-800">{updateSuccess}</p>
            </div>
          </div>
        )}

        {/* Global Error */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                {/* Profile Avatar */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <div className="w-20 h-20 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-2xl">
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                  <h2 className="text-lg font-semibold text-gray-900">{user.name}</h2>
                  <p className="text-sm text-gray-500 capitalize">{user.role?.toLowerCase()} Account</p>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'profile'
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Profile Information</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'security'
                        ? 'bg-primary-50 text-primary-700 border border-primary-200'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span>Security Settings</span>
                  </button>
                </nav>

                {/* Account Info */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Account Type</span>
                      <span className="font-medium flex items-center space-x-1">
                        {user.role === USER_ROLES.ADMIN ? (
                          <Shield className="w-3 h-3 text-primary-600" />
                        ) : (
                          <Users className="w-3 h-3 text-primary-600" />
                        )}
                        <span className="capitalize">{user.role?.toLowerCase()}</span>
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Member Since</span>
                      <span className="font-medium">
                        {formatDate(new Date(), { year: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'profile' ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="w-5 h-5" />
                    <span>Profile Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div>
                      <Input
                        type="text"
                        name="name"
                        label="Full Name"
                        placeholder="Enter your full name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        error={formErrors.name}
                        disabled={isLoading}
                        required
                        autoComplete="name"
                      />
                    </div>

                    {/* Email Field */}
                    <div>
                      <Input
                        type="email"
                        name="email"
                        label="Email Address"
                        placeholder="Enter your email address"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        error={formErrors.email}
                        disabled={isLoading}
                        required
                        autoComplete="email"
                      />
                    </div>

                    {/* Role Field (Read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Type
                      </label>
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        {user.role === USER_ROLES.ADMIN ? (
                          <Shield className="w-5 h-5 text-primary-600" />
                        ) : (
                          <Users className="w-5 h-5 text-primary-600" />
                        )}
                        <div>
                          <div className="font-medium text-gray-900 capitalize">
                            {user.role?.toLowerCase()}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.role === USER_ROLES.ADMIN 
                              ? 'Full admin access to manage posts and users'
                              : 'Author access to create and manage your own posts'
                            }
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleBack}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        isLoading={isLoading}
                        disabled={isLoading || !hasUnsavedChanges}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Lock className="w-5 h-5" />
                    <span>Security Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    {/* Current Password */}
                    <div>
                      <div className="relative">
                        <Input
                          type={showPasswords.current ? 'text' : 'password'}
                          name="currentPassword"
                          label="Current Password"
                          placeholder="Enter your current password"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          error={formErrors.currentPassword}
                          disabled={isLoading}
                          required
                          autoComplete="current-password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('current')}
                          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                          disabled={isLoading}
                        >
                          {showPasswords.current ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <div className="relative">
                        <Input
                          type={showPasswords.new ? 'text' : 'password'}
                          name="newPassword"
                          label="New Password"
                          placeholder="Enter your new password"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          error={formErrors.newPassword}
                          disabled={isLoading}
                          required
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                          disabled={isLoading}
                        >
                          {showPasswords.new ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
                      {passwordData.newPassword && (
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
                              style={{ width: `${(strengthScore / 5) * 100}%` }}
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

                    {/* Confirm New Password */}
                    <div>
                      <div className="relative">
                        <Input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          name="confirmPassword"
                          label="Confirm New Password"
                          placeholder="Confirm your new password"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          error={formErrors.confirmPassword}
                          disabled={isLoading}
                          required
                          autoComplete="new-password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
                          disabled={isLoading}
                        >
                          {showPasswords.confirm ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Security Tips */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="text-sm font-medium text-blue-800 mb-2">Password Security Tips</h3>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Use a mix of uppercase and lowercase letters</li>
                        <li>• Include numbers and special characters</li>
                        <li>• Avoid using personal information</li>
                        <li>• Don't reuse passwords from other accounts</li>
                      </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end space-x-4 pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setPasswordData({
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          });
                          setFormErrors({});
                        }}
                        disabled={isLoading}
                      >
                        Reset Form
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        isLoading={isLoading}
                        disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isLoading ? 'Changing Password...' : 'Change Password'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;