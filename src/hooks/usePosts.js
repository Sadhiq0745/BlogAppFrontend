import { usePostStore } from '../store/usePostStore';

/**
 * Custom hook for managing post-related data and actions.
 * Provides a convenient way to access posts, search, and sort them.
 */
export const usePosts = () => {
  const {
    posts,
    filteredPosts,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    searchQuery,
    sortBy,
    sortOrder,
    currentPost,
    fetchPosts,
    fetchPostsByAuthor,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    searchPosts,
    sortPosts,
  } = usePostStore();

  return {
    posts,
    filteredPosts,
    isLoading,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    searchQuery,
    sortBy,
    sortOrder,
    currentPost,
    fetchPosts,
    fetchPostsByAuthor,
    fetchPost,
    createPost,
    updatePost,
    deletePost,
    searchPosts,
    sortPosts,
  };
};
