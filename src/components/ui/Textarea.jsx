import React, { forwardRef } from 'react';

const Textarea = forwardRef(({
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
  rows = 4,
  className = '',
  ...props
}, ref) => {
  const textareaId = id || name;
  
  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        ref={ref}
        id={textareaId}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        required={required}
        rows={rows}
        className={`textarea ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
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

Textarea.displayName = 'Textarea';

export default Textarea;