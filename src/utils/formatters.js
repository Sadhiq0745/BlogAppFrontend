/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {object} options - Formatting options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return dateObj.toLocaleDateString('en-US', defaultOptions);
};

/**
 * Format date to relative time (e.g., "2 days ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInMs = now - dateObj;
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  } else if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
  } else {
    return `${diffInYears} year${diffInYears !== 1 ? 's' : ''} ago`;
  }
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @param {string} suffix - Suffix to add (default: '...')
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text || text.length <= maxLength) return text || '';
  
  return text.substring(0, maxLength).trim() + suffix;
};

/**
 * Extract reading time from content
 * @param {string} content - Content to analyze
 * @param {number} wordsPerMinute - Reading speed (default: 200)
 * @returns {string} Reading time string
 */
export const getReadingTime = (content, wordsPerMinute = 200) => {
  if (!content) return '0 min read';
  
  // Remove HTML tags and count words
  const text = content.replace(/<[^>]*>/g, '');
  const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  
  return `${readingTime} min read`;
};

/**
 * Format file size to human readable format
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Format username for display
 * @param {string} name - Name to format
 * @param {string} email - Email as fallback
 * @returns {string} Formatted display name
 */
export const formatDisplayName = (name, email) => {
  if (name && name.trim()) {
    return capitalizeWords(name.trim());
  }
  
  if (email) {
    return capitalizeWords(email.split('@')[0]);
  }
  
  return 'Anonymous';
};

/**
 * Generate initials from name
 * @param {string} name - Full name
 * @returns {string} Initials (max 2 characters)
 */
export const getInitials = (name) => {
  if (!name || typeof name !== 'string') return 'AN';
  
  const words = name.trim().split(' ').filter(word => word.length > 0);
  
  if (words.length === 0) return 'AN';
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

/**
 * Format URL to ensure it's complete
 * @param {string} url - URL to format
 * @param {string} baseUrl - Base URL to prepend if needed
 * @returns {string} Complete URL
 */
export const formatImageUrl = (url, baseUrl = '') => {
  if (!url) return '';
  
  // If URL is already complete, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // If URL starts with /, prepend baseUrl
  if (url.startsWith('/')) {
    return `${baseUrl}${url}`;
  }
  
  // Otherwise, assume it's a relative path
  return `${baseUrl}/${url}`;
};

/**
 * Slugify text for URLs
 * @param {string} text - Text to slugify
 * @returns {string} Slugified text
 */
export const slugify = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with dashes
    .replace(/-+/g, '-'); // Replace multiple dashes with single dash
};