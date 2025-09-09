import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Eye, 
  BarChart3, 
  Calendar, 
  User, 
  BookOpen,
  TrendingUp,
  Clock,
  Search,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { usePostStore } from '../store/usePostStore';
import PostCard, { CompactPostCard } from '../components/common/PostCard';
import LoadingSpinner, { CardSkeleton } from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Modal, { ConfirmModal } from '../components/ui/Modal';
import { ROUTES } from '../utils/constants';
import { formatDate, formatRelativeTime, getReadingTime } from '../utils/formatters';
import { debounce } from '../utils/helpers';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuthStore();
  const { 
    posts, 
    filteredPosts,
    isLoading, 
    isDeleting,
    fetchPosts, 
    fetchPostsByAuthor,
    deletePost,
    searchPosts 
  } = usePostStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // 'all', 'published', 'draft'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Debounced search function
  const debouncedSearch = debounce((query) => {
    searchPosts(query);
  }, 300);

  // Fetch user's posts on component mount
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (user) {
        if (isAdmin()) {
          // Admin can see all posts
          await fetchPosts();
        } else {
          // Regular users see only their posts
          await fetchPostsByAuthor(user.email);
        }
        setStatsLoading(false);
      }
    };

    fetchUserPosts();
  }, [user, isAdmin, fetchPosts, fetchPostsByAuthor]);

  // Handle search
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Handle post deletion
  const handleDeleteClick = (post) => {
    setPostToDelete(post);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (postToDelete) {
      const result = await deletePost(postToDelete.id);
      if (result.success) {
        setDeleteModalOpen(false);
        setPostToDelete(null);
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setPostToDelete(null);
  };

  // Handle post editing
  const handleEditClick = (post) => {
    navigate(`${ROUTES.EDIT_POST}/${post.id}`);
  };

  // Calculate user stats
  const userPosts = isAdmin() ? posts : posts.filter(post => post.authorId === user?.email);
  const stats = {
    totalPosts: userPosts.length,
    totalViews: userPosts.reduce((sum, post) => sum + (post.viewCount || 0), 0),
    postsThisMonth: userPosts.filter(post => {
      const postDate = new Date(post.createdAt);
      const now = new Date();
      return postDate.getMonth() === now.getMonth() && postDate.getFullYear() === now.getFullYear();
    }).length,
    averageReadingTime: userPosts.length > 0 
      ? Math.round(userPosts.reduce((sum, post) => {
          const time = parseInt(getReadingTime(post.content));
          return sum + (isNaN(time) ? 3 : time);
        }, 0) / userPosts.length)
      : 0
  };

  // Get recent activity
  const recentPosts = [...userPosts]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  const displayPosts = searchQuery ? filteredPosts : userPosts;

  if (isLoading && statsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="page-container py-8">
          <LoadingSpinner size="lg" text="Loading your dashboard..." fullScreen />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-container py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}! 👋
              </h1>
              <p className="text-gray-600 mt-1">
                {isAdmin() ? 'Manage all posts and content' : 'Here\'s what\'s happening with your posts'}
              </p>
            </div>
            
            <Button
              variant="primary"
              onClick={() => navigate(ROUTES.CREATE_POST)}
              className="w-full lg:w-auto"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Create New Post
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Posts</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalPosts}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {stats.postsThisMonth} posts this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalViews}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Across all your posts
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg. Read Time</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.averageReadingTime}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Minutes per post
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">This Month</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.postsThisMonth}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                New posts published
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Posts */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <CardTitle>
                    {isAdmin() ? 'All Posts' : 'Your Posts'}
                  </CardTitle>
                  
                  <div className="flex items-center space-x-3">
                    {/* Search */}
                    <div className="flex-1 min-w-64">
                      <Input
                        type="text"
                        placeholder="Search posts..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="w-full"
                      />
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-2 text-sm font-medium transition-colors ${
                          viewMode === 'grid'
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        Grid
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-2 text-sm font-medium transition-colors ${
                          viewMode === 'list'
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        List
                      </button>
                    </div>
                  </div>
                </div>

                {/* Search Results Info */}
                {searchQuery && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      Found <strong>{displayPosts.length}</strong> posts matching "{searchQuery}"
                    </p>
                  </div>
                )}
              </CardHeader>

              <CardContent>
                {/* Posts List */}
                {displayPosts.length > 0 ? (
                  <div className={
                    viewMode === 'grid'
                      ? 'grid grid-cols-1 md:grid-cols-2 gap-6'
                      : 'space-y-1'
                  }>
                    {displayPosts.map((post) => (
                      viewMode === 'grid' ? (
                        <PostCard
                          key={post.id}
                          post={post}
                          showActions={true}
                          showAuthor={isAdmin()}
                          showImage={true}
                          onEdit={handleEditClick}
                          onDelete={handleDeleteClick}
                        />
                      ) : (
                        <CompactPostCard
                          key={post.id}
                          post={post}
                          showActions={true}
                          onEdit={handleEditClick}
                          onDelete={handleDeleteClick}
                        />
                      )
                    ))}
                  </div>
                ) : (
                  /* Empty State */
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {searchQuery ? 'No posts found' : 'No posts yet'}
                    </h3>
                    <p className="text-gray-600 mb-6">
                      {searchQuery 
                        ? 'Try adjusting your search terms.'
                        : 'Start by creating your first blog post!'
                      }
                    </p>
                    {!searchQuery && (
                      <Button
                        variant="primary"
                        onClick={() => navigate(ROUTES.CREATE_POST)}
                      >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Create Your First Post
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate(ROUTES.CREATE_POST)}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  New Post
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate(ROUTES.PROFILE)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigate(ROUTES.HOME)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Public Site
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            {recentPosts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentPosts.map((post) => (
                      <div key={post.id} className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`${ROUTES.POST_DETAIL}/${post.id}`}
                            className="text-sm font-medium text-gray-900 hover:text-primary-600 line-clamp-2"
                          >
                            {post.title}
                          </Link>
                          <p className="text-xs text-gray-500 mt-1">
                            Updated {formatRelativeTime(post.updatedAt)}
                          </p>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleEditClick(post)}
                            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Edit post"
                          >
                            <Edit3 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* User Info */}
            <Card>
              <CardHeader>
                <CardTitle>Account Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-medium">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500 capitalize">
                      {user?.role?.toLowerCase()} Account
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">Member since</p>
                  <p className="text-sm text-gray-900">
                    {formatDate(new Date(), { year: 'numeric', month: 'long' })}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <ConfirmModal
          isOpen={deleteModalOpen}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          title="Delete Post"
          message={`Are you sure you want to delete "${postToDelete?.title}"? This action cannot be undone.`}
          confirmText="Delete Post"
          cancelText="Cancel"
          variant="danger"
          loading={isDeleting}
        />
      </div>
    </div>
  );
};

export default Dashboard;