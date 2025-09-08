import * as yup from 'yup';
import { VALIDATION_RULES, FILE_UPLOAD } from './constants';

// Email validation
export const isValidEmail = (email) => {
  return VALIDATION_RULES.EMAIL_REGEX.test(email);
};

// Password validation
export const isValidPassword = (password) => {
  return password && password.length >= VALIDATION_RULES.PASSWORD_MIN_LENGTH;
};

// File validation
export const isValidImageFile = (file) => {
  if (!file) return false;
  
  // Check file type
  const isValidType = FILE_UPLOAD.ALLOWED_TYPES.includes(file.type);
  
  // Check file size
  const isValidSize = file.size <= FILE_UPLOAD.MAX_SIZE;
  
  return isValidType && isValidSize;
};

export const getFileValidationError = (file) => {
  if (!file) return null;
  
  // Check file type
  if (!FILE_UPLOAD.ALLOWED_TYPES.includes(file.type)) {
    return 'Please select a valid image file (JPEG, PNG, WebP)';
  }
  
  // Check file size
  if (file.size > FILE_UPLOAD.MAX_SIZE) {
    return 'File size should be less than 5MB';
  }
  
  return null;
};

// Yup validation schemas
export const authValidationSchemas = {
  login: yup.object({
    email: yup
      .string()
      .required('Email is required')
      .email('Please enter a valid email address'),
    password: yup
      .string()
      .required('Password is required')
      .min(VALIDATION_RULES.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`)
  }),
  
  register: yup.object({
    name: yup
      .string()
      .required('Name is required')
      .min(VALIDATION_RULES.NAME_MIN_LENGTH, `Name must be at least ${VALIDATION_RULES.NAME_MIN_LENGTH} characters`)
      .max(50, 'Name must be less than 50 characters'),
    email: yup
      .string()
      .required('Email is required')
      .email('Please enter a valid email address'),
    password: yup
      .string()
      .required('Password is required')
      .min(VALIDATION_RULES.PASSWORD_MIN_LENGTH, `Password must be at least ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} characters`)
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        'Password must contain at least one uppercase letter, one lowercase letter, and one number'
      ),
    confirmPassword: yup
      .string()
      .required('Please confirm your password')
      .oneOf([yup.ref('password')], 'Passwords must match'),
    role: yup
      .string()
      .required('Please select a role')
      .oneOf(['AUTHOR', 'ADMIN'], 'Invalid role selected')
  })
};

export const postValidationSchemas = {
  create: yup.object({
    title: yup
      .string()
      .required('Title is required')
      .min(VALIDATION_RULES.TITLE_MIN_LENGTH, `Title must be at least ${VALIDATION_RULES.TITLE_MIN_LENGTH} characters`)
      .max(200, 'Title must be less than 200 characters'),
    content: yup
      .string()
      .required('Content is required')
      .min(VALIDATION_RULES.CONTENT_MIN_LENGTH, `Content must be at least ${VALIDATION_RULES.CONTENT_MIN_LENGTH} characters`)
      .max(10000, 'Content must be less than 10,000 characters')
  }),
  
  edit: yup.object({
    title: yup
      .string()
      .required('Title is required')
      .min(VALIDATION_RULES.TITLE_MIN_LENGTH, `Title must be at least ${VALIDATION_RULES.TITLE_MIN_LENGTH} characters`)
      .max(200, 'Title must be less than 200 characters'),
    content: yup
      .string()
      .required('Content is required')
      .min(VALIDATION_RULES.CONTENT_MIN_LENGTH, `Content must be at least ${VALIDATION_RULES.CONTENT_MIN_LENGTH} characters`)
      .max(10000, 'Content must be less than 10,000 characters')
  })
};

// Search validation
export const isValidSearchQuery = (query) => {
  return query && query.trim().length >= 2 && query.trim().length <= 100;
};

// URL validation
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Sanitize HTML content (basic)
export const sanitizeHtml = (html) => {
  if (!html) return '';
  
  // Basic HTML sanitization - remove script tags and dangerous attributes
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '');
};

// Validate form data
export const validateFormData = async (schema, data) => {
  try {
    await schema.validate(data, { abortEarly: false });
    return { isValid: true, errors: {} };
  } catch (error) {
    const errors = {};
    
    if (error.inner) {
      error.inner.forEach((err) => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
    }
    
    return { isValid: false, errors };
  }
};