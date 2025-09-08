import { create } from 'zustand';
import { postService } from '../services/postService';
import toast from 'react-hot-toast';

export const usePostStore = create((set, get) => ({
  // State
  posts: [],
  currentPost: null,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  searchQuery: '',
  filteredPosts: [],
  sortBy: 'createdAt',
  sortOrder: 'desc',

  // Fetch all posts
  fetchPosts: async () => {
    set({ isLoading: true, error: null });

    try {
      const result = await postService.getAllPosts();

      if (result.success) {
        const sortedPosts = postService.sortPosts(
          result.data,
          get().sortBy,
          get().sortOrder
        );

        set({
          posts: sortedPosts.data,
          filteredPosts: sortedPosts.data,
          isLoading: false,
          error: null,
        });

        return { success: true };
      } else {
        set({
          isLoading: false,
          error: result.error,
        });

        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Failed to fetch posts';

      set({
        isLoading: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Fetch posts by author
  fetchPostsByAuthor: async (authorId) => {
    set({ isLoading: true, error: null });

    try {
      const result = await postService.getPostsByAuthor(authorId);

      if (result.success) {
        const sortedPosts = postService.sortPosts(
          result.data,
          get().sortBy,
          get().sortOrder
        );

        set({
          posts: sortedPosts.data,
          filteredPosts: sortedPosts.data,
          isLoading: false,
          error: null,
        });

        return { success: true };
      } else {
        set({
          isLoading: false,
          error: result.error,
        });

        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Failed to fetch posts';

      set({
        isLoading: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Fetch single post
  fetchPost: async (postId) => {
    set({ isLoading: true, error: null });

    try {
      const result = await postService.getPostById(postId);

      if (result.success) {
        set({
          currentPost: result.data,
          isLoading: false,
          error: null,
        });

        return { success: true, data: result.data };
      } else {
        set({
          currentPost: null,
          isLoading: false,
          error: result.error,
        });

        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Failed to fetch post';

      set({
        currentPost: null,
        isLoading: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Create new post
  createPost: async (postData, imageFile) => {
    set({ isCreating: true, error: null });

    try {
      const result = await postService.createPost(postData, imageFile);

      if (result.success) {
        // Add new post to the beginning of the list
        const currentPosts = get().posts;
        const newPosts = [result.data, ...currentPosts];

        set({
          posts: newPosts,
          filteredPosts: newPosts,
          isCreating: false,
          error: null,
        });

        toast.success(result.message);
        return { success: true, data: result.data };
      } else {
        set({
          isCreating: false,
          error: result.error,
        });

        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Failed to create post';

      set({
        isCreating: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Update post
  updatePost: async (postId, updatedData, imageFile) => {
    set({ isUpdating: true, error: null });

    try {
      const result = await postService.updatePost(postId, updatedData, imageFile);

      if (result.success) {
        const updatedPosts = get().posts.map((post) =>
          post.id === postId ? result.data : post
        );

        set({
          posts: updatedPosts,
          filteredPosts: updatedPosts,
          currentPost: result.data,
          isUpdating: false,
          error: null,
        });

        toast.success(result.message);
        return { success: true, data: result.data };
      } else {
        set({
          isUpdating: false,
          error: result.error,
        });

        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Failed to update post';

      set({
        isUpdating: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Delete post
  deletePost: async (postId) => {
    set({ isDeleting: true, error: null });

    try {
      const result = await postService.deletePost(postId);

      if (result.success) {
        const updatedPosts = get().posts.filter((post) => post.id !== postId);

        set({
          posts: updatedPosts,
          filteredPosts: updatedPosts,
          currentPost: null,
          isDeleting: false,
          error: null,
        });

        toast.success(result.message);
        return { success: true };
      } else {
        set({
          isDeleting: false,
          error: result.error,
        });

        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = 'Failed to delete post';

      set({
        isDeleting: false,
        error: errorMessage,
      });

      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  },

  // Search posts
  searchPosts: (query) => {
    set({ searchQuery: query });

    const allPosts = get().posts;
    const filtered = allPosts.filter((post) =>
      post.title.toLowerCase().includes(query.toLowerCase()) ||
      post.content.toLowerCase().includes(query.toLowerCase())
    );

    set({ filteredPosts: filtered });
  },

  // Sort posts
  sortPosts: (sortBy, sortOrder) => {
    set({ sortBy, sortOrder });

    const sortedPosts = postService.sortPosts(
      get().filteredPosts,
      sortBy,
      sortOrder
    );

    set({ filteredPosts: sortedPosts.data });
  },
}));
