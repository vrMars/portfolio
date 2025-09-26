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
      className="group block rounded-3xl border border-white/10 bg-[rgba(15,20,32,0.75)] px-6 py-8 md:px-8 md:py-10 backdrop-blur-lg transition-transform duration-500 hover:-translate-y-2"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[0.7rem] uppercase tracking-[0.3em] text-slate-200/60">
        <span>{post.publishDate}</span>
        {post.readTime && <span>• {post.readTime}</span>}
        <span>• {post.source}</span>
      </div>
      <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white/90 transition-colors duration-300 group-hover:text-white">
        {post.title}
      </h3>
      <p className="mt-3 text-base leading-relaxed text-slate-200/80">{post.description}</p>
      {post.tags && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <li
              key={tag}
              className="glass-button text-xs uppercase tracking-wide text-slate-100/80 px-3 py-1 rounded-full"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
      <span className="mt-6 inline-flex items-center text-sm font-medium text-sky-200 group-hover:text-white transition-colors">
        Read story →
      </span>
    </Link>
  );
};
