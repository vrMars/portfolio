import React from 'react';
import { Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { Section } from './Section';

interface BlogHomeProps {
  posts: BlogPost[];
}

export const BlogHome: React.FC<BlogHomeProps> = ({ posts }) => {
  return (
    <Section
      id="blog-home"
      title="Blog"
      highlightedWordOverride="Blog"
      initiallyVisible
      activeSectionOverride="blog"
      surfaceClassName="space-y-12"
    >
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.3em] text-gray-400">
            <div className="flex items-center gap-2">
              <span>Browse</span>
              <span className="text-gray-300">/</span>
              <span className="text-gray-600">Blog</span>
            </div>
            <Link to="/" className="inline-flex items-center font-medium text-indigo-500 hover:text-purple-500 transition-colors">
              ← Back to portfolio
            </Link>
          </div>
          <p className="text-xs uppercase tracking-[0.4em] text-gray-400">Latest posts</p>
        </header>
        <ul className="space-y-8">
          {posts.map((post) => (
            <li key={post.slug} className="group glass-panel rounded-[30px] px-6 py-8 transition-transform duration-500 hover:-translate-y-2">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-400">
                <span>{post.publishDate}</span>
                {post.readTime && <span>• {post.readTime}</span>}
                <span>• {post.source}</span>
              </div>
              <Link
                to={`/blog/${post.slug}`}
                className="mt-4 block text-2xl font-semibold text-gray-800 transition-colors duration-300 group-hover:text-indigo-500"
              >
                {post.title}
              </Link>
              <p className="mt-3 text-gray-600 leading-relaxed">{post.description}</p>
              {post.tags && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <li key={tag} className="glass-button text-xs uppercase tracking-wide text-gray-500 px-3 py-1 rounded-full">
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
              <Link
                to={`/blog/${post.slug}`}
                className="mt-6 inline-flex items-center text-sm font-medium text-indigo-500 hover:text-purple-500 transition-colors"
              >
                Read post →
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
};
