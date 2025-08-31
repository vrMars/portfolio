import React from 'react';
import { BlogPost } from '../types';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <a href={post.url} target="_blank" rel="noopener noreferrer" className="block p-6 bg-gray-900/50 rounded-lg border border-gray-800 hover:border-blue-500/50 transition-all duration-300 group hover:-translate-y-1">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
          {post.title}
        </h3>
        <ExternalLinkIcon className="w-5 h-5 text-gray-500 group-hover:text-blue-400 transition-colors" />
      </div>
      <p className="text-gray-400 text-sm mb-4">{post.description}</p>
      <div className="text-xs text-gray-500">
        <span>{post.publishDate}</span> &middot; <span>{post.source}</span>
      </div>
    </a>
  );
};