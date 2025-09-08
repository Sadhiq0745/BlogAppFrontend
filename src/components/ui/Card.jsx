import React from 'react';

const Card = ({
  children,
  className = '',
  padding = 'p-6',
  hover = false,
  ...props
}) => {
  return (
    <div
      className={`card ${padding} ${hover ? 'hover:shadow-medium transition-shadow duration-200' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`mb-4 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardTitle = ({
  children,
  className = '',
  as: Component = 'h3',
  ...props
}) => {
  return (
    <Component
      className={`text-lg font-semibold text-gray-900 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
};

const CardDescription = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <p
      className={`text-sm text-gray-600 mt-1 ${className}`}
      {...props}
    >
      {children}
    </p>
  );
};

const CardContent = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const CardFooter = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div
      className={`mt-4 pt-4 border-t border-gray-200 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

// Compound component pattern
Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Description = CardDescription;
Card.Content = CardContent;
Card.Footer = CardFooter;

export default Card;