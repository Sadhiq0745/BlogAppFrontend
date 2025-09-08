import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  const baseClasses = 'btn';
  
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800'
  };
  
  const sizes = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg'
  };
  
  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;
  
  const isDisabled = disabled || isLoading;
  
  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClass} ${sizeClass} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={isDisabled}
      onClick={onClick}
      {...props}
    >
      {isLoading && (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      )}
      {children}
    </button>
  );
};

export default Button;