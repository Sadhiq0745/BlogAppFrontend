import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Filter, SortDesc, PlusCircle, TrendingUp, Users, BookOpen } from 'lucide-react';
import { usePostStore } from '../store/usePostStore';
import { useAuthStore } from '../store/useAuthStore';
import PostCard, { FeaturedPostCard, CompactPostCard } from '../components/common/PostCard';
import LoadingSpinner, { CardSkeleton } from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card, { CardContent } from '../components/ui/Card';
import { ROUTES, APP_NAME } from '../utils/constants';
import { debounce } from '../utils/helpers';
import { formatRelativeTime } from '../utils/formatters';

const Home = () => {
  const navigate = useNavigate();
  const { 
    posts, 
    filteredPosts, 
    isLoading, 
    fetchPosts, 
    searchPosts, 
    sortPosts,
    sortBy,
    sortOrder 
  } = usePostStore();
  
  const { isAuthenticated, user } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('createdAt');
  const [selectedOrder, setSelectedOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Debounced search function
  const debouncedSearch = debounce((query) => {
    searchPosts(query);
  }, 300);

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Handle sort change
  const handleSortChange = (sortBy, sortOrder) => {
    setSelectedSort(sortBy);
    setSelectedOrder(sortOrder);
    sortPosts(sortBy, sortOrder);
  };

  // Get featured posts (latest 3 posts)
  const featuredPosts = posts.slice(0, 3);
  
  // Get remaining posts for regular display
  const regularPosts = posts.slice(3);

  // Stats for hero section
  const stats = {
    totalPosts: posts.length,
    totalAuthors: [...new Set(posts.map(post => post.authorId))].length,
    recentPosts: posts.filter(post => {
      const postDate = new Date(post.createdAt);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return postDate >= weekAgo;
    }).length
  };

  const sortOptions = [
    { value: 'createdAt-desc', label: 'Latest First', sortBy: 'createdAt', order: 'desc' },
    { value: 'createdAt-asc', label: 'Oldest First', sortBy: 'createdAt', order: 'asc' },
    { value: 'title-asc', label: 'Title A-Z', sortBy: 'title', order: 'asc' },
    { value: 'title-desc', label: 'Title Z-A', sortBy: 'title', order: 'desc' },
    { value: 'authorName-asc', label: 'Author A-Z', sortBy: 'authorName', order: 'asc' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 via-primary-700 to-blue-600 text-white">
        <div className="page-container py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-primary-200">{APP_NAME}</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Discover amazing stories, share your thoughts, and connect with writers from around the world.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              {isAuthenticated ? (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate(ROUTES.CREATE_POST)}
                    className="bg-white text-primary-600 border-white hover:bg-primary-50"
                  >
                    <PlusCircle className="w-5 h-5 mr-2" />
                    Write Your Story
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => navigate(ROUTES.DASHBOARD)}
                    className="text-white border-white hover:bg-white hover:bg-opacity-20"
                  >
                    Go to Dashboard
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate(ROUTES.REGISTER)}
                    className="bg-white text-primary-600 border-white hover:bg-primary-50"
                  >
                    Join Our Community
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={() => navigate(ROUTES.LOGIN)}
                    className="text-white border-white hover:bg-white hover:bg-opacity-20"
                  >
                    Sign In
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <BookOpen className="w-8 h-8 text-primary-200" />
                </div>
                <div className="text-3xl font-bold mb-1">{stats.totalPosts}</div>
                <div className="text-primary-200">Published Posts</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-8 h-8 text-primary-200" />
                </div>
                <div className="text-3xl font-bold mb-1">{stats.totalAuthors}</div>
                <div className="text-primary-200">Active Authors</div>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-8 h-8 text-primary-200" />
                </div>
                <div className="text-3xl font-bold mb-1">{stats.recentPosts}</div>
                <div className="text-primary-200">This Week</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="page-container py-12">
        {/* Featured Posts Section */}
        {featuredPosts.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Featured Stories</h2>
              <div className="text-sm text-gray-500">Latest and trending</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Main featured post */}
              {featuredPosts[0] && (
                <div className="lg:row-span-2">
                  <FeaturedPostCard
                    post={featuredPosts[0]}
                    showActions={false}
                    className="h-full"
                  />
                </div>
              )}

              {/* Secondary featured posts */}
              <div className="space-y-6">
                {featuredPosts.slice(1).map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    variant="minimal"
                    showActions={false}
                    showAuthor={true}
                    showImage={true}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Search and Filter Section */}
        <section className="mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            <div className="flex-1 max-w-md">
              <Input
                type="text"
                placeholder="Search posts by title, content, or author..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full"
              />
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort Options */}
              <select
                value={`${selectedSort}-${selectedOrder}`}
                onChange={(e) => {
                  const option = sortOptions.find(opt => opt.value === e.target.value);
                  if (option) {
                    handleSortChange(option.sortBy, option.order);
                  }
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

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
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800">
                Found <strong>{filteredPosts.length}</strong> posts matching "{searchQuery}"
                {filteredPosts.length === 0 && (
                  <span className="block mt-2 text-sm">
                    Try adjusting your search terms or browse all posts below.
                  </span>
                )}
              </p>
            </div>
          )}
        </section>

        {/* Posts Section */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              {searchQuery ? 'Search Results' : 'All Stories'}
            </h2>
            <div className="text-sm text-gray-500">
              {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'}
            </div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="space-y-8">
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' 
                : 'space-y-4'
              }>
                {Array.from({ length: 6 }).map((_, index) => (
                  <CardSkeleton key={index} />
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* Posts Grid/List */}
              {filteredPosts.length > 0 ? (
                <div className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
                    : 'space-y-1'
                }>
                  {filteredPosts.map((post) => (
                    viewMode === 'grid' ? (
                      <PostCard
                        key={post.id}
                        post={post}
                        showActions={false}
                        showAuthor={true}
                        showImage={true}
                      />
                    ) : (
                      <CompactPostCard
                        key={post.id}
                        post={post}
                        showActions={false}
                      />
                    )
                  ))}
                </div>
              ) : (
                /* Empty State */
                <Card className="text-center py-16">
                  <CardContent>
                    <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {searchQuery ? 'No posts found' : 'No posts yet'}
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                      {searchQuery 
                        ? 'Try adjusting your search terms or browse all posts.'
                        : 'Be the first to share your story with the community!'
                      }
                    </p>
                    {isAuthenticated ? (
                      <Button
                        variant="primary"
                        onClick={() => navigate(ROUTES.CREATE_POST)}
                      >
                        <PlusCircle className="w-4 h-4 mr-2" />
                        Write Your First Post
                      </Button>
                    ) : (
                      <Button
                        variant="primary"
                        onClick={() => navigate(ROUTES.REGISTER)}
                      >
                        Join Our Community
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </section>

        {/* Call to Action Section */}
        {!isAuthenticated && posts.length > 0 && (
          <section className="mt-16 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 lg:p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Share Your Story?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join our community of writers and readers. Share your thoughts, 
              discover new perspectives, and connect with like-minded individuals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate(ROUTES.REGISTER)}
              >
                Get Started Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate(ROUTES.LOGIN)}
              >
                Sign In
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Home;