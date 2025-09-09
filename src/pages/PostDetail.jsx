import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Share2, 
  Calendar, 
  Clock, 
  User,
  Eye,
  BookOpen,
  ExternalLink
} from 'lucide-react';
import { usePostStore } from '../store/usePostStore';
import { useAuthStore } from '../store/useAuthStore';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Button from '../components/ui/Button';
import Card, { CardContent } from '../components/ui/Card';
import Modal, { ConfirmModal } from '../components/ui/Modal';
import { ROUTES, IMAGE_BASE_URL } from '../utils/constants';
import { formatDate, formatRelativeTime, getReadingTime, formatImageUrl } from '../utils/formatters';

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { 
    currentPost, 
    isLoading, 
    isDeleting,
    fetchPost, 
    deletePost 
  } = usePostStore();
  
  const { user, canModifyPost } = useAuthStore();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Fetch post on component mount
  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, [id, fetchPost]);

  // Handle post deletion
  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    const result = await deletePost(id);
    if (result.success) {
      navigate(ROUTES.DASHBOARD);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
  };

  // Handle sharing
  const handleShare = () => {
    setShareModalOpen(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="page-container py-8">
          <LoadingSpinner size="lg" text="Loading post..." fullScreen />
        </div>
      </div>
    );
  }

  // Post not found
  if (!currentPost && !isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center py-12 px-8">
          <CardContent>
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h1>
            <p className="text-gray-600 mb-6">
              The post you're looking for doesn't exist or has been removed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="primary"
                onClick={() => navigate(ROUTES.HOME)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const postUrl = `${window.location.origin}${ROUTES.POST_DETAIL}/${id}`;
  const canEdit = canModifyPost(currentPost);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="page-container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">Blog Post</h1>
                <p className="text-sm text-gray-500">Published on {formatDate(currentPost?.createdAt)}</p>
              </div>
            </div>

            {/* Action Buttons */}
            {canEdit && (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  onClick={handleShare}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={() => navigate(`${ROUTES.EDIT_POST}/${id}`)}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                
                <Button
                  variant="ghost"
                  onClick={handleDeleteClick}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="page-container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Main Post Content */}
          <article className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Featured Image */}
            {currentPost.imageUrl && (
              <div className="aspect-video overflow-hidden">
                <img
                  src={formatImageUrl(currentPost.imageUrl, IMAGE_BASE_URL)}
                  alt={currentPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="p-8">
              {/* Post Header */}
              <header className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {currentPost.title}
                </h1>

                {/* Author and Meta Info */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                    <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-medium text-lg">
                      {currentPost.authorName?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{currentPost.authorName}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(currentPost.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{getReadingTime(currentPost.content)}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Updated indicator */}
                  {currentPost.updatedAt && 
                   new Date(currentPost.updatedAt) > new Date(currentPost.createdAt) && (
                    <div className="text-sm text-gray-500">
                      Updated {formatRelativeTime(currentPost.updatedAt)}
                    </div>
                  )}
                </div>
              </header>

              {/* Post Content */}
              <div className="prose prose-lg max-w-none">
                <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {currentPost.content}
                </div>
              </div>

              {/* Post Footer */}
              <footer className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center space-x-6 mb-4 sm:mb-0">
                    <button
                      onClick={handleShare}
                      className="flex items-center space-x-2 text-gray-500 hover:text-primary-600 transition-colors"
                    >
                      <Share2 className="w-5 h-5" />
                      <span>Share this post</span>
                    </button>
                  </div>

                  <div className="text-sm text-gray-500">
                    Published {formatRelativeTime(currentPost.createdAt)}
                  </div>
                </div>
              </footer>
            </div>
          </article>

          {/* Author Info Card */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center font-medium text-xl">
                  {currentPost.authorName?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">
                    {currentPost.authorName}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Author and content creator sharing insights and stories.
                  </p>
                  <Link
                    to={`/author/${currentPost.authorId}`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View all posts by {currentPost.authorName}
                    <ExternalLink className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.HOME)}
              className="flex-1 sm:flex-initial"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to All Posts
            </Button>

            {canEdit && (
              <Button
                variant="primary"
                onClick={() => navigate(`${ROUTES.EDIT_POST}/${id}`)}
                className="flex-1 sm:flex-initial"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit This Post
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Post"
        message={`Are you sure you want to delete "${currentPost?.title}"? This action cannot be undone.`}
        confirmText="Delete Post"
        cancelText="Cancel"
        variant="danger"
        loading={isDeleting}
      />

      {/* Share Modal */}
      <Modal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="Share This Post"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Share this post with your friends and followers:
          </p>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Post URL
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={postUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-primary-500 focus:border-primary-500 bg-gray-50 text-sm"
                />
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(postUrl)}
                  className="rounded-l-none border-l-0"
                >
                  Copy
                </Button>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  const text = `Check out this post: ${currentPost.title} ${postUrl}`;
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="flex-1"
              >
                Share on Twitter
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, '_blank');
                }}
                className="flex-1"
              >
                Share on Facebook
              </Button>
            </div>
          </div>
          
          <div className="flex justify-end pt-4">
            <Button
              variant="ghost"
              onClick={() => setShareModalOpen(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PostDetail;