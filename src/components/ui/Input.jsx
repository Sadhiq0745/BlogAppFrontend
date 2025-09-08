import React, { forwardRef } from 'react';

const Input = forwardRef(({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  onBlur,
  name,
  id,
  disabled = false,
  error = '',
  label = '',
  required = false,
  className = '',
  ...props
}, ref) => {
  const inputId = id || name;
  
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        ref={ref}
        type={type}
        id={inputId}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        className={`input ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
        {...props}
      />
      
      {error && (
        <p className="text-sm text-red-600 mt-1">
          {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;