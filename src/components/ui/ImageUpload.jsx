import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { isValidImageFile, getFileValidationError } from '../../utils/validators';
import Button from './Button';

const ImageUpload = ({
  onFileSelect,
  onFileRemove,
  currentImageUrl = '',
  label = 'Upload Image',
  disabled = false,
  error = '',
  className = ''
}) => {
  const fileInputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImageUrl);
  const [uploadError, setUploadError] = useState('');

  const handleFileSelect = (file) => {
    const validationError = getFileValidationError(file);
    
    if (validationError) {
      setUploadError(validationError);
      return;
    }

    setUploadError('');
    
    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    
    // Call parent callback
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl('');
    setUploadError('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Revoke preview URL to free memory
    if (previewUrl && previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(previewUrl);
    }
    
    if (onFileRemove) {
      onFileRemove();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const displayError = error || uploadError;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="space-y-3">
        {/* Upload Area */}
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
            transition-colors duration-200
            ${dragOver ? 'border-primary-400 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${displayError ? 'border-red-300' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            disabled={disabled}
            className="hidden"
          />

          {previewUrl ? (
            <div className="relative">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full max-h-48 mx-auto rounded-lg"
              />
              <Button
                type="button"
                variant="danger"
                size="sm"
                className="absolute top-2 right-2"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveImage();
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-gray-100">
                {dragOver ? (
                  <Upload className="w-6 h-6 text-primary-600" />
                ) : (
                  <ImageIcon className="w-6 h-6 text-gray-400" />
                )}
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-600">
                  {dragOver ? 'Drop image here' : 'Click to upload or drag and drop'}
                </p>
                <p className="text-xs text-gray-400">
                  PNG, JPG, WebP up to 5MB
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        {previewUrl && (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openFileDialog}
              disabled={disabled}
            >
              <Upload className="w-4 h-4 mr-2" />
              Change Image
            </Button>
            
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemoveImage}
              disabled={disabled}
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {displayError && (
        <p className="text-sm text-red-600">
          {displayError}
        </p>
      )}
    </div>
  );
};

export default ImageUpload;