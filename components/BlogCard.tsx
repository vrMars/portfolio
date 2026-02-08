import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';

interface BlogCardProps {
  post: BlogPost;
}

export const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group block glass-panel rounded-[20px] md:rounded-[30px] px-5 py-6 md:px-8 md:py-10 transition-transform duration-500 hover:-translate-y-2"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.7rem] uppercase tracking-[0.3em] text-gray-400">
        <span>{post.publishDate}</span>
        {post.readTime && <span>• {post.readTime}</span>}
        <span>• {post.source}</span>
      </div>
      <h3 className="mt-3 text-lg md:text-2xl font-semibold tracking-tight text-gray-800 transition-colors duration-300 group-hover:text-indigo-500">
        {post.title}
      </h3>
      <p className="mt-2 text-sm md:text-base leading-relaxed text-gray-600">{post.description}</p>
      {post.tags && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li
              key={tag}
              className="glass-button text-xs uppercase tracking-wide text-gray-500 px-3 py-1 rounded-full"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
      <span className="mt-6 inline-flex items-center text-sm font-medium text-indigo-500 group-hover:text-purple-500 transition-colors">
        Read story →
      </span>
    </Link>
  );
};
