import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  AlertCircle
} from 'lucide-react';
import { usePostStore } from '../store/usePostStore';
import { useAuthStore } from '../store/useAuthStore';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import ImageUpload from '../components/ui/ImageUpload';
import Card, { CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { ROUTES } from '../utils/constants';
import { postValidationSchemas } from '../utils/validators';
import { validateFormData } from '../utils/validators';
import { getReadingTime, truncateText } from '../utils/formatters';
import { debounce } from '../utils/helpers';

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createPost, isCreating } = usePostStore();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  const [saveStatus, setSaveStatus] = useState(''); // 'saving', 'saved', 'error'
  const [wordCount, setWordCount] = useState(0);
  const [characterCount, setCharacterCount] = useState(0);

  // Refs
  const titleRef = useRef(null);
  const contentRef = useRef(null);

  // Auto-save functionality (debounced)
  const debouncedAutoSave = debounce(() => {
    if (formData.title.trim() || formData.content.trim()) {
      setSaveStatus('saving');
      // Simulate auto-save (you can implement actual draft saving here)
      setTimeout(() => {
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus(''), 2000);
      }, 1000);
    }
  }, 2000);

  // Update word and character count
  useEffect(() => {
    const content = formData.content;
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    setWordCount(words);
    setCharacterCount(content.length);

    // Trigger auto-save
    debouncedAutoSave();
  }, [formData.content, formData.title, debouncedAutoSave]);

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
    
    // Create preview URL
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreviewUrl(url);
    }
  };

  // Handle image removal
  const handleImageRemove = () => {
    setSelectedImage(null);
    if (imagePreviewUrl) {
      URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl('');
    }
  };

  // Validate form
  const validateForm = async () => {
    const validation = await validateFormData(postValidationSchemas.create, formData);
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

    // Create post
    const result = await createPost(formData, selectedImage);
    
    if (result.success) {
      // Navigate to dashboard or post detail
      navigate(ROUTES.DASHBOARD);
    }
  };

  // Handle save as draft (future feature)
  const handleSaveAsDraft = async () => {
    setSaveStatus('saving');
    // Implement draft saving logic here
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 1000);
  };

  // Handle preview toggle
  const handlePreviewToggle = () => {
    setShowPreview(!showPreview);
  };

  // Preview component
  const PostPreview = () => (
    <Card>
      <CardContent className="p-0">
        {/* Preview Image */}
        {imagePreviewUrl && (
          <div className="aspect-video overflow-hidden rounded-t-xl">
            <img
              src={imagePreviewUrl}
              alt="Post preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-6">
          {/* Preview Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-medium">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString()} • {getReadingTime(formData.content)}
              </p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="page-container py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
              <p className="text-gray-600">Share your thoughts with the world</p>
            </div>
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
              onClick={handlePreviewToggle}
              className={showPreview ? 'bg-gray-100' : ''}
            >
              <Eye className="w-4 h-4 mr-2" />
              {showPreview ? 'Edit' : 'Preview'}
            </Button>

            <Button
              variant="outline"
              onClick={handleSaveAsDraft}
              disabled={isCreating}
            >
              Save Draft
            </Button>

            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isCreating || !formData.title.trim() || !formData.content.trim()}
              isLoading={isCreating}
            >
              <Save className="w-4 h-4 mr-2" />
              {isCreating ? 'Publishing...' : 'Publish Post'}
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
                        disabled={isCreating}
                        className="text-2xl font-bold border-0 border-b border-gray-200 rounded-none px-0 pb-4 focus:border-primary-500"
                        style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
                      />
                    </div>

                    {/* Image Upload */}
                    <div>
                      <ImageUpload
                        onFileSelect={handleImageSelect}
                        onFileRemove={handleImageRemove}
                        currentImageUrl={imagePreviewUrl}
                        label="Featured Image (Optional)"
                        disabled={isCreating}
                      />
                    </div>

                    {/* Content Textarea */}
                    <div>
                      <Textarea
                        ref={contentRef}
                        name="content"
                        placeholder="Start writing your post content here... 

You can write in multiple paragraphs, add line breaks, and format your content as needed. This is where your main article content will go."
                        value={formData.content}
                        onChange={handleInputChange}
                        error={formErrors.content}
                        disabled={isCreating}
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
              {/* Post Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Post Statistics</CardTitle>
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
                  
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Author</span>
                      <span className="font-medium text-sm">{user?.name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Writing Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Writing Tips</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-start space-x-2">
                      <Type className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                      <span>Use clear, engaging headlines to grab attention</span>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <ImagePlus className="w-4 h-4 mt-0.5 text-green-500 flex-shrink-0" />
                      <span>Add images to make your post more visual</span>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <AlignLeft className="w-4 h-4 mt-0.5 text-purple-500 flex-shrink-0" />
                      <span>Break up text with paragraphs for better readability</span>
                    </div>
                    
                    <div className="flex items-start space-x-2">
                      <BookOpen className="w-4 h-4 mt-0.5 text-orange-500 flex-shrink-0" />
                      <span>Aim for 3-5 minutes reading time for optimal engagement</span>
                    </div>
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
                    onClick={() => navigate(ROUTES.DASHBOARD)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={handlePreviewToggle}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {showPreview ? 'Continue Editing' : 'Preview Post'}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;