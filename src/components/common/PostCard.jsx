import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, Edit3, Trash2, Eye } from 'lucide-react';
import { cn } from '../../utils/helpers';
import { formatDate, formatRelativeTime, truncateText, getReadingTime, formatImageUrl } from '../../utils/formatters';
import { IMAGE_BASE_URL, ROUTES } from '../../utils/constants';
import { useAuthStore } from '../../store/useAuthStore';
import Card, { CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';

const PostCard = ({
  post,
  variant = 'default',
  showActions = true,
  showAuthor = true,
  showImage = true,
  onEdit,
  onDelete,
  className
}) => {
  const { user, canModifyPost } = useAuthStore();
  
  if (!post) return null;

  const canEdit = canModifyPost(post);
  const imageUrl = post.imageUrl ? formatImageUrl(post.imageUrl, IMAGE_BASE_URL) : null;
  const postUrl = `${ROUTES.POST_DETAIL}/${post.id}`;

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(post);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(post);
  };

  const variants = {
    default: 'card hover:shadow-medium transition-all duration-200',
    minimal: 'bg-white border-b border-gray-200 hover:bg-gray-50',
    featured: 'card bg-gradient-to-r from-primary-50 to-blue-50 border-primary-200'
  };

  return (
    <article className={cn(variants[variant], className)}>
      <Link to={postUrl} className="block">
        <Card padding="none" className="h-full">
          {/* Image */}
          {showImage && imageUrl && (
            <div className="aspect-video overflow-hidden rounded-t-xl">
              <img
                src={imageUrl}
                alt={post.title}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
          )}

          <CardContent className="p-6">
            {/* Author Info */}
            {showAuthor && (
              <div className="flex items-center space-x-2 mb-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span className="font-medium">{post.authorName}</span>
                </div>
                <span className="text-gray-400">•</span>
                <time
                  dateTime={post.createdAt}
                  className="text-sm text-gray-500"
                  title={formatDate(post.createdAt)}
                >
                  {formatRelativeTime(post.createdAt)}
                </time>
                <span className="text-gray-400">•</span>
                <span className="text-sm text-gray-500">
                  {getReadingTime(post.content)}
                </span>
              </div>
            )}

            {/* Title */}
            <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-primary-600 transition-colors line-clamp-2">
              {post.title}
            </h2>

            {/* Content Preview */}
            <p className="text-gray-600 mb-4 line-clamp-3">
              {truncateText(post.content, 150)}
            </p>

            {/* Tags (if available) */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
                {post.tags.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{post.tags.length - 3} more
                  </span>
                )}
              </div>
            )}
          </CardContent>

          {/* Footer */}
          <CardFooter className="px-6 pb-6 pt-0">
            <div className="flex items-center justify-between w-full">
              {/* Post Stats */}
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.createdAt, { month: 'short', day: 'numeric' })}</span>
                </div>
                {post.viewCount && (
                  <div className="flex items-center space-x-1">
                    <Eye className="w-4 h-4" />
                    <span>{post.viewCount} views</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {showActions && canEdit && (
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className="text-gray-600 hover:text-primary-600"
                    title="Edit post"
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="text-gray-600 hover:text-red-600"
                    title="Delete post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
      </Link>
    </article>
  );
};

// Compact Post Card for lists
export const CompactPostCard = ({
  post,
  showActions = true,
  onEdit,
  onDelete,
  className
}) => {
  const { canModifyPost } = useAuthStore();
  
  if (!post) return null;

  const canEdit = canModifyPost(post);
  const imageUrl = post.imageUrl ? formatImageUrl(post.imageUrl, IMAGE_BASE_URL) : null;
  const postUrl = `${ROUTES.POST_DETAIL}/${post.id}`;

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(post);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(post);
  };

  return (
    <article className={cn('bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors', className)}>
      <Link to={postUrl} className="block p-4">
        <div className="flex space-x-4">
          {/* Image */}
          {imageUrl && (
            <div className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden">
              <img
                src={imageUrl}
                alt={post.title}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="font-medium">{post.authorName}</span>
                <span className="text-gray-400">•</span>
                <time dateTime={post.createdAt}>
                  {formatRelativeTime(post.createdAt)}
                </time>
              </div>

              {/* Actions */}
              {showActions && canEdit && (
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEdit}
                    className="text-gray-600 hover:text-primary-600 p-1"
                  >
                    <Edit3 className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleDelete}
                    className="text-gray-600 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>

            <h3 className="text-base font-semibold text-gray-900 mb-1 line-clamp-1">
              {post.title}
            </h3>
            
            <p className="text-sm text-gray-600 line-clamp-2">
              {truncateText(post.content, 120)}
            </p>
          </div>
        </div>
      </Link>
    </article>
  );
};

// Featured Post Card (Large)
export const FeaturedPostCard = ({
  post,
  showActions = true,
  onEdit,
  onDelete,
  className
}) => {
  const { canModifyPost } = useAuthStore();
  
  if (!post) return null;

  const canEdit = canModifyPost(post);
  const imageUrl = post.imageUrl ? formatImageUrl(post.imageUrl, IMAGE_BASE_URL) : null;
  const postUrl = `${ROUTES.POST_DETAIL}/${post.id}`;

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onEdit?.(post);
  };

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(post);
  };

  return (
    <article className={cn('relative overflow-hidden rounded-2xl', className)}>
      <Link to={postUrl} className="block">
        {/* Background Image */}
        {imageUrl && (
          <div className="aspect-[16/9] lg:aspect-[21/9] relative">
            <img
              src={imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          </div>
        )}

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
          <div className="flex items-center space-x-2 mb-4">
            <span className="px-3 py-1 bg-primary-600 rounded-full text-sm font-medium">
              Featured
            </span>
            <div className="flex items-center space-x-2 text-sm opacity-90">
              <span>{post.authorName}</span>
              <span>•</span>
              <time dateTime={post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
            </div>
          </div>

          <h2 className="text-2xl lg:text-3xl font-bold mb-3 line-clamp-2">
            {post.title}
          </h2>

          <p className="text-lg opacity-90 line-clamp-2 mb-4">
            {truncateText(post.content, 200)}
          </p>

          <div className="flex items-center justify-between">
            <span className="text-sm opacity-75">
              {getReadingTime(post.content)}
            </span>

            {/* Actions */}
            {showActions && canEdit && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleEdit}
                  className="text-white hover:bg-white/20"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="text-white hover:bg-white/20"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
};

export default PostCard;