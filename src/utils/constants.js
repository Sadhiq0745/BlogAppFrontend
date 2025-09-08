export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
export const IMAGE_BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:8080';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'BlogPlatform';

// API Endpoints
export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  
  // Post endpoints
  POSTS: '/posts',
  CREATE_POST: '/posts/create',
  POSTS_BY_AUTHOR: (authorId) => `/posts/author/${authorId}`,
  POST_BY_ID: (id) => `/posts/${id}`,
  UPDATE_POST: (id) => `/posts/${id}`,
  DELETE_POST: (id) => `/posts/${id}`,
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  AUTHOR: 'AUTHOR'
};

// Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'blog_token',
  USER: 'blog_user',
  THEME: 'blog_theme'
};

// Form Validation
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  PASSWORD_MIN_LENGTH: 6,
  NAME_MIN_LENGTH: 2,
  TITLE_MIN_LENGTH: 3,
  CONTENT_MIN_LENGTH: 10
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp']
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 50
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  CREATE_POST: '/create-post',
  EDIT_POST: '/edit-post',
  POST_DETAIL: '/post',
  PROFILE: '/profile',
  NOT_FOUND: '/404'
};

// Toast Messages
export const TOAST_MESSAGES = {
  SUCCESS: {
    LOGIN: 'Successfully logged in!',
    REGISTER: 'Account created successfully!',
    POST_CREATED: 'Post created successfully!',
    POST_UPDATED: 'Post updated successfully!',
    POST_DELETED: 'Post deleted successfully!',
    LOGOUT: 'Logged out successfully!'
  },
  ERROR: {
    LOGIN_FAILED: 'Invalid email or password',
    REGISTER_FAILED: 'Registration failed. Please try again.',
    POST_CREATE_FAILED: 'Failed to create post',
    POST_UPDATE_FAILED: 'Failed to update post',
    POST_DELETE_FAILED: 'Failed to delete post',
    FETCH_POSTS_FAILED: 'Failed to load posts',
    NETWORK_ERROR: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action',
    FILE_TOO_LARGE: 'File size should be less than 5MB',
    INVALID_FILE_TYPE: 'Please select a valid image file',
    SOMETHING_WENT_WRONG: 'Something went wrong. Please try again.'
  },
  INFO: {
    LOADING: 'Loading...',
    UPLOADING: 'Uploading...',
    DELETING: 'Deleting...'
  }
};

// Theme
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark'
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};