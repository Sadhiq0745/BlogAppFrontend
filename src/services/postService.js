import api, { apiHelpers } from './api';
import { API_ENDPOINTS, TOAST_MESSAGES } from '../utils/constants';

export const postService = {
  // Get all posts
  getAllPosts: async () => {
    try {
      const response = await api.get(API_ENDPOINTS.POSTS);
      
      return {
        success: true,
        data: response.data || []
      };
    } catch (error) {
      return {
        success: false,
        error: apiHelpers.handleError(error, TOAST_MESSAGES.ERROR.FETCH_POSTS_FAILED)
      };
    }
  },

  // Get posts by author
  getPostsByAuthor: async (authorId) => {
    try {
      const response = await api.get(API_ENDPOINTS.POSTS_BY_AUTHOR(authorId));
      
      return {
        success: true,
        data: response.data || []
      };
    } catch (error) {
      return {
        success: false,
        error: apiHelpers.handleError(error, TOAST_MESSAGES.ERROR.FETCH_POSTS_FAILED)
      };
    }
  },

  // Get single post by ID
  getPostById: async (postId) => {
    try {
      const response = await api.get(API_ENDPOINTS.POST_BY_ID(postId));
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: apiHelpers.handleError(error, 'Failed to fetch post')
      };
    }
  },

  // Create new post
  createPost: async (postData, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('title', postData.title);
      formData.append('content', postData.content);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      const response = await api.post(API_ENDPOINTS.CREATE_POST, formData);
      
      return {
        success: true,
        data: response.data,
        message: TOAST_MESSAGES.SUCCESS.POST_CREATED
      };
    } catch (error) {
      return {
        success: false,
        error: apiHelpers.handleError(error, TOAST_MESSAGES.ERROR.POST_CREATE_FAILED)
      };
    }
  },

  // Update existing post
  updatePost: async (postId, postData, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('title', postData.title);
      formData.append('content', postData.content);
      
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      const response = await api.put(API_ENDPOINTS.UPDATE_POST(postId), formData);
      
      return {
        success: true,
        data: response.data,
        message: TOAST_MESSAGES.SUCCESS.POST_UPDATED
      };
    } catch (error) {
      return {
        success: false,
        error: apiHelpers.handleError(error, TOAST_MESSAGES.ERROR.POST_UPDATE_FAILED)
      };
    }
  },

  // Delete post
  deletePost: async (postId) => {
    try {
      const response = await api.delete(API_ENDPOINTS.DELETE_POST(postId));
      
      return {
        success: true,
        message: response.data || TOAST_MESSAGES.SUCCESS.POST_DELETED
      };
    } catch (error) {
      return {
        success: false,
        error: apiHelpers.handleError(error, TOAST_MESSAGES.ERROR.POST_DELETE_FAILED)
      };
    }
  },

  // Search posts (client-side filtering for now)
  searchPosts: async (query, posts = []) => {
    try {
      if (!query || query.trim().length < 2) {
        return {
          success: true,
          data: posts
        };
      }
      
      const searchTerm = query.toLowerCase().trim();
      const filteredPosts = posts.filter(post => 
        post.title?.toLowerCase().includes(searchTerm) ||
        post.content?.toLowerCase().includes(searchTerm) ||
        post.authorName?.toLowerCase().includes(searchTerm)
      );
      
      return {
        success: true,
        data: filteredPosts
      };
    } catch (error) {
      return {
        success: false,
        error: 'Search failed',
        data: posts
      };
    }
  },

  // Filter posts by author
  filterPostsByAuthor: async (authorName, posts = []) => {
    try {
      if (!authorName) {
        return {
          success: true,
          data: posts
        };
      }
      
      const filteredPosts = posts.filter(post => 
        post.authorName?.toLowerCase().includes(authorName.toLowerCase())
      );
      
      return {
        success: true,
        data: filteredPosts
      };
    } catch (error) {
      return {
        success: false,
        error: 'Filter failed',
        data: posts
      };
    }
  },

  // Sort posts
  sortPosts: (posts, sortBy = 'createdAt', order = 'desc') => {
    try {
      const sortedPosts = [...posts].sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        
        // Handle date sorting
        if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }
        
        // Handle string sorting
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }
        
        if (order === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
      
      return {
        success: true,
        data: sortedPosts
      };
    } catch (error) {
      return {
        success: false,
        error: 'Sort failed',
        data: posts
      };
    }
  }
};