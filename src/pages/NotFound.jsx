import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, BookOpen } from 'lucide-react';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import { ROUTES, APP_NAME } from '../utils/constants';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardContent className="text-center py-16 px-8">
            {/* 404 Illustration */}
            <div className="mb-8">
              <div className="relative">
                <div className="text-8xl font-bold text-gray-200 select-none">
                  404
                </div>
                <BookOpen className="w-16 h-16 text-primary-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>

            {/* Error Message */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Page Not Found
              </h1>
              <p className="text-gray-600 mb-2">
                Oops! The page you're looking for doesn't exist.
              </p>
              <p className="text-sm text-gray-500">
                It might have been moved, deleted, or you entered the wrong URL.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                variant="primary"
                className="w-full"
                onClick={() => navigate(ROUTES.HOME)}
              >
                <Home className="w-4 h-4 mr-2" />
                Go to Homepage
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>

            {/* Helpful Links */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 mb-4">
                Here are some helpful links instead:
              </p>
              <div className="flex flex-col space-y-2">
                <Link
                  to={ROUTES.HOME}
                  className="text-sm text-primary-600 hover:text-primary-700 hover:underline transition-colors"
                >
                  Browse All Posts
                </Link>
                <Link
                  to={ROUTES.LOGIN}
                  className="text-sm text-primary-600 hover:text-primary-700 hover:underline transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to={ROUTES.REGISTER}
                  className="text-sm text-primary-600 hover:text-primary-700 hover:underline transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>

            {/* Brand */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link
                to={ROUTES.HOME}
                className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                <span className="font-semibold">{APP_NAME}</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;