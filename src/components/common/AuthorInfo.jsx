import React from 'react';
import { User, Calendar, MapPin, Mail, Globe, BookOpen } from 'lucide-react';
import { formatDate, formatDisplayName, getInitials } from '../../utils/formatters';
import { cn } from '../../utils/helpers';
import Card from '../ui/Card';

const AuthorInfo = ({
  author,
  showStats = true,
  showContact = false,
  variant = 'default',
  className
}) => {
  if (!author) return null;

  const displayName = formatDisplayName(author.name, author.email);
  const initials = getInitials(displayName);

  const variants = {
    default: 'card p-6',
    compact: 'flex items-center space-x-3 p-4 bg-gray-50 rounded-lg',
    minimal: 'flex items-center space-x-2'
  };

  // Default author stats (you can extend this based on your needs)
  const defaultStats = {
    postsCount: author.postsCount || 0,
    joinDate: author.createdAt || author.joinDate || new Date().toISOString(),
    location: author.location || null,
    website: author.website || null
  };

  if (variant === 'compact') {
    return (
      <div className={cn(variants.compact, className)}>
        {/* Author Avatar */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-medium">
            {initials}
          </div>
        </div>

        {/* Author Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate">
            {displayName}
          </h3>
          <div className="flex items-center space-x-3 text-sm text-gray-500">
            <span className="capitalize">{author.role?.toLowerCase()}</span>
            {showStats && (
              <>
                <span>•</span>
                <span>{defaultStats.postsCount} posts</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={cn(variants.minimal, className)}>
        <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
          {initials}
        </div>
        <div>
          <span className="text-sm font-medium text-gray-900">{displayName}</span>
          <span className="text-sm text-gray-500 ml-2 capitalize">
            {author.role?.toLowerCase()}
          </span>
        </div>
      </div>
    );
  }

  return (
    <Card className={cn(variants.default, className)}>
      {/* Header */}
      <div className="flex items-start space-x-4 mb-6">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-xl font-bold">
            {initials}
          </div>
        </div>

        {/* Basic Info */}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            {displayName}
          </h2>
          
          <div className="flex items-center space-x-2 mb-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 capitalize">
              {author.role?.toLowerCase()} Author
            </span>
          </div>

          {author.bio && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {author.bio}
            </p>
          )}
        </div>
      </div>

      {/* Stats Section */}
      {showStats && (
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {defaultStats.postsCount}
            </div>
            <div className="text-sm text-gray-600">
              {defaultStats.postsCount === 1 ? 'Post' : 'Posts'}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600 mb-1">
              {formatDate(defaultStats.joinDate, { year: 'numeric' })}
            </div>
            <div className="text-sm text-gray-600">Joined</div>
          </div>
        </div>
      )}

      {/* Contact & Additional Info */}
      <div className="space-y-3">
        {/* Join Date */}
        <div className="flex items-center space-x-3 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>
            Joined {formatDate(defaultStats.joinDate, { 
              year: 'numeric', 
              month: 'long' 
            })}
          </span>
        </div>

        {/* Location */}
        {defaultStats.location && (
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{defaultStats.location}</span>
          </div>
        )}

        {/* Contact Info */}
        {showContact && (
          <>
            {author.email && (
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <a
                  href={`mailto:${author.email}`}
                  className="text-primary-600 hover:text-primary-700 hover:underline"
                >
                  {author.email}
                </a>
              </div>
            )}

            {defaultStats.website && (
              <div className="flex items-center space-x-3 text-sm text-gray-600">
                <Globe className="w-4 h-4 text-gray-400" />
                <a
                  href={defaultStats.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:text-primary-700 hover:underline"
                >
                  Visit Website
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

// Author Card for lists
export const AuthorCard = ({
  author,
  showFollowButton = false,
  onFollow,
  className
}) => {
  if (!author) return null;

  const displayName = formatDisplayName(author.name, author.email);
  const initials = getInitials(displayName);

  return (
    <Card className={cn('p-4 hover:shadow-medium transition-shadow', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-medium">
            {initials}
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900">{displayName}</h3>
            <p className="text-sm text-gray-600 capitalize">
              {author.role?.toLowerCase()} • {author.postsCount || 0} posts
            </p>
          </div>
        </div>

        {showFollowButton && onFollow && (
          <button
            onClick={() => onFollow(author)}
            className="px-4 py-2 text-sm font-medium text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors"
          >
            Follow
          </button>
        )}
      </div>

      {author.bio && (
        <p className="mt-3 text-sm text-gray-600 line-clamp-2">
          {author.bio}
        </p>
      )}
    </Card>
  );
};

// Simple author mention component
export const AuthorMention = ({ author, showRole = true, className }) => {
  if (!author) return null;

  const displayName = formatDisplayName(author.name, author.email);
  const initials = getInitials(displayName);

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-medium">
        {initials}
      </div>
      <div className="flex items-center space-x-1 text-sm">
        <span className="font-medium text-gray-900">{displayName}</span>
        {showRole && (
          <span className="text-gray-500 capitalize">
            • {author.role?.toLowerCase()}
          </span>
        )}
      </div>
    </div>
  );
};

export default AuthorInfo;