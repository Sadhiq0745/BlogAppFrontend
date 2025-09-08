import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Github, Twitter, Mail, Heart } from 'lucide-react';
import { APP_NAME, ROUTES } from '../../utils/constants';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    platform: [
      { name: 'Home', path: ROUTES.HOME },
      { name: 'About', path: '/about' },
      { name: 'Contact', path: '/contact' },
      { name: 'FAQ', path: '/faq' }
    ],
    resources: [
      { name: 'Blog', path: '/blog' },
      { name: 'Help Center', path: '/help' },
      { name: 'Privacy Policy', path: '/privacy' },
      { name: 'Terms of Service', path: '/terms' }
    ],
    social: [
      { name: 'GitHub', icon: Github, href: '#' },
      { name: 'Twitter', icon: Twitter, href: '#' },
      { name: 'Email', icon: Mail, href: 'mailto:contact@blogplatform.com' }
    ]
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="page-container py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="w-8 h-8 text-primary-400" />
              <span className="text-xl font-bold">{APP_NAME}</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              A modern blogging platform where writers and readers connect. 
              Share your thoughts, discover new ideas, and be part of a vibrant community.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {footerLinks.social.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Platform</h3>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="max-w-md">
            <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
            <p className="text-gray-400 mb-4">
              Get the latest posts and platform updates delivered to your inbox.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <button className="px-6 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {currentYear} {APP_NAME}. All rights reserved.
            </p>
            
            <div className="flex items-center space-x-1 text-gray-400 text-sm">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>by the {APP_NAME} team</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;