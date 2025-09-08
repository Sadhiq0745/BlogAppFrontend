import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings, PlusCircle, Home, BookOpen } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import Button from '../ui/Button';
import { APP_NAME, ROUTES } from '../../utils/constants';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
    setIsUserMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { name: 'Home', path: ROUTES.HOME, icon: Home, public: true },
    { name: 'Posts', path: ROUTES.HOME, icon: BookOpen, public: true },
  ];

  const authNavItems = [
    { name: 'Dashboard', path: ROUTES.DASHBOARD, icon: User },
    { name: 'Create Post', path: ROUTES.CREATE_POST, icon: PlusCircle },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="page-container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to={ROUTES.HOME}
              className="flex items-center space-x-2 text-xl font-bold text-primary-600 hover:text-primary-700 transition-colors"
            >
              <BookOpen className="w-8 h-8" />
              <span className="hidden sm:block">{APP_NAME}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActivePath(item.path)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {isAuthenticated && authNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActivePath(item.path)
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                    <div className="text-xs text-gray-500 capitalize">{user?.role?.toLowerCase()}</div>
                  </div>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setIsUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                      <Link
                        to={ROUTES.PROFILE}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4 mr-3" />
                        Profile Settings
                      </Link>
                      <Link
                        to={ROUTES.DASHBOARD}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        Dashboard
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(ROUTES.LOGIN)}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => navigate(ROUTES.REGISTER)}
                >
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-50"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActivePath(item.path)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {isAuthenticated && authNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActivePath(item.path)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}

              {!isAuthenticated && (
                <div className="pt-4 space-y-2">
                  <Link
                    to={ROUTES.LOGIN}
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
                  >
                    <User className="w-4 h-4" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to={ROUTES.REGISTER}
                    onClick={closeMobileMenu}
                    className="flex items-center space-x-3 px-4 py-2 text-sm font-medium bg-primary-600 text-white hover:bg-primary-700 rounded-lg"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Sign Up</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;