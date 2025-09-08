import React from 'react';
import { cn } from '../../utils/helpers';

const LoadingSpinner = ({ 
  size = 'md', 
  className, 
  text,
  fullScreen = false 
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const spinner = (
    <div className={cn(
      'flex flex-col items-center justify-center space-y-2',
      fullScreen && 'min-h-screen',
      className
    )}>
      <div className="relative">
        <div className={cn(
          'animate-spin rounded-full border-2 border-gray-300 border-t-primary-600',
          sizes[size]
        )} />
      </div>
      
      {text && (
        <p className={cn(
          'text-gray-600 font-medium',
          textSizes[size]
        )}>
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

// Alternative pulse loader
export const PulseLoader = ({ className }) => (
  <div className={cn('flex space-x-2', className)}>
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="w-2 h-2 bg-primary-600 rounded-full animate-pulse"
        style={{
          animationDelay: `${i * 0.2}s`,
          animationDuration: '1s'
        }}
      />
    ))}
  </div>
);

// Skeleton loader for content
export const SkeletonLoader = ({ lines = 3, className }) => (
  <div className={cn('animate-pulse space-y-3', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className={cn(
          'h-4 bg-gray-200 rounded',
          i === lines - 1 && 'w-3/4' // Last line is shorter
        )}
      />
    ))}
  </div>
);

// Card skeleton loader
export const CardSkeleton = ({ className }) => (
  <div className={cn('animate-pulse', className)}>
    <div className="bg-gray-200 h-48 w-full rounded-lg mb-4" />
    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-full" />
    </div>
  </div>
);

export default LoadingSpinner;