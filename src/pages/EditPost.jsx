import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, 
  Eye, 
  ArrowLeft, 
  ImagePlus, 
  Type, 
  AlignLeft, 
  BookOpen,
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { usePostStore } from '../store/usePostStore';
import { useAuthStore } from '../store/useAuthStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import ImageUpload from '../components/ui/ImageUpload';
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Modal, { ConfirmModal } from '../components/ui/Modal';
import { ROUTES, IMAGE_BASE_URL } from '../utils/constants';
import { postValidationSchemas } from '../utils/validators';
import { validateFormData } from '../utils/validators';
import { getReadingTime, formatDate, formatImageUrl } from '../utils/formatters';
import { debounce } from '../utils/helpers';

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, canModifyPost } = useAuthStore();
  const { 
    currentPost, 
    isLoading, 
    isUpdating, 
    isDeleting,
    fetchPost, 
    updatePost, 
    deletePost 
  } = usePostStore();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [imageChanged, setImageChanged] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); // 'saving', 'saved', 'error'
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [originalData, setOriginalData] = useState({});

  // Refs
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  // Fetch post data on component mount
  useEffect(() => {
    if (id) {
      fetchPost(id);
    }
  }, [id, fetchPost]);

  // Set form data when post is loaded
  useEffect(() => {
    if (currentPost) {
      const postData = {
        title: currentPost.title || '',
        content: currentPost.content || ''
      };
      
      setFormData(postData);
      setOriginalData(postData);
      setCurrentImageUrl(currentPost.imageUrl ? formatImageUrl(currentPost.imageUrl, IMAGE_BASE_URL) : '');
      
      // Check permissions
      if (!canModifyPost(currentPost)) {
        navigate(ROUTES.DASHBOARD);
      }
    }
  }, [currentPost, canModifyPost, navigate]);

  // Auto-save functionality (debounced)
  const debouncedAutoSave = debounce(() => {
    if (hasUnsavedChanges && formData.title.trim() && formData.content.trim()) {
      setSaveStatus('saving');
      // Simulate auto-save (implement actual draft saving here)
      setTimeout(() => {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 2000);
      }, 1000);
    }
  }, 3000);

  // Check for unsaved changes
  useEffect(() => {
    const hasChanges = 
      formData.title !== originalData.title || 
      formData.content !== originalData.content ||
      imageChanged;
    
    setHasUnsavedChanges(hasChanges);
  }, [formData, originalData, imageChanged]);

  // Update word and character count
  useEffect(() => {
    const content = formData.content;
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharacterCount(content.length);

    // Trigger auto-save
    if (hasUnsavedChanges) {
      debouncedAutoSave();
    }
  }, [formData.content, hasUnsavedChanges, debouncedAutoSave]);

  // Warn about unsaved changes before leaving
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Handle image selection
  const handleImageSelect = (file) => {
    setSelectedImage(file);
    setImageChanged(true);
    
    // Create preview URL
    if (file) {
      const url = URL.createObjectURL(file);
      setCurrentImageUrl(url);
    }
  };

  // Handle image removal
  const handleImageRemove = () => {
    setSelectedImage(null);
    setImageChanged(true);
    
    if (currentImageUrl && currentImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(currentImageUrl);
    }
    setCurrentImageUrl('');
  };

  // Validate form
  const validateForm = async () => {
    const validation = await validateFormData(postValidationSchemas.edit, formData);
    setFormErrors(validation.errors);
    return validation.isValid;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    const isValid = await validateForm();
    if (!isValid) {
      // Focus on first error field
      if (formErrors.title) {
        titleRef.current?.focus();
      } else if (formErrors.content) {
        contentRef.current?.focus();
      }
      return;
    }

    // Update post
    const imageToSend = imageChanged ? selectedImage : null;
    const result = await updatePost(id, formData, imageToSend);
    
    if (result.success) {
      // Update original data to reflect saved state
      setOriginalData({ ...formData });
      setImageChanged(false);
      setHasUnsavedChanges(false);
      
      // Navigate back to dashboard
      navigate(ROUTES.DASHBOARD);
    }
  };

  // Handle delete
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

  // Handle preview toggle
  const handlePreviewToggle = () => {
    setShowPreview(!showPreview);
  };

  // Handle back navigation with unsaved changes warning
  const handleBack = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  // Preview component
  const PostPreview = () => (
    <Card>
      <CardContent className="p-0">
        {/* Preview Image */}
        {currentImageUrl && (
          <div className="aspect-video overflow-hidden rounded-t-xl">
            <img
              src={currentImageUrl}
              alt="Post preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          {/* Preview Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-medium">
              {currentPost?.authorName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900">{currentPost?.authorName}</p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>
                  {currentPost ? `Updated ${formatDate(new Date())}` : formatDate(new Date())}
                </span>
                <span>•</span>
                <span>{getReadingTime(formData.content)}</span>
              </div>
            </div>
          </div>

          {/* Preview Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {formData.title || 'Your post title will appear here'}
          </h1>

          {/* Preview Content */}
          <div className="prose prose-lg max-w-none">
            {formData.content ? (
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {formData.content}
              </div>
            ) : (
              <p className="text-gray-500 italic">
                Your post content will appear here as you type...
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
            <Button
              variant="primary"
              onClick={() => navigate(ROUTES.DASHBOARD)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={handleBack}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
              <p className="text-gray-600">
                Last updated {formatDate(currentPost?.updatedAt)}
              </p>
            </div>
            
            {/* Unsaved changes indicator */}
            {hasUnsavedChanges && (
              <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-50 border border-yellow-200 rounded-full">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                <span className="text-sm text-yellow-800 font-medium">Unsaved changes</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Auto-save status */}
            {saveStatus && (
              <div className="flex items-center space-x-2 text-sm">
                {saveStatus === 'saving' && (
                  <>
                    <Clock className="w-4 h-4 text-blue-500 animate-spin" />
                    <span className="text-blue-600">Saving...</span>
                  </>
                )}
                {saveStatus === 'saved' && (
                  <>
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-green-600">Saved</span>
                  </>
                )}
                {saveStatus === 'error' && (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-red-600">Error saving</span>
                  </>
                )}
              </div>
            )}

            <Button
              variant="ghost"
              onClick={() => window.open(`${ROUTES.POST_DETAIL}/${id}`, '_blank')}
              title="View live post"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              View Live
            </Button>

            <Button
              variant="ghost"
              onClick={handlePreviewToggle}
              className={showPreview ? 'bg-gray-100' : ''}
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Edit' : 'Preview'}
            </Button>

            <Button
              variant="outline"
              onClick={handleDeleteClick}
              disabled={isUpdating || isDeleting}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>

            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isUpdating || !hasUnsavedChanges}
              isLoading={isUpdating}
            >
              <Save className="w-4 h-4 mr-2" />
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {showPreview ? (
              <PostPreview />
            ) : (
              <Card>
                <CardContent className="p-6">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title Input */}
                    <div>
                      <Input
                        ref={titleRef}
                        name="title"
                        placeholder="Enter your post title..."
                        value={formData.title}
                        onChange={handleInputChange}
                        error={formErrors.title}
                        disabled={isUpdating}
                        className="text-2xl font-bold border-0 border-b border-gray-200 rounded-none px-0 pb-4 focus:border-primary-500"
                        style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
                      />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <ImageUpload
                        onFileSelect={handleImageSelect}
                        onFileRemove={handleImageRemove}
                        currentImageUrl={currentImageUrl}
                        label="Featured Image (Optional)"
                        disabled={isUpdating}
                      />
                    </div>

                    {/* Content Textarea */}
                    <div>
                      <Textarea
                        ref={contentRef}
                        name="content"
                        placeholder="Write your post content here..."
                        value={formData.content}
                        onChange={handleInputChange}
                        error={formErrors.content}
                        disabled={isUpdating}
                        rows={20}
                        className="text-lg leading-relaxed resize-y min-h-96"
                      />
                    </div>

                    {/* Hidden submit button for form submission */}
                    <button type="submit" className="hidden" />
                  </form>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-6 sticky top-8">
              {/* Post Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Post Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status</span>
                    <span className="font-medium text-green-600">Published</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Created</span>
                    <span className="font-medium text-sm">{formatDate(currentPost?.createdAt)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Updated</span>
                    <span className="font-medium text-sm">{formatDate(currentPost?.updatedAt)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Author</span>
                    <span className="font-medium text-sm">{currentPost?.authorName}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Current Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Current Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Words</span>
                    <span className="font-medium">{wordCount}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Characters</span>
                    <span className="font-medium">{characterCount}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Reading Time</span>
                    <span className="font-medium">{getReadingTime(formData.content)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handleBack}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => window.open(`${ROUTES.POST_DETAIL}/${id}`, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View Live Post
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handlePreviewToggle}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showPreview ? 'Continue Editing' : 'Preview Changes'}
                  </Button>
                </CardContent>
              </Card>
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
      </div>
    </div>
  );
};

export default EditPost;